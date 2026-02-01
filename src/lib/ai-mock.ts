import type { Flashcard } from "~/lib/types";

/**
 * Mock AI: generates flashcards from text. Replace with real API (e.g. OpenAI)
 * when OPENAI_API_KEY or similar is configured.
 */
export async function generateFlashcardsFromText(text: string): Promise<Omit<Flashcard, "id">[]> {
  await new Promise((r) => setTimeout(r, 800));

  const lines = text
    .trim()
    .split(/\n+/)
    .map((s) => s.trim())
    .filter(Boolean);

  if (lines.length === 0) {
    return [
      { question: "Sample question", answer: "Sample answer" },
      { question: "Another question", answer: "Another answer" },
    ];
  }

  const cards: Omit<Flashcard, "id">[] = [];
  for (let i = 0; i < lines.length - 1; i += 2) {
    cards.push({
      question: lines[i] ?? "",
      answer: lines[i + 1] ?? "",
    });
  }
  if (lines.length % 2 === 1) {
    cards.push({
      question: lines[lines.length - 1] ?? "",
      answer: "",
    });
  }

  if (cards.length === 0) {
    return [
      { question: "Sample question", answer: "Sample answer" },
      { question: "Another question", answer: "Another answer" },
    ];
  }

  return cards;
}

/**
 * Mock: extract key concepts from text (bonus). Replace with real API.
 */
export async function extractKeyConcepts(text: string): Promise<string> {
  await new Promise((r) => setTimeout(r, 500));
  const sentences = text
    .trim()
    .split(/[.!?]+/)
    .map((s) => s.trim())
    .filter(Boolean)
    .slice(0, 5);
  return sentences.join("\n") || text.slice(0, 500);
}
