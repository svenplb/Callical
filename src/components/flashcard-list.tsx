"use client";

import { useState } from "react";

import type { Flashcard } from "~/lib/types";
import { CardEditorPanel } from "~/components/card-editor-panel";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";

interface FlashcardListProps {
  deckId: string;
  cards: Flashcard[];
  onUpdateCard: (cardId: string, question: string, answer: string) => void;
  onDeleteCard: (cardId: string) => void;
}

export function FlashcardList({
  cards,
  onUpdateCard,
  onDeleteCard,
}: FlashcardListProps) {
  const [panelOpen, setPanelOpen] = useState(false);
  const [selectedCardId, setSelectedCardId] = useState<string | null>(null);

  const openEditor = (card: Flashcard, e?: React.MouseEvent) => {
    e?.stopPropagation();
    setSelectedCardId(card.id);
    setPanelOpen(true);
  };

  if (cards.length === 0) {
    return (
      <p className="text-muted-foreground text-sm">
        No cards in this deck. Use &quot;Generate Cards&quot; to add some.
      </p>
    );
  }

  return (
    <>
      <Table className="table-fixed">
        <TableHeader>
          <TableRow>
            <TableHead className="w-1/2">Question</TableHead>
            <TableHead className="w-1/2">Answer</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {cards.map((card) => (
            <TableRow
              key={card.id}
              className="cursor-pointer"
              onClick={() => openEditor(card)}
            >
              <TableCell className="align-top font-medium min-w-0 overflow-hidden">
                <span className="block truncate" title={card.question || undefined}>
                  {card.question || "—"}
                </span>
              </TableCell>
              <TableCell className="text-muted-foreground align-top min-w-0 overflow-hidden">
                <span className="block truncate" title={card.answer || undefined}>
                  {card.answer || "—"}
                </span>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <CardEditorPanel
        open={panelOpen}
        onOpenChange={setPanelOpen}
        cards={cards}
        initialCardId={selectedCardId}
        onUpdateCard={onUpdateCard}
        onDeleteCard={onDeleteCard}
      />
    </>
  );
}
