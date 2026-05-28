---
title: "BuJo Todo App — Component Inventory"
status: final
created: 2026-05-24
updated: 2026-05-28
author: Winston (BMAD Architect Persona)
---

# BuJo Todo App — Component Inventory

## Overview

This document maps all screens, components, user flows, and the component hierarchy for the BuJo Todo App frontend prototype. It is derived from the Project Brief and BuJo Design Specification and serves as the authoritative reference for the Story Creation phase and implementation.

Tech stack: **React 18 + TypeScript + Vite + Tailwind CSS v3 + Kalam (Google Fonts)**. No router required — single-page, view switching managed by local state.

### Brownfield naming map (2026-05-28)

| Spec / inventory name | Actual implementation |
|---|---|
| `BulletEntry` | `EntryRow.tsx` |
| `BulletSymbol` | `Glyph.tsx` |
| `EntryInput` / `SymbolPicker` | `Composer.tsx` (task ↔ event toggle) |
| `EntryTimestamp` / `formatTimestamp.ts` | `formatWhen()` in `EntryRow.tsx`; `ago` sort key only — not displayed |
| `mockEntries.ts` | `data/seed.ts` |
| `ViewTabs` | `Tabs.tsx` + `HeaderBar.tsx` |
| Relative creation timestamp | Optional `when` label when scheduled; no "2h ago" / "Just now" |

---

## Screens

The app has a single HTML page. "Views" are logical states of the same page, not separate routes.

| View ID | View Name | Description |
|---|---|---|
| `daily` | Daily | Entries for today |
| `weekly` | Weekly | Entries for the current week |
| `monthly` | Monthly | Entries for the current month |
| `backlog` | Backlog | Undated flat list (Future Log) |

---

## Data Model

```typescript
type SymbolType = 'task' | 'completed' | 'migrated' | 'scheduled' | 'event' | 'note'
type ViewType = 'daily' | 'weekly' | 'monthly' | 'backlog'

interface Entry {
  id: string           // uuid
  symbol: SymbolType
  text: string
  createdAt: Date
  view: ViewType       // which view this entry belongs to
  migratedTo?: ViewType // only set when symbol === 'migrated'
}

interface AppState {
  activeView: ViewType
  entries: Entry[]
  isLoading: boolean
  hasError: boolean
  showCompleted: boolean
  showNotes: boolean
  colorMode: 'bw' | 'color'
  activeTheme: ThemeKey  // only relevant when colorMode === 'color'
}
```

Symbol-to-character mapping:

| SymbolType | Display character |
|---|---|
| `task` | `·` |
| `completed` | animated SVG `×` |
| `migrated` | `>` |
| `scheduled` | `<` |
| `event` | `○` |
| `note` | `–` |

---

## Component Tree

```
App
├── ThemeSwitcher             [global, always visible]
├── AppHeader                 [app title + current date/period label]
├── ViewTabs                  [tab navigation: Daily / Weekly / Monthly / Backlog]
├── MigrationPrompt           [conditional: shown on open if unresolved tasks exist]
├── FilterBar                 [toggle: hide completed | hide notes]
├── EntryList                 [main content area]
│   ├── LoadingState          [shown while isLoading === true]
│   ├── ErrorState            [shown while hasError === true]
│   ├── EmptyState            [shown when filtered entries.length === 0]
│   └── BulletEntry[]         [one per entry in the active view]
│       ├── BulletSymbol      [SVG-animated symbol, clickable to change state]
│       ├── EntryText         [task / event / note text content]
│       ├── EntryTimestamp    [relative timestamp, e.g. "2h ago"]
│       └── EntryActions      [delete button; migrate options shown on demand]
└── EntryInput                [add new entry form: type selector + text field]
    ├── SymbolPicker          [select entry type before typing]
    └── TextInput             [text field + submit]
```

---

## Component Specifications

### `App`
- Root component. Owns all global state via `useEntries` and `useTheme` hooks.
- Renders the full layout shell.
- On mount: triggers simulated loading (300ms), then checks for migration ritual conditions.
- Props: none (root)
- State: delegated to hooks

### `AppHeader`
- Displays the app title and the current period label.
- Period label examples: "Monday 24 May", "Week 21", "May 2026", "Backlog"
- No interaction.
- Props: `activeView: ViewType`, `date: Date`

### `ViewTabs`
- Horizontal tab bar. Four tabs: Daily | Weekly | Monthly | Backlog.
- Active tab highlighted. Keyboard navigable.
- On desktop: tabs at top of content area.
- On mobile: tabs at top (default; bottom placement is a deferred decision — see Open Questions in Project Brief).
- Props: `activeView: ViewType`, `onChange: (view: ViewType) => void`
- States: default, hover, active/selected, focus-visible

### `ThemeSwitcher`
- Toggle between B&W and Colour mode.
- When in Colour mode, shows a palette selector (4–5 fixed options as coloured dots).
- Positioned: top-right corner on desktop; accessible from header area on mobile.
- Props: `colorMode: 'bw' | 'color'`, `activeTheme: ThemeKey`, `onChange: (mode, theme) => void`
- States: B&W active, Colour active + palette selection visible

### `FilterBar`
- Two toggle buttons: "Hide completed" | "Hide notes".
- Visually compact. Positioned between ViewTabs and EntryList.
- Props: `showCompleted: boolean`, `showNotes: boolean`, `onToggleCompleted: () => void`, `onToggleNotes: () => void`
- States: each toggle on/off

### `MigrationPrompt`
- Banner or inline modal. Shown on app open when unresolved tasks exist from previous period.
- Displays a list of unresolved tasks, one at a time or all at once.
- For each task: three actions — **Migrate** (→ asks "When?"), **Delete**, **Postpone** (dismiss for now).
- Dismissed after all tasks are resolved or the user explicitly closes it.
- Props: `tasks: Entry[]`, `onMigrate: (id, to: ViewType) => void`, `onDelete: (id) => void`, `onPostpone: (id) => void`, `onClose: () => void`
- States: visible / hidden, task list, "When?" sub-prompt

### `EntryList`
- Renders the filtered list of entries for the active view.
- Delegates to `LoadingState`, `ErrorState`, `EmptyState`, or `BulletEntry[]` based on state.
- Props: `entries: Entry[]`, `isLoading: boolean`, `hasError: boolean`, `showCompleted: boolean`, `showNotes: boolean`, `onComplete`, `onMigrate`, `onSchedule`, `onDelete`

### `BulletEntry`
- Single entry row. Contains symbol, text, timestamp, and actions.
- Completed entries: text opacity 45%, symbol = animated SVG X.
- Migrated entries: `>` symbol, text opacity 45%.
- Scheduled entries: `<` symbol, text opacity 45%.
- Props: `entry: Entry`, `onComplete`, `onMigrate`, `onSchedule`, `onDelete`
- States: default, hover (shows delete action), completed, migrated, scheduled

### `BulletSymbol`
- Renders the correct symbol character or SVG animation.
- For `task` symbol: clickable, triggers completion flow.
- For `completed` symbol: SVG with two diagonal strokes animated on mount (stroke-dashoffset animation). Replay on hover.
- For all other symbols: static characters, not interactive (except task-type symbols which open a type-change menu on long press / right click — [ASSUMPTION: out of scope for v1, render static]).
- Props: `symbol: SymbolType`, `animated?: boolean`, `onClick?: () => void`
- States: task (interactive), completed (animated SVG), migrated / scheduled / event / note (static)

### `EntryText`
- Displays the entry text.
- Line-through + opacity 45% when entry is completed, migrated, or scheduled.
- Props: `text: string`, `dimmed?: boolean`

### `EntryTimestamp`
- Displays creation time in relative format.
- Logic: < 1h → "Xm ago"; < 24h → "Xh ago"; yesterday → "yesterday"; older → "D MMM" short date.
- Props: `createdAt: Date`

### `EntryActions`
- Shown on hover (desktop) or via swipe/tap (mobile).
- Delete button: always present.
- Migrate option: shown only for `task` symbol entries.
- Props: `entry: Entry`, `onDelete`, `onMigrate`, `onSchedule`

### `EntryInput`
- Fixed at the bottom of the view (sticky or inline depending on breakpoint).
- Contains: `SymbolPicker` + `TextInput`.
- On submit: calls `addEntry` with selected type and text. Clears input.
- Props: `onAdd: (symbol: SymbolType, text: string) => void`
- States: empty (placeholder visible), typing, symbol-picker open

### `SymbolPicker`
- Compact selector for entry type before adding.
- Default: `task` (·).
- Options: task (·), event (○), note (–). [ASSUMPTION: migrated/scheduled/completed cannot be created directly — they result from actions on existing tasks.]
- Props: `value: SymbolType`, `onChange: (symbol: SymbolType) => void`
- States: collapsed (shows current symbol), expanded (shows options)

### `TextInput`
- Simple text field. Submits on Enter.
- Placeholder: "Add an entry…"
- Props: `value: string`, `onChange`, `onSubmit`
- States: empty, typing, disabled (when isLoading or hasError)

### `LoadingState`
- Full-width placeholder inside EntryList.
- Simulates data fetch: animated skeleton lines in BuJo style.
- No props required.

### `EmptyState`
- Full-width message when no entries exist in the current view (after filtering).
- Message: "Nothing here yet. Add your first entry below."
- Subtle CTA pointing to the EntryInput.
- Props: `view: ViewType` (to contextualise the message per view)

### `ErrorState`
- Full-width error message when `hasError === true`.
- Message: "Something went wrong. Your entries couldn't be loaded."
- Retry button: calls `retryLoad`.
- Props: `onRetry: () => void`

---

## Hooks

### `useEntries()`
Manages all entry CRUD and mock data lifecycle.

```typescript
// Returns:
{
  entries: Entry[]
  isLoading: boolean
  hasError: boolean
  addEntry: (symbol: SymbolType, text: string, view: ViewType) => void
  completeEntry: (id: string) => void
  migrateEntry: (id: string, to: ViewType) => void
  scheduleEntry: (id: string) => void    // moves to backlog, marks as 'scheduled'
  deleteEntry: (id: string) => void
  retryLoad: () => void
  unresolvedFromPreviousPeriod: (view: ViewType) => Entry[]
}
```

Mock behaviour:
- On mount: `isLoading = true` for 400ms, then loads mock entries from `data/mockEntries.ts`
- Error simulation: a dev-only `?error=1` query param (or a toggle in the UI) forces `hasError = true`

### `useTheme()`
Manages colour mode and active palette.

```typescript
// Returns:
{
  colorMode: 'bw' | 'color'
  activeTheme: ThemeKey
  setColorMode: (mode: 'bw' | 'color') => void
  setTheme: (key: ThemeKey) => void
}
```

Applies theme by swapping CSS custom properties on `:root`.

---

## User Flows

### Flow 1: Add an entry
```
User opens app
  → Loading state (400ms)
  → [if migration prompt] → Migration ritual
  → Daily view renders with existing entries
  → User taps EntryInput
  → Selects type in SymbolPicker (default: task)
  → Types text → presses Enter
  → Entry appears at top of list instantly
```

### Flow 2: Complete a task
```
User taps · symbol on a task entry
  → BulletSymbol triggers animation
  → SVG draws first diagonal stroke (~150ms)
  → SVG draws second diagonal stroke (~150ms)
  → Entry text fades to 28% opacity (dim, no strikethrough)
  → Symbol = X (completed)
```

### Flow 3: Migrate a task
```
User hovers BulletEntry → EntryActions visible
  → Taps "Migrate"
  → Inline "When?" prompt appears (Daily / Weekly / Monthly / Backlog)
  → User selects destination
  → Entry symbol → `>`, opacity reduced, stays in current view
  → Entry duplicated in target view as a new `task` entry
```

### Flow 4: Migration ritual on open
```
App opens → isLoading resolves
  → useEntries checks: any task/event entries in previous Daily view (yesterday) with symbol !== completed?
  → If yes: MigrationPrompt renders
  → User acts on each: migrate → flow 3 | delete → deleteEntry | postpone → dismiss entry from prompt
  → After all resolved or prompt closed: normal view renders
```

### Flow 5: Switch colour mode
```
User taps ThemeSwitcher
  → colorMode toggles bw → color
  → Palette selector appears (4 coloured dots)
  → User picks palette
  → CSS custom properties update on :root → all colours update instantly
```

---

## File Structure

```
todo-app/
├── index.html
├── vite.config.ts
├── tailwind.config.ts
├── tsconfig.json
├── package.json
├── src/
│   ├── main.tsx
│   ├── App.tsx
│   ├── types/
│   │   └── entry.ts              ← Entry, SymbolType, ViewType, ThemeKey
│   ├── data/
│   │   └── mockEntries.ts        ← pre-seeded mock entries for all 4 views
│   ├── hooks/
│   │   ├── useEntries.ts
│   │   └── useTheme.ts
│   ├── utils/
│   │   └── formatTimestamp.ts    ← relative timestamp formatting
│   ├── styles/
│   │   └── themes.ts             ← CSS custom property maps for each palette
│   └── components/
│       ├── AppHeader.tsx
│       ├── ViewTabs.tsx
│       ├── ThemeSwitcher.tsx
│       ├── FilterBar.tsx
│       ├── MigrationPrompt.tsx
│       ├── EntryList.tsx
│       ├── BulletEntry.tsx
│       ├── BulletSymbol.tsx
│       ├── EntryText.tsx
│       ├── EntryTimestamp.tsx
│       ├── EntryActions.tsx
│       ├── EntryInput.tsx
│       ├── SymbolPicker.tsx
│       ├── TextInput.tsx
│       ├── LoadingState.tsx
│       ├── EmptyState.tsx
│       └── ErrorState.tsx
├── docs/
│   └── bujo-design-spec.md
└── _bmad-output/
    └── planning-artifacts/
        ├── project-brief.md
        ├── component-inventory.md   ← this file
        └── stories/
```

---

## Design Decisions

| Decision | Choice | Rationale |
|---|---|---|
| No router | Single-page, view = state | 4 views are lightweight; React Router adds overhead with no benefit for this scope |
| Tailwind CSS | Utility-first | Rapid responsive layout; custom BuJo tokens defined in `tailwind.config.ts` |
| CSS custom properties for themes | `:root` variable swap | Instant theme switching without re-render; Tailwind reads from vars |
| SVG animation via stroke-dashoffset | CSS keyframes | Native, dependency-free; precise control over stroke timing per diagonal |
| No animation library | Raw CSS keyframes | Framer Motion is powerful but overkill for two SVG strokes and opacity transitions |
| localStorage for state | Optional / deferred | Keeps prototype simple; can be added to `useEntries` without architecture change |
| Mock entries in a static file | `data/seed.ts` | Predictable, version-controllable, easy to modify during demo |
| Entry sort order | Oldest top, newest bottom (`b.ago - a.ago`) | Matches BuJo page-fill direction per design spec |
| Entry timestamps | Optional `when` label only; `ago` is sort-only | Aligns UX-DR4 with design spec right-slot behaviour |
