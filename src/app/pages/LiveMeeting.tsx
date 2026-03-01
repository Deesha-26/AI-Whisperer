import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "../components/Button";
import { VideoTile } from "../components/VideoTile";
import { MetricCard } from "../components/MetricCard";
import { WhisperCard } from "../components/WhisperCard";
import { Clock, Mic, MicOff, Sparkles, Shield, Keyboard } from "lucide-react";

type WhisperType = "info" | "success" | "warning";

type Whisper = {
  message: string;
  type: WhisperType;
  timestamp: string;
  source?: "heuristic" | "llm";
};

type Persona = "Interview" | "Standup" | "Sales Call" | "Design Critique";
type WhisperMode = "Heuristic" | "LLM" | "Hybrid";

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

function clamp(n: number, lo: number, hi: number) {
  return Math.max(lo, Math.min(hi, n));
}

function computeWhisperQuality(whispers: Whisper[], durationSec: number) {
  const mins = Math.max(0.1, durationSec / 60);
  const rate = whispers.length / mins; // tips per minute
  const recent = whispers.slice(0, 6).map((w) => w.message.trim().toLowerCase());
  const uniq = new Set(recent).size;
  const repetition = recent.length > 0 ? 1 - uniq / recent.length : 0;

  // Rule-of-thumb: 4–10 tips/min feels “alive” but not spammy for a demo.
  const rateScore =
    rate < 2 ? 0 :
    rate < 4 ? 1 :
    rate <= 10 ? 2 :
    rate <= 14 ? 1 : 0;

  const repScore = repetition < 0.15 ? 2 : repetition < 0.35 ? 1 : 0;

  const score = rateScore + repScore;
  if (score >= 3) return { label: "Helpful", tone: "success" as const };
  if (score >= 2) return { label: "Okay", tone: "info" as const };
  return { label: "Noisy", tone: "warning" as const };
}

function SkeletonWhisper() {
  return (
    <div className="bg-white rounded-[16px] border border-[#E6E8EC] p-5 mb-3 shadow-[0_8px_24px_rgba(0,0,0,0.06)] animate-pulse">
      <div className="h-3 w-4/5 bg-gray-200 rounded mb-2" />
      <div className="h-3 w-2/3 bg-gray-200 rounded" />
      <div className="h-2 w-24 bg-gray-200 rounded mt-3" />
    </div>
  );
}

export function LiveMeeting() {
  const navigate = useNavigate();
  const { id } = useParams();

  // Timer
  const [duration, setDuration] = useState(0);

  // Presets
  const [persona, setPersona] = useState<Persona>("Standup");
  const [mode, setMode] = useState<WhisperMode>("Hybrid");

  // Speech recognition availability
  const SpeechRecognitionCtor = useMemo(() => {
    return window.SpeechRecognition || window.webkitSpeechRecognition;
  }, []);

  const [isSupported, setIsSupported] = useState<boolean>(!!SpeechRecognitionCtor);
  const [isListening, setIsListening] = useState(false);

  // Transcript + derived activity
  const [transcript, setTranscript] = useState("");
  const [whispers, setWhispers] = useState<Whisper[]>([]);
  const [statusLine, setStatusLine] = useState<string>("Not listening");
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // Simple “talk detection” based on transcript growth
  const lastLenRef = useRef<number>(0);
  const lastWhisperAtRef = useRef<number>(0);
  const lastTipRef = useRef<string>("");

  // LLM throttling / caching
  const lastAnalyzeAtRef = useRef<number>(0);
  const lastAnalyzedLenRef = useRef<number>(0);
  const lastLLMTipRef = useRef<string>("");
  const inflightRef = useRef<boolean>(false);

  // “talk time” estimate: seconds in which transcript grew
  const talkSecondsRef = useRef<number>(0);
  const silenceSecondsRef = useRef<number>(0);

  // Recognition instance
  const recRef = useRef<any>(null);

  // Meeting timer
  useEffect(() => {
    const t = setInterval(() => setDuration((d) => d + 1), 1000);
    return () => clearInterval(t);
  }, []);

  // Keyboard shortcuts: M = mic toggle, W = cycle mode, E = end meeting
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
      if (k === "e") {
        e.preventDefault();
        endMeeting();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [duration, transcript, whispers, persona, mode, isListening]);

  // Start/Stop speech recognition
  useEffect(() => {
    if (!SpeechRecognitionCtor) {
      setIsSupported(false);
      return;
    }
    setIsSupported(true);

    if (!isListening) {
      // Stop existing session if any
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
      // Some browsers stop unexpectedly — gently restart, but avoid tight loops.
      if (isListening) {
        setStatusLine("Restarting mic…");
        setTimeout(() => {
          try {
            rec.start();
          } catch {
            // ignore
          }
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

    // De-dupe exact repeats across both sources
    if (tip.toLowerCase() === lastTipRef.current.toLowerCase()) return;

    lastTipRef.current = tip;
    setWhispers((prev) => [{ message: tip, type, timestamp: nowLabel(), source }, ...prev].slice(0, 10));
  }

  function heuristicTip(delta: number, fullTranscript: string) {
    const lower = fullTranscript.toLowerCase();

    if (delta > 140) return { tip: "You’re on a long turn—pause, invite input.", type: "info" as const };
    if (lower.includes("um") || lower.includes("uh")) return { tip: "Slow down slightly; reduce filler words.", type: "info" as const };
    if (lower.includes("i think") || lower.includes("maybe")) return { tip: "Use a more confident, specific phrasing.", type: "info" as const };
    if (lower.includes("sorry")) return { tip: "Drop apologies; state the point directly.", type: "info" as const };

    return { tip: "Nice momentum—ask a quick check-in question.", type: "success" as const };
  }

  async function requestLLMTip(latestTranscript: string) {
    if (inflightRef.current) return;
    inflightRef.current = true;

    try {
      setIsAnalyzing(true);

      const tail = latestTranscript.slice(-900); // keep requests small
      const resp = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          transcript: tail,
          persona,
          // Give server a hint about desired style
          style: mode === "LLM" ? "direct" : "balanced",
        }),
      });

      const data = await resp.json().catch(() => ({}));
      if (!resp.ok) {
        console.warn("Analyze failed:", data);
        addWhisper("LLM unavailable—using on-device coaching.", "warning", "heuristic");
        return;
      }

      const tip: string = (data?.whisper ?? "").toString();
      const tag: string = (data?.tag ?? "").toString();

      // If model repeats itself, skip
      if (tip.trim().toLowerCase() === lastLLMTipRef.current.trim().toLowerCase()) return;
      lastLLMTipRef.current = tip.trim();

      const mappedType: WhisperType =
        tag === "confidence" ? "success" : tag === "clarity" ? "info" : tag === "pace" ? "info" : "success";

      addWhisper(tip, mappedType, "llm");
    } catch (e) {
      console.error(e);
      addWhisper("LLM tip failed—staying in heuristic mode.", "warning", "heuristic");
    } finally {
      inflightRef.current = false;
      setIsAnalyzing(false);
    }
  }

  // Whisper rules (runs every 2 seconds while listening)
  useEffect(() => {
    if (!isListening) return;

    const interval = setInterval(() => {
      const currentLen = transcript.length;
      const delta = currentLen - lastLenRef.current;

      // Determine talk vs silence for rough metrics
      if (delta > 8) talkSecondsRef.current += 2;
      else silenceSecondsRef.current += 2;

      lastLenRef.current = currentLen;

      if (delta <= 20) {
        setStatusLine("Listening… (no significant speech detected)");
        return;
      }

      setStatusLine("Listening… (speech detected)");

      // Cooldown to prevent spam
      const now = Date.now();
      const cooldownMs = 8000; // tips every ~8s
      if (now - lastWhisperAtRef.current < cooldownMs) return;

      lastWhisperAtRef.current = now;

      // Heuristic path
      if (mode === "Heuristic" || mode === "Hybrid") {
        const { tip, type } = heuristicTip(delta, transcript);
        addWhisper(tip, type, "heuristic");
      }

      // LLM path (throttle separately; only if transcript progressed)
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

  function endMeeting() {
    const talkTotal = talkSecondsRef.current + silenceSecondsRef.current;
    const talkPct = talkTotal > 0 ? Math.round((talkSecondsRef.current / talkTotal) * 100) : 0;

    const payload = {
      id: id ?? "instant",
      createdAt: new Date().toISOString(),
      persona,
      mode,
      duration,
      transcript,
      talkPct,
      whispers: whispers.slice(0, 10),
    };
    try {
      localStorage.setItem("aiw:lastMeeting", JSON.stringify(payload));
    } catch {}
    navigate(`/meeting/summary/${id ?? "instant"}`);
  }

  // Derived metrics
  const talkTotal = talkSecondsRef.current + silenceSecondsRef.current;
  const talkPct = talkTotal > 0 ? Math.round((talkSecondsRef.current / talkTotal) * 100) : 0;

  const engagement = clamp(70 + Math.round((100 - Math.abs(50 - talkPct)) / 10), 50, 95);
  const clarity = clamp(75 - Math.round(Math.max(0, talkPct - 60) / 2), 45, 95);
  const quality = computeWhisperQuality(whispers, duration);

  const participants = [
    { name: "You", isSelf: true, isActive: isListening },
    { name: "Sarah", isSelf: false, isActive: false },
    { name: "Daniel", isSelf: false, isActive: false },
    { name: "Priya", isSelf: false, isActive: false },
  ];

  return (
    <div className="h-screen bg-[#111318] flex flex-col">
      {/* Top Bar */}
      <div className="bg-gray-900 border-b border-gray-800 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h3 className="text-white text-lg font-semibold">{persona}</h3>

          <div className="flex items-center gap-2 text-gray-400">
            <Clock className="w-4 h-4" />
            <span className="text-sm font-mono">{formatClock(duration)}</span>
          </div>

          <div className="text-xs text-gray-400 hidden md:flex items-center gap-2">
            <Shield className="w-4 h-4" />
            <span>Privacy: mic stays local</span>
          </div>

          <div className="text-xs text-gray-400 hidden lg:block">
            {isSupported ? statusLine : "Speech recognition not supported in this browser"}
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Persona */}
          <div className="hidden md:flex items-center gap-2 bg-gray-800 border border-gray-700 rounded-lg px-3 py-2">
            <Sparkles className="w-4 h-4 text-gray-300" />
            <select
              value={persona}
              onChange={(e) => setPersona(e.target.value as Persona)}
              className="bg-transparent text-gray-200 text-sm outline-none"
            >
              <option>Interview</option>
              <option>Standup</option>
              <option>Sales Call</option>
              <option>Design Critique</option>
            </select>
          </div>

          {/* Mode */}
          <div className="hidden md:flex items-center gap-2 bg-gray-800 border border-gray-700 rounded-lg px-3 py-2">
            <span className="text-xs text-gray-300">Mode</span>
            <select
              value={mode}
              onChange={(e) => setMode(e.target.value as WhisperMode)}
              className="bg-transparent text-gray-200 text-sm outline-none"
            >
              <option>Hybrid</option>
              <option>Heuristic</option>
              <option>LLM</option>
            </select>
          </div>

          {isSupported && (
            <Button
              variant="secondary"
              onClick={() => setIsListening((v) => !v)}
              className="text-sm py-2 gap-2"
            >
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

          <Button
            variant="danger"
            onClick={endMeeting}
            className="text-sm py-2"
          >
            End (E)
          </Button>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 p-6 grid grid-cols-12 gap-6 overflow-hidden">
        {/* Video grid */}
        <div className="col-span-12 lg:col-span-8 grid grid-cols-2 gap-4 h-full">
          {participants.map((p) => (
            <VideoTile key={p.name} name={p.name} isSelf={p.isSelf} isActive={p.isActive} />
          ))}
        </div>

        {/* Sidebar */}
        <div className="col-span-12 lg:col-span-4 flex flex-col gap-4 overflow-hidden">
          <div className="grid grid-cols-2 gap-4">
            <MetricCard title="Engagement" value={`${engagement}%`} />
            <MetricCard title="Clarity" value={`${clarity}%`} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <MetricCard title="Talk time" value={`${talkPct}%`} />
            <MetricCard title="Whisper Quality" value={quality.label} badgeTone={quality.tone} />
          </div>

          {/* Transcript */}
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-4 flex-1 overflow-hidden">
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-white font-semibold">Live transcript</h4>
              <div className="text-xs text-gray-400 flex items-center gap-2">
                <Keyboard className="w-4 h-4" />
                <span>M mic • W mode • E end</span>
              </div>
            </div>
            <div className="text-gray-200 text-sm leading-relaxed overflow-auto max-h-[200px] pr-2">
              {transcript ? transcript : <span className="text-gray-500">Start the mic to see transcription.</span>}
            </div>
          </div>

          {/* Whispers */}
          <div className="bg-[#F6F8FB] rounded-2xl p-4 overflow-auto">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-[#111318] font-semibold">Whispers</h4>
              <div className="text-xs text-gray-600">
                {mode === "Heuristic" ? "On-device" : mode === "LLM" ? "AI-only" : "Hybrid"}
              </div>
            </div>

            {isAnalyzing && <SkeletonWhisper />}

            {whispers.length === 0 ? (
              <div className="text-sm text-gray-500">
                Tips show up automatically once you start speaking.
              </div>
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
    </div>
  );
}
