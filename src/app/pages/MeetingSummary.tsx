import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Card } from "../components/Card";
import { Button } from "../components/Button";
import { Sidebar } from "../components/Sidebar";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from "recharts";
import { TrendingUp, MessageSquare, Clock, ChevronRight, Sparkles } from "lucide-react";

type Whisper = {
  message: string;
  type?: "info" | "success" | "warning";
  timestamp?: string;
  source?: "heuristic" | "llm";
};

type LastMeeting = {
  id: string;
  createdAt: string;
  persona?: string;
  mode?: string;
  duration?: number;
  transcript?: string;
  talkPct?: number;
  whispers?: Whisper[];
};

function formatDate(iso: string) {
  try {
    const d = new Date(iso);
    return d.toLocaleString(undefined, { month: "short", day: "2-digit", hour: "2-digit", minute: "2-digit" });
  } catch {
    return "Recently";
  }
}

export function MeetingSummary() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [meeting, setMeeting] = useState<LastMeeting | null>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("aiw:lastMeeting");
      if (raw) setMeeting(JSON.parse(raw));
    } catch {
      setMeeting(null);
    }
  }, []);

  const talkPct = meeting?.talkPct ?? 52;
  const createdAt = meeting?.createdAt ?? new Date().toISOString();
  const persona = meeting?.persona ?? "Standup";
  const mode = meeting?.mode ?? "Hybrid";

  const talkTimeData = useMemo(() => {
    // Demo: split "others" based on your talk %
    const you = talkPct;
    const rest = Math.max(0, 100 - you);
    const s = Math.round(rest * 0.38);
    const d = Math.round(rest * 0.34);
    const p = Math.max(0, rest - s - d);
    return [
      { name: "You", value: you, color: "#4C7DFF" },
      { name: "Sarah", value: s, color: "#22C55E" },
      { name: "Daniel", value: d, color: "#F59E0B" },
      { name: "Priya", value: p, color: "#8B5CF6" },
    ];
  }, [talkPct]);

  const insights = useMemo(() => {
    // Lightweight derived scores from talk %
    const engagement = Math.max(50, Math.min(95, 70 + Math.round((100 - Math.abs(50 - talkPct)) / 10)));
    const pace = Math.max(45, Math.min(95, 82 - Math.round(Math.max(0, talkPct - 60) / 2)));
    const balance = Math.max(35, Math.min(95, 90 - Math.abs(50 - talkPct)));

    return [
      { label: "Engagement Score", value: engagement, icon: TrendingUp },
      { label: "Speaking Pace", value: pace, icon: MessageSquare },
      { label: "Participation Balance", value: balance, icon: Clock },
    ];
  }, [talkPct]);

  const tips = useMemo(() => {
    const ws = meeting?.whispers ?? [];
    const top = ws.slice(0, 6).map((w) => w.message).filter(Boolean);

    const defaultTips = [
      {
        title: "Invite More Participation",
        description: `You spoke for ${talkPct}%. Ask 1 open question per minute.`,
      },
      {
        title: "Keep Segments Short",
        description: "Aim for 60–90 second chunks with brief pauses.",
      },
      {
        title: "Summarize + Next Step",
        description: "End key points with a crisp decision or action.",
      },
    ];

    if (top.length === 0) return defaultTips;

    // Convert whispers into human-friendly cards
    const mapped = top.slice(0, 3).map((m, idx) => ({
      title: idx === 0 ? "Top Whisper" : idx === 1 ? "Second Whisper" : "Third Whisper",
      description: m,
    }));

    // Ensure we still show one actionable meta tip
    if (mapped.length < 3) mapped.push(defaultTips[mapped.length]);
    return mapped.slice(0, 3);
  }, [meeting, talkPct]);

  return (
    <div className="flex h-screen bg-[#F6F8FB]">
      <Sidebar />

      <main className="flex-1 overflow-auto">
        <div className="p-8">
          <div className="max-w-[1200px] mx-auto bg-white rounded-[20px] shadow-[0_20px_50px_rgba(0,0,0,0.06)] p-12">
            {/* Header */}
            <div className="flex items-start justify-between mb-10">
              <div>
                <h1 className="text-3xl font-bold text-[#111318] mb-2">Meeting Summary</h1>
                <div className="text-[#6B7280] text-sm flex items-center gap-3 flex-wrap">
                  <span className="inline-flex items-center gap-2">
                    <Sparkles className="w-4 h-4" /> {persona}
                  </span>
                  <span className="px-2 py-1 rounded-full bg-[#F6F8FB] border border-[#E6E8EC]">{mode}</span>
                  <span>•</span>
                  <span>{formatDate(createdAt)}</span>
                </div>
              </div>

              <div className="flex gap-3">
                <Button variant="secondary" onClick={() => navigate(`/meeting/live/${id ?? "instant"}`)}>
                  New Session
                </Button>
                <Button variant="primary" onClick={() => navigate("/dashboard")}>
                  Back to Dashboard
                </Button>
              </div>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-12 gap-8">
              {/* Left: Pie */}
              <div className="col-span-12 lg:col-span-5">
                <Card className="p-6">\n                  <div className="mb-4">\n                    <div className="font-semibold text-[#111318]">Talk-time split</div>\n                    <div className="text-xs text-[#6B7280]">Estimated from transcript activity</div>\n                  </div>
                  <div className="h-[280px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie data={talkTimeData} dataKey="value" nameKey="name" outerRadius={90} label>
                          {talkTimeData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </Card>\n\n                <div className="mt-6">\n                  <Card className="p-6">\n                    <div className="mb-4">\n                      <div className="font-semibold text-[#111318]">Transcript (tail)</div>\n                      <div className="text-xs text-[#6B7280]">Last ~700 characters</div>\n                    </div>
                    <div className="text-sm text-gray-700 leading-relaxed max-h-[220px] overflow-auto pr-2">
                      {meeting?.transcript ? (
                        meeting.transcript.slice(-700)
                      ) : (
                        <span className="text-gray-400">No transcript captured. Start the mic in the live view.</span>
                      )}
                    </div>
                  </Card>\n                </div>
              </div>

              {/* Right: Insights + tips */}
              <div className="col-span-12 lg:col-span-7">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                  {insights.map((insight) => (
                    <Card key={insight.label}>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-[#F6F8FB] rounded-full flex items-center justify-center">
                          <insight.icon className="w-5 h-5 text-[#4C7DFF]" />
                        </div>
                        <div>
                          <div className="text-xs text-[#6B7280]">{insight.label}</div>
                          <div className="text-2xl font-bold text-[#111318]">{insight.value}</div>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>

                <Card className="p-6">\n                  <div className="mb-4">\n                    <div className="font-semibold text-[#111318]">Coach takeaways</div>\n                    <div className="text-xs text-[#6B7280]">Best next steps for the next meeting</div>\n                  </div>
                  <div className="space-y-4">
                    {tips.map((tip) => (
                      <div
                        key={tip.title}
                        className="flex items-start justify-between bg-[#F6F8FB] border border-[#E6E8EC] rounded-2xl p-5"
                      >
                        <div>
                          <div className="font-semibold text-[#111318] mb-1">{tip.title}</div>
                          <div className="text-sm text-[#6B7280] leading-relaxed">{tip.description}</div>
                        </div>
                        <ChevronRight className="w-5 h-5 text-[#6B7280] mt-1" />
                      </div>
                    ))}
                  </div>

                  <div className="mt-6 flex gap-3">
                    <Button variant="primary" onClick={() => navigate(`/meeting/whisper/${id ?? "instant"}`)}>
                      Review in Whisper Mode
                    </Button>
                    <Button variant="secondary" onClick={() => navigate(`/meeting/live/${id ?? "instant"}`)}>
                      Run it again
                    </Button>
                  </div>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
