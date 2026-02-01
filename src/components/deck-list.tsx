"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { PencilIcon, Trash2Icon } from "lucide-react";

import type { Deck } from "~/lib/types";
import { useDeckStore } from "~/store/deck-store";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "~/components/ui/alert-dialog";
import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";

function formatDate(iso: string) {
  try {
    const d = new Date(iso);
    return d.toLocaleDateString(undefined, {
      dateStyle: "short",
    });
  } catch {
    return "—";
  }
}

export function DeckList() {
  const router = useRouter();
  const { decks, updateDeck, deleteDeck } = useDeckStore();
  const [editDeck, setEditDeck] = useState<Deck | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [deleteDeckId, setDeleteDeckId] = useState<string | null>(null);

  const openEdit = (deck: Deck) => {
    setEditDeck(deck);
    setEditTitle(deck.title);
  };

  const saveEdit = () => {
    if (editDeck && editTitle.trim()) {
      updateDeck(editDeck.id, { title: editTitle.trim() });
      setEditDeck(null);
    }
  };

  const confirmDelete = (id: string) => {
    deleteDeck(id);
    setDeleteDeckId(null);
  };

  if (decks.length === 0) {
    return (
      <p className="text-muted-foreground text-sm">
        No decks yet. Create one to get started.
      </p>
    );
  }

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Deck</TableHead>
            <TableHead className="text-right w-24">Cards</TableHead>
            <TableHead className="text-right w-32">Last updated</TableHead>
            <TableHead className="w-24 text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {decks.map((deck: Deck) => (
            <TableRow
              key={deck.id}
              role="button"
              tabIndex={0}
              className="cursor-pointer"
              onClick={() => router.push(`/deck/${deck.id}`)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  router.push(`/deck/${deck.id}`);
                }
              }}
            >
              <TableCell className="font-medium">{deck.title}</TableCell>
              <TableCell className="text-right text-muted-foreground">
                {deck.cards.length}
              </TableCell>
              <TableCell className="text-right text-muted-foreground">
                {formatDate(deck.updatedAt)}
              </TableCell>
              <TableCell className="text-right" onClick={(e) => e.stopPropagation()}>
                <div className="flex justify-end gap-1">
                  <Button
                    variant="ghost"
                    size="icon-xs"
                    aria-label="Edit deck"
                    onClick={() => openEdit(deck)}
                  >
                    <PencilIcon className="size-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon-xs"
                    aria-label="Delete deck"
                    onClick={() => setDeleteDeckId(deck.id)}
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2Icon className="size-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Dialog open={!!editDeck} onOpenChange={(open) => !open && setEditDeck(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit deck</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="deck-title-edit">Deck name</Label>
              <Input
                id="deck-title-edit"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                placeholder="Deck name"
                onKeyDown={(e) => e.key === "Enter" && saveEdit()}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditDeck(null)}>
              Cancel
            </Button>
            <Button onClick={saveEdit} disabled={!editTitle.trim()}>
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!deleteDeckId} onOpenChange={(open) => !open && setDeleteDeckId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete deck?</AlertDialogTitle>
            <AlertDialogDescription>
              This cannot be undone. All cards in the deck will be removed.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteDeckId && confirmDelete(deleteDeckId)}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
