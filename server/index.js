import express from "express";
import cors from "cors";
import multer from "multer";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import OpenAI from "openai";

// Load env vars (local dev). In production, your platform should inject these.
// This is safe even if no .env exists.
import "dotenv/config";

const app = express();
app.use(cors());
app.use(express.json());

const uploadDir = path.join(process.cwd(), "uploads");
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

const upload = multer({ dest: uploadDir });

const apiKey = process.env.OPENAI_API_KEY;
const openai = apiKey ? new OpenAI({ apiKey }) : null;

// --------------------
// API ROUTES
// --------------------
app.get("/api/health", (req, res) => {
  res.json({ ok: true });
});

app.get("/api", (req, res) => {
  res.send("AI Whisperer API running ✅");
});

// 🎤 Speech → text
app.post("/api/transcribe", upload.single("audio"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: "Missing audio file" });

    if (!openai) {
      // Don't crash the whole app if the key isn't set.
      fs.unlinkSync(req.file.path);
      return res.status(500).json({
        error: "OPENAI_API_KEY is not set",
        hint: "Create a .env file with OPENAI_API_KEY=... (or set it in your hosting env).",
      });
    }

    const transcript = await openai.audio.transcriptions.create({
      file: fs.createReadStream(req.file.path),
      model: "gpt-4o-mini-transcribe",
    });

    fs.unlinkSync(req.file.path);
    res.json({ text: transcript.text });
  } 
  catch (err) {
  console.error("ANALYZE_ERROR:", err?.message ?? err);
  console.error("ANALYZE_ERROR_RAW:", err);
  res.status(500).json({ error: "Analysis failed" });
}
});

// 🧠 Transcript → coaching whisper
app.post("/api/analyze", async (req, res) => {
  try {
    const { transcript, persona = "Standup", style = "balanced" } = req.body ?? {};
    if (!transcript) return res.status(400).json({ error: "Missing transcript" });

    if (!openai) {
      return res.status(500).json({
        error: "OPENAI_API_KEY is not set",
        hint: "Create a .env file with OPENAI_API_KEY=... (or set it in your hosting env).",
      });
    }

    // Keep requests small + safe
    const text = String(transcript).slice(-1200);

    const system = [
      "You are a real-time meeting coach.",
      "Your job: provide ONE actionable coaching tip that the speaker can do NOW.",
      "Return STRICT JSON only, no markdown, no extra keys.",
      'Schema: {"tip":"<max 12 words>","tag":"clarity|pace|confidence|structure|engagement"}',
      "Tip must be supportive, direct, and specific.",
      `Context persona: ${persona}.`,
      style === "direct" ? "Be very concise and blunt (still kind)." : "Be concise and calm.",
      "Never mention policies, tools, or that you are an AI.",
    ].join(" ");

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      temperature: 0.4,
      messages: [
        { role: "system", content: system },
        { role: "user", content: text },
      ],
    });

    const raw = response?.choices?.[0]?.message?.content ?? "";
    let tip = "";
    let tag = "engagement";

    try {
      const parsed = JSON.parse(raw);
      tip = String(parsed?.tip ?? "").trim();
      tag = String(parsed?.tag ?? tag).trim();
    } catch {
      // Fallback: treat raw as the tip
      tip = String(raw).trim();
      tag = "engagement";
    }

    // Enforce <= 12 words (hard clamp for reliability in demos)
    const words = tip.split(/\s+/).filter(Boolean);
    if (words.length > 12) tip = words.slice(0, 12).join(" ");

    // Last-resort fallback
    if (!tip) tip = "Pause. Ask one clear question to invite input.";

    // Normalize tag
    const allowed = new Set(["clarity", "pace", "confidence", "structure", "engagement"]);
    if (!allowed.has(tag)) tag = "engagement";

    res.json({ whisper: tip, tag });
  } catch (err) {
    // Safe structured logging (does NOT print your API key)
    console.error("ANALYZE_ERROR_MESSAGE:", err?.message);
    console.error("ANALYZE_ERROR_NAME:", err?.name);
    console.error("ANALYZE_ERROR_STATUS:", err?.status);
    console.error("ANALYZE_ERROR_CODE:", err?.code);
    console.error("ANALYZE_ERROR_TYPE:", err?.type);
    console.error("ANALYZE_ERROR_RESPONSE:", err?.response?.data ?? err?.error ?? null);

    res.status(500).json({
      error: "Analysis failed",
      debug: {
        message: err?.message,
        status: err?.status,
        code: err?.code,
        type: err?.type,
      },
    });
  }
});


// --------------------
// SERVE FRONTEND (Vite build)
// --------------------
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Serve frontend build output from repo root /dist
app.use(express.static(path.join(__dirname, "../dist")));

// SPA fallback (IMPORTANT: keep this LAST)
app.get(/^(?!\/api).*/, (req, res) => {
  res.sendFile(path.join(__dirname, "../dist/index.html"));
});

// --------------------
// START SERVER (ONLY ONCE)
// --------------------
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));