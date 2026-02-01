"use client";

import { useRef, useState } from "react";

import type { Flashcard } from "~/lib/types";
import { extractKeyConcepts, generateFlashcardsFromText } from "~/lib/ai-mock";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";
import { Label } from "~/components/ui/label";
import { Separator } from "~/components/ui/separator";
import { Textarea } from "~/components/ui/textarea";
import { FlashcardEditor } from "~/components/flashcard-editor";

interface GenerateCardsProps {
  onSaveCards: (cards: Omit<Flashcard, "id">[]) => void;
}

type DraftCard = Flashcard & { temp?: boolean };

export function GenerateCards({ onSaveCards }: GenerateCardsProps) {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [summarizing, setSummarizing] = useState(false);
  const [draftCards, setDraftCards] = useState<DraftCard[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const summarizeText = async () => {
    if (!input.trim()) return;
    setSummarizing(true);
    try {
      const summary = await extractKeyConcepts(input);
      setInput(summary);
    } finally {
      setSummarizing(false);
    }
  };

  const generateFromText = async () => {
    if (!input.trim()) return;
    setLoading(true);
    try {
      const generated = await generateFlashcardsFromText(input);
      setDraftCards(
        generated.map((c, i) => ({
          id: `draft-${i}-${Date.now()}`,
          question: c.question,
          answer: c.answer,
          temp: true,
        }))
      );
    } finally {
      setLoading(false);
    }
  };

  const addBlankCard = () => {
    setDraftCards((prev) => [
      ...prev,
      {
        id: `draft-blank-${Date.now()}`,
        question: "",
        answer: "",
        temp: true,
      },
    ]);
  };

  const updateDraft = (id: string, question: string, answer: string) => {
    setDraftCards((prev) =>
      prev.map((c) =>
        c.id === id ? { ...c, question, answer } : c
      )
    );
  };

  const removeDraft = (id: string) => {
    setDraftCards((prev) => prev.filter((c) => c.id !== id));
  };

  const saveToDeck = () => {
    const toSave = draftCards
      .filter((c) => c.question.trim() || c.answer.trim())
      .map(({ question, answer }) => ({ question: question.trim(), answer: answer.trim() }));
    if (toSave.length > 0) {
      onSaveCards(toSave);
      setDraftCards([]);
      setInput("");
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const raw = reader.result;
      const text = typeof raw === "string" ? raw : "";
      setInput((prev) => (prev ? `${prev}\n\n${text}` : text));
    };
    reader.readAsText(file);
    e.target.value = "";
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Generate cards</CardTitle>
        <CardDescription>
          Paste text or upload a file. We&apos;ll suggest flashcards. Review and
          edit before saving.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="generate-input">Text</Label>
          <Textarea
            id="generate-input"
            placeholder="Paste or type content to turn into flashcards..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            rows={5}
            className="resize-none"
          />
          <div className="flex flex-wrap gap-2">
            <Button
              onClick={generateFromText}
              disabled={loading || !input.trim()}
            >
              {loading ? "Generating…" : "Generate cards"}
            </Button>
            <Button
              variant="outline"
              onClick={summarizeText}
              disabled={summarizing || !input.trim()}
            >
              {summarizing ? "Extracting…" : "Extract key concepts"}
            </Button>
            <Button
              variant="outline"
              onClick={() => fileInputRef.current?.click()}
            >
              Upload file
            </Button>
            <input
              ref={fileInputRef}
              type="file"
              accept=".txt,.md,.json,text/*"
              className="hidden"
              onChange={handleFileChange}
            />
          </div>
        </div>

        {draftCards.length > 0 && (
          <>
            <Separator />
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label>Review and edit</Label>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={addBlankCard}>
                    Add card
                  </Button>
                  <Button size="sm" onClick={saveToDeck}>
                    Save to deck
                  </Button>
                </div>
              </div>
              <ul className="grid gap-2 sm:grid-cols-2">
                {draftCards.map((card) => (
                  <li key={card.id}>
                    <div className="border bg-card rounded-lg p-3 flex flex-col gap-2">
                      <div className="flex items-start justify-between gap-2">
                        <span className="text-muted-foreground line-clamp-1 text-sm">
                          {card.question || "(No question)"}
                        </span>
                        <FlashcardEditor
                          card={card}
                          onSave={(q, a) => updateDraft(card.id, q, a)}
                          onDelete={() => removeDraft(card.id)}
                          trigger={
                            <Button variant="ghost" size="icon-xs">
                              Edit
                            </Button>
                          }
                        />
                      </div>
                      <p className="text-muted-foreground line-clamp-1 text-xs">
                        {card.answer || "(No answer)"}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
