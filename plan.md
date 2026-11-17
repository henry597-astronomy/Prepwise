# Prepwise MatricPrep — Implementation Plan

## Product scope

Prepwise MatricPrep is a single Grade 12 matric examination preparation application that treats the local device as the operational source for examination content, attempts, answers, progress, explanations, bookmarks, and history. Internet connectivity enhances the product with account authentication, synchronization, new content packages, AI assistance, video streaming/downloads, and application updates; it must not determine whether a student can study.

The existing `henry597-astronomy/Prepwise` repository was inspected before implementation. It currently contains only a README, so there is no existing React/Vite/Supabase implementation to preserve or replace.

## Implementation approach

1. Establish a React + TypeScript + Vite web foundation with a mobile-first student experience and a resilient application shell.
2. Add Dexie.js and `dexie-react-hooks` as the primary operational data layer. Use stable IDs, schema versions, timestamps, and repository-style access functions so examination features never depend directly on Supabase.
3. Add connectivity and sync state services. Persist every learner action locally first, enqueue cloud mutations, retry safely, and apply a conflict policy that preserves the newest progress rather than overwriting it with older cloud data.
4. Add hybrid profile access: online Supabase Auth when configured, secure local unlock for previously authenticated profiles, and local-only guest profiles. Keep credentials and tokens out of ordinary IndexedDB tables; secure storage and the final Capacitor packaging path will be handled in the Android phase.
5. Build the offline examination flow against local fixture packages first: package library, question runner, immediate scoring, explanations, attempt history, progress, bookmarks, and clear online/offline/sync indicators.
6. Add the versioned examination package model and download/import boundary, so Supabase Storage or another approved content source can be connected without changing the offline examination runtime.
7. Add online-only AI and video boundaries with graceful offline states. AI will use the approved online provider after credentials/service choice is confirmed; video downloads will be isolated from examination data and removable independently.
8. Add the PWA service worker, manifest, cache/update strategy, and later Capacitor configuration. Verify persistence and offline behavior in the installed Android build before preserving or extending the existing GitHub Actions APK workflow.

The first implementation slice is now a usable local-first dashboard and practice flow with representative examination content, Dexie persistence, connectivity state, local response/bookmark persistence, and honest sync/download surfaces. It does not pretend Supabase synchronization, Google OAuth, AI, or video downloads are live until the relevant provider configuration is available.

## Dependencies and integration boundaries

- **GitHub:** already connected. It is suitable for repository inspection and normal source-control operations. The existing Prepwise repository is empty apart from `README.md`.
- **Vercel:** enabled in the session configuration but its management MCP requires a separate authenticated login before deployment inspection or project operations. Vercel is optional for development and can be connected later for deployment.
- **Supabase:** not connected in the current session. It is required before implementing real Supabase Auth, Google OAuth configuration, cloud synchronization, remote examination packages, and production video storage. The initial local-first foundation can be built without it.
- **Google OAuth:** no separate connector is required for the local-first phase. It becomes a Supabase dashboard configuration item once Supabase is connected.
- **Capacitor / Android build:** no account connector is needed for the code phase. Android SDK/build credentials and the current GitHub Actions workflow will be inspected when the Android phase begins.
- **AI:** no separate model-provider account is required if the project uses the managed built-in AI capability. If an external provider is preferred, its key must be added through protected project secrets rather than source code.

## Project structure

```text
src/
  app/                  App shell, routing, global providers, error boundaries
  components/           Reusable UI including status, download, and exam controls
  features/
    dashboard/          Local progress overview and next-study actions
    exams/              Package library, practice runner, scoring, explanations
    profiles/           Online/local profile access and local unlock UX
    sync/               Queue state, conflict policy, manual sync actions
    downloads/          Exam package and video download status/storage surfaces
    ai/                 Online-only assistant boundary and offline fallback
  db/
    schema.ts           Dexie database, versioned tables, migrations
    repositories.ts     Local-first reads/writes for examination operations
    seed.ts              Development fixture package
  services/
    connectivity.ts     Online/offline detection
    sync-engine.ts      Queue processing, retries, stable IDs, conflicts
    packages.ts         Versioned package verification/import boundary
    auth.ts              Supabase/local profile boundary
  styles/               Design tokens, typography, responsive layout
public/
  manus-routes.json      Complete route manifest for Preview
  icons/                 PWA/Android icon assets
plan.md
TODO.md                 Created after plan approval and maintained by outcome
```

## Design direction

The user-provided MatricMaster screenshot is the primary visual reference for the first slice: a dark mobile-first study dashboard with a compact top bar, student greeting, streak card, prominent goal card, quick-access tiles, colorful subject icons, and a five-item bottom navigation. The Ethio Cosmos repository is a read-only pattern reference only. Prepwise may adapt its app-shell ideas—mobile navigation, update/install prompts, offline-save affordances, and Vite/Supabase/Capacitor organization—but no changes will be made to that repository and its content will not become a runtime dependency.

Three candidate styles were considered for the student-facing product:

- **Study Atlas / editorial utility** — 0.07 probability: calm paper-like surfaces, navigation inspired by a marked-up revision guide.
- **Signal & Slate / resilient field tool** — 0.06 probability: dark graphite, warm signal color, and strong status communication for students studying under inconsistent connectivity.
- **Quiet Momentum / optimistic academic minimalism** — 0.05 probability: bright neutral canvas, restrained color blocks, and progress-led interactions.

### Chosen style: Signal & Slate / resilient field tool, tuned to the MatricMaster reference

- **Design movement:** contemporary utility design with editorial study-guide cues; the interface should feel dependable in a low-bandwidth classroom rather than like a generic SaaS dashboard.
- **Core principles:** local-first confidence, visible system state, focused practice, and calm recovery from failure.
- **Color philosophy:** use the screenshot’s deep navy base and electric violet/purple accents for the Prepwise identity, with ember orange retained for local-first/offline signals and a cool mint for confirmed sync. Color communicates state as well as subject identity.
- **Layout paradigm:** use the screenshot’s stacked mobile dashboard: top utility bar, greeting/streak row, goal banner, quick-access tiles, subject shelf, and a persistent five-item bottom navigation. Desktop can widen the same information hierarchy rather than switching to a generic admin dashboard.
- **Signature elements:** a violet-to-indigo goal card, colorful subject glyphs, a small streak badge, an ember signal dot for connection/sync state, and package cards that resemble labeled exam folders.
- **Interaction philosophy:** every action should acknowledge persistence locally first. Buttons and messages should explain what remains available offline and what will happen when connectivity returns.
- **Animation:** restrained 150–220ms transitions for panel changes and status updates; a short ember pulse only when connectivity changes or sync begins; no looping decorative animation in the examination runner.
- **Typography system:** use a highly legible sans-serif for UI and questions with a compact mono or tabular face only for years, scores, and sync timestamps. Headings should be short and editorial; body copy should be comfortable at mobile reading sizes.
- **Brand essence:** dependable matric preparation for students who cannot rely on constant internet; personality: grounded, focused, encouraging.
- **Brand voice:** direct, calm, and practical. Example lines: “Your study data is safe on this device.” and “New packages are ready when you’re online.”
- **Wordmark & logo:** a compact open-folder mark containing a forward ember notch, paired with the Prepwise wordmark; the open folder represents downloadable exam packages and the notch represents forward momentum. The wordmark may use a violet accent on “wise” as a nod to the reference image without copying its brand.
- **Signature brand color:** electric violet, used for identity and progress surfaces; ember orange remains the operational offline signal.

## Required decisions before the next implementation slice

1. The plan is approved; the MatricMaster screenshot is now the visual reference and the local-first phase proceeds with fixture data.
2. Connect Supabase before the cloud-auth/sync phase. Until then, the implementation must keep those boundaries explicit and offline-safe.
3. Keep `henry597-astronomy/Prepwise` as the user-owned source repository. The existing repository is empty, so no merge or preservation work is required.
4. Treat Vercel as optional for now; it is not required for the first implementation slice or Preview.
