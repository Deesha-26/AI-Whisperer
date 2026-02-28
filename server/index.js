import express from "express";
import cors from "cors";
import multer from "multer";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import OpenAI from "openai";

const app = express();
app.use(cors());
app.use(express.json());

const uploadDir = path.join(process.cwd(), "uploads");
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

const upload = multer({ dest: uploadDir });

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

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
    const { transcript } = req.body;
    if (!transcript) return res.status(400).json({ error: "Missing transcript" });

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "You are a real-time meeting coach. Give ONE short coaching tip under 12 words.",
        },
        { role: "user", content: transcript },
      ],
    });

    res.json({ whisper: response.choices[0].message.content });
  } catch (err) {
  // Safe structured logging (does NOT print your API key)
  console.error("ANALYZE_ERROR_MESSAGE:", err?.message);
  console.error("ANALYZE_ERROR_NAME:", err?.name);
  console.error("ANALYZE_ERROR_STATUS:", err?.status);
  console.error("ANALYZE_ERROR_CODE:", err?.code);
  console.error("ANALYZE_ERROR_TYPE:", err?.type);

  // Some OpenAI SDK errors include response details
  console.error("ANALYZE_ERROR_RESPONSE:", err?.response?.data ?? err?.error ?? null);

  res.status(500).json({
    error: "Analysis failed",
    // TEMP: return minimal debug info to you (remove after fix)
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