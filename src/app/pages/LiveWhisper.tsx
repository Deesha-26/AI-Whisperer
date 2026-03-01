import { useEffect, useRef, useState } from "react";
import { suggestWhisper } from "../lib/whisperEngine";

type Mode = "heuristic" | "llm" | "hybrid";

export function LiveWhisper() {
  const [transcript, setTranscript] = useState("");
  const [whispers, setWhispers] = useState<string[]>([]);
  const [isRecording, setIsRecording] = useState(false);
  const [persona, setPersona] = useState("Interview");
  const [mode, setMode] = useState<Mode>("hybrid");

  const recognitionRef = useRef<any>(null);

  // 🎤 Speech Recognition
  useEffect(() => {
    const SpeechRecognition =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) return;

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;

    recognition.onresult = (event: any) => {
      let text = "";
      for (let i = event.resultIndex; i < event.results.length; i++) {
        text += event.results[i][0].transcript;
      }
      setTranscript(text);
    };

    recognitionRef.current = recognition;
  }, []);

  function toggleRecording() {
    if (!recognitionRef.current) return;

    if (isRecording) {
      recognitionRef.current.stop();
    } else {
      recognitionRef.current.start();
    }
    setIsRecording(!isRecording);
  }

  // ⏱ Whisper generation loop
  useEffect(() => {
    const interval = setInterval(async () => {
      if (!transcript) return;

      let tip: string | null = null;

      if (mode !== "llm") {
        tip = suggestWhisper(transcript, persona as any, whispers);
      }

      // optional server call (works even without API key)
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
          // fallback silently
        }
      }

      if (tip && !whispers.includes(tip)) {
        setWhispers(w => [...w.slice(-5), tip]);
      }
    }, 8000);

    return () => clearInterval(interval);
  }, [transcript, persona, mode, whispers]);

  return (
    <div className="p-8 max-w-3xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold">🎧 Live Whisper</h1>

      <div className="flex gap-4">
        <select
          value={persona}
          onChange={e => setPersona(e.target.value)}
          className="border p-2"
        >
          <option>Interview</option>
          <option>Standup</option>
          <option>Sales Call</option>
          <option>Design Critique</option>
        </select>

        <select
          value={mode}
          onChange={e => setMode(e.target.value as Mode)}
          className="border p-2"
        >
          <option value="hybrid">Smart Coach</option>
          <option value="heuristic">Local Coach</option>
          <option value="llm">Cloud Coach</option>
        </select>

        <button
          onClick={toggleRecording}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          {isRecording ? "Stop Mic" : "Start Mic"}
        </button>
      </div>

      <div className="bg-gray-100 p-4 rounded min-h-[120px]">
        {transcript || "Start speaking…"}
      </div>

      <div className="space-y-2">
        {whispers.map((w, i) => (
          <div key={i} className="bg-purple-100 p-3 rounded">
            💡 {w}
          </div>
        ))}
      </div>
    </div>
  );
}