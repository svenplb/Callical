"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { ArrowLeftIcon, XIcon } from "lucide-react";

import { useDeckStore } from "~/store/deck-store";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Label } from "~/components/ui/label";
import { Textarea } from "~/components/ui/textarea";

const TEXT_ACCEPT = ".txt,.md,.json,text/plain";
const IMAGE_ACCEPT =
  "image/png,image/jpeg,image/webp,image/gif,.png,.jpg,.jpeg,.webp,.gif";

export default function GeneratePage() {
  const router = useRouter();
  const { createDeck, addCards } = useDeckStore();
  const [text, setText] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const hasInput = text.trim().length > 0 || files.length > 0;

  const handleGenerate = async () => {
    if (!hasInput) return;
    setError(null);
    setLoading(true);
    try {
      const formData = new FormData();
      if (text.trim()) formData.set("text", text.trim());
      for (const file of files) {
        formData.append("files", file);
      }
      const res = await fetch("/api/generate-flashcards", {
        method: "POST",
        body: formData,
      });
      type ApiRes =
        | { cards: { question: string; answer: string }[] }
        | { error: string };
      const data = (await res.json().catch(() => ({}))) as ApiRes;
      if (!res.ok) {
        setError("error" in data ? data.error : "Generation failed");
        return;
      }
      const generated = "cards" in data ? data.cards : [];
      const toSave = generated
        .filter((c) => (c.question?.trim() ?? "") || (c.answer?.trim() ?? ""))
        .map((c) => ({
          question: (c.question ?? "").trim(),
          answer: (c.answer ?? "").trim(),
        }));
      if (toSave.length > 0) {
        const deck = createDeck("New deck");
        addCards(deck.id, toSave);
        router.push(`/deck/${deck.id}?fromGenerate=1`);
        return;
      }
      setError("No flashcards were generated.");
    } finally {
      setLoading(false);
    }
  };

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const list = e.target.files ? Array.from(e.target.files) : [];
    setFiles((prev) => [...prev, ...list]);
    e.target.value = "";
  };

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <Button variant="link" size="sm" asChild className="mb-4 text-muted-foreground hover:text-foreground">
        <Link href="/" className="inline-flex items-center gap-2">
          <ArrowLeftIcon className="size-4 shrink-0" />
          Decks
        </Link>
      </Button>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Generate new deck</CardTitle>
          <CardDescription>
            Paste text or upload text files and images. We&apos;ll generate
            flashcards with the ChatGPT API.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label>Upload files</Label>
            <div className="flex flex-wrap gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
                disabled={loading}
              >
                Add text or image
              </Button>
              <input
                ref={fileInputRef}
                type="file"
                accept={`${TEXT_ACCEPT},${IMAGE_ACCEPT}`}
                multiple
                className="hidden"
                onChange={onFileChange}
              />
            </div>
            {files.length > 0 && (
              <ul className="text-muted-foreground flex flex-wrap gap-2 text-sm">
                {files.map((f, i) => (
                  <li key={`${f.name}-${i}`} className="flex items-center gap-1">
                    <span>{f.name}</span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon-xs"
                      aria-label="Remove file"
                      onClick={() => removeFile(i)}
                    >
                      <XIcon className="size-3" />
                    </Button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="generate-text">Text</Label>
            <Textarea
              id="generate-text"
              placeholder="Paste or type content..."
              value={text}
              onChange={(e) => setText(e.target.value)}
              rows={5}
              className="resize-none"
              disabled={loading}
            />
          </div>
          {error && (
            <p className="text-destructive text-sm">{error}</p>
          )}
          <Button
            onClick={handleGenerate}
            disabled={loading || !hasInput}
            className="bg-cyan-primary text-white hover:bg-cyan-primary/90"
          >
            Generate flashcards
          </Button>
        </CardContent>
      </Card>

      {loading && (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center gap-4 bg-background/95 backdrop-blur-sm">
          <div className="size-10 animate-spin rounded-full border-2 border-border border-t-foreground" />
          <p className="text-muted-foreground text-sm">
            Generating flashcards from your content…
          </p>
        </div>
      )}
    </div>
  );
}
