import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "../components/Button";
import { MetricCard } from "../components/MetricCard";
import { WhisperCard } from "../components/WhisperCard";
import { Clock, Mic, MicOff, Sparkles, Keyboard, ArrowLeft } from "lucide-react";

type WhisperType = "info" | "success" | "warning";
type Persona = "Interview" | "Standup" | "Sales Call" | "Design Critique";
type WhisperMode = "Heuristic" | "LLM" | "Hybrid";

type Whisper = {
  message: string;
  type: WhisperType;
  timestamp: string;
  source?: "heuristic" | "llm";
};

declare global {
  interface Window {
    webkitSpeechRecognition?: any;
    SpeechRecognition?: any;
  }
}

function formatClock(seconds: number) {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
}

function nowLabel() {
  return "Just now";
}

function computeWhisperQuality(whispers: Whisper[], durationSec: number) {
  const mins = Math.max(0.1, durationSec / 60);
  const rate = whispers.length / mins;
  const recent = whispers.slice(0, 6).map((w) => w.message.trim().toLowerCase());
  const uniq = new Set(recent).size;
  const repetition = recent.length > 0 ? 1 - uniq / recent.length : 0;

  const rateScore = rate < 2 ? 0 : rate < 4 ? 1 : rate <= 10 ? 2 : rate <= 14 ? 1 : 0;
  const repScore = repetition < 0.15 ? 2 : repetition < 0.35 ? 1 : 0;
  const score = rateScore + repScore;

  if (score >= 3) return { label: "Helpful", tone: "success" as const };
  if (score >= 2) return { label: "Okay", tone: "info" as const };
  return { label: "Noisy", tone: "warning" as const };
}

function SkeletonWhisper() {
  return (
    <div className="bg-white rounded-[16px] border border-[#E6E8EC] p-5 mb-3 shadow-[0_8px_24px_rgba(0,0,0,0.06)] animate-pulse">
      <div className="h-3 w-5/6 bg-gray-200 rounded mb-2" />
      <div className="h-3 w-3/5 bg-gray-200 rounded" />
      <div className="h-2 w-24 bg-gray-200 rounded mt-3" />
    </div>
  );
}

export function LiveWhisper() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [duration, setDuration] = useState(0);
  const [persona, setPersona] = useState<Persona>("Standup");
  const [mode, setMode] = useState<WhisperMode>("Hybrid");

  const SpeechRecognitionCtor = useMemo(() => {
    return window.SpeechRecognition || window.webkitSpeechRecognition;
  }, []);

  const [isSupported, setIsSupported] = useState<boolean>(!!SpeechRecognitionCtor);
  const [isListening, setIsListening] = useState(false);

  const [transcript, setTranscript] = useState("");
  const [whispers, setWhispers] = useState<Whisper[]>([]);
  const [statusLine, setStatusLine] = useState<string>("Not listening");
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const recRef = useRef<any>(null);

  const lastLenRef = useRef<number>(0);
  const lastWhisperAtRef = useRef<number>(0);
  const lastTipRef = useRef<string>("");

  const lastAnalyzeAtRef = useRef<number>(0);
  const lastAnalyzedLenRef = useRef<number>(0);
  const lastLLMTipRef = useRef<string>("");
  const inflightRef = useRef<boolean>(false);

  useEffect(() => {
    const t = setInterval(() => setDuration((d) => d + 1), 1000);
    return () => clearInterval(t);
  }, []);

  // Keyboard shortcuts
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.repeat) return;
      const tag = (e.target as HTMLElement | null)?.tagName?.toLowerCase();
      if (tag === "input" || tag === "textarea" || (e.target as any)?.isContentEditable) return;

      const k = e.key.toLowerCase();
      if (k === "m") {
        e.preventDefault();
        setIsListening((v) => !v);
      }
      if (k === "w") {
        e.preventDefault();
        setMode((m) => (m === "Heuristic" ? "LLM" : m === "LLM" ? "Hybrid" : "Heuristic"));
      }
      if (k === "escape") {
        e.preventDefault();
        navigate(`/meeting/live/${id ?? "instant"}`);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [navigate, id]);

  // Start/Stop recognition
  useEffect(() => {
    if (!SpeechRecognitionCtor) {
      setIsSupported(false);
      return;
    }
    setIsSupported(true);

    if (!isListening) {
      try {
        recRef.current?.stop?.();
      } catch {}
      return;
    }

    const rec = new SpeechRecognitionCtor();
    recRef.current = rec;

    rec.continuous = true;
    rec.interimResults = true;
    rec.lang = "en-US";

    rec.onstart = () => setStatusLine("Listening… speak naturally");
    rec.onerror = (e: any) => {
      console.error("SpeechRecognition error:", e);
      setStatusLine(`Mic error: ${e?.error ?? "unknown"}`);
      setIsListening(false);
    };

    rec.onend = () => {
      if (isListening) {
        setStatusLine("Restarting mic…");
        setTimeout(() => {
          try {
            rec.start();
          } catch {}
        }, 300);
      } else {
        setStatusLine("Not listening");
      }
    };

    rec.onresult = (event: any) => {
      let text = "";
      for (let i = 0; i < event.results.length; i++) {
        text += event.results[i][0].transcript;
      }
      setTranscript(text.trim());
    };

    try {
      rec.start();
    } catch (err) {
      console.error("Failed to start SpeechRecognition:", err);
      setStatusLine("Failed to start mic");
      setIsListening(false);
    }

    return () => {
      try {
        rec.stop();
      } catch {}
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isListening, SpeechRecognitionCtor]);

  function addWhisper(message: string, type: WhisperType, source: Whisper["source"]) {
    const tip = message.trim();
    if (!tip) return;
    if (tip.toLowerCase() === lastTipRef.current.toLowerCase()) return;
    lastTipRef.current = tip;
    setWhispers((prev) => [{ message: tip, type, timestamp: nowLabel(), source }, ...prev].slice(0, 12));
  }

  function heuristicTip(delta: number, fullTranscript: string) {
    const lower = fullTranscript.toLowerCase();
    if (delta > 140) return { tip: "Long turn—pause and invite feedback.", type: "info" as const };
    if (lower.includes("um") || lower.includes("uh")) return { tip: "Reduce fillers—take a short breath.", type: "info" as const };
    if (lower.includes("i think") || lower.includes("maybe")) return { tip: "Be specific: state a clear recommendation.", type: "success" as const };
    return { tip: "Ask a quick question to pull others in.", type: "success" as const };
  }

  async function requestLLMTip(latestTranscript: string) {
    if (inflightRef.current) return;
    inflightRef.current = true;

    try {
      setIsAnalyzing(true);
      const tail = latestTranscript.slice(-900);

      const resp = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ transcript: tail, persona, style: mode === "LLM" ? "direct" : "balanced" }),
      });

      const data = await resp.json().catch(() => ({}));
      if (!resp.ok) {
        addWhisper("LLM unavailable—using on-device coaching.", "warning", "heuristic");
        return;
      }

      const tip: string = (data?.whisper ?? "").toString();
      const tag: string = (data?.tag ?? "").toString();
      if (tip.trim().toLowerCase() === lastLLMTipRef.current.trim().toLowerCase()) return;
      lastLLMTipRef.current = tip.trim();

      const mappedType: WhisperType =
        tag === "confidence" ? "success" : tag === "clarity" ? "info" : tag === "pace" ? "info" : "success";

      addWhisper(tip, mappedType, "llm");
    } catch (e) {
      console.error(e);
      addWhisper("LLM tip failed—staying on-device.", "warning", "heuristic");
    } finally {
      inflightRef.current = false;
      setIsAnalyzing(false);
    }
  }

  // Whisper loop
  useEffect(() => {
    if (!isListening) return;

    const interval = setInterval(() => {
      const currentLen = transcript.length;
      const delta = currentLen - lastLenRef.current;
      lastLenRef.current = currentLen;

      if (delta <= 20) return;

      const now = Date.now();
      const cooldownMs = 8000;
      if (now - lastWhisperAtRef.current < cooldownMs) return;
      lastWhisperAtRef.current = now;

      if (mode === "Heuristic" || mode === "Hybrid") {
        const { tip, type } = heuristicTip(delta, transcript);
        addWhisper(tip, type, "heuristic");
      }

      if (mode === "LLM" || mode === "Hybrid") {
        const llmMinMs = 9000;
        const grewEnough = currentLen - lastAnalyzedLenRef.current > 80;
        if (grewEnough && now - lastAnalyzeAtRef.current > llmMinMs) {
          lastAnalyzeAtRef.current = now;
          lastAnalyzedLenRef.current = currentLen;
          requestLLMTip(transcript);
        }
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [isListening, transcript, mode, persona]);

  const quality = computeWhisperQuality(whispers, duration);

  return (
    <div className="h-screen bg-[#F6F8FB] flex flex-col">
      {/* Top */}
      <div className="bg-white border-b border-[#E6E8EC] px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button variant="secondary" onClick={() => navigate(`/meeting/live/${id ?? "instant"}`)} className="gap-2">
            <ArrowLeft className="w-4 h-4" /> Back
          </Button>

          <div className="flex items-center gap-2 text-gray-600">
            <Clock className="w-4 h-4" />
            <span className="text-sm font-mono">{formatClock(duration)}</span>
          </div>

          <div className="text-xs text-gray-500 hidden md:block">
            {isSupported ? statusLine : "Speech recognition not supported in this browser"}
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden md:flex items-center gap-2 bg-white border border-[#E6E8EC] rounded-lg px-3 py-2">
            <Sparkles className="w-4 h-4 text-gray-700" />
            <select
              value={persona}
              onChange={(e) => setPersona(e.target.value as Persona)}
              className="bg-transparent text-gray-800 text-sm outline-none"
            >
              <option>Interview</option>
              <option>Standup</option>
              <option>Sales Call</option>
              <option>Design Critique</option>
            </select>
          </div>

          <div className="hidden md:flex items-center gap-2 bg-white border border-[#E6E8EC] rounded-lg px-3 py-2">
            <span className="text-xs text-gray-600">Mode</span>
            <select
              value={mode}
              onChange={(e) => setMode(e.target.value as WhisperMode)}
              className="bg-transparent text-gray-800 text-sm outline-none"
            >
              <option>Hybrid</option>
              <option>Heuristic</option>
              <option>LLM</option>
            </select>
          </div>

          {isSupported && (
            <Button variant="secondary" onClick={() => setIsListening((v) => !v)} className="gap-2">
              {isListening ? (
                <>
                  <MicOff className="w-4 h-4" /> Stop (M)
                </>
              ) : (
                <>
                  <Mic className="w-4 h-4" /> Start (M)
                </>
              )}
            </Button>
          )}
        </div>
      </div>

      {/* Body */}
      <div className="flex-1 p-6 grid grid-cols-12 gap-6 overflow-hidden">
        <div className="col-span-12 lg:col-span-4 grid grid-cols-2 lg:grid-cols-1 gap-4">
          <MetricCard title="Whisper Quality" value={quality.label} badgeTone={quality.tone} />
          <MetricCard title="Mode" value={mode} badgeTone="info" />
          <div className="col-span-2 lg:col-span-1 bg-white rounded-2xl border border-[#E6E8EC] p-4">
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-[#111318] font-semibold">Transcript</h4>
              <div className="text-xs text-gray-500 flex items-center gap-2">
                <Keyboard className="w-4 h-4" />
                <span>M mic • W mode • Esc back</span>
              </div>
            </div>
            <div className="text-sm text-gray-700 leading-relaxed max-h-[260px] overflow-auto pr-2">
              {transcript ? transcript : <span className="text-gray-400">Start the mic to see transcription.</span>}
            </div>
          </div>
        </div>

        <div className="col-span-12 lg:col-span-8 overflow-auto bg-white rounded-2xl border border-[#E6E8EC] p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-[#111318] font-semibold text-lg">Whispers (focus mode)</h3>
            <div className="text-xs text-gray-500">{mode === "Heuristic" ? "On-device" : mode === "LLM" ? "AI-only" : "Hybrid"}</div>
          </div>

          {isAnalyzing && <SkeletonWhisper />}

          {whispers.length === 0 ? (
            <div className="text-sm text-gray-500">Speak a bit—tips appear every ~8 seconds.</div>
          ) : (
            whispers.map((w, idx) => (
              <WhisperCard
                key={`${w.timestamp}-${idx}`}
                message={`${w.source === "llm" ? "✨ " : ""}${w.message}`}
                type={w.type}
                timestamp={w.timestamp}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
}
