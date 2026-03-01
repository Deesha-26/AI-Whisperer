export type Persona =
  | "Interview"
  | "Standup"
  | "Sales Call"
  | "Design Critique"
  | "General";

const fillerRegex = /\b(um|uh|like)\b/gi;
const hedgeRegex = /(maybe|i think|kind of|sort of)/gi;
const vagueRegex = /(stuff|things|basically|etc)/gi;
const apologyRegex = /(sorry|apologize)/gi;

export function suggestWhisper(
  transcript: string,
  persona: Persona,
  history: string[]
): string | null {
  const text = transcript.toLowerCase();

  const candidates: string[] = [];

  if (fillerRegex.test(text))
    candidates.push("Pause instead of filler words.");

  if (hedgeRegex.test(text))
    candidates.push("State your point confidently.");

  if (vagueRegex.test(text))
    candidates.push("Add a concrete example or number.");

  if (apologyRegex.test(text))
    candidates.push("Skip apologizing — go straight to value.");

  // persona rotation
  if (persona === "Interview")
    candidates.push("Use the STAR method.");

  if (persona === "Standup")
    candidates.push("Use Yesterday → Today → Blockers.");

  if (persona === "Sales Call")
    candidates.push("Ask a check-in question.");

  if (persona === "Design Critique")
    candidates.push("Explain the user goal first.");

  // remove recently used tips
  const filtered = candidates.filter(t => !history.includes(t));

  if (filtered.length === 0) return null;

  return filtered[Math.floor(Math.random() * filtered.length)];
}