"use client";

import { createContext, useContext, useMemo, useSyncExternalStore } from "react";
import type { Deck, Flashcard } from "~/lib/types";

const STORAGE_KEY = "callical-decks";

function loadDecks(): Deck[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as Deck[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function saveDecks(decks: Deck[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(decks));
}

function generateId() {
  return crypto.randomUUID();
}

type DeckStore = {
  decks: Deck[];
  getDeck: (id: string) => Deck | undefined;
  createDeck: (title: string) => Deck;
  updateDeck: (id: string, updates: Partial<Pick<Deck, "title" | "cards">>) => void;
  deleteDeck: (id: string) => void;
  addCards: (deckId: string, cards: Omit<Flashcard, "id">[]) => void;
  updateCard: (deckId: string, cardId: string, q: string, a: string) => void;
  deleteCard: (deckId: string, cardId: string) => void;
};

const DeckStoreContext = createContext<DeckStore | null>(null);

let decksSnapshot = loadDecks();
const listeners = new Set<() => void>();

function subscribe(cb: () => void) {
  listeners.add(cb);
  return () => listeners.delete(cb);
}

function getSnapshot() {
  return decksSnapshot;
}

function mutate(updater: (decks: Deck[]) => Deck[]) {
  decksSnapshot = updater(decksSnapshot);
  saveDecks(decksSnapshot);
  listeners.forEach((l) => l());
}

const deckStoreMethods: Omit<DeckStore, "decks" | "getDeck"> = {
  createDeck(title: string) {
    const deck: Deck = {
      id: generateId(),
      title: title.trim() || "Untitled Deck",
      cards: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    mutate((decks) => [...decks, deck]);
    return deck;
  },

  updateDeck(id: string, updates: Partial<Pick<Deck, "title" | "cards">>) {
    mutate((decks) =>
      decks.map((d) =>
        d.id === id
          ? { ...d, ...updates, updatedAt: new Date().toISOString() }
          : d
      )
    );
  },

  deleteDeck(id: string) {
    mutate((decks) => decks.filter((d) => d.id !== id));
  },

  addCards(deckId: string, cards: Omit<Flashcard, "id">[]) {
    const newCards: Flashcard[] = cards.map((c) => ({
      id: generateId(),
      question: c.question,
      answer: c.answer,
    }));
    mutate((decks) =>
      decks.map((d) =>
        d.id === deckId
          ? {
              ...d,
              cards: [...d.cards, ...newCards],
              updatedAt: new Date().toISOString(),
            }
          : d
      )
    );
  },

  updateCard(deckId: string, cardId: string, question: string, answer: string) {
    mutate((decks) =>
      decks.map((d) =>
        d.id === deckId
          ? {
              ...d,
              cards: d.cards.map((c) =>
                c.id === cardId ? { ...c, question, answer } : c
              ),
              updatedAt: new Date().toISOString(),
            }
          : d
      )
    );
  },

  deleteCard(deckId: string, cardId: string) {
    mutate((decks) =>
      decks.map((d) =>
        d.id === deckId
          ? {
              ...d,
              cards: d.cards.filter((c) => c.id !== cardId),
              updatedAt: new Date().toISOString(),
            }
          : d
      )
    );
  },
};

export function DeckStoreProvider({ children }: { children: React.ReactNode }) {
  const decks = useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
  const store = useMemo<DeckStore>(
    () => ({
      decks,
      getDeck: (id: string) => decks.find((d) => d.id === id),
      ...deckStoreMethods,
    }),
    [decks]
  );
  return (
    <DeckStoreContext.Provider value={store}>
      {children}
    </DeckStoreContext.Provider>
  );
}

export function useDeckStore() {
  const ctx = useContext(DeckStoreContext);
  if (!ctx) throw new Error("useDeckStore must be used within DeckStoreProvider");
  return ctx;
}
