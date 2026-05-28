# Story 1.5: Error State with Retry

Status: done

## Story

As a user,
I want to see a clear error message when entries fail to load, with a way to retry,
so that I know something went wrong and can attempt to recover without refreshing the page.

## Acceptance Criteria

1. **Given** `hasError === true` in app state **When** the EntryList renders **Then** the ErrorState component is shown in place of the entry list.
2. **And** the primary message reads **"Couldn't load the page."**
3. **And** a secondary line reads **"Something on our side. The page is fine — it's the fetch that failed."**
4. **And** a **"Try again"** button is visible.
5. **When** I click "Try again" **Then** `retryLoad()` is called, `isLoading` becomes true, and the app re-runs the simulated 400ms fetch.
6. **And** the error can be triggered via `?error=1` query param.
7. **And** a dev-only "Simulate error" control is visible in development mode.

## Tasks / Subtasks

- [ ] **Verify ErrorState component copy** (AC: 2, 3, 4)
  - [ ] Confirm exact strings in `ErrorState.tsx` match AC
  - [ ] Confirm `bj-btn-primary` styling on retry button

- [ ] **Verify `useEntries` error simulation** (AC: 1, 5, 6)
  - [ ] `?error=1` on mount sets `hasError=true`, skips load
  - [ ] `retryLoad()` clears error, sets `isLoading=true`, reloads after 400ms
  - [ ] `simulateError()` dev helper sets error state

- [ ] **Verify App wiring** (AC: 1, 5, 7)
  - [ ] ErrorState receives `onRetry={retryLoad}`
  - [ ] Composer disabled when `hasError` (already: `disabled={isLoading || hasError}`)
  - [ ] Dev simulate button visible only when `import.meta.env.DEV`
  - [ ] Tabs/header remain visible during error

- [ ] **Manual verification** (AC: 1–7)
  - [ ] Open `/?error=1` — ErrorState shown, no entries
  - [ ] Click "Try again" — LoadingState flash, then entries load
  - [ ] In dev mode, click "[dev] simulate error" — ErrorState appears
  - [ ] Run `npm run build` — exit 0

## Dev Notes

### Brownfield Project — Error Flow Already Implemented

This is a **verification story**. `ErrorState.tsx`, `useEntries` error handling, and App wiring already exist.

**What already works:**
- `src/components/states/ErrorState.tsx` — correct copy + retry button
- `src/hooks/useEntries.ts` — `hasError`, `retryLoad()`, `simulateError()`, `?error=1` URL param
- `src/components/App.tsx` — ErrorState branch, dev simulate button, Composer disabled on error

**Do NOT:**
- Add a real backend or fetch API — mock-only per NFR4
- Show EmptyState or entry list while `hasError === true`

### Error Simulation Pattern

```typescript
// On mount — URL param check
if (params.get('error') === '1') { setHasError(true); setIsLoading(false); return }

// retryLoad — re-triggers 400ms simulated fetch
setHasError(false); setIsLoading(true); setEntries([])
setTimeout(() => { setEntries(loadEntries()); setIsLoading(false) }, 400)
```

### Render Priority

```
isLoading  → LoadingState
hasError   → ErrorState
visible.length === 0 → EmptyState
else       → EntryRow list
```

### References

- Story requirements: [Source: epics.md#Story-1.5]
- UX spec: [Source: epics.md#UX-DR15] message + retry wired to `retryLoad`
- Hook: [Source: src/hooks/useEntries.ts#L100-132]
- Component: [Source: src/components/states/ErrorState.tsx]
- App wiring: [Source: src/components/App.tsx#L113-114,L138,L143-161]

## Dev Agent Record

### Agent Model Used

(pending)

### Debug Log References

### Completion Notes List

### File List
