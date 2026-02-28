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

const upload = multer({ dest: "uploads/" });

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
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Transcription failed" });
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
    console.error(err);
    res.status(500).json({ error: "Analysis failed" });
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