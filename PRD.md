# Ansh JEE — Product Requirements Document

> Last updated: 2026-09-28. This file is governed by the Master Build Prompt (v3). In any conflict, the prompt wins.

---

## 1. Product Identity

- **Name:** Ansh JEE (always written exactly like this)
- **Tagline:** *Everything a JEE aspirant needs. One place.*
- **Creator:** Maatriansh — exact footer line: `Made with ♥ from Maatriansh`
- **Audience:** JEE Main and Advanced aspirants. **Most are on mobile**, many on mid-range phones and slow networks.
- **What it is:** A personal JEE preparation workspace where a student can learn, read notes, understand chapters, practise, solve PYQs, take tests, focus, track activity, and return to weak areas.
- **Priorities (in order):** content → clarity → data → aesthetics.
- **The feeling:** intro creates emotion; app creates clarity; academic system creates structure; practice and tests create feedback; focus creates deliberate study blocks; progress makes preparation visible.

---

## 2. The Two Experiences

```
INTRO (cinematic)   →   ENTER ANSH JEE   →   MAIN APP (workspace)
     /                                              /app/*
```

- **Intro (`/`):** scroll-driven cinematic story — 12 scenes, full-black Mono theme, GSAP ScrollTrigger.
- **Main app (`/app/*`):** fast, calm, functional study workspace.
- **Hard rule:** zero paths from the app back to `/`. App logo → `/app`. 404 → `/app`.

---

## 3. Core Sections

| Section | Route | Purpose |
|---|---|---|
| Home | `/app` | Context, continue studying, subject access |
| Learn | `/app/learn` | Class → Subject → Chapter → Chapter page |
| Practice | `/app/practice` | Chapter-based question practice with tracking |
| PYQs | `/app/pyqs` | Filtered past year questions |
| Tests | `/app/tests` | Full CBT-style tests with timer and palette |
| Focus | `/app/focus` | Timer-based study sessions |
| Progress | `/app/progress` | Real-data charts, streaks, activity |
| Saved | `/app/saved` | Bookmarked chapters, notes, questions |
| Revision | `/app/revision` | Wrong answers, saved for revision, mistake log |
| Profile | `/app/profile` | Name, class, theme, export/import/reset |

---

## 4. Class Selection

- **Class 11:** Class 11 syllabus only.
- **Class 12:** Class 12 syllabus only.
- **Dropper:** All chapters (11 + 12), grouped by class, revision-first wording, emphasis on Revision and Tests.
- Stored locally; editable in Profile. First-run prompt is light and skippable.

---

## 5. Content Model

Academic content is entirely data-driven. Never hard-code chapters into pages.

```
class → subjects → chapters → chapter metadata → notes / PYQs / practice questions
```

Heavy content loads lazily per chapter. Missing file = honest empty state, never an error.

**Never fabricate:** no made-up PYQs, notes, statistics, student counts, exam dates, weightage, or claims.

---

## 6. Feature Requirements

### Learn
- Subject → Chapter list (mono index, serif name, status chip, save icon)
- Chapter page: Overview, Topics, Notes (empty state), PYQs (empty state), Formulas (if data exists), Prev/Next
- Search and filter by status
- Breadcrumb and Back control, sticky on mobile

### Practice
- Flow: Class → Subject → Chapter → Question → Answer → Explanation → Next
- Track: correct / incorrect / skipped / time per question
- Incorrect → Revision
- Support MCQ and numerical types

### PYQs
- Filters: Class, Subject, Chapter, Topic, Year, Exam (Main / Advanced), Shift
- Solve view: statement, options/numerical, Check answer, Explanation, Save, Add to revision

### Tests
- Countdown timer (timestamp-based, tab-safe)
- Five-state question palette (not visited, not answered, answered, marked, answered+marked)
- Mark for review, Clear response, Submit with confirmation, Auto-submit at zero
- In-progress state persists; Resume on reload
- Result: score, accuracy, per-subject and per-chapter breakdown
- Demo test behind `SHOW_DEMO_CONTENT` flag — never counted in Progress

### Focus
- Modes: 25 min, 50 min, Custom, Stopwatch
- Timestamp-based; survives tab hide and reload
- Subject tag per session
- Session history, streak, weekly chart, today's total

### Progress
- Real data only; empty states when no activity exists
- Study time, focus sessions, chapters done, tests taken, accuracy (min 5 attempts)
- Heat-calendar, subject completion rings, plain-SVG charts

### Saved & Revision
- Saved: chapters, notes, questions with tabs
- Revision: saved for revision, recently studied, frequently revisited, incorrect questions, mistake log

### Profile & Settings
- Name, class, theme, export JSON, import JSON, reset (confirmation modal)
- Local-storage note: everything lives on this device

---

## 7. Non-Requirements (explicitly excluded)

No AI chatbot, leaderboards, social features, streak gambling, fake ranks, daily quote widgets, games, fake badges, fake testimonials, fake statistics, IIT claims, any feature only for aesthetics.

---

## 8. Acceptance (summary — see Appendix K of the Master Prompt for full tests)

- `npm run build` succeeds with zero console errors
- Intro: all 12 scenes, Skip, reduced-motion, mobile-perfect, Enter transition
- App: no link back to `/`; class selector persists; real data only in Progress
- All five themes: AA contrast, no flash on reload
- Mobile 360px: no overflow, 44px touch targets, safe-area respected
- Footer: exactly `Made with ♥ from Maatriansh`
- Lighthouse mobile: Performance ≥ 85, Accessibility ≥ 95, Best Practices ≥ 95, SEO ≥ 90
