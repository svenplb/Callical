"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { ArrowLeftIcon, ChevronLeftIcon, ChevronRightIcon } from "lucide-react";

import { useDeckStore } from "~/store/deck-store";
import { Button } from "~/components/ui/button";

export default function ReviewPage() {
  const params = useParams();
  const id = params.id as string;
  const { getDeck } = useDeckStore();
  const deck = getDeck(id);
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);

  if (!deck) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-8">
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

  const cards = deck.cards;
  const hasCards = cards.length > 0;
  const current = hasCards ? cards[index] : null;

  const goNext = () => {
    setFlipped(false);
    setIndex((i) => (i + 1) % cards.length);
  };

  const goPrev = () => {
    setFlipped(false);
    setIndex((i) => (i - 1 + cards.length) % cards.length);
  };

  // Flip card with Space (and Enter) from anywhere on the page
  useEffect(() => {
    if (!hasCards) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === " " || e.key === "Enter") {
        const target = e.target as HTMLElement;
        if (target.closest("a") || target.closest("button") || target.closest("input") || target.closest("textarea")) return;
        e.preventDefault();
        setFlipped((f) => !f);
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [hasCards]);

  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      {/* Top bar: above fixed overlay so Back to deck is clickable */}
      <div className="relative z-10 flex items-center justify-between">
        <Button variant="link" size="sm" asChild className="text-muted-foreground hover:text-foreground">
          <Link href={`/deck/${id}`} className="inline-flex items-center gap-2">
            <ArrowLeftIcon className="size-4 shrink-0" />
            Back to deck
          </Link>
        </Button>
        {hasCards ? (
          <span className="text-muted-foreground text-sm">
            {index + 1} / {cards.length}
          </span>
        ) : (
          <span />
        )}
      </div>

      {!hasCards ? (
        <div className="mt-8">
          <p className="text-muted-foreground text-sm">
            No cards to review. Add cards to this deck first.
          </p>
        </div>
      ) : (
        <>
          {/* Text + arrows: fixed overlay, centered in full viewport */}
          <div className="fixed inset-0 z-0 flex flex-col items-center justify-center gap-8 px-4">
            <div
              className="w-full max-w-xl cursor-pointer text-center"
              onClick={() => setFlipped((f) => !f)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  setFlipped((f) => !f);
                }
              }}
            >
              <p className="text-2xl font-medium leading-relaxed md:text-3xl">
                {flipped ? current?.answer : current?.question}
              </p>
            </div>
            <div className="flex w-full max-w-sm items-center justify-between">
              <Button
                variant="ghost"
                size="icon-sm"
                onClick={goPrev}
                aria-label="Previous card"
                className="text-muted-foreground hover:text-foreground"
              >
                <ChevronLeftIcon className="size-4" />
              </Button>
              <span className="text-muted-foreground text-sm">
                {flipped ? "Answer" : "Question"}
              </span>
              <Button
                variant="ghost"
                size="icon-sm"
                onClick={goNext}
                aria-label="Next card"
                className="text-muted-foreground hover:text-foreground"
              >
                <ChevronRightIcon className="size-4" />
              </Button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
