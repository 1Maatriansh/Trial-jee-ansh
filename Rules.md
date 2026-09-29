# Ansh JEE — Engineering & Design Rules

> Last updated: 2026-09-28. Governed by Master Build Prompt v3. These rules are always in force.

---

## Working Agreement

1. **Read existing project before writing code.** Reuse what is good.
2. **One phase at a time.** Finish, run, and verify before moving to the next.
3. **Git commit after every working phase** with a clear message.
4. **Never delete files or folders without asking.**
5. **Never add a dependency without approval** (see Architecture.md dependency ledger).
6. **After each phase:** report in 5 lines or fewer (what was built, what to test, what is still missing).
7. **Update Memory.md** at the end of every phase.
8. **Resumption protocol:** start each session by reading Memory.md and Phases.md, then continue from the last commit.
9. **Do not invent facts.** No made-up statistics, claims, PYQs, notes, or student counts.
10. **Do not copy any other website.** The reference site is for concept only.
11. **Student experience and small, maintainable codebase** are the top priorities.

---

## Code Quality Rules

- Readable, semantic, componentised where useful
- No dead code, no duplicate styles, no unused imports
- No console spam, no TODO scattered around
- No fake functions or placeholder hacks pretending to be finished
- No broken buttons, no dead navigation
- Every file and every dependency must have a reason to exist
- Prefer 8–12 components and a handful of data/lib files over dozens of tiny ones
- No abstraction layers, services, or custom hooks unless truly needed in 2+ places

---

## Design Rules

- Every value (colour, radius, spacing, duration, easing) comes from tokens. No magic numbers.
- No raw colour values inside components.
- Every screen: clear hierarchy — Primary / Secondary / Tertiary.
- Every screen answers: *Where am I? What can I do? What should I do next?*
- Premium = restraint. What is **not** shown matters.
- Use `transform` and `opacity` only for animation (60fps on mid-range phone).
- Minimum touch target: **44×44px**.
- Mobile-first: design at 360px, test at 360, 390, 768, 1024, 1440.
- `100dvh` (with `svh` fallback), never `100vh`.

---

## Content Rules

- **Never fabricate content.** Empty states are honest, never fake.
- Chapter names and topics from the official NTA JEE syllabus only. Mark unverified entries with a comment.
- Real data only in Progress, charts, and statistics.
- The demo test (`SHOW_DEMO_CONTENT`) never contributes to Progress.
- No exaggerated claims. No exam-result guarantees.

---

## Security Rules

- No secrets, API keys, or credentials in the repo or bundle.
- No source maps in production.
- `user-select: none` only in content areas, **never** on inputs, search, or textareas.
- `dangerouslySetInnerHTML` is forbidden with user input.
- Validate all localStorage reads against a schema before use.
- Wrap all localStorage writes in try/catch.
- External links: `rel="noopener noreferrer"`.

---

## Navigation Rules

- **No path from the app back to `/` (the intro).** App logo → `/app`. 404 → `/app`.
- Every nav item navigates. No dead links.
- Breadcrumb and Back control on every deep page.
- Deep links work via `public/_redirects`.

---

## Accessibility Rules

- Semantic HTML at all times.
- Correct heading hierarchy (one H1 per page).
- Visible `:focus-visible` everywhere (never `outline: none` without replacement).
- AA contrast in all five themes.
- `prefers-reduced-motion` respected everywhere.
- Screen reader announcements for timer and test palette.
- No accessibility sacrifice for aesthetics.

---

## Copywriting Rules

- Sentence case for all UI text.
- No exclamation marks.
- No emoji in UI.
- No hype verbs: `unlock`, `supercharge`, `dominate`, `crush`, `crack IIT like a beast`.
- Short, precise sentences. Human, calm, professional.
- Privacy note is short and honest: everything is on this device.

---

## What Not to Add

No AI chatbot · No leaderboards · No social feeds · No streak gambling · No fake ranks · No daily quote widgets · No motivational quote randomisers · No games · No fake badges · No fake statistics · No fake testimonials · No fake student counts · No IIT guarantees · No random illustrations · No features included only because they look cool.

---

## Anti-Patterns Checklist (before saying a phase is done)

- [ ] No `100vh` (use `100dvh`)
- [ ] No `setInterval` alone for timers (timestamps)
- [ ] No GSAP outside the intro lazy chunk
- [ ] No inline theme script (CSP violation — must be external sync file)
- [ ] No global `user-select: none` (breaks inputs)
- [ ] No hard-coded chapter content in pages
- [ ] No fake data shown to the user
- [ ] No link from /app/* back to /
- [ ] No magic numbers (everything from tokens)
- [ ] No missing empty states
- [ ] No unused dependencies
- [ ] No secrets in the repo
