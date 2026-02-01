"use client";

import { useState } from "react";

import type { Flashcard } from "~/lib/types";
import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Textarea } from "~/components/ui/textarea";

interface FlashcardEditorProps {
  card: Flashcard;
  onSave: (question: string, answer: string) => void;
  onDelete: () => void;
  trigger?: React.ReactNode;
}

export function FlashcardEditor({
  card,
  onSave,
  onDelete,
  trigger,
}: FlashcardEditorProps) {
  const [open, setOpen] = useState(false);
  const [question, setQuestion] = useState(card.question);
  const [answer, setAnswer] = useState(card.answer);

  const handleOpenChange = (next: boolean) => {
    if (!next) {
      setQuestion(card.question);
      setAnswer(card.answer);
    }
    setOpen(next);
  };

  const handleSave = () => {
    onSave(question, answer);
    setOpen(false);
  };

  const handleDelete = () => {
    onDelete();
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        {trigger ?? (
          <Button variant="outline" size="sm">
            Edit
          </Button>
        )}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit card</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="edit-question">Question</Label>
            <Input
              id="edit-question"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="Question"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="edit-answer">Answer</Label>
            <Textarea
              id="edit-answer"
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              placeholder="Answer"
              rows={3}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="destructive" onClick={handleDelete}>
            Delete
          </Button>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave}>Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
