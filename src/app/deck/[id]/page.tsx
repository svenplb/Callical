"use client";

import Link from "next/link";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { ArrowLeftIcon } from "lucide-react";

import { useDeckStore } from "~/store/deck-store";
import { FlashcardList } from "~/components/flashcard-list";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";

export default function DeckPage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = params.id as string;
  const { getDeck, updateCard, deleteCard, updateDeck } = useDeckStore();
  const [savedFeedback, setSavedFeedback] = useState(false);
  const [saveDialogOpen, setSaveDialogOpen] = useState(false);
  const [deckNameInDialog, setDeckNameInDialog] = useState("");

  const deck = getDeck(id);
  const fromGenerate = searchParams.get("fromGenerate") === "1";

  const handleSaveClick = () => {
    setDeckNameInDialog(deck?.title ?? "New deck");
    setSaveDialogOpen(true);
  };

  const handleSaveConfirm = () => {
    if (deck && fromGenerate) {
      const title = (deckNameInDialog.trim() || "New deck").trim() || "New deck";
      updateDeck(deck.id, { title });
    }
    setSaveDialogOpen(false);
    setSavedFeedback(true);
    setTimeout(() => setSavedFeedback(false), 1500);
    const next = new URLSearchParams(searchParams.toString());
    next.delete("fromGenerate");
    const q = next.toString();
    router.replace(q ? `/deck/${id}?${q}` : `/deck/${id}`);
  };

  if (!deck) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-8">
        <p className="text-muted-foreground">Deck not found.</p>
        <Button variant="link" asChild className="mt-2 text-muted-foreground hover:text-foreground">
          <Link href="/" className="inline-flex items-center gap-2">
            <ArrowLeftIcon className="size-4 shrink-0" />
            Back to decks
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <Button variant="link" size="sm" asChild className="text-muted-foreground hover:text-foreground">
            <Link href="/" className="inline-flex items-center gap-2">
              <ArrowLeftIcon className="size-4 shrink-0" />
              Decks
            </Link>
          </Button>
          {!fromGenerate && (
            <>
              <h1 className="mt-2 text-2xl font-semibold">{deck.title}</h1>
              <p className="text-muted-foreground text-sm">
                {deck.cards.length} card{deck.cards.length !== 1 ? "s" : ""}
              </p>
            </>
          )}
        </div>
        <div className="flex gap-2">
          {fromGenerate && (
            <Button
              size="sm"
              onClick={handleSaveClick}
              className={
                savedFeedback
                  ? "bg-cyan-primary text-white hover:bg-cyan-primary/90 text-green-600 dark:text-green-400"
                  : "bg-cyan-primary text-white hover:bg-cyan-primary/90"
              }
            >
              {savedFeedback ? "Saved!" : "Save"}
            </Button>
          )}
          {!fromGenerate && (
            <Button asChild size="sm" className="bg-cyan-primary text-white hover:bg-cyan-primary/90">
              <Link href={`/deck/${deck.id}/review`}>Review</Link>
            </Button>
          )}
        </div>
      </div>

      <section>
        <h2 className="mb-4 text-lg font-medium">Cards</h2>
        <FlashcardList
          deckId={deck.id}
          cards={deck.cards}
          onUpdateCard={(cardId, q, a) => updateCard(deck.id, cardId, q, a)}
          onDeleteCard={(cardId) => deleteCard(deck.id, cardId)}
        />
      </section>

      <Dialog open={saveDialogOpen} onOpenChange={setSaveDialogOpen}>
        <DialogContent showCloseButton={true}>
          <DialogHeader>
            <DialogTitle>Name your deck</DialogTitle>
          </DialogHeader>
          <div className="space-y-2 py-2">
            <Label htmlFor="deck-name-dialog">Deck name</Label>
            <Input
              id="deck-name-dialog"
              value={deckNameInDialog}
              onChange={(e) => setDeckNameInDialog(e.target.value)}
              placeholder="Enter deck name"
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSaveConfirm();
              }}
            />
          </div>
          <DialogFooter showCloseButton={false}>
            <Button
              onClick={handleSaveConfirm}
              className="bg-cyan-primary text-white hover:bg-cyan-primary/90"
            >
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
