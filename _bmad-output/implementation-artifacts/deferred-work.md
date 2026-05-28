# Deferred Work

Items deferred from BMad reviews. Each entry is real but not actionable at the time it was raised.

## Deferred from: code review of 1-1-app-scaffold-layout-shell (2026-05-28)

- `MigrationPrompt` and `MIGRATION_QUEUE` are unreachable dead code in `App.tsx:57,141-148,3` — intentional scaffolding for Story 4.1 (`migration-ritual-prompt-on-app-open`). Wire up when that story lands.
- `window.innerWidth` is read in the `useState` initializer at `App.tsx:156` with no SSR guard. Vite SPA with no SSR planned; revisit if SSR/prerender or Node-based tests are added.
- Resize listener at `App.tsx:160-164` is unthrottled — every pixel of resize triggers a state setter. Low impact because the boolean rarely flips, but worth `requestAnimationFrame`/`matchMedia` later.
- Resize listener at `App.tsx:160-164` does not subscribe to `orientationchange` or `window.visualViewport`. iOS rotation and on-screen keyboard appearances can leave `isMobile` stale.
- Two modals (`MigrationPrompt` + `LegendModal`) can be open simultaneously at `App.tsx:141-149` with no mutual exclusion, shared z-index policy, or focus-trap coordination. Currently theoretical because `MigrationPrompt` is unreachable; revisit with Story 4.1.
- Bottom `Tabs` bar at `App.tsx:138` remains interactive while a modal is open. Tab presses can change `view` behind the modal. Revisit with Story 4.1 (or sooner if `LegendModal` becomes more prominent).
- Sort comparator at `App.tsx:61-63` yields `NaN` if any entry has a missing/NaN `ago` (e.g. older localStorage payload). Requires a type bypass to trigger.
- No deterministic tiebreaker at `App.tsx:63` for entries with equal `ago` values — display order depends on insertion order.
- Duplicate React keys possible at `App.tsx:109-121`: `useEntries.newId()` seeds from `Date.now()`. Two tabs opened in the same millisecond sharing the same `localStorage` can mint colliding `eN` ids.
- `today` is captured at render time in `ViewHeader.tsx:5`. A tab left open across midnight keeps showing yesterday's date until some unrelated re-render occurs.
- Locale hard-coded to `en-GB` in `ViewHeader.tsx:6`. No i18n in the brief; flag for future scope.
- DST-day arithmetic in `ViewHeader.tsx:11-13` can produce 23h/25h boundary shifts on the last Sunday of October/March; in far-eastern/western timezones this can shift the rendered date by one day.
- Filter + sort at `App.tsx:60-63` runs on every render with no memoization, producing a new array reference each pass and defeating any downstream `React.memo` on `EntryRow`.
- Sort at `App.tsx:60-63` relies on the undocumented invariant that `ago` is monotonically larger for older entries. A refactor that changes `ago` to "ms since epoch" would silently invert the order.
- `themeStyle as React.CSSProperties` cast at `App.tsx:170` hides a real type mismatch — the cast is required because `useTheme().themeStyle` does not satisfy `React.CSSProperties`. Fix the return type of `useTheme` rather than the call site.
- `{...entriesCtx}` spread at `App.tsx:173` is wider than the declared `BuJoAppProps` — additional fields from `useEntries()` pass unchecked, masking refactors that change the hook's surface.
- Inner content gets stacked padding (`28px 52px` on the column + `0 10px` on `.bj-list` and the composer) at `App.tsx:102,108,125`. Narrows the working area more than the Dev Notes figure implies.
