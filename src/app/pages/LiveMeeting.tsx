import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "../components/Button";
import { VideoTile } from "../components/VideoTile";
import { MetricCard } from "../components/MetricCard";
import { WhisperCard } from "../components/WhisperCard";
import { Clock, Mic, MicOff } from "lucide-react";

type WhisperType = "info" | "success";

type Whisper = {
  message: string;
  type: WhisperType;
  timestamp: string;
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

export function LiveMeeting() {
  const navigate = useNavigate();
  const { id } = useParams();

  // Timer
  const [duration, setDuration] = useState(0);

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

  // Simple “talk detection” based on transcript growth
  const lastLenRef = useRef<number>(0);
  const lastWhisperAtRef = useRef<number>(0);
  const lastTipRef = useRef<string>("");

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
      // If user still wants listening, some browsers stop unexpectedly — we can gently restart.
      // But avoid tight restart loops.
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
      // Build transcript from results
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

  // Whisper rules (runs every 2 seconds while listening)
  useEffect(() => {
    if (!isListening) return;

    const interval = setInterval(() => {
      const currentLen = transcript.length;
      const delta = currentLen - lastLenRef.current;

      // Determine talk vs silence for rough metrics
      if (delta > 8) {
        talkSecondsRef.current += 2;
      } else {
        silenceSecondsRef.current += 2;
      }

      // Update last len
      lastLenRef.current = currentLen;

      // If no real speech change, do nothing
      if (delta <= 20) {
        setStatusLine("Listening… (no significant speech detected)");
        return;
      }

      setStatusLine("Listening… (speech detected)");

      // Cooldown to prevent spam
      const now = Date.now();
      const cooldownMs = 8000; // 8s between tips
      if (now - lastWhisperAtRef.current < cooldownMs) return;

      // Heuristic tips based on transcript growth and simple patterns
      const lower = transcript.toLowerCase();

      let tip = "";
      let type: WhisperType = "info";

      // If user seems to be rambling / long turns (big delta)
      if (delta > 140) {
        tip = "You’re on a long turn—pause and ask for input.";
        type = "info";
      } else if (lower.includes("um") || lower.includes("uh")) {
        tip = "Slow down slightly; reduce filler words.";
        type = "info";
      } else if (lower.includes("i think") || lower.includes("maybe")) {
        tip = "Try a more confident phrasing for clarity.";
        type = "info";
      } else {
        // default when speech detected
        tip = "Nice momentum—add a quick check-in question.";
        type = "success";
      }

      // De-dupe exact repeats
      if (tip === lastTipRef.current) return;

      lastTipRef.current = tip;
      lastWhisperAtRef.current = now;

      setWhispers((prev) => [{ message: tip, type, timestamp: nowLabel() }, ...prev].slice(0, 8));
    }, 2000);

    return () => clearInterval(interval);
  }, [isListening, transcript]);

  // Derived metrics
  const talkTotal = talkSecondsRef.current + silenceSecondsRef.current;
  const talkPct = talkTotal > 0 ? Math.round((talkSecondsRef.current / talkTotal) * 100) : 0;

  // “engagement” / “clarity” just demo metrics that respond to talk balance
  const engagement = Math.min(95, Math.max(50, 70 + Math.round((100 - Math.abs(50 - talkPct)) / 10)));
  const clarity = Math.min(95, Math.max(45, 75 - Math.round(Math.max(0, talkPct - 60) / 2)));

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
          <h3 className="text-white text-lg font-semibold">Product Standup</h3>

          <div className="flex items-center gap-2 text-gray-400">
            <Clock className="w-4 h-4" />
            <span className="text-sm font-mono">{formatClock(duration)}</span>
          </div>

          <div className="text-xs text-gray-400 hidden md:block">
            {isSupported ? statusLine : "Speech recognition not supported in this browser"}
          </div>
        </div>

        <div className="flex items-center gap-3">
          {isSupported && (
            <Button
              variant="secondary"
              onClick={() => setIsListening((v) => !v)}
              className="text-sm py-2 gap-2"
            >
              {isListening ? (
                <>
                  <MicOff className="w-4 h-4" /> Stop Listening
                </>
              ) : (
                <>
                  <Mic className="w-4 h-4" /> Start Listening
                </>
              )}
            </Button>
          )}

          <Button
            variant="secondary"
            onClick={() => navigate(`/meeting/whisper/${id ?? "instant"}`)}
            className="text-sm py-2"
          >
            View with Whispers
          </Button>

          <Button variant="danger" onClick={() => navigate(`/meeting/summary/${id ?? "instant"}`)}>
            End Meeting
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Video Grid */}
        <div className="flex-1 p-8 bg-white">
          <div className="grid grid-cols-2 gap-6 max-w-4xl mx-auto">
            {participants.map((p) => (
              <VideoTile key={p.name} name={p.name} isSelf={p.isSelf} isActive={p.isActive} />
            ))}
          </div>

          {/* Optional: show live transcript (helps demos a lot) */}
          <div className="max-w-4xl mx-auto mt-6">
            <div className="bg-[#F6F8FB] rounded-xl border border-[#E6E8EC] p-4">
              <div className="text-sm font-semibold text-[#111318] mb-2">Live Transcript (demo)</div>
              <div className="text-sm text-[#6B7280] min-h-[40px]">
                {transcript ? transcript : "Start listening to see transcript here…"}
              </div>
            </div>
          </div>
        </div>

        {/* Right Panel - Live Coaching */}
        <div className="w-96 bg-[#F7F8FA] border-l border-[#E6E8EC] p-6 overflow-y-auto">
          <h3 className="text-[22px] font-semibold mb-8">Live Coaching</h3>

          {/* Metrics */}
          <div className="space-y-5 mb-10">
            <MetricCard title="Talk Balance" value={`You ${talkPct}%`} showProgress progressValue={talkPct} />
            <MetricCard title="Engagement Score" value={`${engagement}/100`} showProgress progressValue={engagement} />
            <MetricCard title="Clarity Score" value={`${clarity}/100`} showProgress progressValue={clarity} />
          </div>

          {/* Whispers Section (kept empty-ish here; “full whisper view” is next page) */}
          <div>
            <h4 className="text-lg font-semibold mb-5">Whispers</h4>

            {whispers.length > 0 ? (
              <div className="space-y-3">
                {whispers.slice(0, 3).map((w, idx) => (
                  <WhisperCard key={idx} message={w.message} type={w.type} timestamp={w.timestamp} />
                ))}
                <div className="text-xs text-[#6B7280] mt-2">
                  Showing latest 3 — open “View with Whispers” for full feed.
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-[14px] border border-[#E6E8EC] p-8 text-center shadow-[0_4px_16px_rgba(0,0,0,0.04)]">
                <div className="w-12 h-12 bg-[#E6E8EC] rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-[#6B7280] text-xl">💬</span>
                </div>
                <p className="text-[#6B7280] text-sm">
                  {isListening ? "No coaching yet. Speak a bit to trigger tips." : "Start listening to enable real-time tips."}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}