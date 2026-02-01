import Link from "next/link";

import { DeckList } from "~/components/deck-list";
import { Button } from "~/components/ui/button";

export default function HomePage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-semibold">Decks</h1>
        <Button size="lg" asChild className="bg-cyan-primary text-white hover:bg-cyan-primary/90">
          <Link href="/generate">Generate New Deck</Link>
        </Button>
      </div>
      <DeckList />
    </div>
  );
}
