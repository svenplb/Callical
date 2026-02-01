# Callical

A simple, open-source flashcard app. Paste text or upload files (text and images), generate flashcards with the OpenAI API, edit them, and review with keyboard shortcuts.

## Features

- **Generate decks** from text or uploaded files (text + images) using GPT
- **Edit cards** in a deck before saving
- **Review mode** — flip with click or **Space**, navigate with arrow buttons
- **Dark/light theme** toggle
- Data stored in your browser (localStorage); no account required

## Prerequisites

- [Node.js](https://nodejs.org/) 18+ (or [Bun](https://bun.sh/))
- An [OpenAI API key](https://platform.openai.com/api-keys) for flashcard generation

## Quick start

1. **Clone and install**

   ```bash
   git clone https://github.com/YOUR_USERNAME/callical.git
   cd callical
   npm install
   # or: bun install
   ```

2. **Configure environment**

   Copy the example env file and add your OpenAI API key:

   ```bash
   cp .env.example .env
   ```

   Edit `.env` and set:

   ```env
   OPENAI_API_KEY="sk-your-openai-api-key-here"
   ```

   Get an API key at [OpenAI API keys](https://platform.openai.com/api-keys).  
   `DATABASE_URL` is required by the app (used by the stack); the default `file:./db.sqlite` is fine for local use.

3. **Run the app**

   ```bash
   npm run dev
   # or: bun run dev
   ```

   Open [http://localhost:3000](http://localhost:3000). Create or generate a deck and start reviewing.

## Scripts

| Command        | Description              |
|----------------|--------------------------|
| `npm run dev`  | Start dev server         |
| `npm run build`| Build for production     |
| `npm run start`| Start production server  |
| `npm run lint` | Run ESLint               |

## Tech stack

- [Next.js](https://nextjs.org/) (App Router)
- [React](https://react.dev/)
- [Tailwind CSS](https://tailwindcss.com/) + [shadcn/ui](https://ui.shadcn.com/)-style components
- [OpenAI API](https://platform.openai.com/) for flashcard generation
- [Drizzle](https://orm.drizzle.team/) (env requires `DATABASE_URL`; decks are stored in localStorage)

## License

MIT — see [LICENSE](LICENSE).
