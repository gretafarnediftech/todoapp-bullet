---
title: "BuJo Todo App — Project Brief"
status: final
created: 2026-05-24
updated: 2026-05-24
author: John (BMAD PM Persona)
---

# BuJo Todo App — Project Brief

## Product Vision

A digital implementation of the Bullet Journal (BuJo) system: a minimal, elegant, and calm personal task management interface that replicates the logic and warmth of a paper BuJo without being a literal paper simulation. The prototype demonstrates how Spec-Driven Development bridges design thinking and implementation. Backend integration is out of scope — all data interactions use mock data.

---

## Target User

A single, individual user — no authentication, no accounts, no collaboration. The user is familiar with analogue organisation systems (planners, notebooks, BuJo) and values clarity and intentionality over feature richness.

[ASSUMPTION] The user is comfortable with the BuJo symbol system (·, X, >, <, ○, –) and does not need onboarding or a tutorial on first open.

---

## Core User Flows

### 1. Add an entry
The user opens the app and can immediately add a new entry by selecting an entry type (task, event, or note) and typing text. No onboarding, no explanation required. The entry appears instantly in the current view.

### 2. Navigate between views
The app has four independent, non-hierarchical views accessible via tabs:
- **Daily** — tasks, events, and notes for today
- **Weekly** — entries for the current week
- **Monthly** — entries for the current month
- **Backlog** — a flat, undated list (Future Log equivalent)

The user switches views using tab navigation. Each view is self-contained.

### 3. Complete a task (· → X)
The user taps or clicks the `·` bullet symbol. An SVG stroke animation "hand-draws" the `X` over the dot (first diagonal, then second). The task text reduces in opacity. The symbol updates to `X`.

### 4. Migrate a task (· → >)
The user marks a task as migrated. The app immediately asks: "When?" — offering the options: today, this week, this month, backlog. The task stays visible in the current view with the `>` symbol and reduced opacity.

### 5. Schedule a task to backlog (· → <)
The user marks a task as scheduled to the backlog. The task moves to the Backlog view and is marked with `<` in the originating view with reduced opacity.

### 6. Delete an entry
The user permanently removes an entry from the list. The deletion is instant with no confirmation dialog. [ASSUMPTION: no undo / soft delete in v1.]

### 7. Migration ritual prompt
On first open each day, week, **or month**, if unresolved tasks exist from the previous period (yesterday's Daily, last week's Weekly, last month's Monthly), the app displays a migration prompt (banner or modal). For each unresolved task, the user chooses: **migrate**, **delete**, or **postpone**. Migrated tasks appear in the current view with `>` and show a `→ destination` tag.

### 8. Filter completed items and notes
A toggle bar allows the user to hide/show completed tasks and separately hide/show notes. Filters persist per session. [ASSUMPTION: filters reset on page reload.]

### 9. Switch colour mode
The user can toggle between **B&W mode** (default, pure black and white) and **Colour mode** (one of 4–5 fixed preset palettes). The theme applies globally across all views.

---

## UI Scope

### In scope (v1 prototype)

| Area | Detail |
|---|---|
| Views | Daily, Weekly, Monthly, Backlog — all four views present and functional |
| Entry types | Task (·), Completed (X), Migrated (>), Scheduled (<), Event (○), Note (–) |
| Entry fields | Symbol, text, creation timestamp (relative format) |
| Interactions | Add, complete, migrate, schedule, delete |
| Animation | SVG hand-drawn X on task completion |
| Migration ritual | Prompt on open if unresolved tasks exist from previous period |
| Filters | Toggle completed items; toggle notes |
| Colour modes | B&W (default) + Colour with 4–5 fixed palettes |
| Visual theme | Kalam font (Google Fonts), ivory/cream background, dot grid texture |
| Responsive | Desktop (centred, max-width ~680px) + Mobile (full-screen, tab nav) |
| UI states | Empty state, Loading state, Error state, Migration prompt |
| Component states | Hover, active, disabled on all interactive elements |
| Data | Mock data only — no backend, no real persistence |

### Out of scope (v1)

- Backend integration or real data persistence
- User authentication and accounts
- Task prioritisation and deadlines
- Advanced filtering, sorting, or search
- Push notifications
- Collaboration or shared lists
- Custom colour picker (free input) — fixed palettes only

The component architecture must not prevent any of these features from being added in future iterations.

---

## Design Constraints

- **Fonts**: Kalam (Google Fonts) — entries, titles, symbols (weights 400, 700); Inter (Google Fonts) — tab labels, metadata, period label (weights 300, 400)
- **Light mode**: off-white background `#F5F4F0`, near-black text `#1A1A1A`, dot grid overlay
- **Dark mode**: near-black background `#141414`, off-white text, CSS grain/noise texture
- **No timestamp on entries** — entries show symbol + text only (+ `→ destination` tag for migrated entries)
- **Entry input inline** — last row of the list (`· Write a task...`), not a separate sticky form
- **Logo**: `.B` top-left corner (Kalam bold)
- **Decorative doodle SVGs** per view: frog (Daily), rocket (Weekly), tree (Monthly), mountains (Future Log)
- **Period header**: small label (Inter, small caps) + large title (Kalam bold) + squiggle SVG underline
- Animations must feel instantaneous — no perceptible delay on any interaction

---

## Success Criteria

| Criterion | Definition of done |
|---|---|
| Prototype coverage | All 4 views functional, all 9 core user flows demonstrable |
| Symbol system | All 6 BuJo symbols rendered and interactive as specced |
| UI states | Empty, loading, error, and migration prompt all implemented and polished |
| Animation | SVG hand-drawn X animation on task completion |
| Responsive | Works on desktop and mobile without layout breakage |
| BMAD artifacts | Project Brief, Component Inventory, User Stories all present and complete |
| README | Setup instructions + AI integration notes documented |

---

## Open Questions / Deferred Decisions

| # | Question | Owner | Revisit condition |
|---|---|---|---|
| 1 | Exact colour palettes for Colour mode (4–5 options) | Design | Before component build phase |
| 2 | Placement of tab nav on mobile: top or bottom? | Design | Before responsive implementation |
| 3 | Should filters persist across sessions (localStorage)? | PM | Before hook implementation |
| 4 | Confirmation dialog on delete? | PM | During story review |
| 5 | Specific animation duration and easing for SVG X | Design | During BulletSymbol component build |
