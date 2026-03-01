# AI Whisperer — Judge Demo Script (≈60–90s)

## Setup (before you start)
- Open the app in Chrome.
- If you want LLM coaching, set `OPENAI_API_KEY` and run `npm run dev:full`.
- If not, run `npm run dev` and use **Heuristic** mode (still demos great).

## Narrative (what to say)
**0–10s: The problem**
“Meetings and interviews fail in the moment — not in preparation. People lose clarity, ramble, or freeze, and feedback comes too late.”

**10–25s: The magic moment**
“This app listens locally, shows a live transcript, and gives tiny ‘whispers’ you can apply immediately — like a coach in your ear.”

**25–45s: Show it working**
- Press **M** to start the mic.
- Speak:  
  “Today I want to summarize progress, call out blockers, and propose next steps… um… we might be able to…”  
- Point to:
  - transcript filling in
  - whispers appearing every ~8 seconds
  - **Whisper Quality** badge

**45–60s: Why it’s better**
“Notice it doesn’t spam. It dedupes and throttles tips, so the guidance stays stable.”

**60–80s: AI differentiation**
- Press **W** to cycle: **Heuristic → LLM → Hybrid**
- Say:  
  “Heuristic is instant and offline. LLM is context-aware. Hybrid is the best default.”

**80–90s: Close the loop**
- Press **E** to end.
- Summary screen shows your last session: takeaways + transcript tail.
“Now you get actionable next steps immediately after the meeting.”

## Judge-friendly callouts
- **Privacy:** mic + transcript stay in-browser (LLM is optional).
- **Accessibility:** keyboard-first (M/W/E) — works in high-stress moments.
- **Product thinking:** quality indicator prevents tip fatigue.

## Suggested personas to impress
- **Interview:** “Here’s my recommendation…” (shows confidence tips)
- **Sales Call:** “Let me ask a quick question…” (shows engagement tips)
