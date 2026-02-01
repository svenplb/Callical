"use client";

import Link from "next/link";

import { ThemeToggle } from "~/components/theme-toggle";

export function Header() {
  return (
    <header className="relative z-10 border-b bg-background">
      <div className="mx-auto flex h-14 max-w-4xl items-center justify-between px-4">
        <Link href="/" className="text-sm font-medium">
          Flashcards
        </Link>
        <ThemeToggle />
      </div>
    </header>
  );
}
