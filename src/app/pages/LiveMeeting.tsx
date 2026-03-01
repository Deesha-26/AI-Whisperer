import { useEffect, useMemo, useRef, useState } from "react";
import { suggestWhisper } from "../lib/whisperEngine";

type Mode = "heuristic" | "llm" | "hybrid";

function Pill({
  tone,
  children
}: {
  tone: "green" | "gray" | "purple" | "amber";
  children: React.ReactNode;
}) {
  const cls =
    tone === "green"
      ? "bg-green-100 text-green-800 border-green-200"
      : tone === "purple"
      ? "bg-purple-100 text-purple-800 border-purple-200"
      : tone === "amber"
      ? "bg-amber-100 text-amber-800 border-amber-200"
      : "bg-gray-100 text-gray-800 border-gray-200";
  return (
    <span className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-medium ${cls}`}>
      {children}
    </span>
  );
}

export function LiveMeeting() {
  const [transcript, setTranscript] = useState("");
  const [whispers, setWhispers] = useState<string[]>([]);
  const [isRecording, setIsRecording] = useState(false);
  const [persona, setPersona] = useState("Standup");
  const [mode, setMode] = useState<Mode>("hybrid");
  const [lastTipAt, setLastTipAt] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const recognitionRef = useRef<any>(null);

  const speechSupported = useMemo(() => {
    const w = window as any;
    return Boolean(w.SpeechRecognition || w.webkitSpeechRecognition);
  }, []);

  useEffect(() => {
    if (!speechSupported) return;

    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;

    recognition.onresult = (event: any) => {
      setError(null);
      let text = "";
      for (let i = event.resultIndex; i < event.results.length; i++) {
        text += event.results[i][0].transcript;
      }
      setTranscript(text);
    };

    recognition.onerror = (e: any) => {
      setError(e?.error ? `Speech error: ${e.error}` : "Speech error");
    };

    recognitionRef.current = recognition;

    return () => {
      try {
        recognition.stop?.();
      } catch {}
    };
  }, [speechSupported]);

  function toggleRecording() {
    setError(null);
    if (!speechSupported) {
      setError("Speech recognition not supported in this browser. Try Chrome.");
      return;
    }
    if (!recognitionRef.current) {
      setError("Speech recognition not initialized.");
      return;
    }

    try {
      if (isRecording) recognitionRef.current.stop();
      else recognitionRef.current.start();
      setIsRecording(!isRecording);
    } catch (e: any) {
      setError("Could not start microphone. Check permissions.");
    }
  }

  // Tip cadence (every ~8s)
  useEffect(() => {
    const interval = setInterval(async () => {
      if (!transcript) return;

      let tip: string | null = null;

      if (mode !== "llm") {
        tip = suggestWhisper(transcript, persona as any, whispers);
      }

      // optional server call (works even w/o API key if you set /api/analyze fallback)
      if (!tip && mode !== "heuristic") {
        try {
          const res = await fetch("/api/analyze", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ transcript, persona })
          });
          const data = await res.json();
          tip = data.whispers?.[0] ?? null;
        } catch {
          // silent fallback
        }
      }

      if (tip && !whispers.includes(tip)) {
        setWhispers((w) => [...w, tip].slice(-12));
        setLastTipAt(Date.now());
      }
    }, 8000);

    return () => clearInterval(interval);
  }, [transcript, persona, mode, whispers]);

  const statusTone = !speechSupported
    ? "amber"
    : isRecording
    ? "green"
    : "gray";

  const statusText = !speechSupported
    ? "Mic not supported"
    : isRecording
    ? "Recording"
    : "Idle";

  const modeLabel =
    mode === "hybrid" ? "Smart Coach" : mode === "heuristic" ? "Local Coach" : "Cloud Coach";

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="mx-auto max-w-6xl px-6 py-10">
        {/* Header */}
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-2xl bg-black text-white flex items-center justify-center shadow-sm">
                <span className="text-lg">📊</span>
              </div>
              <div>
                <h1 className="text-3xl font-semibold tracking-tight">Live Meeting Coach</h1>
                <p className="text-sm text-gray-600">
                  Real-time transcript + micro-coaching to keep you crisp, confident, and structured.
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <Pill tone={statusTone as any}>
                <span className={`h-2 w-2 rounded-full ${isRecording ? "bg-green-600" : "bg-gray-400"}`} />
                {statusText}
              </Pill>
              <Pill tone="purple">{modeLabel}</Pill>
              <Pill tone="gray">{persona}</Pill>
              {lastTipAt ? (
                <Pill tone="gray">
                  Last tip {Math.max(1, Math.round((Date.now() - lastTipAt) / 1000))}s ago
                </Pill>
              ) : (
                <Pill tone="gray">Tips every ~8s</Pill>
              )}
            </div>
          </div>

          {/* Controls */}
          <div className="flex flex-col gap-3 md:flex-row md:items-center">
            <select
              value={persona}
              onChange={(e) => setPersona(e.target.value)}
              className="w-full md:w-48 rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-black/10"
            >
              <option>Standup</option>
              <option>Interview</option>
              <option>Sales Call</option>
              <option>Design Critique</option>
              <option>General</option>
            </select>

            <select
              value={mode}
              onChange={(e) => setMode(e.target.value as Mode)}
              className="w-full md:w-48 rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-black/10"
            >
              <option value="hybrid">Smart Coach</option>
              <option value="heuristic">Local Coach</option>
              <option value="llm">Cloud Coach</option>
            </select>

            <button
              onClick={toggleRecording}
              className={`inline-flex items-center justify-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold shadow-sm transition
                ${
                  isRecording
                    ? "bg-gray-900 text-white hover:bg-gray-800"
                    : "bg-green-600 text-white hover:bg-green-700"
                }`}
            >
              <span className="text-base">{isRecording ? "⏹" : "🎙️"}</span>
              {isRecording ? "Stop Meeting" : "Start Meeting"}
            </button>
          </div>
        </div>

        {error ? (
          <div className="mt-5 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
            {error}
          </div>
        ) : null}

        {/* Main grid */}
        <div className="mt-8 grid gap-6 lg:grid-cols-5">
          {/* Transcript */}
          <div className="lg:col-span-3">
            <div className="rounded-2xl border border-gray-200 bg-white shadow-sm">
              <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold">Transcript</span>
                  <span className="text-xs text-gray-500">(live)</span>
                </div>
                <button
                  onClick={() => setTranscript("")}
                  className="text-xs text-gray-500 hover:text-gray-700"
                  disabled={!transcript}
                >
                  Clear
                </button>
              </div>

              <div className="px-5 py-4">
                <div className="min-h-[260px] whitespace-pre-wrap rounded-xl bg-gray-50 p-4 text-sm leading-6 text-gray-800">
                  {transcript || (
                    <span className="text-gray-500">
                      Start the mic, speak naturally, and you’ll see your live transcript here.
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Quick coaching hints */}
            <div className="mt-6 grid gap-4 md:grid-cols-3">
              <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
                <div className="text-xs font-semibold text-gray-700">Structure</div>
                <div className="mt-2 text-sm text-gray-600">
                  {persona === "Standup"
                    ? "Yesterday → Today → Blockers"
                    : persona === "Interview"
                    ? "STAR (S/T/A/R)"
                    : persona === "Sales Call"
                    ? "Problem → Value → Ask"
                    : "Goal → Constraint → Tradeoff"}
                </div>
              </div>

              <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
                <div className="text-xs font-semibold text-gray-700">Cadence</div>
                <div className="mt-2 text-sm text-gray-600">
                  Keep sentences short. Pause 1 beat instead of filler words.
                </div>
              </div>

              <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
                <div className="text-xs font-semibold text-gray-700">Clarity</div>
                <div className="mt-2 text-sm text-gray-600">
                  Add one concrete example or number to anchor your point.
                </div>
              </div>
            </div>
          </div>

          {/* Whisper feed */}
          <div className="lg:col-span-2">
            <div className="rounded-2xl border border-gray-200 bg-white shadow-sm">
              <div className="border-b border-gray-100 px-5 py-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm font-semibold">Coach Feed</div>
                    <div className="text-xs text-gray-500">micro-whispers as you speak</div>
                  </div>
                  <button
                    onClick={() => setWhispers([])}
                    className="text-xs text-gray-500 hover:text-gray-700"
                    disabled={whispers.length === 0}
                  >
                    Clear
                  </button>
                </div>
              </div>

              <div className="max-h-[520px] overflow-auto px-5 py-4">
                {whispers.length === 0 ? (
                  <div className="rounded-xl border border-dashed border-gray-200 bg-gray-50 p-4 text-sm text-gray-600">
                    Your coach tips will show up here once you start talking.
                  </div>
                ) : (
                  <div className="space-y-3">
                    {whispers
                      .slice()
                      .reverse()
                      .map((w, i) => (
                        <div
                          key={`${i}-${w.slice(0, 12)}`}
                          className="rounded-xl border border-gray-100 bg-white p-3 shadow-sm"
                        >
                          <div className="flex items-start gap-3">
                            <div className="mt-0.5 h-8 w-8 flex-shrink-0 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center">
                              💡
                            </div>
                            <div className="text-sm text-gray-800">{w}</div>
                          </div>
                        </div>
                      ))}
                  </div>
                )}
              </div>

              <div className="border-t border-gray-100 px-5 py-3 text-xs text-gray-500">
                Tip sources: {mode === "llm" ? "Cloud coach" : mode === "heuristic" ? "Local coach" : "Smart mix"}
              </div>
            </div>
          </div>
        </div>

        {/* Footer helper */}
        <div className="mt-8 text-xs text-gray-500">
          Pro tip: speak in short sentences and end with a clear “next step” to trigger better coaching.
        </div>
      </div>
    </div>
  );
}