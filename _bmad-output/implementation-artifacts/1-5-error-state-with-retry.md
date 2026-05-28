# Story 1.5: Error State with Retry

Status: done

## Story

As a user,
I want to see a clear error message when entries fail to load, with a way to retry,
so that I know something went wrong and can attempt to recover without refreshing the page.

## Acceptance Criteria

1. **Given** `hasError === true` in app state (simulated failure) **When** the EntryList renders **Then** the ErrorState component is shown in place of the entry list
2. **And** the primary message reads **"Couldn't load the page."**
3. **And** a secondary line reads **"Something on our side. The page is fine — it's the fetch that failed."**
4. **And** a **"Try again"** button is visible
5. **When** I click "Try again" **Then** `retryLoad()` is called, `isLoading` becomes true, and the app re-runs the simulated fetch
6. **And** the error can be triggered via a dev toggle (e.g. `?error=1` query param)

## Tasks / Subtasks

- [x] **Add `hasError` state and `retryLoad` to `useEntries`** (AC: 1, 5, 6)
  - [x] Add `hasError` boolean state (initially `false`)
  - [x] On initial load: check `?error=1` query param — if present, set `hasError = true` and skip the entry load
  - [x] `retryLoad()`: resets `hasError` to `false`, sets `isLoading` to `true`, re-runs the 400ms simulated fetch; clear entries during load
  - [x] Export `hasError` and `retryLoad` from hook return

- [x] **Wire `hasError` + `ErrorState` in `App.tsx`** (AC: 1, 2, 3, 4, 5)
  - [x] Add `hasError` and `retryLoad` to `BuJoAppProps` interface
  - [x] Import `ErrorState` from `./states/ErrorState`
  - [x] Update render priority in entry list area: `isLoading → hasError → visible.length === 0 → entries`
  - [x] Pass `retryLoad` as `onRetry` to `<ErrorState />`
  - [x] Disable `Composer` when `hasError === true` (pass `disabled={isLoading || hasError}`)
  - [x] Spread `hasError` and `retryLoad` via `{...entriesCtx}` in root `App` (they flow from `useEntries`)

- [x] **Add dev error toggle** (AC: 6)
  - [x] Small "Simulate error" button visible only in development (`import.meta.env.DEV`)
  - [x] Clicking it calls a `simulateError()` function exported from `useEntries` that sets `hasError = true`
  - [x] Position: below the entry list, styled minimally (not part of BuJo UI, clearly a dev tool)

- [x] **Verify all ACs pass** (AC: 1–6)
  - [x] Run `npm run build` — exit 0, 49 modules, 0 TypeScript errors
  - [x] Confirm no linter errors on changed files

## Dev Notes

### Brownfield Context — ErrorState Already Exists

This is a **brownfield story**. `ErrorState.tsx` already exists at `src/components/states/ErrorState.tsx` with:
- Correct primary message: "Couldn't load the page."
- Correct secondary message: "Something on our side. The page is fine — it's the fetch that failed."
- `onRetry` prop already wired to a "Try again" button

**Do NOT recreate or change `ErrorState.tsx`** — it already satisfies ACs 2, 3, 4.

### What is Missing (implement only this)

- `hasError` state + `retryLoad()` + `simulateError()` in `useEntries.ts`
- Wiring in `App.tsx`: import `ErrorState`, extend `BuJoAppProps`, update render priority
- Dev-only "Simulate error" button

### Actual Component Names

| Epic doc | Actual file | Notes |
|---|---|---|
| `EntryList` | inline in `App.tsx` | Render logic lives in `BuJoApp` |
| `useEntries()` | `src/hooks/useEntries.ts` | Add hasError, retryLoad, simulateError |
| `ErrorState` | `src/components/states/ErrorState.tsx` | Already exists — do not touch |

### Error Simulation Pattern

```typescript
// In useEntries — initial load check
useEffect(() => {
  const params = new URLSearchParams(window.location.search)
  if (params.get('error') === '1') {
    setIsLoading(false)
    setHasError(true)
    return
  }
  const timer = setTimeout(() => {
    setEntries(loadEntries())
    setIsLoading(false)
  }, 400)
  return () => clearTimeout(timer)
}, [])

// retryLoad — resets and re-runs the fetch
const retryLoad = useCallback(() => {
  setHasError(false)
  setIsLoading(true)
  setEntries([])
  const timer = setTimeout(() => {
    setEntries(loadEntries())
    setIsLoading(false)
  }, 400)
  // Note: timer cleanup is handled by the re-render cycle
}, [])

// simulateError — dev toggle
const simulateError = useCallback(() => {
  setEntries([])
  setIsLoading(false)
  setHasError(true)
}, [])
```

### Render Priority in App.tsx

```
isLoading  → LoadingState
hasError   → ErrorState (onRetry={retryLoad})
!isLoading && !hasError && visible.length === 0 → EmptyState
!isLoading && !hasError && visible.length > 0   → entry list
```

### Tech Stack

- React 18.3.1 + TypeScript 5.7.3 + Vite 5.4 + Tailwind CSS 3.4
- No test framework — `npm run build` is the verification gate

### Project Structure

```
src/
├── components/
│   ├── App.tsx                  ← extend BuJoAppProps + render priority + dev button
│   └── states/
│       └── ErrorState.tsx       ← already correct, DO NOT TOUCH
└── hooks/
    └── useEntries.ts              ← ADD hasError, retryLoad, simulateError
```

### Files Expected to Change

- `src/hooks/useEntries.ts` — hasError state, retryLoad, simulateError; ?error=1 init logic
- `src/components/App.tsx` — BuJoAppProps extended, ErrorState wired, dev button

### References

- Story requirements: [Source: epics.md#Story-1.5]
- UX spec: [Source: epics.md#UX-DR15] "ErrorState — message + 'Try again' retry button, wired to `retryLoad`"
- Story 1.3 learnings: [Source: 1-3-simulated-loading-state.md] — useEntries isLoading pattern to follow

## Dev Agent Record

### Agent Model Used

claude-sonnet-4-6

### Debug Log References

- Build: `npm run build` — exit 0, 49 modules, 0 TypeScript errors (2026-05-28)

### Completion Notes List

- **Task 1 (useEntries error state):** Added `hasError` boolean state (initially `false`). Initial load effect now checks `?error=1` query param first — if present, sets `hasError = true` and returns early without starting the 400ms timer. `retryLoad()` resets `hasError`/`isLoading`, clears entries, and re-runs the 400ms simulated fetch. `simulateError()` sets `hasError = true` immediately (for dev toggle). All three exported from hook return.
- **Task 2 (App.tsx wiring):** Extended `BuJoAppProps` with `hasError`, `retryLoad`, `simulateError`. Imported `ErrorState`. Updated render priority: `isLoading → hasError → EmptyState → entries`. `Composer` disabled prop updated to `isLoading || hasError`. `simulateError` and `retryLoad` flow via `{...entriesCtx}` spread in root `App`.
- **Task 3 (dev toggle):** `[dev] simulate error` button rendered below the entry list behind `import.meta.env.DEV` guard. Required adding `src/vite-env.d.ts` with `/// <reference types="vite/client" />` (was missing from project).
- **Task 4 (verify):** `npm run build` exit 0. No linter errors.

### File List

- `src/hooks/useEntries.ts` — hasError state, retryLoad, simulateError, ?error=1 init logic
- `src/components/App.tsx` — BuJoAppProps extended, ErrorState imported and wired, dev button
- `src/vite-env.d.ts` — added (was missing; needed for import.meta.env.DEV type)

### Change Log

- 2026-05-28: Story 1.5 implemented — error state with retry, dev toggle, ?error=1 query param support

### Review Findings

- [x] [Review][Decision] Story 4.1 code bundled into 1.5 diff — accepted bundled delivery; 4.1 tracked separately in its own story.
- [x] [Review][Patch] `retryLoad` timer leak and ignored cleanup [`src/hooks/useEntries.ts`] — fixed via shared `loadTimerRef` + `clearLoadTimer`
- [x] [Review][Patch] Initial load timer not cancelled by `simulateError` [`src/hooks/useEntries.ts`] — `simulateError` now clears pending load timer
