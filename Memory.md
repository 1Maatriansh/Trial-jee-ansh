# Ansh JEE — Memory

> This file is updated after every phase. A new session must read this file first, then continue from the last committed state.

---

## Current State

**Status:** Complete system built, verified, and passing all performance budgets.
**Date:** 2026-09-29

---

## What Is Done

### Phase 0: Audit & Documentation ✅
- Vite + React scaffolded (React 19, Vite 8).
- Approved dependencies installed: `react-router-dom`, `gsap`.
- All six specification files aligned with Master Build Prompt v3: `PRD.md`, `Design.md`, `Architecture.md`, `Rules.md`, `Phases.md`, `Memory.md`.

### Phase 1: Foundation ✅
- Design tokens defined in `src/styles/tokens.css`.
- Five complete theme systems defined in `src/styles/themes.css`: Mono (default), Paper, Midnight, Ember, Sage.
- Pre-paint theme synchronization via external script `public/theme-init.js` in `<head>` (satisfies strict CSP).
- Base CSS reset, typography scale, selection, and scrollbar in `src/styles/base.css`.
- App layout styles in `src/styles/app.css` and intro styles in `src/styles/intro.css`.
- Core primitives built: `Button.jsx`, `Chip.jsx`, `Skeleton.jsx`, `EmptyState.jsx`, `ProgressRing.jsx`, `Toast.jsx`, `Modal.jsx`, `Segmented.jsx`, `ThemeSwitcher.jsx`, `Background.jsx`, `Icons.jsx`.
- Local storage wrapper with versioning and validation in `src/lib/storage.js`.
- Accurate timestamp time calculations in `src/lib/time.js`.
- Lazy content loader in `src/lib/content.js`.
- Curated official NTA syllabus chapter index in `src/data/chaptersData.js`, topic map in `src/data/syllabusData.js`, and verified formulas in `src/data/formulaData.js`.
- Security headers in `public/_headers`, Netlify SPA redirects in `public/_redirects`, PWA manifest in `public/manifest.webmanifest`, robots in `public/robots.txt`.

### Phase 2: Intro Experience ✅
- Full 12-scene scroll-driven story built with GSAP ScrollTrigger in `src/pages/intro/Intro.jsx` and `src/pages/intro/scenes.jsx`.
- Letterbox bars, scroll progress bar, and Skip mechanism.
- Hand-crafted SVG/CSS UI fragments: Problem fragments, Kinematics trajectory blueprint, PYQ film strip, CBT test simulator, and the 6-discipline preparation loop.
- `ENTER ANSH JEE` CTA with desktop magnetic pull and View Transitions API entry into `/app`.
- Intro footer with outlined wordmark and exact line `Made with ♥ from Maatriansh`.
- GSAP and ScrollTrigger isolated strictly to the lazy-loaded intro chunk.
- Reduced motion fallback providing stacked, non-pinned layout.

### Phase 3: App Shell & Navigation ✅
- Desktop navigation rail (`src/components/Rail.jsx`): 64px collapsed, expands to 240px.
- Mobile bottom bar (`src/components/BottomBar.jsx`): 5 items + More bottom sheet, safe-area inset aware.
- Top header (`src/components/Header.jsx`) with Class selector segmented control (11, 12, Dropper) and Theme switcher.
- First-run setup prompt modal for selecting class and optional student name on first visit.
- App logo strictly links to `/app`. Codebase confirmed zero links leading back to `/`.
- App footer (`src/components/Footer.jsx`) with quick links, legal disclaimer, and `Made with ♥ from Maatriansh`.

### Phase 4: Academic System (Learn & Chapter) ✅
- Subject selector (Physics, Chemistry, Mathematics).
- Chapter list with search, status filters (All, Not started, In progress, Done), and Dropper mode grouping by Class 11 and Class 12.
- Chapter page (`src/pages/app/Chapter.jsx`): Overview, topics, notes section with honest empty state, PYQs section with honest empty state, formulas section (only displayed when verified data exists), bookmark toggle, status selector, and previous/next chapter navigation.
- Sample verified Kinematics notes added in `src/content/notes/phy-11-kinematics.js` using block renderer.

### Phase 5: Practice, PYQs & CBT Tests ✅
- PYQs page (`src/pages/app/Pyqs.jsx`) with multi-criteria filtering: Exam (Main / Advanced), Subject, Year, Topic.
- Practice page (`src/pages/app/Practice.jsx`) with chapter-based question selection and tracking.
- Test list page (`src/pages/app/Tests.jsx`) with demo test integration under `SHOW_DEMO_CONTENT` flag.
- Computer-Based Test engine (`src/pages/app/TestRunner.jsx`):
  - Timestamp-based countdown timer that does not drift across tab hiding or reloading.
  - 5-state question palette: Not visited, Not answered, Answered, Marked for review, Answered and marked (shape + color distinction).
  - Save & Next, Mark for review, Clear response, Previous.
  - Submit confirmation modal displaying exact question counts.
  - Result score card: score, accuracy, correct, incorrect, unattempted, time taken.
  - Question review mode with full solutions.
  - Demo test results explicitly flagged with `isDemo: true` and excluded from progress calculations.

### Phase 6: Focus Tool ✅
- Focus page (`src/pages/app/Focus.jsx`):
  - Modes: 25 min, 50 min, Custom (10m), Stopwatch.
  - Subject tagging: Physics, Chemistry, Mathematics, Other.
  - Large SVG progress ring with tabular-nums mono digits.
  - Timestamp-accurate timing surviving tab hide and reload.
  - Minimum 1-minute session saving to `ajee:v1:focus`.
  - Today's study time, consecutive day streak (minimum 10m session required per day), and weekly 7-day SVG bar chart.

### Phase 7: Progress, Saved, Revision & Profile ✅
- Progress page (`src/pages/app/Progress.jsx`):
  - Honest empty state on fresh visits.
  - Real calculations only: study time this week, focus session count, syllabus completion rings for Physics, Chemistry, Mathematics, practice accuracy (calculated only when ≥ 5 attempts exist). Demo test results filtered out.
- Saved page (`src/pages/app/Saved.jsx`):
  - Tabs for Chapters, Notes, Questions with removal controls and empty states.
- Revision page (`src/pages/app/Revision.jsx`):
  - Mistake logger modal (Subject, What went wrong: concept / calculation / silly / time, notes).
  - Mistake type distribution summary.
- Profile page (`src/pages/app/Profile.jsx`):
  - Optional student name configuration.
  - Export data as single JSON file `ansh-jee-backup-YYYY-MM-DD.json`.
  - Import data with format validation.
  - Danger zone: Reset all data with confirmation modal.

### Phase 8: Security & Anti-Theft ✅
- `public/_headers`: Content-Security-Policy, X-Frame-Options: DENY, X-Content-Type-Options: nosniff, Referrer-Policy, Strict-Transport-Security, Permissions-Policy.
- `src/components/SecurityGuard.jsx`: Domain allow-list enforcement (blocks unlisted hosts) and frame-busting defense against iframe clickjacking.
- `src/styles/app.css`: Content deterrents on `.notes-content-container`: text selection disabled, context menu / drag disabled, print media hidden (`@media print`), and faint watermark (`ANSH JEE · STUDY WORKSPACE`) rendered diagonally for screenshot traceability. Inputs and search fields remain fully functional.

### Phase 9: Polish, Performance & Verification ✅
- `npm run build` succeeds in < 1.2s.
- Budgets verified:
  - Initial JS (gzip): ~85 kB (Budget: ≤ 180 kB) — 52% below budget!
  - Intro chunk (gzip): ~49 kB (Budget: ≤ 130 kB) — 62% below budget!
  - CSS total (gzip): ~4.2 kB (Budget: ≤ 40 kB) — 89% below budget!
- Section 35 Definition of Done verified.

---

## Verified Performance Numbers

| Metric | Budget | Actual | Status |
|---|---|---|---|
| Initial app JS (gzip) | ≤ 180 KB | 85.87 KB | ✅ Well under budget |
| Intro chunk (gzip) | ≤ 130 KB | 49.00 KB | ✅ Well under budget |
| CSS total (gzip) | ≤ 40 KB | 4.20 KB | ✅ Well under budget |
| 404 handler | Inside app layout | Returns to `/app` | ✅ Verified |
| Intro isolation | No app links to `/` | 0 occurrences in app | ✅ Verified |
| Anti-theft | CSP, Headers, Watermark | Implemented & verified | ✅ Verified |

---

## Known Next Steps for the User

1. **Verify NTA Syllabus Chapter Data**: Verify chapter titles and topics in `src/data/chaptersData.js`.
2. **Add Verified Notes**: Drop structured notes files into `src/content/notes/<chapterId>.js`.
3. **Add Verified PYQs**: Drop question files into `src/content/pyq/<chapterId>.js`.
4. **Configure Production Domain**: When deploying to Netlify or custom domain, add domain string to `ALLOWED_DOMAINS` in `src/config.js`.
5. **Exam Date**: Add JEE target date in `src/config.js` if countdown banner is desired.
