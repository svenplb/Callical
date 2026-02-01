export interface Flashcard {
  id: string;
  question: string;
  answer: string;
}

export interface Deck {
  id: string;
  title: string;
  cards: Flashcard[];
  createdAt: string;
  updatedAt: string;
}
