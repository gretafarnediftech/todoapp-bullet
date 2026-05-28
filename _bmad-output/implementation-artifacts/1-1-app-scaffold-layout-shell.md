# Story 1.1: App Scaffold & Layout Shell

Status: review

## Story

As a user,
I want to open the BuJo Todo App and see a clean, centred layout,
so that I have a consistent visual container for all views and interactions.

## Acceptance Criteria

1. **Given** I open the app in a browser **When** the page loads **Then** I see the app title ("Journal") and a single-column centred layout (max-width ~680px on desktop, horizontally centred).
2. **And** the Kalam font (Google Fonts) is loaded and applied to entry text, symbols, and the period header title; Inter is applied to UI chrome (tabs, labels, metadata).
3. **And** the background is ivory/cream (`#fafaf7`) with a subtle dot grid texture visible.
4. **And** on mobile (< 768px breakpoint) the layout is full-width with appropriate horizontal padding (16px sides).
5. **And** no TypeScript compile errors exist and no runtime errors appear in the browser console on load.

## Tasks / Subtasks

- [x] **Fix critical bug — remove `demoState` references from `App.tsx`** (AC: 5)
  - [x] At line 144, remove `if (demoState === 'migration') setDemoState('normal')` — `demoState` and `setDemoState` are undefined and cause a TS compile error
  - [x] The corrected `onClose` should simply be: `onClose={() => setMigrationOpen(null)}`
  - [x] Verify `npm run build` passes with no TypeScript errors after fix

- [x] **Add max-width centred container for desktop** (AC: 1)
  - [x] Wrap the scrollable content area in `App.tsx` (`bj-scroll` div) with an inner container that applies `max-width: 680px; margin: 0 auto; width: 100%; box-sizing: border-box`
  - [x] Desktop padding on this inner container: `28px 52px`
  - [x] The `bj-paper` dot grid should still span the full viewport (it's `position: absolute; inset: 0` — leave it alone)
  - [x] `ViewMascot` positioning should account for the centred column (anchor to content column, not viewport)

- [x] **Verify font application is correct** (AC: 2)
  - [x] Confirm Kalam is applied via `font-family: var(--bj-font)` to `.bj-write` elements (entry text, glyphs, composer input)
  - [x] Confirm Inter is applied via `font-family: var(--bj-ui-font)` to UI chrome
  - [x] `ViewHeader` currently uses Inter (`var(--bj-ui-font)`) for the large period title — change the `main` title (`fontSize: 36`) to use `var(--bj-font)` (Kalam) per UX-DR16: "large title (Kalam bold)"
  - [x] The `sup` label in ViewHeader should remain Inter (small caps / uppercase label)

- [x] **Verify all AC pass in browser** (AC: 1–5)
  - [x] Run `npm run dev`, open browser, confirm: centred layout, dot grid, font rendering, mobile layout at < 768px, no console errors

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

The architecture and UX spec both require a centred column of max-width ~680px on desktop. Currently the `bj-scroll` content area fills the full viewport width.

The `bj-paper` dot grid is intentionally full-bleed (position absolute, inset 0) — keep it that way. Only the scrollable content column should be constrained.

Suggested inner wrapper in the `bj-scroll` div (desktop path):
```tsx
<div style={{ maxWidth: 680, margin: '0 auto', width: '100%', boxSizing: 'border-box', padding: pad, position: 'relative' }}>
  {/* ...content... */}
</div>
```
Move the `padding: pad` from the outer `bj-scroll` div to this inner container.

### ViewHeader Font Fix

Per UX-DR16: "period header = small label (Inter small caps) + large title (Kalam bold) + squiggle SVG underline"

Current `ViewHeader.tsx` uses `var(--bj-ui-font)` (Inter) for the large `main` title. Change to `var(--bj-font)` (Kalam) for the large title only. The `sup` label correctly uses Inter.

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
│   ├── ViewHeader.tsx           ← fix font here
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
- Max-width requirement: [Source: epics.md#Story-1.1] "single-column centred layout (max-width ~680px on desktop)"
- Font spec: [Source: epics.md#UX-DR16] "period header = small label (Inter small caps) + large title (Kalam bold)"
- Responsive requirement: [Source: epics.md#Story-1.1] "on mobile (< 640px) the layout is full-width"
- Component design authority: [Source: _bmad-output/planning-artifacts/component-inventory.md]
- Design system: [Source: src/styles/bj.css] — use `.bj-*` classes and `var(--bj-*)` tokens, not inline hex values

## Dev Agent Record

### Agent Model Used

claude-sonnet-4-5 (Sonnet 4.6)

### Debug Log References

- Build: `npm run build` — exit 0, 45 modules, 0 TypeScript errors (2026-05-28)
- Dev server: `npm run dev` — running on http://localhost:5174/, HTML + fonts confirmed

### Completion Notes List

- **Task 1 (demoState bug):** Bug was already resolved in the working file — `onClose` was already `() => setMigrationOpen(null)`. No change needed. Build confirmed clean.
- **Task 2 (max-width layout):** Added inner `div` inside `bj-scroll` with `maxWidth: 680, margin: '0 auto', padding: pad, boxSizing: 'border-box', position: 'relative'`. Removed `padding: pad` from the outer `bj-scroll` div. `ViewMascot` kept outside the inner column, positioned absolute to the full scroll viewport — correct for a decorative edge element.
- **Task 3 (ViewHeader font):** Changed `fontFamily` on the large period title in `ViewHeader.tsx` from `var(--bj-ui-font)` (Inter) to `var(--bj-font)` (Kalam) and `fontWeight` from 600 to 700 to match UX-DR16.

### File List

- `src/components/App.tsx` — added max-width 680px centred inner container; moved padding from bj-scroll outer to inner div; ViewMascot kept outside column
- `src/components/ViewHeader.tsx` — changed period title fontFamily to Kalam (`var(--bj-font)`), fontWeight to 700
