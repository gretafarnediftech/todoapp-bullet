# Story 5.2: Switch Between Dark and Light Mode

Status: review

## Story

As a user,
I want to toggle between dark and light mode,
so that I can use the app comfortably in different lighting conditions.

## Acceptance Criteria

1. **Given** the app is in light mode (default) **When** I click the ThemeSwitcher (sun/moon icon) **Then** the app switches to dark mode.
2. **And** the background becomes near-black with a grain/noise texture while text becomes off-white.
3. **And** the change applies globally across all four views.
4. **When** I click the ThemeSwitcher again **Then** the app returns to light mode with ivory background, near-black text, and the dot-grid texture.
5. **And** all transitions are immediate with no perceptible delay.
6. **And** the selected mode is persisted to localStorage and restored on next app open.

## Tasks / Subtasks

- [ ] **Simplify `useTheme` hook to dark/light only** (AC: 1, 4, 5, 6) — **MAJOR GAP**
  - [ ] Remove `colorMode` / palette preset state and keep a single `light | dark` mode
  - [ ] Persist the selected mode in `localStorage('bj-theme')`
  - [ ] Restore the saved mode on initial app load
  - [ ] Swap CSS variables via theme style with no perceptible UI delay

- [ ] **Align ThemeSwitcher UI** (AC: 1, 4) — **GAP**
  - [ ] Remove the B&W/Colour button and palette dots from `HeaderBar`
  - [ ] Keep only the sun/moon toggle in the header
  - [ ] Preserve position: top-right desktop, within HeaderBar on mobile

- [ ] **Apply dark mode visuals in `bj.css`** (AC: 2, 3, 4)
  - [ ] Ensure dark mode uses near-black background and off-white ink tokens
  - [ ] Add or restore CSS grain/noise texture for dark mode
  - [ ] Keep light mode dot-grid texture on return to light mode

- [ ] **Remove colour-mode styling and wiring** (AC: 3, 5)
  - [ ] Remove `data-color-mode` usage from the app shell
  - [ ] Remove palette-dot styles and colour-mode-only selectors from `bj.css`

- [ ] **Manual test + build** (AC: 1–6)
  - [ ] Toggle to dark mode — icon, background, text, and texture all update
  - [ ] Reload page — selected mode is restored
  - [ ] Toggle back to light mode — ivory background and dot grid return
  - [ ] Run `npm run build` — exit 0

## Dev Notes

### Brownfield Project — Story Drift to Colour Mode

The approved Epic 5 requirement is **dark/light mode only**, but the current implementation and story artifact drifted into a separate B&W/Colour palette system. This story is now a correction back to the approved scope.

**What exists:**
- `src/hooks/useTheme.ts` — currently contains extra colour-mode and palette state
- `src/components/HeaderBar.tsx` — currently includes both a dark toggle and a separate B&W/Colour control
- `src/styles/bj.css` — currently contains colour-mode selectors and palette-dot styles

**What must be built:**
- Remove colour-mode state and palette selection
- Keep a single dark/light ThemeSwitcher
- Add persistence for the selected theme mode
- Ensure dark mode texture and light mode dot-grid are both correctly applied

**Suggested hook shape:**
```typescript
type ThemeMode = 'light' | 'dark'

// useTheme returns:
{ themeStyle, isDark, toggleDark }
```

**Suggested persistence pattern:**
```typescript
const STORAGE_KEY = 'bj-theme'
const [mode, setMode] = useState<ThemeMode>(() =>
  localStorage.getItem(STORAGE_KEY) === 'dark' ? 'dark' : 'light'
)
```

**Do NOT:**
- Keep the B&W/Colour button or palette dots
- Reintroduce palette presets under a different name
- Omit localStorage persistence, because it is part of the approved story

### References

- Story requirements: [Source: epics.md#Story-5.2]
- FR9: [Source: epics.md#FR9]
- UX spec: [Source: epics.md#UX-DR7] ThemeSwitcher — dark/light toggle
- Current hook: [Source: src/hooks/useTheme.ts]
- HeaderBar toggle: [Source: src/components/HeaderBar.tsx]
- Story 5.1: base theme audit [Source: 5-1-bujo-visual-theme-applied.md]

### Review Findings

- [x] [Review][Patch] localStorage init not wrapped in try/catch — SecurityError crashes React tree on first render in private-browsing Safari and sandboxed iframes [`src/hooks/useTheme.ts:27`]
- [x] [Review][Patch] Side effect (localStorage.setItem) inside setState updater — fires twice in React 18 Strict Mode; move setItem out of updater [`src/hooks/useTheme.ts:31-37`]
- [x] [Review][Patch] Rename `'bw'` → `'light'` throughout — `Palette` type, `PALETTE_DEFS` key, state init, and stored-value branch all still use `'bw'`; spec requires `ThemeMode = 'light' | 'dark'` [`src/types/entry.ts:4`, `src/hooks/useTheme.ts:6–22`]
- [x] [Review][Patch] `palette` still exposed in hook return — spec return shape is `{ themeStyle, isDark, toggleDark }`; remove `palette` from return [`src/hooks/useTheme.ts:40`]
- [x] [Review][Patch] No CSS grain/noise texture for dark mode — AC2 + NFR6 + UX-DR7 all require a grain texture when dark mode is active; none exists in bj.css [`src/styles/bj.css`]
- [x] [Review][Defer] Dark background token `#0f0d0a` vs NFR6 spec `#141414` [`src/hooks/useTheme.ts:15`] — deferred, pre-existing from Story 5.1
- [x] [Review][Defer] Light token color deviations (`#fafaf7` vs `#F5F4F0`, `#0a0a0a` vs `#1A1A1A`) [`src/hooks/useTheme.ts:8-9`] — deferred, pre-existing from Story 5.1
- [x] [Review][Defer] `as React.CSSProperties` type cast suppresses a type error for CSS custom properties [`src/hooks/useTheme.ts:39`] — deferred, pre-existing
- [x] [Review][Defer] No cross-tab storage sync (window `storage` event) — palette diverges between open tabs — deferred, out of scope for this story

## Dev Agent Record

### Agent Model Used

(pending)

### Debug Log References

### Completion Notes List

### File List
