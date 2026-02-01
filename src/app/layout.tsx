import "~/styles/globals.css";

import { type Metadata } from "next";
import { Geist } from "next/font/google";

import { Header } from "~/components/header";
import { ThemeProvider } from "~/providers/theme-provider";
import { DeckStoreProvider } from "~/store/deck-store";

export const metadata: Metadata = {
  title: "Flashcards",
  description: "AI-powered flashcard generator",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
});

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={geist.variable} suppressHydrationWarning>
      <body>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <DeckStoreProvider>
            <div className="min-h-screen flex flex-col bg-background">
              <Header />
              <main className="flex-1">{children}</main>
            </div>
          </DeckStoreProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
