# BuJo · Journal — Todo App Prototype

A Bullet Journal-inspired Todo App built with BMAD + Cursor as part of the Spec-Driven Development (SDD) exercise.

---

## Quick start

```bash
npm install
npm run dev
```

Opens at `http://localhost:5173`.

```bash
npm run build    # production build
npm run preview  # preview build
```

---

## What this is

A working frontend prototype of a digital Bullet Journal. It runs entirely in the browser with mock data (no backend). State is persisted to `localStorage` so your entries survive page refreshes.

### Core features

- **Four views** — Daily, Weekly, Monthly, Future Log — each a self-contained list
- **Bullet Key** — `·` task, SVG × done, `›` migrated, `○` event
- **Inline add** — composer at the bottom of each list; `↑`/`↓` to toggle task/event type
- **Inline edit** — click the pencil icon; Enter commits, Escape cancels; original text shown struck-through
- **Inline delete** — click trash → confirm in place (`delete? cancel · yes`)
- **Move to view** — chevron icon opens a "Move to…" popover with all destination views
- **When picker** — time picker for Daily, date picker (week/calendar) for other views
- **Migration ritual** — "The morning ritual" modal: decide the fate of each unresolved item (done / today / migrate → / drop) before proceeding
- **End-of-period banner** — non-intrusive reminder at the top of the list when a period is ending
- **Light / Dark mode** — toggle via the sun/moon icon in the header
- **Dot-grid paper** background — CSS `radial-gradient`, 22 px spacing
- **Per-view mascots** — hand-drawn SVG creatures in the scroll margin with hover animations
- **Demo state switcher** — floating strip at the bottom-left to preview all UI states (normal / empty / loading / error / reminder / migration)
- **Responsive** — desktop ≥ 768 px (tabs in header), mobile < 768 px (bottom tab bar, tap to reveal actions)

---

## How I used BMAD and Cursor

### Step 1 — BMAD for spec generation

Installed BMAD-METHOD (`npx bmad-method install`) and ran through three personas:

1. **PM persona** — refined the initial PRD into a focused product brief (`_bmad-output/planning-artifacts/project-brief.md`) with clear scope, out-of-scope list, and success criteria
2. **Architect persona** — generated a component inventory (`_bmad-output/planning-artifacts/component-inventory.md`) with screens, data model, component tree, and prop specs
3. **Story Writer persona** — broke work into 7 user stories with UI-focused acceptance criteria and design decisions (`_bmad-output/planning-artifacts/epics.md`)

The design spec (`docs/bujo-design-spec.md`) started as a brainstorm and was progressively updated as new design inputs arrived (BuJo markdown spec → HTML mockups from Figma export → final handoff bundle).

### Step 2 — Design handoff analysis

The design was delivered as a Claude Design handoff (`todo-app-bj`): a self-contained HTML prototype with React UMD + Babel (no bundler). Before touching any production code, I used Cursor to:

- Read the full `bujo-app.jsx` (2274 lines) and `Todo App.html` (1340 lines) from the zip
- Identify all differences between the existing BMAD specs and the final design (14 corrections documented in the plan)
- Clarify 3 ambiguities with the user (note type, priority field, `originalText`)
- Update `docs/bujo-design-spec.md` with confirmed token values, exact CSS class names, correct symbol Unicode, and interaction details

### Step 3 — Cursor for implementation

Used Cursor Agent to translate the spec into production React + TypeScript:

- CSS design system (`src/styles/bj.css`) extracted directly from the prototype's 1100-line `<style>` block
- Components follow the same structure as the prototype but in TypeScript with proper typing
- All SVG doodles (mascots, tab icons, action icons) ported from JSX to `.tsx`
- `useEntries` hook with localStorage persistence replacing the prototype's in-memory `useState`

### What I learned

1. **Spec-first pays off** — having a detailed component inventory before coding meant no architectural surprises during implementation. Every component was already named and its props were known.

2. **Design handoffs as code are better than screenshots** — reading the actual CSS and JSX gave exact token values (`#fafaf7`, `rgba(0,0,0,0.10)`) and interaction logic (e.g. the migration `canDefer` distinction) that no screenshot could convey.

3. **BMAD artifacts are living documents** — the specs needed 14 corrections after the final design handoff. Updating them *before* writing production code prevented those errors from multiplying across many files.

4. **The prototype's structure ≠ the production structure** — the handoff used React UMD + Babel (no bundler, one 2000-line file). Production code uses Vite, TypeScript, and separate files. Cursor helped translate patterns without copying the prototype's architecture.

---

## Project structure

```
src/
  types/entry.ts          # Entry, EntryView, EntryStatus, EntryType, DemoState
  data/seed.ts            # SEED_ENTRIES, MIGRATION_QUEUE (mock data)
  hooks/
    useEntries.ts         # CRUD + localStorage persistence
    useTheme.ts           # palette (bw|dark) + CSS token application
  styles/bj.css           # BuJo design system (.bj-* classes, @keyframes)
  components/
    App.tsx               # Root + BuJoApp (responsive wrapper)
    HeaderBar.tsx         # Logo + desktop tabs + icon buttons
    Tabs.tsx              # Desktop strip + mobile bottom bar
    ViewHeader.tsx        # Period title + squiggle underline
    EntryRow.tsx          # Row with inline edit, hover actions, delete confirm
    Composer.tsx          # Inline new-entry input + when picker toggle
    MigrationPrompt.tsx   # "The morning ritual" modal
    EndOfPeriodBanner.tsx # End-of-period reminder banner
    LegendModal.tsx       # Bullet key info modal
    Glyph.tsx             # XGlyph (animated), EventDot, Glyph dispatcher
    doodles/Doodle.tsx    # All SVG marks (tab icons, mascots, action icons, etc.)
    pickers/DatePicker.tsx # TimePicker, WeekPicker, MonthDatePicker, WhenChip
    states/
      EmptyState.tsx
      LoadingState.tsx    # bullets / pulse / dots variants
      ErrorState.tsx
```

---

## BMAD artifacts

| File | Description |
|---|---|
| `_bmad-output/planning-artifacts/project-brief.md` | Product vision, scope, success criteria |
| `_bmad-output/planning-artifacts/component-inventory.md` | Screens, data model, component tree |
| `_bmad-output/planning-artifacts/epics.md` | 7 user stories with acceptance criteria |
| `docs/bujo-design-spec.md` | Final design specification (aligned to handoff) |

---

## Tech stack

- **React 18** + **TypeScript 5**
- **Vite 5** (dev server + build)
- **Tailwind CSS 3** (utility classes — minimal use; design system is `.bj-*` CSS vars)
- **Google Fonts** — Kalam (handwriting) + Inter (UI)
- No external UI library, no icon library — all SVGs are hand-drawn inline
