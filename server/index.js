import "dotenv/config";
import express from "express";
import path from "path";
import { fileURLToPath } from "url";

const app = express();
app.use(express.json());

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Serve Vite build output
const distPath = path.join(__dirname, "../dist");
app.use(express.static(distPath));

/**
 * Local "Smart Coach" endpoint (no API key needed)
 */
app.post("/api/analyze", (req, res) => {
  const { transcript = "", persona = "General" } = req.body ?? {};
  const text = transcript.toLowerCase();

  const tips = [];

  if (!text.trim()) {
    tips.push("Start with a one-sentence summary of your goal.");
  }

  if (/(um|uh|like)\b/g.test(text))
    tips.push("Try a 1-second pause instead of filler words.");

  if (/(maybe|i think|kind of|sort of)/g.test(text))
    tips.push("Sound more confident: state your point directly.");

  if (/(stuff|things|basically|etc)/g.test(text))
    tips.push("Add one concrete example or number.");

  if (/(sorry|apologize)/g.test(text))
    tips.push("Skip apologizing — jump straight to your point.");

  if (persona.toLowerCase().includes("interview"))
    tips.push("Use STAR: Situation → Task → Action → Result.");

  if (persona.toLowerCase().includes("standup"))
    tips.push("Structure: Yesterday → Today → Blockers.");

  if (persona.toLowerCase().includes("sales"))
    tips.push("Ask a check-in question to engage the listener.");

  if (persona.toLowerCase().includes("design"))
    tips.push("Explain the user goal before the solution.");

  res.json({
    mode: "local",
    whispers: tips.slice(0, 3)
  });
});

// React Router fallback
app.get("*", (_req, res) => {
  res.sendFile(path.join(distPath, "index.html"));
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log("Server running on port", PORT));