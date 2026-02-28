import express from "express";
import cors from "cors";
import multer from "multer";
import fs from "fs";
import OpenAI from "openai";

const app = express();
app.use(cors());
app.use(express.json());

const upload = multer({ dest: "uploads/" });

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server running on ${PORT}`));

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

app.get("/", (req, res) => {
  res.send("AI Whisperer API running ✅ Try /health");
});

app.get("/health", (req, res) => {
  res.json({ ok: true });
});

// 🎤 Speech → text
app.post("/transcribe", upload.single("audio"), async (req, res) => {
  const transcript = await openai.audio.transcriptions.create({
    file: fs.createReadStream(req.file.path),
    model: "gpt-4o-mini-transcribe"
  });

  fs.unlinkSync(req.file.path);
  res.json({ text: transcript.text });
});

// 🧠 Transcript → coaching whisper
app.post("/analyze", async (req, res) => {
  const { transcript } = req.body;

  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content:
          "You are a real-time meeting coach. Give ONE short coaching tip under 12 words."
      },
      { role: "user", content: transcript }
    ]
  });

  res.json({ whisper: response.choices[0].message.content });
});

app.listen(4000, () => console.log("AI server running on port 4000"));

import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Serve frontend build
app.use(express.static(path.join(__dirname, "../dist")));

// SPA fallback
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../dist/index.html"));
});