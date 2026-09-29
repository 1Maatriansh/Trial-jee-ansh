# Ansh JEE — Architecture

> Last updated: 2026-09-28. Governed by Master Build Prompt v3.

---

## 1. Tech Stack

| Layer | Tool | Reason |
|---|---|---|
| Build | Vite 8 | Fast HMR, route-level code splitting via `import.meta.glob` |
| UI | React 19 | Component model; native transitions via View Transitions API |
| Routing | react-router-dom v7 | Real URLs, back button, deep links, SPA fallback |
| Animation | GSAP + ScrollTrigger | **Intro only** (lazy chunk). Cinematic pinned scenes justify it. |
| Styles | Plain CSS (tokens + themes) | No CSS-in-JS; tokens in `tokens.css` and `themes.css` |
| Icons | Inline SVG (hand-written) | No icon package needed for our small set |
| Charts | Plain SVG (hand-written) | No chart library; simple bar/ring charts |
| Math | None yet | Ask before adding KaTeX or similar |
| State | React built-in (`useState`, `useReducer`, `useContext`) | No external state library needed |
| Storage | Custom `storage.js` wrapper | try/catch, schema validation, versioned keys |

**Never add a dependency without asking.** Record every dependency and its reason here.

---

## 2. Dependency Ledger

| Package | Reason | Added |
|---|---|---|
| `react` | UI framework | Scaffolded |
| `react-dom` | DOM rendering | Scaffolded |
| `vite` | Build tool | Scaffolded |
| `@vitejs/plugin-react` | JSX transform | Scaffolded |
| `react-router-dom` | SPA routing with real URLs | Phase 1 |
| `gsap` | Intro scroll animations only | Phase 1 (used in Phase 2) |

---

## 3. File Structure

Target ~35–45 source files total. Merge small things; split only when a file is hard to read.

```
index.html
public/
  theme-init.js          ← synchronous, external (CSP requires it); applies theme before paint
  _headers               ← Netlify security headers
  _redirects             ← SPA fallback: /* → /index.html 200
  manifest.webmanifest
  robots.txt
  og.png
  icons/                 ← PWA icons
  fonts/                 ← WOFF2, self-hosted

src/
  main.jsx               ← React root mount
  App.jsx                ← Router setup, route skeleton
  config.js              ← Site name, creator, external links, exam date, SHOW_DEMO_CONTENT

  styles/
    tokens.css            ← Spacing, radius, z-index, motion tokens (all :root)
    themes.css            ← Five themes as [data-theme="mono"] selectors
    base.css              ← Reset, body, scrollbar, selection
    app.css               ← App shell, rail, bottom bar, header, layout
    intro.css             ← Intro-specific styles (letterbox, grain, etc.)

  lib/
    storage.js            ← localStorage wrapper: try/catch, versioning, schema validation
    content.js            ← Lazy content loader via import.meta.glob
    time.js               ← Date/time helpers (day boundary, streak, week start)

  data/
    chaptersData.js       ← Chapter metadata index (eagerly loaded, small)
    syllabusData.js       ← Topic lists per chapter
    formulaData.js        ← Formula data per chapter

  content/               ← Heavy content, lazy-loaded per chunk
    notes/               ← <chapterId>.js
    pyq/                 ← <chapterId>.js
    practice/            ← <chapterId>.js
    tests/               ← <testId>.js

  components/
    Button.jsx
    Chip.jsx
    Skeleton.jsx
    Toast.jsx
    Modal.jsx
    ProgressRing.jsx
    EmptyState.jsx
    Icons.jsx
    Segmented.jsx
    Rail.jsx
    BottomBar.jsx
    Header.jsx
    Footer.jsx
    Background.jsx
    ThemeSwitcher.jsx

  pages/
    intro/
      Intro.jsx           ← Lazy-loaded entry point
      scenes.jsx          ← All 12 scenes
    app/
      Home.jsx
      Learn.jsx
      Chapter.jsx
      Pyqs.jsx
      Practice.jsx
      Tests.jsx
      TestRunner.jsx
      Focus.jsx
      Progress.jsx
      Saved.jsx
      Revision.jsx
      Profile.jsx
```

---

## 4. Routing

```
/              → Intro (lazy chunk)
/app           → Home
/app/learn     → Learn (subject list)
/app/learn/:subject        → Subject chapter list
/app/learn/:subject/:chapterId → Chapter page
/app/practice  → Practice
/app/pyqs      → PYQs
/app/tests     → Test list
/app/tests/:testId → Test runner
/app/focus     → Focus
/app/progress  → Progress
/app/saved     → Saved
/app/revision  → Revision
/app/profile   → Profile
*              → 404 (inside app layout) → link to /app
```

`public/_redirects`: `/* /index.html 200`

---

## 5. Data Architecture

### Chapter IDs
Format: `{subjectCode}-{class}-{slug}` — e.g. `phy-11-kinematics`, `che-12-solutions`, `mat-11-sets`.
**Never rename an ID after it has been used** (localStorage keys reference them).

### Test IDs
Format: `test-{slug}` — e.g. `test-demo-interface`.

### Chapter Metadata (src/data/chaptersData.js)
```js
{
  id: "phy-11-kinematics",
  class: 11,               // 11 | 12
  subject: "physics",      // physics | chemistry | mathematics
  order: 3,
  name: "Kinematics",
  overview: "...",         // 2–4 sentences
  topics: ["..."],         // from NTA syllabus — VERIFY before publishing
  weightage: null          // only with verified numbers
}
```
> ⚠️ **Chapter names and topics must come from the official NTA JEE syllabus. Verify before publishing. Never guess weightage.**

### Notes Format (src/content/notes/<chapterId>.js)
```js
export default { sections: [{ id, title, blocks: [
  { type: "p", text },
  { type: "list", items },
  { type: "callout", text },
  { type: "formula", text },
  { type: "image", src, alt }
] }] }
```

### Question Format (PYQ, practice, test)
```js
{ id, chapterId, topic, type: "mcq" | "numerical",
  statement, options, answer, explanation,
  year, exam: "main" | "advanced", shift,
  marks: { correct, wrong } }
```

### Adding Content (no UI change required)
1. Add chapter metadata to `chaptersData.js`
2. Add overview and topics
3. Drop `src/content/notes/<chapterId>.js` → notes appear
4. Drop `src/content/pyq/<chapterId>.js` → PYQs appear
5. Drop `src/content/practice/<chapterId>.js` → practice appears

---

## 6. Local Storage Schema

Keys namespaced as `ajee:v1:<type>`. All reads validated against schema; fall back gracefully on corrupt data.

| Key | Contents |
|---|---|
| `ajee:v1:profile` | name, classMode, theme, createdAt, lastChapterId |
| `ajee:v1:chapters` | map by chapterId: status, openedAt, updatedAt, opens |
| `ajee:v1:focus` | append-only array (cap 2000): sessions |
| `ajee:v1:attempts` | append-only array (cap 5000): question attempts |
| `ajee:v1:tests` | inProgress state + finished array |
| `ajee:v1:saved` | chapters, notes, questions, revision arrays |
| `ajee:v1:mistakes` | mistake log array |

---

## 7. Security Measures

### What each measure does (and does not do)
| Measure | What it does | What it does NOT do |
|---|---|---|
| Domain allow-list | Renders notice if served from unlisted host | Cannot be bypassed by just changing headers |
| Frame-busting | Prevents embedding in iframes | Does not stop screenshots |
| Production source maps disabled | Hides source code from easy inspection | Does not prevent reverse engineering |
| Content protection (notes/PYQ areas) | Disables selection, drag, context menu, print; adds watermark | Does not prevent screen recording or a determined actor |
| Lazy content chunks | Requires loading each chapter separately | Does not prevent fetching all chunks with a script |
| Minified bundle | Increases effort to copy | Does not prevent decompilation |
| CSP headers | Prevents most XSS and injection | Does not stop someone who controls the browser |

> **Important:** We do not claim the site is uncopyable. We do not add security theatre. We do not harm accessibility or usability in the name of security. For genuinely premium content (future), the correct approach is a server function with rate limiting and watermarked images — documented here as a future option, not built now.

### Content Security Policy notes
- `script-src 'self'` blocks inline scripts → theme init must be `public/theme-init.js` (external, sync, in `<head>` without `defer`).
- `style-src 'unsafe-inline'` needed because React and GSAP set inline styles. Documented and accepted.
- All fonts are self-hosted so `font-src 'self'` works. Any external host addition requires documenting here.

### Content deterrents (notes, PYQ, formula areas only)
- `user-select: none`, `pointer-events: none` on drag, context menu suppressed, `@media print { display: none }`
- A faint repeating watermark (`Ansh JEE` + domain) for screenshot traceability
- These MUST NOT apply to: inputs, search box, textarea, or any form element

---

## 8. Performance Architecture

- Route-level code splitting via React.lazy + Suspense
- Intro is a separate lazy chunk (GSAP + ScrollTrigger only loaded there)
- Content (notes, PYQ, practice, tests) loaded lazily per chapter via `import.meta.glob`
- No large images or videos; inline SVGs preferred
- Fonts: WOFF2, self-hosted, `font-display: swap`, preload the two most-used files only
- No constant background animation in the app

### Performance Budgets
| Metric | Target |
|---|---|
| Initial app JS (gzip) | ≤ 180 KB |
| Intro chunk (gzip) | ≤ 130 KB |
| CSS total (gzip) | ≤ 40 KB |
| LCP (mid-range phone, 4G) | ≤ 2.5s |
| CLS | < 0.05 |
| INP | < 200ms |

---

## 9. Anti-Patterns (never do these)

- Never use `dangerouslySetInnerHTML` with user input
- Never store API keys or credentials in the repo
- Never leave source maps in production
- Never apply `user-select: none` globally (breaks inputs)
- Never use `100vh` on mobile (use `100dvh`/`svh`)
- Never use `setInterval` alone for timers (derive from timestamps)
- Never put GSAP outside the intro lazy chunk
- Never hard-code chapter content into pages
- Never show fake data, fake statistics, or fabricated content
- Never add a navigation path from the app back to the intro (`/`)
