# Callical

![Callical screenshot](https://github.com/user-attachments/assets/cb378fb1-4954-4391-b503-43f567b2a952)

A simple, open-source flashcard generator. Paste text or images, generate flashcards using the OpenAI API and review them.

## Prerequisites

- [Node.js](https://nodejs.org/) 18+ (or [Bun](https://bun.sh/))
- [OpenAI API key](https://platform.openai.com/api-keys) for flashcard generation

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

   Open [http://localhost:3000](http://localhost:3000).

## Tech stack

- [Next.js](https://nextjs.org/) (App Router)
- [React](https://react.dev/)
- [Tailwind CSS](https://tailwindcss.com/) + [shadcn/ui](https://ui.shadcn.com/)-style components
- [OpenAI API](https://platform.openai.com/) for flashcard generation
- [Drizzle](https://orm.drizzle.team/) (env requires `DATABASE_URL`; decks are stored in localStorage)

## License

MIT - see [LICENSE](LICENSE).
