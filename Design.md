# Ansh JEE — Design System & Visual Language

> Last updated: 2026-09-28. Governed by Master Build Prompt v3.

---

## 1. Design Direction

**Feel:** editorial + technical + academic + premium software. Monochrome-first identity with a restrained accent.

**Avoid:** purple/blue gradients, neon glow, floating colour blobs, glassmorphism everywhere, giant gradient headings, giant centred hero, emoji as icons, generic AI illustrations, meaningless metric cards, unnecessary 3D, gaming-dashboard styling, repetitive animation.

**Do:** build hierarchy with typography and spacing, not boxes and shadows. Hairline borders over heavy shadows. Every screen answers: *Where am I? What can I do? What should I do next?*

---

## 2. Themes

Five complete design systems (not colour inversions). Theme change adapts: bg, surfaces, borders, text, accent, buttons, shadows, grain/grid, charts, timer ring, scrollbars, selection, focus rings, `theme-color`.

| Theme | ID | Character |
|---|---|---|
| Mono | `mono` | Pure black/white. Identity theme. **Default.** |
| Paper | `paper` | Warm off-white, near-black text. Proper light mode. |
| Midnight | `midnight` | Deep blue-black, cool and calm. |
| Ember | `ember` | Black with warm amber accent. |
| Sage | `sage` | Very dark green-grey, low-strain study mode. |

- **Intro always renders in Mono** regardless of user's chosen theme.
- Persisted before first paint via `public/theme-init.js` (synchronous, external — required by CSP).
- Switched with View Transitions API circular reveal from the control; cross-fade fallback.
- All pairs must meet **WCAG AA** (4.5:1 body, 3:1 large/UI).

---

## 3. Design Tokens (centralised)

All values live in `src/styles/tokens.css` and `src/styles/themes.css`. No raw hex values in components.

### Spacing (4px base)
`--s-1: 4px` through `--s-10: 128px`

### Radius (small and precise)
`--r-1: 2px` · `--r-2: 4px` · `--r-3: 8px` · `--r-full: 999px` (pill — chips/dots only)

### Layout
- Rail: `--rail-w: 64px` / `--rail-w-open: 240px`
- Header: `--header-h: 56px` / `--header-h-lg: 64px`
- Bottom bar: `--bottombar-h: 64px` + `env(safe-area-inset-bottom)`
- Content max: `--content-max: 1120px` · Reading: `--reading-max: 68ch`

### Z-index scale
`--z-bg: -1` · `--z-base: 0` · `--z-sticky: 20` · `--z-rail: 30` · `--z-header: 40` · `--z-sheet: 60` · `--z-modal: 70` · `--z-toast: 80`

### Motion tokens
```
--ease-out-expo: cubic-bezier(.16, 1, .3, 1)        /* entrances */
--ease-in-out-quart: cubic-bezier(.76, 0, .24, 1)   /* scene/page transitions */
--ease-standard: cubic-bezier(.4, 0, .2, 1)          /* hover, small UI */
--dur-1: 120ms  --dur-2: 200ms  --dur-3: 300ms
--dur-4: 600ms  --dur-5: 900ms  --dur-6: 1400ms     /* dur-5/6: intro only */
```
`prefers-reduced-motion: reduce` → all durations → `0ms`.

### Semantic colour tokens
`--bg` · `--surface` · `--surface-elevated` · `--text-primary` · `--text-secondary` · `--text-muted` · `--border` · `--border-strong` · `--accent` · `--accent-hover` · `--accent-contrast` · `--success` · `--warning` · `--danger` · `--focus-ring` · `--grid` · `--grain-opacity` · `--shadow-1` · `--shadow-2`

See Appendix A of the Master Prompt for exact hex values per theme.

---

## 4. Typography

| Role | Family | Size |
|---|---|---|
| Display | Serif (Fraunces or Instrument Serif) | `clamp(3rem, 1rem + 8vw, 8rem)` |
| H1 (page title) | Serif | `clamp(2.25rem, 1.5rem + 3.2vw, 4rem)` |
| H2 (section) | Serif | `clamp(1.75rem, 1.3rem + 1.8vw, 2.75rem)` |
| H3 | Grotesk 600 | `1.25rem` |
| Body | Grotesk 400 | `1rem` (min 16px, max 68ch line length) |
| Small | Grotesk 400 | `0.875rem` |
| Label / meta | Mono 500, uppercase, letter-spaced | `0.75rem` |
| Numeric (timer, palette) | Mono 500, tabular-nums | context |
| Button | Grotesk 600 | `0.9375rem` |

- **Max three font families.** Self-hosted WOFF2 only. `font-display: swap`. Preload the two most important files only.
- `text-wrap: balance` on headings, `text-wrap: pretty` on paragraphs. `font-optical-sizing: auto`.

---

## 5. Background System (layered, theme-aware)

1. Base `--bg`
2. Blueprint grid: faint 1px lines + `+` ticks at intersections, very low opacity
3. Fine grain overlay (tiled, 3–5%, `--grain-opacity`)
4. Soft vignette + controlled radial lighting
5. Optional: thin SVG axes, mono labels (`x`, `y`, `θ`, `∫`), extremely faint, not behind body text

Desktop: optional slow pointer-following light. Mobile: slow scroll-linked drift or nothing. Effects pause when tab hidden. Reduced under `prefers-reduced-motion` and on low-power devices.

---

## 6. Navigation

### Desktop: Navigation Rail
- 64px collapsed → 240px on hover/click
- Hairline divider, thin active indicator (bar or dot)
- Primary group: Home, Learn, Practice, PYQs, Tests
- Secondary group: Focus, Progress, Saved, Revision
- Bottom: Profile, Theme switcher

### Mobile: Bottom Tab Bar
- Max 5 items: Home, Learn, Focus, Progress, More
- More → bottom sheet with remaining items
- Safe-area aware
- Compact header with class selector

### Class Selector
- Compact segmented control in the top bar
- 3 segments: 11 / 12 / Dropper
- 36px desktop, 40px mobile, sliding indicator, keyboard-navigable

---

## 7. Component Specs

### Button
- Primary: 44px min / 48px CTAs, bg `--accent`, text `--accent-contrast`
- Secondary: transparent, 1px `--border-strong`
- Ghost: no border, text `--text-secondary`
- Icon button: 44×44 hit area minimum
- States: hover, active `scale(.97)`, focus-visible `--focus-ring`, disabled 40% opacity, loading spinner
- Intro CTA: 56px, magnetic pull on desktop, ink-fill sweep

### Other Primitives
- **Chip:** 24px height, mono label, 1px border, `--r-2`; status dots: hollow/half/filled
- **Card:** `--surface`, 1px `--border`, `--r-3`, padding `--s-5`; hover: border `--border-strong`
- **Segmented control:** 3 segments, sliding indicator, `role="radiogroup"`
- **Progress ring:** SVG, stroke-linecap round, animates `stroke-dashoffset`
- **Skeleton:** `--surface-elevated` + 1.6s shimmer; reduced-motion: static
- **Toast:** bottom-centre mobile / bottom-right desktop, 3s, `role="status"`
- **Modal/Sheet:** centred modal desktop, bottom sheet mobile; focus trapped, Esc closes
- **Empty state:** small SVG, one sentence title, one sentence explanation, optional action
- **Breadcrumb:** mono label, `›` separators, `aria-current="page"` on last

---

## 8. Motion Language

- **Intro:** cinematic, scroll-linked, expressive
- **App:** subtle, fast, functional — never makes studying feel slow
- Animate only `transform` and `opacity`. 60fps on mid-range phone.
- `prefers-reduced-motion`: calm, non-animated equivalent everywhere
- Never block content behind an animation the user cannot skip

---

## 9. Icons

Small set of inline SVG icons written for the project. **No emoji as UI icons. No icon package.**

---

## 10. Accessibility

- Semantic HTML, correct heading hierarchy
- Full keyboard navigation, visible focus states (`--focus-ring`)
- WCAG AA contrast in all five themes
- `prefers-reduced-motion` respected
- Focus management on route change
- Test palette: `aria-label` per button (e.g. `Question 12, answered, marked for review`)
- Timer: `role="timer"`, announces at 30m, 10m, 5m, 1m, 30s — not every second
- Min touch target 44×44px
