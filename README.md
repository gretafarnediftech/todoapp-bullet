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

### Phase 0 — Domain research and product definition

The starting point was a generic PRD provided as part of the exercise. Because it was intentionally open-ended, the first decision was to pick a specific take rather than build another generic todo app. I chose a **Bullet Journal** — a system I actually wanted for myself, which made me the primary user. Knowing what I wanted removed a lot of ambiguity.

Before opening any code editor I ran a research session with Claude:

- Explored the Bullet Journal method (analog origins, core concepts, symbol system)
- Did a quick market scan of existing digital BuJo apps to understand what was already out there since I wanted to do something different
- Used Claude to write a structured `.md` file capturing my requirements: which features I wanted, which I wanted to leave out, and the visual style I had in mind (handwritten feel, dot-grid paper, minimal chrome)

This document became the seed for everything that followed.

---

### Phase 1 — Project setup and BMAD · PM persona

Initialized the project in Cursor (`npm create vite@latest . -- --template react-ts`) and installed BMAD:

```bash
npx bmad-method install
```

Then activated the **PM persona** to translate my requirements into formal planning artifacts:

- **Project brief** (`_bmad-output/planning-artifacts/project-brief.md`) — product vision, in-scope features, explicit out-of-scope list, success criteria
- **Initial PRD refinement** — structured functional and non-functional requirements, a UX requirements inventory, and a FR coverage map linking each requirement to an epic

After reading the output I realised the documents were technically correct but didn't fully reflect the visual language and UX interactions I had in mind. Rather than forcing the specs forward from text alone, I paused and went back to the design.

---

### Phase 2 — Design exploration and high-fidelity prototype

I explored several tools to find a design workflow that felt fast and expressive:

- **Figma Make** — tried it, useful for layout sketching but not quite for the handcrafted feel I was after
- **ChatGPT** — generated some ideas but the visual output wasn't precise enough
- **Claude Design** — clicked immediately; the conversational iteration loop matched how I think about design

I settled on **Claude Design** and iterated extensively, session by session, until I had:

- All four views (Daily, Weekly, Monthly, Future Log) fully defined at high fidelity
- Every UX interaction specified: inline add, inline edit, inline delete, migration ritual modal, end-of-period banner, theme switcher
- A consistent visual language: Kalam + Inter typefaces, BuJo symbol set (`·` `×` `›` `○`), dot-grid background, dark/light palettes with grain texture

At the end of this phase I exported the final design from Claude Design as a **self-contained HTML file** — a React UMD + Babel prototype with all styles and JSX in a single bundle.

---

### Phase 3 — Design handoff analysis with Cursor

Before writing a single line of production code I gave the exported HTML to Cursor and asked it to analyse the design:

- Read `bujo-app.jsx` (2274 lines) and `Todo App.html` (1340 lines) from the export
- Cross-referenced the existing BMAD specs against the final design and identified **14 corrections** (wrong token values, missing component props, incorrect symbol Unicode, undocumented interaction states)
- Clarified 3 ambiguities interactively (note type semantics, priority field, `originalText` behaviour on edit)
- Updated `docs/bujo-design-spec.md` with exact CSS class names, confirmed hex values (`#fafaf7`, `rgba(0,0,0,0.10)`), and precise interaction rules (e.g. the `canDefer` distinction in the migration modal)

This analysis step was the bridge between the design world and the spec world. It kept the BMAD documents as the single source of truth rather than letting the code diverge from them.

---

### Phase 4 — BMAD spec completion · Architect and Story Writer personas

With a corrected design spec in hand, I returned to BMAD to complete the planning layer:

**Architect persona**
- Generated `_bmad-output/planning-artifacts/component-inventory.md`: screens, full data model (`Entry`, `EntryView`, `EntryStatus`, `EntryType`), component tree with prop signatures, `localStorage` persistence strategy

**Story Writer persona (Epics + Stories)**
- Broke the work into 5 epics and 14 user stories in `_bmad-output/planning-artifacts/epics.md`, each with:
  - Precise UI-focused acceptance criteria
  - Explicit design decisions and edge cases
  - A story file (`_bmad-output/implementation-artifacts/`) generated before each implementation session to give the dev agent full context

| Epic | Title |
|------|-------|
| Epic 1 | Foundation — scaffold, tabs, loading, empty, error states |
| Epic 2 | Entry management — list display, add, delete |
| Epic 3 | Task lifecycle — complete with SVG animation, revert |
| Epic 4 | Migration ritual — end-of-period banner + morning modal |
| Epic 5 | Visual polish — BuJo theme + dark/light mode |

---

### Phase 5 — Implementation with Cursor Agent · story by story

Used Cursor Agent to implement one story at a time, always starting from the story file:

- CSS design system (`src/styles/bj.css`) extracted directly from the prototype's 1100-line `<style>` block — no rewriting, no guessing token values
- Each component follows the structure of the prototype but rewritten in TypeScript with proper typing and split into separate files
- `useEntries` hook with `localStorage` persistence, replacing the prototype's in-memory `useState`

After each story, Cursor ran a structured **code review** (Blind Hunter + Edge Case Hunter layers). Non-blocking findings were logged to `_bmad-output/implementation-artifacts/deferred-work.md` rather than interrupting the sprint.

---

### What I learned

1. **Starting with "I am the user" removes ambiguity** — choosing a domain I knew personally meant I could make fast, confident decisions during spec writing and design. The PRD was generic; the bullet journal take gave it shape.

2. **Design-first, then spec — not the other way round** — running the PM persona before the design was done produced technically valid but emotionally empty docs. The right order for me was: research → design exploration → high-fidelity prototype → spec update → then finish the planning artifacts.

3. **Design handoffs as code beat screenshots** — the exported HTML gave exact token values, interaction logic, and animation keyframes that no image could capture. Cursor could read the actual CSS and JSX, not describe what it saw in a picture.

4. **BMAD artifacts are living documents** — 14 corrections were needed after the design handoff. Updating the specs *before* writing production code prevented those errors from multiplying across every component.

5. **The story file is the real unit of work** — generating a dedicated story file before each implementation session (rather than pointing the agent at the epic document) meant the agent had exactly the right context and didn't hallucinate missing details.

6. **Keep all artifacts in sync or pay for it later** — if the design spec, the story file, and the code diverge even slightly, the agent implements the wrong thing with full confidence. Worse, the code review then flags correct code as wrong (because it's comparing against a stale spec), or misses real bugs (because the spec doesn't reflect what was actually decided). Every time a design decision changed, updating *all* affected documents — spec, epic, story — before resuming implementation was the only way to keep the feedback loop honest.

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
