# Prepwise MatricPrep — Delivery TODO

## 1. Local-first student shell and dashboard — Complete for first slice

- The application is one hybrid Grade 12 matric examination preparation application for online and offline users; it must not require separate applications.
- The student-facing experience uses a dark mobile-first dashboard inspired by the provided MatricMaster screenshot: compact top bar, greeting, streak, goal progress, quick access, colorful subjects, and persistent bottom navigation.
- The shell displays a clear online/offline indicator.
- The shell displays synchronization status as one of: Synced, Pending synchronization, or Synchronization failed.
- Offline students must not be presented with an experience that makes the whole application feel broken simply because there is no internet.
- Evidence: the React/Vite app renders the mobile MatricMaster-inspired dashboard, `/manus-routes.json` returns all five routes, Preview renders the dashboard and practice screens, and `pnpm lint && pnpm build` pass.

## 2. Dexie local operational database — In progress

- Dexie.js is the primary operational database and `dexie-react-hooks` is used for reactive local reads.
- Store student profiles, subjects, exams, questions, options, answers, explanations, attempts, responses, progress, bookmarks, and downloaded-content metadata.
- All examination operations must work using local data without requiring Supabase.
- Use stable unique IDs and safe schema migrations.
- Save every examination response locally immediately.
- Never store plaintext passwords or authentication tokens in ordinary local database tables.
- Evidence: Dexie seeds local profiles, subjects, exams, questions, attempts, responses, bookmarks, sync queue, and download metadata; answer selection and bookmark actions write locally. Repository abstraction and migration coverage remain open.

## 3. Offline examination experience — In progress

- Students can access all downloaded examinations offline.
- Practice tests work offline.
- Scoring works offline.
- Explanations work offline.
- Progress is saved offline.
- Bookmarks and examination history remain available offline.
- Local examination data is always the primary operational source for examination features.
- Evidence: the local Mathematics fixture practice runner scores answers, shows explanations, persists responses, and has a working bookmark toggle. Full examination history and all downloaded package types remain open.

## 4. Hybrid authentication and profiles — Open

- Supabase Auth remains the online account creation and login mechanism.
- Google OAuth can be supported when internet is available.
- Previously authenticated users can unlock local profiles securely while offline, such as with a locally configured PIN.
- Local student registration can occur without internet.
- Guest/local-only profiles can be created without internet.
- A local-only profile can optionally be linked to a Supabase account later.
- Sensitive authentication information is kept out of ordinary local database tables and uses secure storage in the Android packaging phase.

## 5. Bidirectional cloud synchronization — Open; blocked until Supabase is connected

- Implement bidirectional synchronization between Dexie.js and Supabase.
- Maintain a synchronization queue and detect pending changes.
- Synchronize when connectivity returns.
- Retry failed operations.
- Avoid duplicate records using stable unique IDs.
- Implement conflict resolution.
- Never overwrite newer student progress with older cloud data.
- Display synchronization status.
- Support manual synchronization.
- Local data remains usable even when synchronization fails.

## 6. Versioned examination packages — Open

- When connected, check for new subjects, examination years, and questions.
- Show available updates.
- Allow students to download new examination packages.
- Verify downloaded packages.
- Import packages into the local database.
- Keep previously downloaded packages available offline.
- Do not delete downloaded examination content unless the student explicitly chooses to remove it.
- Display download status for examination packages.

## 7. Video tutorials and resources — Open

- Support online video streaming.
- Support optional video downloads.
- Support offline playback of downloaded videos.
- Display download progress indicators.
- Provide storage management.
- Remove downloaded videos without affecting examination data.

## 8. AI assistant — Open; online-only boundary until provider is configured

- The AI assistant works when online.
- AI may be unavailable offline, and the interface must explain that clearly without blocking offline study.

## 9. Safe application updates and PWA — Open

- Check for new application versions when online.
- Database migrations are safe.
- Student progress is preserved.
- Cached application files update correctly.
- Offline functionality continues working after an update.
- Add Vite PWA support and an application-owned manifest/service-worker strategy.

## 10. Android packaging and release workflow — Open

- Package the application with Capacitor.
- Ensure local database persistence and offline operation work in the installed APK.
- Use secure storage for sensitive authentication information.
- Preserve the current GitHub Actions workflow wherever possible.
- Generate the APK and conduct online/offline testing before marking this outcome complete.

## 11. Source and deployment boundaries — Open

- Keep `henry597-astronomy/Prepwise` as the user-owned source repository.
- Do not modify, push to, or depend on `henry597-astronomy/Ethio-cosmos-learning-community-5`; it is a read-only pattern reference only.
- GitHub is already connected.
- Supabase must be connected before real online authentication, Google OAuth, synchronization, remote content packages, and production video storage are implemented.
- Vercel is optional and is not required for the first implementation slice or Preview.
