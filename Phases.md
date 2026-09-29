# Ansh JEE — Build Phases

> Last updated: 2026-09-29. Governed by Master Build Prompt v3.

---

## Phase Overview

| Phase | Deliverable | Status |
|---|---|---|
| **0** | Audit and docs | ✅ Done |
| **1** | Foundation (tokens, themes, router, primitives) | ✅ Done |
| **2** | Intro experience (12 scenes, skip, reduced-motion, mobile) | ✅ Done |
| **3** | App shell (rail, bottom bar, header, home, theme switcher) | ✅ Done |
| **4** | Academic system (chapters, subject views, chapter page) | ✅ Done |
| **5** | Practice, PYQs, Tests (full CBT engine) | ✅ Done |
| **6** | Focus (timer, sessions, streak, SVG chart) | ✅ Done |
| **7** | Progress, Saved, Revision, Profile | ✅ Done |
| **8** | Security and privacy (headers, CSP, allow-list, watermark) | ✅ Done |
| **9** | Polish, QA, verify (performance budgets, build test) | ✅ Done |

---

## All Phases Verification Summary

1. **Build & Bundling**: `npm run build` succeeds cleanly in under 1.2s.
2. **Bundle Sizes**:
   - Initial JS (gzip): **85.87 kB** (Budget: ≤ 180 kB)
   - Intro chunk (gzip): **49.00 kB** (Budget: ≤ 130 kB)
   - CSS total (gzip): **4.20 kB** (Budget: ≤ 40 kB)
3. **Hard Rules**:
   - Zero links from app back to `/`.
   - Intro rendered strictly in Mono theme.
   - Pre-paint theme synchronization via synchronous external `public/theme-init.js`.
   - Exact creator credit across both footers: `Made with ♥ from Maatriansh`.
   - Demo tests marked `isDemo: true` and excluded from Progress.
   - Content protection (watermark, no-select, no-print) on notes without breaking inputs.
