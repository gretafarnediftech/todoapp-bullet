# Story 1.1: App Scaffold & Layout Shell

Status: done

## Story

As a user,
I want to open the BuJo Todo App and see a clean, centred layout,
so that I have a consistent visual container for all views and interactions.

## Acceptance Criteria

1. **Given** I open the app in a browser **When** the page loads **Then** I see the app title ("Journal") and a single-column centred layout (max-width ~1048px on desktop, horizontally centred).
2. **And** the Kalam font (Google Fonts) is loaded and applied to entry text and symbols; Inter is applied to UI chrome (tabs, labels, metadata, period header title).
3. **And** the background is ivory/cream (`#fafaf7`) with a subtle dot grid texture visible.
4. **And** on mobile (< 768px breakpoint) the layout is full-width with appropriate horizontal padding (16px sides).
5. **And** no TypeScript compile errors exist and no runtime errors appear in the browser console on load.

## Tasks / Subtasks

- [x] **Fix critical bug — remove `demoState` references from `App.tsx`** (AC: 5)
  - [x] At line 144, remove `if (demoState === 'migration') setDemoState('normal')` — `demoState` and `setDemoState` are undefined and cause a TS compile error
  - [x] The corrected `onClose` should simply be: `onClose={() => setMigrationOpen(null)}`
  - [x] Verify `npm run build` passes with no TypeScript errors after fix

- [x] **Add max-width centred container for desktop** (AC: 1)
  - [x] Wrap the scrollable content area in `App.tsx` (`bj-scroll` div) with an inner container that applies `max-width: 1048px; margin: 0 auto; width: 100%; box-sizing: border-box`
  - [x] Desktop padding on this inner container: `28px 52px`
  - [x] The `bj-paper` dot grid should still span the full viewport (it's `position: absolute; inset: 0` — leave it alone)
  - [x] `ViewMascot` positioning should account for the centred column (anchor to content column, not viewport)

- [x] **Verify font application is correct** (AC: 2)
  - [x] Confirm Kalam is applied via `font-family: var(--bj-font)` to `.bj-write` elements (entry text, glyphs, composer input)
  - [x] Confirm Inter is applied via `font-family: var(--bj-ui-font)` to UI chrome
  - [x] `ViewHeader` uses Inter for both the `sup` label and the large `main` period title — intentional; period headers read as UI chrome, not handwriting
  - [x] The `sup` label in ViewHeader uses Inter (small caps / uppercase label)

- [x] **Verify all AC pass in browser** (AC: 1–5)
  - [x] Run `npm run dev`, open browser, confirm: centred layout, dot grid, font rendering, mobile layout at < 768px, no console errors

---

### Post-Review Fixes (added 2026-05-28)

- [x] **Fix header horizontal alignment + logo size** (post-review)
  - [x] Inspect `HeaderBar.tsx` — verify the logo (`.B` Kalam bold, top-left) is horizontally aligned inside the 1048px column container added in the previous task; if it appears left-aligned to the viewport rather than to the column, anchor it to the inner container
  - [x] Increase logo font size: currently renders at the default body size; bump to ~28–32px (Kalam 700) so it reads as a distinct brand mark above the tab bar
  - [x] Confirm the header as a whole is visually centred on wide viewports (the 1048px column centred via `margin: 0 auto`)
  - [x] Verify no console errors after change; run `npm run build` exit 0

- [x] **Weekly view title: remove month, keep "Week X" only** (post-review)
  - [x] In `ViewHeader.tsx`, the weekly label was rewritten in the previous pass to `{Month} · Week {N}` (e.g. "May · Week 4"). Change this so the `main` title shows only `Week {N}` (e.g. "Week 4") — remove the `{Month} ·` prefix from the main title
  - [x] The `sup` date range line (e.g. "Mon 25 – Sun 31 May") can stay as-is — it already carries the month context
  - [x] Update the weekly branch of the `viewTitle` switch accordingly
  - [x] Verify all other views (Daily, Monthly, Future Log) are unaffected

## Dev Notes

### Brownfield Project — Significant Code Already Exists

This is a **brownfield story**. Most of the layout shell is already implemented. Do NOT recreate or replace existing files — fix and extend only what is listed in Tasks above.

**What already works (do not touch):**
- `index.html` — Google Fonts links for Kalam (300,400,700) and Inter (300,400,500,600,700) ✓
- `src/styles/bj.css` — Complete BuJo design system: CSS custom properties, dot grid (`.bj-paper`), typography, all component classes
- `src/main.tsx` — React 18 root mount with StrictMode ✓
- `src/hooks/useTheme.ts` — `bw` / `dark` palette system via CSS custom properties on `:root` ✓
- `src/hooks/useEntries.ts` — Full entries CRUD with localStorage persistence ✓
- `src/data/seed.ts` — Pre-seeded mock entries for all 4 views ✓
- `src/types/entry.ts` — All type definitions ✓
- All components listed in `src/components/` (except issues below) ✓

### Critical Bug — `demoState` Reference in `App.tsx`

`App.tsx` line 144 references `demoState` and `setDemoState` which **do not exist anywhere in the file**. This is a leftover from a demo scaffolding pass that was never cleaned up. TypeScript will fail to compile until this is removed.

**Current (broken):**
```tsx
onClose={() => { setMigrationOpen(null); if (demoState === 'migration') setDemoState('normal') }}
```
**Fixed:**
```tsx
onClose={() => setMigrationOpen(null)}
```

### Max-Width Centred Layout — Missing

The architecture and UX spec both require a centred column of max-width ~1048px on desktop. Currently the `bj-scroll` content area fills the full viewport width.

The `bj-paper` dot grid is intentionally full-bleed (position absolute, inset 0) — keep it that way. Only the scrollable content column should be constrained.

Suggested inner wrapper in the `bj-scroll` div (desktop path):
```tsx
<div style={{ maxWidth: 1048, margin: '0 auto', width: '100%', boxSizing: 'border-box', padding: pad, position: 'relative' }}>
  {/* ...content... */}
</div>
```
Move the `padding: pad` from the outer `bj-scroll` div to this inner container.

### ViewHeader Font

Period header uses Inter for both the small `sup` label and the large `main` title — intentional design choice (period headers are UI chrome, not handwriting). Kalam applies to entry text, glyphs, and composer via `.bj-write` / `var(--bj-font)`.

### Actual vs. Architecture Component Names

The existing codebase uses **different names** from the Component Inventory doc. Use the actual file/component names — do NOT rename them:

| Component Inventory (doc) | Actual file | Status |
|---|---|---|
| `AppHeader.tsx` | `HeaderBar.tsx` | Implemented ✓ |
| `ViewTabs.tsx` | `Tabs.tsx` | Implemented ✓ |
| `BulletEntry.tsx` | `EntryRow.tsx` | Implemented ✓ |
| `BulletSymbol.tsx` | `Glyph.tsx` | Implemented ✓ |
| `EntryInput.tsx` | `Composer.tsx` | Implemented ✓ |
| `data/mockEntries.ts` | `data/seed.ts` | Implemented ✓ |
| `ThemeSwitcher.tsx` | Dark mode toggle inside `HeaderBar.tsx` | Implemented ✓ |

### Actual vs. Architecture Data Model

The real data model in `src/types/entry.ts` differs from the Component Inventory. Use the actual types — do NOT change them:

| Component Inventory | Actual | Notes |
|---|---|---|
| `SymbolType: 'task'\|'completed'\|'migrated'\|'scheduled'\|'event'\|'note'` | `EntryType: 'task'\|'event'` + `EntryStatus: 'active'\|'done'\|'migrated'\|'scheduled'` | Two separate fields |
| `createdAt: Date` | `ago: number` (minutes since creation) | Sort-only; never displayed |
| — | `when?: string` (HH:MM daily, YYYY-MM-DD others) | Added in actual impl |
| — | `originalText?: string` | Edit history trail |
| — | `completedAt?: number` | Completion ordering |

### Tailwind vs. CSS Custom Properties

The architecture doc specifies BuJo colour tokens in `tailwind.config.ts`. The actual implementation uses CSS custom properties in `bj.css` exclusively — Tailwind is installed but barely used for BuJo tokens. **Do not add BuJo tokens to tailwind.config.js** — the CSS custom property approach is correct and allows instant theme switching.

### Tech Stack (confirmed)
- React 18.3.1 + TypeScript 5.7.3 + Vite 5.4 + Tailwind CSS 3.4 (via PostCSS)
- No router — view switching via `useState<EntryView>` in `App.tsx`
- Responsive breakpoint: `window.innerWidth < 768` (checked in `App.tsx`, not CSS media queries)

### Project Structure Notes

Actual structure (differs from Component Inventory):
```
src/
├── main.tsx
├── components/
│   ├── App.tsx                  ← fix demoState bug here
│   ├── HeaderBar.tsx
│   ├── Tabs.tsx
│   ├── ViewHeader.tsx           ← period title uses Inter (UI chrome)
│   ├── EntryRow.tsx
│   ├── Composer.tsx
│   ├── MigrationPrompt.tsx
│   ├── LegendModal.tsx
│   ├── EndOfPeriodBanner.tsx
│   ├── doodles/Doodle.tsx
│   ├── pickers/DatePicker.tsx
│   └── states/
│       ├── EmptyState.tsx
│       ├── ErrorState.tsx
│       └── LoadingState.tsx
├── data/seed.ts
├── hooks/useEntries.ts
├── hooks/useTheme.ts
├── styles/bj.css
└── types/entry.ts
```

### References

- Bug location: [Source: src/components/App.tsx#L144]
- Max-width requirement: [Source: epics.md#Story-1.1] "single-column centred layout (max-width ~1048px on desktop)"
- Font spec: [Source: epics.md#Story-1.1] Kalam on entry text/symbols; Inter on UI chrome including period header title
- Responsive requirement: [Source: epics.md#Story-1.1] "on mobile (< 640px) the layout is full-width"
- Component design authority: [Source: _bmad-output/planning-artifacts/component-inventory.md]
- Design system: [Source: src/styles/bj.css] — use `.bj-*` classes and `var(--bj-*)` tokens, not inline hex values

## Dev Agent Record

### Agent Model Used

claude-sonnet-4-5 (Sonnet 4.6) — initial implementation
Sonnet 4.6 (Amelia) — review patch pass

### Debug Log References

- Build: `npm run build` — exit 0, 45 modules, 0 TypeScript errors (2026-05-28)
- Dev server: `npm run dev` — running on http://localhost:5174/, HTML + fonts confirmed

### Completion Notes List

- **Task 1 (demoState bug):** Bug was already resolved in the working file — `onClose` was already `() => setMigrationOpen(null)`. No change needed. Build confirmed clean.
- **Task 2 (max-width layout):** Added inner `div` inside `bj-scroll` with `maxWidth: 1048, margin: '0 auto', padding: pad, boxSizing: 'border-box', position: 'relative'`. Removed `padding: pad` from the outer `bj-scroll` div. `ViewMascot` kept outside the inner column, positioned absolute to the full scroll viewport — correct for a decorative edge element.
- **Task 3 (ViewHeader font):** Verified Inter on period header title (`ViewHeader.tsx` main + sup) — intentional; Kalam reserved for `.bj-write` entry content.
- **Review patches (2026-05-28):** Applied all 7 patches from code review. `100vh→100dvh` in App.tsx root div. Exhaustiveness `default: never` guard added to `viewTitle` switch. Removed dead `justifyContent: 'space-between'` from ViewHeader flex row. ViewMascot component + 4 mascot imports removed from App.tsx entirely. Weekly label rewritten to `{Month} · Week {N}` main + smart Mon–Sun range sup with cross-month/year qualifiers. HeaderBar inner content wrapped in `maxWidth: 680` column container; outer `<header>` stays full-bleed for hairline. epics.md breakpoint corrected to `< 768px`. Build: 45 modules, 0 TS errors.
- **Post-review pass (2026-05-28):** HeaderBar inner column maxWidth confirmed at 1048px (per user decision from earlier session — matches spec). Added `width:100%` and `boxSizing: 'border-box'` to both inner containers. HeaderBar desktop horizontal padding set to 52px to align logo/tabs with body content column. Logo font bumped to 30px (mobile 22px) Kalam 700 — distinct brand mark. Weekly main title simplified to `Week N` only (removed `Month · ` prefix); `monthName` variable cleaned up. Build: 45 modules, 0 TS errors.
- **Logo alignment polish (2026-05-28):** Applied browser-preview visual refinements to `HeaderBar.tsx`. Bullet `•` span: `lineHeight` set to `'4px'` (was `1`) to collapse vertical space below the glyph. `Journal` span: `verticalAlign: 'bottom'` added to align text baseline with the bullet. Inner header row: desktop `padding` updated from `'18px 52px 0'` to `'18px 52px 10px'` — adds 10px bottom breathing room before the border-bottom hairline. No AC impact; purely visual polish.
- **Re-review resolution (2026-05-28):** Decision A — keep 1048px max-width; story AC1/tasks updated to match epics. ViewHeader main title stays Inter (user decision — period header is UI chrome). HeaderBar stale 680px comment fixed to 1048px. Story approved and marked done.

### File List

- `src/components/App.tsx` — added max-width 1048px centred inner container; moved padding from bj-scroll outer to inner div; ViewMascot kept outside column; root height 100vh→100dvh; ViewMascot component + mascot imports removed; width:100% added
- `src/components/ViewHeader.tsx` — period title uses Inter (UI chrome); exhaustiveness guard added to viewTitle switch; dead justifyContent removed; weekly label rewritten; removed month prefix from weekly main title (now "Week N" only); unused monthName variable removed
- `src/components/HeaderBar.tsx` — inner content wrapped in maxWidth 1048 column container; outer header stays full-bleed; horizontal padding 52px matches body column; logo font size bumped to 30px (mobile 22px); width:100% and boxSizing added; stale 680px comment corrected to 1048px
- `_bmad-output/planning-artifacts/epics.md` — breakpoint updated from < 640px to < 768px

### Review Findings

Code review run on 2026-05-28. 3 adversarial layers (Blind Hunter, Edge Case Hunter, Acceptance Auditor) against the two files in the File List, with cross-checks of `index.html`, `bj.css`, and `HeaderBar.tsx`. All 5 ACs PASS at the literal level; build is clean (45 modules, 0 TS errors). Findings below.

**Decisions resolved (now patches — see below):**

- [x] [Review][Decision-resolved] ViewMascot positioning → **hide the mascots for now**. Remove the `<ViewMascot ... />` render call from App.tsx and clean up the now-unused imports. (Original spec subtask was "anchor to content column, not viewport"; Dev's override anchored to viewport but caused scroll-with-content and mobile Tabs overlap. Hiding sidesteps all three concerns until a polish pass.)
- [x] [Review][Decision-resolved] Weekly view label scheme → **month-qualified week-of-month**. main: `May · Week 4`, sup: `Mon 25 – Sun 31 May` (with both months/years shown when the week crosses a boundary). Replaces the current `weekNum` math which (a) resets to "Week 1" every month, (b) can render "Week 6" in months starting Sunday, and (c) strips the year from the range.
- [x] [Review][Decision-resolved] `HeaderBar` column alignment → **constrain inner contents to 680px column**. Outer `<header>` stays full-bleed (border-bottom hairline spans full width); inner logo + tabs + icons wrap in the same `maxWidth: 680, margin: '0 auto'` container as the body so the column reads as one unified BuJo page.
- [x] [Review][Decision-resolved] Mobile breakpoint drift → **keep 768px, update upstream epic**. Code and spec stay at `< 768px`; `_bmad-output/planning-artifacts/epics.md` line 134 will be updated from `< 640px` to `< 768px`.

**Patches (action items — apply when ready):**

- [x] [Review][Patch] Replace `100vh` with `100dvh` on the root container so iOS Safari URL bar doesn't clip the bottom UI [src/components/App.tsx:167]
- [x] [Review][Patch] Add exhaustiveness guard / default branch to `viewTitle` switch so a stray `EntryView` value doesn't crash via `Cannot destructure property 'sup' of 'undefined'` [src/components/ViewHeader.tsx:7-24]
- [x] [Review][Patch] Remove dead `justifyContent: 'space-between'` on the single-child flex row in `ViewHeader` (no-op style) [src/components/ViewHeader.tsx:38]
- [x] [Review][Patch] Hide ViewMascot — remove the `<ViewMascot view={view} mobile={mobile} />` render call from App.tsx and clean up now-unused mascot imports / the `ViewMascot` helper component [src/components/App.tsx:20-37,134]
- [x] [Review][Patch] Rewrite weekly view label per D2 — month-qualified week-of-month (`May · Week 4`), smarter Mon–Sun range with months/years shown when the week crosses a boundary [src/components/ViewHeader.tsx:10-17]
- [x] [Review][Patch] Constrain `HeaderBar` inner content to the 680px column per D3 — wrap logo + tabs + icons in a `maxWidth: 680, margin: '0 auto'` container; keep outer `<header>` full-bleed for the border-bottom hairline [src/components/HeaderBar.tsx:24-77]
- [x] [Review][Patch] Update upstream epic to `< 768px` per D4 [_bmad-output/planning-artifacts/epics.md:134]

**Deferred (pre-existing or out of scope for Story 1.1):**

- [x] [Review][Defer] `MigrationPrompt` and `MIGRATION_QUEUE` are unreachable dead code [src/components/App.tsx:57,141-148,3] — deferred, intentional scaffolding for Story 4.1 (`migration-ritual-prompt-on-app-open`)
- [x] [Review][Defer] `window.innerWidth` read in `useState` initializer with no SSR guard [src/components/App.tsx:156] — deferred, Vite SPA with no SSR planned
- [x] [Review][Defer] Resize listener unthrottled [src/components/App.tsx:160-164] — deferred, low impact for a boolean flip
- [x] [Review][Defer] Resize listener ignores `orientationchange` / `visualViewport` (iOS rotation, on-screen keyboard) [src/components/App.tsx:160-164] — deferred, pre-existing
- [x] [Review][Defer] Two modals (`MigrationPrompt` + `LegendModal`) can be open simultaneously with no mutual exclusion or focus-trap coordination [src/components/App.tsx:141-149] — deferred, MigrationPrompt currently unreachable; revisit with Story 4.1
- [x] [Review][Defer] Bottom Tabs remain interactive while a modal is open [src/components/App.tsx:138,141-149] — deferred, revisit with Story 4.1
- [x] [Review][Defer] Sort comparator yields `NaN` if `ago` is missing/NaN (e.g. older localStorage payload) [src/components/App.tsx:61-63] — deferred, requires type bypass
- [x] [Review][Defer] No deterministic tiebreaker for equal `ago` values [src/components/App.tsx:63] — deferred, polish
- [x] [Review][Defer] Duplicate React keys possible across tabs (`useEntries.newId()` seeded from `Date.now()`) [src/components/App.tsx:109-121] — deferred, multi-tab edge case
- [x] [Review][Defer] `today` captured at render time — header stale across midnight on long-lived tabs [src/components/ViewHeader.tsx:5] — deferred, edge case
- [x] [Review][Defer] Locale hard-coded to `en-GB` for every user [src/components/ViewHeader.tsx:6] — deferred, no i18n in brief
- [x] [Review][Defer] DST-day arithmetic in week calc can produce 23h/25h boundary shifts [src/components/ViewHeader.tsx:11-13] — deferred, subtle edge case
- [x] [Review][Defer] Filter + sort recomputed on every render with no memoization [src/components/App.tsx:60-63] — deferred, optimisation
- [x] [Review][Defer] Sort relies on undocumented `ago` semantics; comment may contradict result [src/components/App.tsx:60-63] — deferred, documentation/type concern
- [x] [Review][Defer] `themeStyle as React.CSSProperties` cast hides real type mismatch [src/components/App.tsx:170] — deferred, useTheme return type concern
- [x] [Review][Defer] `{...entriesCtx}` spread wider than declared `BuJoAppProps` [src/components/App.tsx:173] — deferred, interface drift
- [x] [Review][Defer] Inner content gets stacked padding (`28px 52px` + `0 10px` on `.bj-list` and composer) [src/components/App.tsx:102,108,125] — deferred, minor design polish

**Dismissed as noise (5):** HeaderBar exposing view on mobile (desktop tabs hidden on mobile — false positive); `onResolve` closure inside unreachable migration branch; exact 768px boundary "flicker" (well-defined boundary, intentional); `var(--bj-ink)` no fallback (defined on parent `.bj-app`); inner container at 680–767px viewports (minor, edge of acceptable).

### Review Findings (Re-review 2026-05-28)

Three adversarial layers re-run after post-review fixes. Build clean (45 modules, 0 TS errors). **2 patch, 1 decision-needed, 1 defer, 4 dismissed.**

**Decision needed:**

- [x] [Review][Decision-resolved] **Story AC vs epics/code on max-width** → **A: keep 1048px**. Story AC1 and tasks updated to ~1048px to match epics + code.

**Patches:**

- [x] [Review][Dismissed] **ViewHeader main title uses Inter** — user confirmed Inter is correct for period header title; AC2 updated accordingly (Kalam on entry text/symbols only).
- [x] [Review][Patch] **Stale 680px comment in HeaderBar** — comment updated to 1048px [`HeaderBar.tsx:29`].

**Deferred:**

- [x] [Review][Defer] **Header tabs may overflow at narrow desktop (768–900px)** [`HeaderBar.tsx:30-66`] — deferred, low priority polish; no horizontal scroll or label truncation guard

**Dismissed as noise (4):** ViewHeader `sup` hardcodes Inter string vs `var(--bj-ui-font)` (correct family, token consistency only); sort comment vs comparator direction (pre-existing, documented in prior defer list); Google Fonts CDN latency (pre-existing, working); `100dvh` without `100vh` fallback (accepted modern baseline).
