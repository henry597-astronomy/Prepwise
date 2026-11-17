# Prepwise MatricMaster

Prepwise is a Grade 12 matric examination preparation app designed for online and offline study. The first foundation slice uses a dark, mobile-first MatricMaster-inspired interface and a local-first Dexie database.

## Current foundation

- React + TypeScript + Vite + PWA support
- Dexie.js local profile, subject, examination, question, attempt, response, bookmark, download, and sync-queue storage
- Offline Mathematics practice fixture with local scoring, explanations, response persistence, and bookmarks
- Exam library, AI-provider boundary, local profile surface, connectivity indicator, and mobile bottom navigation
- Supabase synchronization, authentication, package downloads, video downloads, Android packaging, and AI provider wiring remain planned follow-up work

## Development

```bash
pnpm install
pnpm dev
```

Production validation:

```bash
pnpm lint
pnpm build
```

The read-only Ethio Cosmos project was used only as a UI pattern reference. It is not modified or imported as a dependency.
