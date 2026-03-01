
  # Review File Instructions

  This is a code bundle for Review File Instructions. The original project is available at https://www.figma.com/design/ZkcTyNnkCC88ucySzbVM0C/Review-File-Instructions.

  ## Running the code

  ### Frontend only (prototype)
  1. Install deps: `npm i`
  2. Start: `npm run dev`

  ### Full stack (optional, enables live transcription + coaching API)
  1. Install deps: `npm i`
  2. Create `.env` from `.env.example` and set `OPENAI_API_KEY`
  3. Run both web + API: `npm run dev:full`

  Build + serve locally:
  - `npm run build`
  - `npm run start` (serves `dist/` and the `/api/*` routes)


## Makeathon demo (60 seconds)
1. Go to **Meeting → Live** (or “New Session”).
2. Press **M** to start the mic (browser will prompt).
3. Speak for ~15–20 seconds. Watch:
   - **Live transcript** fill in
   - **Whispers** appear every ~8 seconds
   - **Whisper Quality** badge stabilize (Helpful / Okay / Noisy)
4. Press **W** to cycle coaching modes: **Heuristic → LLM → Hybrid**.
5. Press **E** to end the meeting → **Summary** shows your last session (tips + transcript tail).

### Shortcuts
- **M**: toggle mic
- **W**: cycle whisper mode
- **E**: end meeting
- **Esc** (in Whisper Mode): back to Live

### Coaching modes
- **Heuristic**: runs fully on-device (fast + offline).
- **LLM**: calls `/api/analyze` (requires `OPENAI_API_KEY`).
- **Hybrid**: best of both (heuristic + occasional LLM refinement).

## Notes
- Browser speech recognition is a Web Speech API feature; Chrome works best.
- LLM tips are throttled and deduped to avoid “tip spam” during demos.

