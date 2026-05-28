# Story 1.3: Simulated Loading State

Status: done

## Story

As a user,
I want to see a loading indicator while the app fetches my entries,
so that I understand the app is working and data is on its way.

## Acceptance Criteria

1. **Given** I open the app **When** the initial data fetch begins (simulated 400ms delay in `useEntries`) **Then** the EntryList area shows the LoadingState component with the message **"Fetching the page…"**
2. **And** the LoadingState renders in the BuJo aesthetic (minimal, no generic spinner)
3. **And** the EntryInput and tabs are visible but EntryInput is in disabled state
4. **When** the 400ms delay resolves **Then** the LoadingState is replaced by the actual entry list (or EmptyState if no entries)

## Tasks / Subtasks

- [x] **Add simulated loading to `useEntries`** (AC: 1, 4)
  - [x] Add `isLoading` state — `true` on mount, `false` after 400ms
  - [x] Defer initial `loadEntries()` until the timeout resolves (start with empty `entries` array)
  - [x] Export `isLoading` from the hook return value
  - [x] Clean up timeout on unmount

- [x] **Add skeleton variant to `LoadingState`** (AC: 1, 2)
  - [x] Add `skeleton` variant with animated skeleton lines (Tailwind `animate-pulse`, ivory/dim colours via `var(--bj-soft)`)
  - [x] Keep existing "Fetching the page…" copy (Kalam, 18px)
  - [x] Use `skeleton` as the default variant for the entry list loading state

- [x] **Wire loading state in `App.tsx`** (AC: 1, 3, 4)
  - [x] Pass `isLoading` from `useEntries` into `BuJoApp`
  - [x] When `isLoading === true`, render `<LoadingState />` in the entry list area (not EmptyState or entries)
  - [x] When `isLoading === false`, render entry list or EmptyState as before
  - [x] Tabs and header remain visible during loading

- [x] **Disable Composer during loading** (AC: 3)
  - [x] Add optional `disabled?: boolean` prop to `Composer`
  - [x] When disabled: input, glyph toggle, WhenChip, and submit button are non-interactive
  - [x] Pass `disabled={isLoading}` from `App.tsx`

- [x] **Verify all ACs pass** (AC: 1–4)
  - [x] Run `npm run build` — exit 0, 0 TypeScript errors
  - [x] Confirm no linter errors on changed files

## Dev Notes

### Brownfield Project — LoadingState Already Exists

This is a **brownfield story**. `LoadingState.tsx` already exists with `bullets`, `pulse`, and `dots` animation variants and the correct copy ("Fetching the page…"). Do NOT recreate the file — extend it with a `skeleton` variant per epic design decisions.

**What already works (do not touch unless required):**
- `src/components/states/LoadingState.tsx` — bullets/pulse/dots variants + "Fetching the page…" message
- `src/components/states/EmptyState.tsx` — empty state per view (Story 1.4 will refine)
- `src/components/Tabs.tsx` + `HeaderBar.tsx` — tab navigation (Story 1.2)
- `src/hooks/useEntries.ts` — full CRUD with localStorage persistence (loads synchronously today)

**What is missing (implement only this):**
- Simulated 400ms async load in `useEntries` with `isLoading` flag
- LoadingState shown in entry list area during load
- Composer disabled during load
- Skeleton lines variant (epic Design Decision: CSS `animate-pulse` with ivory/dim colours)

### Actual Component Names (Reminder)

| Component Inventory (doc) | Actual file | Notes |
|---|---|---|
| `EntryList` | inline in `App.tsx` | No separate EntryList component — render logic lives in BuJoApp |
| `EntryInput` | `Composer.tsx` | Add `disabled` prop here |
| `useEntries()` | `src/hooks/useEntries.ts` | Add `isLoading` return value |

### Loading Simulation Pattern

```typescript
const [entries, setEntries] = useState<Entry[]>([])
const [isLoading, setIsLoading] = useState(true)

useEffect(() => {
  const timer = setTimeout(() => {
    setEntries(loadEntries())
    setIsLoading(false)
  }, 400)
  return () => clearTimeout(timer)
}, [])
```

CRUD operations (`persist`, `add`, etc.) continue to work on the loaded entries after the initial fetch. Do NOT re-trigger loading on view changes — only on initial mount.

### Render Priority in App.tsx

```
isLoading  → LoadingState
!isLoading && visible.length === 0 → EmptyState
!isLoading && visible.length > 0   → EntryRow list
```

EmptyState must NOT show while `isLoading === true` (Story 1.4 AC also references this).

### Skeleton Variant Design

Epic Design Decision: skeleton lines use Tailwind `animate-pulse` with ivory/dim colours. Mimic entry row layout (glyph column + text line) with 3–4 placeholder rows of varying widths.

Use `var(--bj-soft)` for skeleton fill colour — adapts in dark mode automatically.

### Tech Stack (confirmed from Story 1.1)
- React 18.3.1 + TypeScript 5.7.3 + Vite 5.4 + Tailwind CSS 3.4 (via PostCSS)
- No test framework (vitest/jest not installed) — build + TypeScript compile is the verification gate
- BuJo design tokens via CSS custom properties in `src/styles/bj.css`

### Project Structure
```
src/
├── components/
│   ├── App.tsx                  ← wire isLoading + LoadingState + disabled Composer
│   ├── Composer.tsx             ← ADD disabled prop
│   └── states/
│       └── LoadingState.tsx     ← ADD skeleton variant
└── hooks/
    └── useEntries.ts              ← ADD isLoading + 400ms simulated fetch
```

### Files Expected to Change
- `src/hooks/useEntries.ts` — isLoading state, deferred loadEntries
- `src/components/App.tsx` — LoadingState render branch, pass isLoading + disabled
- `src/components/Composer.tsx` — disabled prop
- `src/components/states/LoadingState.tsx` — skeleton variant

### References
- Story requirements: [Source: epics.md#Story-1.3]
- UX spec: [Source: epics.md#UX-DR14] "LoadingState — animated skeleton lines in BuJo style within EntryList"
- Design spec: [Source: docs/bujo-design-spec.md#Loading-state] bullets/pulse/dots + "Fetching the page…"
- Component inventory: [Source: component-inventory.md#LoadingState] skeleton lines, no props required
- Story 1.2 learnings: [Source: 1-2-view-tab-navigation.md] tabs remain interactive during loading

## Dev Agent Record

### Agent Model Used

claude-sonnet-4-6

### Debug Log References

- Build: `npm run build` — exit 0, 46 modules, 0 TypeScript errors (2026-05-28)

### Completion Notes List

- **Task 1 (useEntries loading):** Added `isLoading` state starting `true` on mount. Initial entries array is empty; `loadEntries()` runs after a 400ms `setTimeout`. Timeout is cleared on unmount. `isLoading` exported from hook return.
- **Task 2 (LoadingState skeleton):** Added `LoadingSkeleton` component with 4 animated placeholder rows (glyph + text line) using Tailwind `animate-pulse` and `var(--bj-soft)`. Set `skeleton` as the default variant. Existing bullets/pulse/dots variants preserved.
- **Task 3 (App wiring):** `BuJoApp` receives `isLoading` via spread from `useEntries`. Render priority: LoadingState → EmptyState → entry list. Header and tabs remain visible during load.
- **Task 4 (Composer disabled):** Added `disabled?: boolean` prop. When disabled, composer uses reduced opacity, `pointer-events: none`, and `disabled` on input/glyph button.
- **Task 5 (verify):** `npm run build` exit 0. No linter errors on changed files. No test framework present — build serves as verification gate.

### File List

- `src/hooks/useEntries.ts` — isLoading state, 400ms deferred loadEntries on mount
- `src/components/App.tsx` — LoadingState render branch, isLoading prop, disabled Composer
- `src/components/Composer.tsx` — disabled prop with non-interactive styling; passes disabled to WhenChip and submit
- `src/components/states/LoadingState.tsx` — skeleton variant as default
- `src/styles/bj.css` — skeleton line CSS classes
- `src/components/pickers/DatePicker.tsx` — WhenChip disabled prop; all trigger/clear buttons respect disabled

### Change Log

- 2026-05-28: Story 1.3 implemented — simulated 400ms loading state with skeleton lines and disabled Composer
- 2026-05-28: Patch — added `disabled` prop to `WhenChip`; WhenChip buttons and submit button now non-interactive (keyboard + mouse) during loading

### Review Findings

**Review scope (2026-05-28, pass 1):** `useEntries.ts`, `App.tsx`, `Composer.tsx`, `LoadingState.tsx`, `bj.css` skeleton CSS. Build: exit 0, 49 modules, 0 TS errors.

- [x] [Review][Patch] WhenChip and submit remain keyboard-focusable while loading [`Composer.tsx:91-94`] — Added `disabled?: boolean` prop to `WhenChip`; all three buttons (trigger, clear, submit) now receive `disabled={disabled}`, removing them from the tab order during loading. Build: exit 0, 0 TS errors.

**Review scope (2026-05-28, pass 2):** Full story implementation (committed + working tree): `useEntries.ts`, `App.tsx`, `Composer.tsx`, `LoadingState.tsx`, `DatePicker.tsx`, `bj.css`. Build: exit 0, 49 modules, 0 TS errors.

- [x] [Review][Defer] Unrelated `bj.css` hunks bundled with Story 1.3 [`bj.css:49,422-425`] — `.bj-tab:focus-visible` and `@keyframes bj-circle-scale-in` belong to other stories (1.2 tabs / 3.1 glyph animation); keep out of the 1-3 commit.
- [x] [Review][Defer] README LoadingState description stale [`README.md:113`] — still lists bullets/pulse/dots only; update when docs are next touched.
