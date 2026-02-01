"use client";

import { useEffect, useState } from "react";
import { Trash2Icon } from "lucide-react";

import type { Flashcard } from "~/lib/types";
import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Textarea } from "~/components/ui/textarea";
import { cn } from "~/lib/utils";

interface CardEditorPanelProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  cards: Flashcard[];
  initialCardId: string | null;
  onUpdateCard: (cardId: string, question: string, answer: string) => void;
  onDeleteCard: (cardId: string) => void;
}

function truncate(text: string, max = 50) {
  const t = text.trim() || "—";
  return t.length <= max ? t : t.slice(0, max).trim() + "…";
}

export function CardEditorPanel({
  open,
  onOpenChange,
  cards,
  initialCardId,
  onUpdateCard,
  onDeleteCard,
}: CardEditorPanelProps) {
  const [selectedId, setSelectedId] = useState<string | null>(initialCardId);
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");

  const selectedCard = selectedId
    ? cards.find((c) => c.id === selectedId)
    : cards[0];

  useEffect(() => {
    if (open) {
      const id = initialCardId && cards.some((c) => c.id === initialCardId)
        ? initialCardId
        : cards[0]?.id ?? null;
      setSelectedId(id);
      const card = id ? cards.find((c) => c.id === id) : cards[0];
      if (card) {
        setQuestion(card.question);
        setAnswer(card.answer);
      } else {
        setQuestion("");
        setAnswer("");
      }
    }
  }, [open, initialCardId, cards]);

  useEffect(() => {
    if (selectedCard) {
      setQuestion(selectedCard.question);
      setAnswer(selectedCard.answer);
    }
  }, [selectedCard?.id]);

  const handleSelect = (card: Flashcard) => {
    setSelectedId(card.id);
    setQuestion(card.question);
    setAnswer(card.answer);
  };

  const handleSave = () => {
    if (selectedCard) {
      onUpdateCard(selectedCard.id, question, answer);
    }
  };

  const handleDelete = () => {
    if (!selectedCard) return;
    const idx = cards.findIndex((c) => c.id === selectedCard.id);
    onDeleteCard(selectedCard.id);
    const next = cards[idx + 1] ?? cards[idx - 1];
    if (next) {
      setSelectedId(next.id);
      setQuestion(next.question);
      setAnswer(next.answer);
    } else {
      onOpenChange(false);
    }
  };

  if (cards.length === 0) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="max-h-[85vh] max-w-4xl gap-0 overflow-hidden p-0 sm:max-w-4xl"
        showCloseButton
      >
        <div className="flex h-[70vh] min-h-[300px]">
          <aside className="border-r bg-muted/30 flex w-56 shrink-0 flex-col overflow-hidden">
            <DialogHeader className="border-b px-4 py-3">
              <DialogTitle className="text-sm">Cards</DialogTitle>
            </DialogHeader>
            <nav className="flex-1 overflow-y-auto p-2" aria-label="Card list">
              {cards.map((card) => (
                <button
                  key={card.id}
                  type="button"
                  onClick={() => handleSelect(card)}
                  className={cn(
                    "text-muted-foreground hover:bg-accent hover:text-accent-foreground w-full rounded-md px-3 py-2 text-left text-sm transition-colors",
                    selectedId === card.id &&
                      "bg-accent text-accent-foreground font-medium"
                  )}
                >
                  {truncate(card.question, 40)}
                </button>
              ))}
            </nav>
          </aside>
          <div className="flex flex-1 flex-col overflow-hidden">
            <DialogHeader className="border-b px-6 py-4">
              <DialogTitle>Edit card</DialogTitle>
            </DialogHeader>
            <div className="flex min-h-0 flex-1 flex-col">
              <div className="flex-1 overflow-y-auto p-6">
                <div className="grid gap-1.5">
                  <Label htmlFor="panel-question">Question</Label>
                  <Input
                    id="panel-question"
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                    placeholder="Question"
                  />
                </div>
                <div className="mt-3 grid gap-1.5">
                  <Label htmlFor="panel-answer">Answer</Label>
                  <Textarea
                    id="panel-answer"
                    value={answer}
                    onChange={(e) => setAnswer(e.target.value)}
                    placeholder="Answer"
                    className="min-h-[120px] resize-none"
                  />
                </div>
              </div>
              <div className="border-t px-6 py-4">
                <div className="flex justify-end gap-2">
                  <Button
                    variant="destructive"
                    onClick={handleDelete}
                    className="gap-2"
                  >
                    <Trash2Icon className="size-4" />
                    Delete
                  </Button>
                  <Button onClick={handleSave}>Save</Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
