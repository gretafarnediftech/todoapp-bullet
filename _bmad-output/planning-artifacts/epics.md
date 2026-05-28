---
stepsCompleted: [step-01, step-02, step-03, step-04]
inputDocuments:
  - _bmad-output/planning-artifacts/project-brief.md
  - _bmad-output/planning-artifacts/component-inventory.md
  - docs/bujo-design-spec.md
  - "Product Requirement Document (PRD) — Todo App_ Designer Track.md"
---

# BuJo Todo App - Epic Breakdown

## Overview

This document provides the complete epic and story breakdown for the BuJo Todo App, decomposing the requirements from the PRD, BuJo Design Specification, Project Brief, and Component Inventory into implementable, UI-focused stories with clear acceptance criteria.

---

## Requirements Inventory

### Functional Requirements

FR1: User can create a new entry (task, event, or note) in any view by selecting an entry type and typing text
FR2: User can navigate between four independent views: Daily, Weekly, Monthly, Backlog via tab navigation
FR3: User can mark a task as completed (· → X) triggering an SVG hand-drawn animation
FR4: User can mark a task as migrated (· → >) and choose a destination view via a "When?" prompt
FR5: User can mark a task as scheduled to backlog (· → <), moving it to the Backlog view
FR6: User can permanently delete any entry from the current view
FR7: On app open, if unresolved tasks exist from the previous period, a migration ritual prompt is shown
FR8: User can toggle visibility of completed tasks and notes independently via a filter bar
FR9: User can switch between B&W mode (default) and Colour mode with 4–5 fixed preset palettes
FR10: Each entry displays a symbol (bullet key), text, and creation timestamp in relative format
FR11: App displays an empty state when no entries exist in the current view after filtering
FR12: App displays a loading state on initial data fetch (simulated 400ms delay)
FR13: App displays an error state when data retrieval fails (simulated), with a retry action

### NonFunctional Requirements

NFR1: All UI updates are reflected instantly — no perceptible delay on any user interaction
NFR2: All interactive components must implement hover, active, and disabled states
NFR3: Layout must be responsive: desktop (centred layout, max-width ~680px) and mobile (full-screen)
NFR4: All data interactions use mock data only — no backend integration required
NFR5: Typography — Kalam (Google Fonts) for entries/titles/symbols (weights 400, 700); Inter (Google Fonts) for tab labels, period label, metadata (weights 300, 400)
NFR6: Light mode: off-white background (#F5F4F0), near-black text (#1A1A1A), dot grid texture; Dark mode: near-black (#141414) + CSS grain texture, off-white text
NFR7: The prototype must feel production-ready despite minimal scope

### Additional Requirements

- No router required — view switching managed by local React state (`activeView`)
- CSS custom properties on `:root` used for theming to enable instant palette switching without re-render
- SVG animation for task completion via `stroke-dashoffset` CSS keyframes — no animation library dependency
- Mock data pre-seeded in `src/data/mockEntries.ts` covering all four views
- Project scaffolded with `npm create vite@latest . -- --template react-ts` + Tailwind CSS v3
- Component architecture must not prevent future addition of: auth, priorities, deadlines, filtering, sorting

### UX Design Requirements

UX-DR1: Six BuJo symbols rendered correctly — `·` (task), animated SVG `×` (completed), `>` (migrated), `<` (scheduled), `○` (event), `–` (note)
UX-DR2: Task completion animation — SVG `×` drawn via stroke-dashoffset in two sequential diagonal strokes (~150ms each)
UX-DR3: Completed, migrated, and scheduled entries display text with 45% opacity and line-through
UX-DR4: No timestamp on entries — entries display symbol + text only; migrated entries additionally show `→ destination` tag in muted Inter text
UX-DR5: Tab navigation — horizontal tab bar with icon + label (Inter) per tab; icons: ✦ Daily, ≡ Weekly, ⊞ Monthly, ≡ Future Log
UX-DR6: MigrationPrompt — modal/banner for unresolved tasks from previous day, week, OR month
UX-DR7: ThemeSwitcher — Light/Dark toggle (sun/moon icon, top-right); dark mode applies grain/noise CSS texture
UX-DR8: FilterBar — two independent toggles: "Hide completed" and "Hide notes"
UX-DR9: EntryInput inline as the last row of the list — renders as `· Write a task...` placeholder, not a separate sticky form
UX-DR10: All interactive elements implement hover, active, and disabled states (buttons, tabs, bullets, toggles)
UX-DR11: Mobile layout: full-screen list, tab navigation visible at top
UX-DR12: Desktop layout: centred container (max-width ~680px), horizontal tabs above the list
UX-DR13: EmptyState — contextualised message per view + visual CTA
UX-DR14: LoadingState — animated skeleton lines in BuJo style within EntryList
UX-DR15: ErrorState — message + "Try again" retry button, wired to `retryLoad`
UX-DR16: Logo `.B` top-left (Kalam bold); period header = small label (Inter small caps) + large title (Kalam bold) + squiggle SVG underline
UX-DR17: Decorative doodle SVG per view (bottom-right): frog (Daily), rocket (Weekly), tree (Monthly), mountains (Future Log)

### FR Coverage Map

FR1: Epic 2 — Entry creation via EntryInput + SymbolPicker
FR2: Epic 1 — ViewTabs navigation and view-scoped rendering
FR3: Epic 3 — Task completion with SVG animation (BulletSymbol)
FR4: Epic 3 — Task migration with "When?" prompt (EntryActions)
FR5: Epic 3 — Task scheduling to backlog (EntryActions)
FR6: Epic 2 — Entry deletion via EntryActions
FR7: Epic 4 — Migration ritual prompt on app open (MigrationPrompt)
FR8: Epic 4 — FilterBar toggles (hide completed / hide notes)
FR9: Epic 5 — ThemeSwitcher (B&W / Colour mode)
FR10: Epic 2 — Entry display: symbol + text + timestamp (BulletEntry)
FR11: Epic 1 — EmptyState component within EntryList
FR12: Epic 1 — LoadingState component + simulated 400ms delay in useEntries
FR13: Epic 1 — ErrorState component + retryLoad in useEntries

---

## Epic List

### Epic 1: App Foundation & Navigation Shell
Users can open the app, see it load correctly, navigate between the four BuJo views, and encounter the right state (loading, empty, or error) depending on the data situation.
**FRs covered:** FR2, FR11, FR12, FR13

### Epic 2: Entry Management (Core CRUD)
Users can create new entries, view the full list of entries for the active view, and delete entries. Each entry correctly displays its BuJo symbol, text, and timestamp.
**FRs covered:** FR1, FR6, FR10

### Epic 3: Task State Transitions
Users can change the state of a task — completing it with a hand-drawn X animation, migrating it with a destination prompt, or scheduling it to the Backlog.
**FRs covered:** FR3, FR4, FR5

### Epic 4: Migration Ritual & Filters
Users are guided through the migration ritual when opening the app after an unresolved period, and can filter the list to hide completed items or notes.
**FRs covered:** FR7, FR8

### Epic 5: Visual Theme & Colour Modes
Users experience the full BuJo visual theme (Kalam font, ivory background, dot grid) and can switch between B&W and Colour modes with preset palettes.
**FRs covered:** FR9

---

## Epic 1: App Foundation & Navigation Shell

Users can open the BuJo app, navigate between Daily, Weekly, Monthly, and Backlog views via tab navigation, and see the appropriate UI state (loading while data is being fetched, empty when the view has no entries, and error when retrieval fails with a retry option).

### Story 1.1: App Scaffold & Layout Shell

As a user,
I want to open the BuJo Todo App and see a clean, centred layout,
So that I have a consistent visual container for all views and interactions.

**Acceptance Criteria:**

**Given** I open the app in a browser
**When** the page loads
**Then** I see the app title and a single-column centred layout (max-width ~680px on desktop)
**And** the Kalam font (Google Fonts) is loaded and applied to all text
**And** the background is ivory/cream (#FAFAF7) with a subtle dot grid texture visible
**And** on mobile (< 768px) the layout is full-width with appropriate horizontal padding
**And** no errors appear in the browser console

**Design Decisions:**
- Vite + React 18 + TypeScript + Tailwind CSS v3 as the tech stack
- Kalam loaded via Google Fonts `<link>` in `index.html`
- Dot grid implemented as an SVG background pattern on a root div
- Tailwind config extended with BuJo colour tokens (`bujo-ivory`, `bujo-ink`, etc.)

---

### Story 1.2: View Tab Navigation

As a user,
I want to switch between Daily, Weekly, Monthly, and Backlog views using a tab bar,
So that I can access different time horizons for my entries without leaving the page.

**Acceptance Criteria:**

**Given** the app has loaded
**When** I look at the top of the content area
**Then** I see four tabs labelled "Daily", "Weekly", "Monthly", "Backlog"
**And** the "Daily" tab is selected by default (active state visually distinct)
**When** I click on "Weekly"
**Then** the "Weekly" tab becomes active and the content area updates to show the weekly view
**And** only one tab is active at a time
**And** each tab is keyboard-navigable (Tab key + Enter/Space to select)
**And** each tab has hover and focus-visible states

**Design Decisions:**
- ViewTabs receives `activeView` and `onChange` as props from App
- Active tab: ink colour (#1A1A1A) with bottom border indicator in B&W mode
- Tab font: Kalam 400, slightly smaller than body

---

### Story 1.3: Simulated Loading State

As a user,
I want to see a loading indicator while the app fetches my entries,
So that I understand the app is working and data is on its way.

**Acceptance Criteria:**

**Given** I open the app
**When** the initial data fetch begins (simulated 400ms delay in `useEntries`)
**Then** the EntryList area shows the LoadingState component with the message **"Fetching the page…"**
**And** the LoadingState renders in the BuJo aesthetic (minimal, no generic spinner)
**And** the EntryInput and tabs are visible but EntryInput is in disabled state
**When** the 400ms delay resolves
**Then** the LoadingState is replaced by the actual entry list (or EmptyState if no entries)

**Design Decisions:**
- Skeleton lines use CSS `animate-pulse` (Tailwind) with ivory/dim colours
- `useEntries` sets `isLoading = true` on mount, resolves after 400ms with mock data

---

### Story 1.4: Empty State Per View

As a user,
I want to see a contextualised empty state message when a view has no entries,
So that I understand there is nothing here yet and know how to add my first entry.

**Acceptance Criteria:**

**Given** a view has no entries (after any active filters)
**When** the EntryList renders
**Then** the EmptyState component is displayed
**And** the message reads: "A blank page." (large, Kalam) with a secondary line: "Use the line below to write your first task." (Inter, muted)
**And** a subtle visual cue directs the user toward the inline EntryInput below
**And** the EmptyState is not shown while isLoading is true
**And** the EmptyState is not shown when an error is active

**Design Decisions:**
- EmptyState receives `view: ViewType` prop to customise the message
- CTA is a soft visual cue (arrow or text), not a button

---

### Story 1.5: Error State with Retry

As a user,
I want to see a clear error message when entries fail to load, with a way to retry,
So that I know something went wrong and can attempt to recover without refreshing the page.

**Acceptance Criteria:**

**Given** `hasError === true` in app state (simulated failure)
**When** the EntryList renders
**Then** the ErrorState component is shown in place of the entry list
**And** the primary message reads **"Couldn't load the page."**
**And** a secondary line reads **"Something on our side. The page is fine — it's the fetch that failed."**
**And** a **"Try again"** button is visible
**When** I click "Try again"
**Then** `retryLoad()` is called, `isLoading` becomes true, and the app re-runs the simulated fetch
**And** the error can be triggered via a dev toggle (e.g. `?error=1` query param)

**Design Decisions:**
- `retryLoad` in `useEntries` resets `hasError` and re-triggers the 400ms simulated load
- Error state dev toggle: a small "Simulate error" button visible only in development

---

## Epic 2: Entry Management (Core CRUD)

Users can add new entries (tasks, events, or notes) to any view, see the full entry list with correct symbols and timestamps, and delete entries they no longer need.

### Story 2.1: Display Entry List with Mock Data

As a user,
I want to see a pre-populated list of entries when I open the app,
So that I can immediately see the BuJo system in action and understand how entries look.

**Acceptance Criteria:**

**Given** the app has loaded successfully
**When** I view any of the four views
**Then** I see a list of pre-seeded mock entries relevant to that view
**And** each entry displays: a BuJo symbol on the left, the entry text, and a relative timestamp on the right
**And** mock entries include at least one of each type: task (·), event (○), and note (–)
**And** entries are displayed in reverse-chronological order (newest first)
**And** the list is scrollable when entries exceed the visible area

**Design Decisions:**
- Mock data sourced from `src/data/mockEntries.ts`, seeded for all 4 views
- Entry row: symbol (fixed width, Kalam 700) + text (flex-grow, Kalam 400) + timestamp (fixed width, Kalam 300, muted)

---

### Story 2.2: Add a New Entry

As a user,
I want to add a new entry to the current view by selecting a type and typing text,
So that I can record tasks, events, and notes in my BuJo without friction.

**Acceptance Criteria:**

**Given** I am in any view
**When** I look at the bottom of the screen
**Then** I see the EntryInput with a SymbolPicker (showing `·` by default) and a text field
**When** I click the SymbolPicker
**Then** a compact menu shows the three addable types: task (·), event (○), note (–)
**When** I select a type and type text in the text field then press Enter (or tap a submit button on mobile)
**Then** the new entry appears immediately at the top of the current view's list
**And** the entry shows the correct symbol, the text I typed, and "Just now" as the timestamp
**And** the text field is cleared and focus returns to it
**And** empty text submissions are ignored (no empty entry created)

**Design Decisions:**
- `addEntry(symbol, text, activeView)` is called on submit via the `useEntries` hook
- EntryInput is sticky at the bottom of the viewport on mobile; inline at the bottom of the list on desktop
- SymbolPicker collapsed state shows only the current symbol character

---

### Story 2.3: Delete an Entry

As a user,
I want to delete an entry I no longer need,
So that I can keep my lists clean without migrating everything.

**Acceptance Criteria:**

**Given** I hover over an entry (desktop) or view it (mobile)
**When** the entry is hovered (desktop) or long-pressed / swiped (mobile)
**Then** a delete action becomes visible (trash icon or "×" button)
**When** I click/tap the delete action
**Then** the entry is immediately removed from the list with no confirmation dialog
**And** if it was the last entry in the view, the EmptyState is shown
**And** the deletion is permanent for this session (no undo)

**Design Decisions:**
- EntryActions visible on hover (desktop: CSS `group-hover`); on mobile shown as an inline icon
- No confirmation dialog in v1 (per Project Brief assumption)
- `deleteEntry(id)` called via `useEntries` hook

---

## Epic 3: Task State Transitions

Users can change the state of existing task entries: completing them with an animated X, migrating them forward with a destination prompt, or scheduling them to the Backlog.

### Story 3.1: Complete a Task with SVG Animation

As a user,
I want to mark a task as complete by clicking its bullet, which animates into an X,
So that completing a task feels satisfying and visually distinct from the paper BuJo ritual.

**Acceptance Criteria:**

**Given** I see a task entry with a `·` symbol
**When** I click or tap the `·` bullet
**Then** an SVG animation begins: the first diagonal stroke of the X is drawn (~150ms)
**And** then the second diagonal stroke is drawn (~150ms)
**And** after animation, the symbol is `×` (fully drawn X)
**And** the task text transitions to 45% opacity with a strikethrough
**And** the change is immediate — no server round-trip, no delay
**And** the completed entry remains in the list (not removed) unless the "Hide completed" filter is active

**Design Decisions:**
- BulletSymbol uses SVG with `stroke-dasharray` + `stroke-dashoffset` animated via CSS `@keyframes`
- Two `<line>` elements, each animated sequentially via `animation-delay`
- Text styling: Tailwind `line-through opacity-[0.45]`
- `completeEntry(id)` updates the entry symbol to `completed` in `useEntries`

---

### Story 3.2: Migrate a Task with "When?" Prompt

As a user,
I want to migrate a task to a future view and be asked where to send it,
So that I can reschedule work following the BuJo migration ritual.

**Acceptance Criteria:**

**Given** I hover over a task entry (symbol = `·`)
**When** the EntryActions appear and I click/tap "Migrate"
**Then** an inline "When?" prompt appears with four options: Today (Daily), This Week (Weekly), This Month (Monthly), Backlog
**When** I select a destination
**Then** the current entry's symbol changes to `>` and its text opacity reduces to 45%
**And** the entry remains visible in the current view with the `>` symbol
**And** a new task entry (symbol = `·`) is created in the destination view with the same text
**And** the "When?" prompt closes
**And** if I press Escape or click outside the prompt, it closes without any change

**Design Decisions:**
- "When?" prompt is an inline popover anchored to the EntryActions area
- `migrateEntry(id, destinationView)` handles symbol update + new entry creation in `useEntries`
- Migrate option only shown for entries with symbol = `task`

---

### Story 3.3: Schedule a Task to Backlog

As a user,
I want to mark a task as scheduled (moved to the future log/backlog),
So that I can defer open-ended tasks without specifying an exact date.

**Acceptance Criteria:**

**Given** I hover over a task entry (symbol = `·`)
**When** the EntryActions appear and I click/tap "Schedule to Backlog"
**Then** the current entry's symbol changes to `<` and its text opacity reduces to 45%
**And** the entry remains visible in the current view with the `<` symbol
**And** a new task entry (symbol = `·`) is created in the Backlog view with the same text
**And** the action is immediate with no additional prompt

**Design Decisions:**
- "Schedule to Backlog" is a separate, simpler action from Migrate (no destination choice needed)
- `scheduleEntry(id)` in `useEntries` updates symbol + creates Backlog entry
- The `<` symbol is rendered as a static character (no animation)

---

## Epic 4: Migration Ritual & Filters

On app open, users are prompted to act on unresolved tasks from the previous period. Users can also filter the active view to hide completed tasks or notes.

### Story 4.1: Migration Ritual Prompt on App Open

As a user,
I want to be prompted about unresolved tasks from yesterday (or last week) when I open the app,
So that I consciously decide what happens to carried-over work — just like the paper BuJo ritual.

**Acceptance Criteria:**

**Given** the app has loaded
**When** there are task entries from the previous period (yesterday's Daily, last week's Weekly, last month's Monthly) with symbol `task` (not completed, migrated, or scheduled)
**Then** a **trigger banner** appears at the top of the current view with contextual copy:
  - Daily: "Yesterday ended. Migrate what still matters; let the rest go." + **"Review now"** button
  - Weekly: "End of week. Tomorrow the week resets. Migrate what still matters; let the rest go." + **"Review now"** button
  - Monthly: "New month starting. Migrate what still matters; let the rest go." + **"Review now"** button
**When** I click "Review now"
**Then** a modal opens with title **"The morning ritual"** and section header **"Yesterday's leftovers"** (or week/month equivalent)
**And** the unresolved tasks are listed with three action buttons each: **"today"**, **"future"**, **"drop"**
**And** a badge shows **"N left"** (count of unresolved tasks)
**And** a **"Maybe later"** link dismisses the modal without acting
**When** I click "today" on a task
**Then** the task is migrated to the Daily view; the original entry gets `>` symbol + `→ tomorrow` destination tag
**When** I click "future" on a task
**Then** the task is migrated to the Future Log; the original gets `>` + `→ future` tag
**When** I click "drop" on a task
**Then** the task is removed from the previous period's view permanently
**And** the trigger banner is not shown if there are no unresolved tasks

**Design Decisions:**
- `unresolvedFromPreviousPeriod(view)` in `useEntries` checks daily, weekly, and monthly
- Trigger banner renders above EntryList — not a modal itself, just a banner with "Review now"
- Clicking "Review now" opens the MigrationRitualModal (separate component from the banner)
- Per-task actions are **today / future / drop** (not migrate/delete/postpone)
- Destination tag on migrated entries uses relative label: "→ tomorrow", "→ next week", "→ future"
- "Maybe later" dismisses the modal, banner remains visible but collapsed for the session

---

### Story 4.2: Filter Completed Tasks and Notes

As a user,
I want to hide completed tasks and/or notes from my current view,
So that I can focus on what still needs to be done without distraction.

**Acceptance Criteria:**

**Given** a view has a mix of task, completed, and note entries
**When** I look at the FilterBar below the ViewTabs
**Then** I see two toggle buttons: "Hide completed" and "Hide notes" — both off by default
**When** I toggle "Hide completed" on
**Then** all entries with symbol = `completed`, `migrated`, or `scheduled` are hidden from the list
**And** if no entries remain, the EmptyState is shown
**When** I toggle "Hide notes" on
**Then** all entries with symbol = `note` are hidden from the list
**And** both toggles can be active simultaneously
**When** I toggle either filter off
**Then** the corresponding entries reappear instantly

**Design Decisions:**
- `showCompleted` and `showNotes` are boolean state in App, passed to FilterBar and EntryList
- Filtering is purely presentational — entries are not deleted from state
- Filter state resets on page reload (not persisted in v1 — deferred per Open Questions)

---

## Epic 5: Visual Theme & Colour Modes

Users experience the complete BuJo visual theme throughout the app and can switch between B&W (default) and Colour modes, selecting from preset palettes.

### Story 5.1: BuJo Visual Theme Applied

As a user,
I want the app to look and feel like a digital Bullet Journal,
So that the aesthetic matches the calm, minimal, handwritten quality of a paper BuJo.

**Acceptance Criteria:**

**Given** I open the app in B&W mode (default)
**When** I look at the app
**Then** the background is ivory/cream (#FAFAF7) with a visible but subtle dot grid texture
**And** the Kalam font is applied at the correct weights: 300 for timestamps/meta, 400 for body text, 700 for titles and symbols
**And** all text is in near-black (#1A1A1A)
**And** there are no heavy drop shadows, gradients, or decorative elements
**And** the visual weight feels minimal, clean, and calm

**Design Decisions:**
- Dot grid: CSS background using an SVG data URI with small circles at regular intervals
- BuJo colour tokens in `tailwind.config.ts`: `bujo-ivory`, `bujo-ink`, `bujo-muted`, `bujo-dim`
- Tailwind `fontFamily` extended with `kalam: ['Kalam', 'cursive']`

---

### Story 5.2: Switch Between B&W and Colour Mode

As a user,
I want to toggle between B&W and Colour modes and pick a palette,
So that I can personalise the app's feel while keeping the BuJo aesthetic.

**Acceptance Criteria:**

**Given** the app is in B&W mode (default)
**When** I click the ThemeSwitcher
**Then** the app switches to Colour mode
**And** 4–5 palette option dots are shown (each a small coloured circle)
**When** I click a palette dot
**Then** the app's accent colour updates instantly across all views (tabs, symbols, CTA elements)
**And** the change applies globally — all four views use the same theme
**When** I click the ThemeSwitcher again (back to B&W)
**Then** the colour theme is removed and the app returns to pure black and white
**And** all transitions are immediate with no perceptible delay

**Design Decisions:**
- `useTheme` hook manages `colorMode` and `activeTheme`
- CSS custom properties on `:root` swapped by `useTheme` to avoid React re-renders
- ThemeSwitcher positioned: top-right corner on desktop, within AppHeader on mobile
- Palette colours to be defined during implementation (5 options targeting different tones: warm, cool, sage, terracotta, slate)
