# BuJo Todo App — Design Specification

> Reference document for the design and prototype of a Bullet Journal-inspired Todo App.
> Updated from design handoff (Todo-app-bj) — May 2026.

---

## Context and goal

The app is a digital implementation of the Bullet Journal (BuJo) system. The goal is to replicate the logic and aesthetic of a paper BuJo in a digital interface that feels **minimal, elegant, and clean**, while preserving the warmth of paper and handwriting.

Backend is out of scope: the prototype uses mock data.

---

## Views

The app is organised into **four independent views** (non-hierarchical — each view is self-contained):

| View | ID | Description |
|---|---|---|
| **Daily** | `daily` | Tasks and events for the current day |
| **Weekly** | `weekly` | Tasks and events for the current week |
| **Monthly** | `monthly` | Tasks and events for the current month |
| **Future Log** | `backlog` | Flat list of tasks with no specific date |

Navigation between views uses **tabs** (desktop: top strip; mobile: bottom bar).

---

## Symbol system (Bullet Key)

All symbols live in the same list — tasks and events coexist without separation.

**Entry types:**

| Type | Glyph (active) | Glyph (done) |
|---|---|---|
| `task` | `·` (U+00B7, bold) | SVG × drawn with two animated strokes |
| `event` | `○` (U+25CB, open circle) | `●` (filled circle) |

**Status symbols:**

| Symbol | Status | Note |
|---|---|---|
| `·` / `○` | `active` | Default |
| SVG × | `done` | Animated hand-drawn stroke on completion |
| `›` (U+203A) | `migrated` | Moved to another view or period |
| `‹` (U+2039) | `scheduled` | Scheduled from backlog to a specific period |

There is **no note type** (`–`) in v1.

### Completion animation
Clicking the glyph of an active task triggers the `XGlyph` SVG animation: two strokes drawn sequentially via `strokeDashoffset` transition.

---

## Entry model

```ts
interface Entry {
  id: string
  view: 'daily' | 'weekly' | 'monthly' | 'backlog'
  type: 'task' | 'event'
  text: string
  ago: number          // minutes since creation (used for sorting only, not displayed)
  status: 'active' | 'done' | 'migrated' | 'scheduled'
  when?: string        // HH:MM for daily, YYYY-MM-DD for others
  migratedTo?: string  // relative label, e.g. 'tomorrow', 'this week', 'future log'
  originalText?: string  // previous text shown struck-through above current text
  completedAt?: number
}
```

**Sort order:** oldest first, newest at bottom — `sort((a, b) => b.ago - a.ago)`. This matches how a real BuJo page fills up.

**Opacity:** done / migrated / scheduled entries render at **0.28 opacity** (dim).

---

## Entry row layout

Each row uses a 3-column grid: `22px glyph | 1fr text | auto right-slot`

- **Right slot (default):** shows `when` formatted (e.g. `4:00pm`, `Tue 26`) at 0.45 opacity
- **Right slot (hover/selected):** shows action buttons — Edit (pencil) | Move (chevron, opens MovePicker) | Delete (trash)
- **Delete confirm:** replaces action buttons inline — `"delete? cancel · yes"`
- **Edit mode:** glyph stays; text becomes an `<input>` with the same styling; right slot shows a `WhenChip`
- **`originalText`:** if set and different from `text`, shown struck-through (`opacity: 0.4`) before the current text

**Mobile:** tap on the row body toggles the action strip (no hover). Actions are larger tap targets.

---

## Interactions

### Task completion
- Click/tap the glyph button
- `active` → `done`: triggers XGlyph animation, opacity drops to 0.28
- `done` → `active`: reverts immediately (no animation)
- Events: same toggle but glyph becomes a filled circle (no SVG animation)

### Inline edit
- Click the pencil icon → row enters edit mode
- Enter or click outside commits; Escape cancels
- `originalText` is set to the previous `text` value on commit

### Move (migrate between views)
- Click the chevron/migrate icon → `MovePicker` popover appears
- From Daily: options are "Tomorrow" (special, keeps entry in daily with `›` label), then Weekly / Monthly / Future Log
- From other views: the 3 other views
- Destination labels: `today`, `tomorrow`, `this week`, `this month`, `future log`

---

## Composer (new entry input)

Sits inline at the bottom of the list, separated by a dashed top border.

- **Glyph button:** toggles type (`·` task ↔ `○` event); dim when empty, solid when text is present
- **Text input:** placeholder `"Write a task…"` / `"Write an event…"`; Enter submits
- **When picker:** icon button to the right — opens `TimePicker` for Daily, `DatePicker` for others
  - `TimePicker`: preset chips 7:00→22:00 in 30-min increments
  - `WeekPicker`: 7-day grid for the current week
  - `MonthDatePicker`: calendar grid (locked to current month for Monthly view; free-roam for Backlog)
- **"return ↵" button:** appears when text is non-empty
- Picker popovers are custom (no native `showPicker()`)

---

## Migration ritual

### End-of-period banner (inline)

A banner appears **at the top of the list** when a period is ending (separate from the migration modal):

```
[clock icon]  End of day / End of week / End of month
              "A new day starts tomorrow." / copy per view
              [×] dismiss
```

Copy per view:
- Daily: "End of day" / "A new day starts tomorrow." / "Decide what to do with anything still on the page."
- Weekly: "End of week" / "Tomorrow the week resets." / "Migrate what still matters; let the rest go."
- Monthly: "End of month" / "A new month begins on Monday." / "Decide what carries forward — and what doesn't."

### Migration modal ("The morning ritual")

A full-screen modal triggered at the start of a new period (or when reviewing yesterday's unresolved tasks):

- **Header:** small sup label "The morning ritual", large handwritten title "Yesterday's leftovers", decorative squiggle underline
- **Lead text:** "Nothing carries forward unless you choose it. Mark each item before proceeding."
- **Per-item actions** (decide before Confirm is enabled):
  - `done (×)` — mark as completed
  - `today` — move to today's Daily view (→ today)
  - `migrate →` — opens submenu: "This week" / "This month" / "Future log"
  - `drop` — let it go (trash icon)
- After deciding, the item shows its chosen glyph + an **undo button** (curved arrow)
- **Footer:** "Maybe later" (ghost, left) | "Confirm" (primary, right — disabled until all items decided)
- **Mobile layout:** actions stack below the text (grid becomes 2-row)

### Triggers
- Start of day with unresolved tasks from previous day
- Start of week with unresolved tasks from previous week  
- Start of month with unresolved tasks from previous month

Dismissible with "Maybe later" before all items are resolved (`canDefer` mode); mandatory if `canDefer` is false.

---

## Visual theme

### General aesthetic
- Inspiration: bullet journal paper — clean digital reinterpretation
- Tone: minimal, elegant, calm
- Texture: **dot grid** overlay (CSS `radial-gradient`, 22px spacing)
- Logo: SVG open-book (`LogoBook`) + wordmark "Journal" (top-left header)
- Each view has a **per-view mascot** SVG in the scroll margin — a hand-drawn creature that animates on hover
- Period header: small uppercase label (Inter) + large Kalam title + decorative squiggle underline
- Mobile: tab navigation at the **bottom** (iOS bottom tab bar pattern)

### Typography
- Handwriting font: **Kalam** (Google Fonts) — entry text, glyph symbols, modal titles, composer. Weights: 300, 400, 700
- UI font: **Inter** (Google Fonts) — tab labels, uppercase labels, metadata, action buttons, popovers. Weights: 300, 400, 500, 600, 700

### CSS design system

All styles are namespaced under `.bj-*`. Theme tokens are CSS custom properties applied on the root `.bj-app` element:

| Token | Light (`bw`) | Dark |
|---|---|---|
| `--bj-bg` | `#fafaf7` | `#0f0d0a` |
| `--bj-ink` | `#0a0a0a` | `#f1ebde` |
| `--bj-rule` | `rgba(0,0,0,0.10)` | `rgba(241,235,222,0.16)` |
| `--bj-soft` | `rgba(0,0,0,0.05)` | `rgba(241,235,222,0.06)` |
| `--bj-font` | `'Kalam', system-ui, sans-serif` | same |
| `--bj-ui-font` | `'Inter', -apple-system, system-ui` | same |

The mode toggle (sun/moon icon in the header) switches between the two palettes globally and instantly.

### Data attributes on `.bj-app`
- `data-grid="dot"` → dot paper background
- `data-mobile="1"` → mobile layout adaptations (font-size 14px, tab bar bottom, larger tap targets)

---

## Loading state

Three animation variants (default: `bullets`):
- **bullets**: cycles through BuJo symbols (· × – › ○) with scale+rotate entrance animation, 380ms interval
- **pulse**: single `·` with expanding concentric rings
- **dots**: three `·` bouncing in sequence

Copy: "Fetching the page…" (Kalam, 18px)

---

## Error state

- Large `!` mark (rotated −8°, opacity 0.18)
- Heading: "Couldn't load the page."
- Body: "Something on our side. The page is fine — it's the fetch that failed."
- Button: "Try again" (primary)

---

## Empty state

- Notebook SVG illustration
- Heading: "A blank page."
- Body: "Use the line below to write your first {task / thing for this week / thing for this month / future-log entry}."
- Animated down arrow pointing toward the Composer

---

## Legend modal

Opens from an info icon button in the header. Shows:
1. "QUICK RECAP" / "The bullet key" — table of all symbols
2. "The ritual" — explanation of migration

---

## Responsive design

| Breakpoint | Layout |
|---|---|
| Desktop (≥ 768px) | Tabs at top, max-width centred layout, entry hover actions visible |
| Mobile (< 768px) | `data-mobile="1"`, tab bar fixed at bottom, row tap toggles action strip |

Desktop artboard reference: 1280 × 860px, content padding `52px` horizontal.
Mobile artboard reference: 402 × 830px (inside iOS device frame), content padding `16px` horizontal.

---

## Required UI states

| State | Trigger |
|---|---|
| **normal** | Default — entries list + composer |
| **empty** | No entries in current view |
| **loading** | Simulated async fetch |
| **error** | Simulated fetch failure |
| **reminder** | End-of-period banner visible (deferrable) |
| **migration** | Migration modal open (mandatory or deferrable) |

---

## Out of scope (v1)

- Backend and real data persistence
- User accounts
- Push notifications
- Collaboration
- Advanced filtering beyond hide/show done
