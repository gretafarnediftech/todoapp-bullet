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

FR1: User can create a new entry (task or event) in any view by selecting an entry type and typing text
FR2: User can navigate between four independent views: Daily, Weekly, Monthly, Backlog via tab navigation
FR3: User can mark a task as completed (· → X) triggering an SVG hand-drawn animation
FR5: User can unmark a task as completed and revert it to the uncompleted status
FR6: User can permanently delete any entry from the current view
FR7: At 18:00 local hour, if unresolved tasks exist in the current period view (Daily/Weekly/Monthly), a non-blocking end-of-day reminder banner is shown (retried on next 60s tick if the user is in Backlog view). 
FR8: After midnight, on first navigation into a period view in a session, if unresolved tasks from the previous period exist and the view's ritual window is open (Daily: any day; Weekly: Monday or first app-open of the week; Monthly: 1st of month or first app-open of the month), a blocking migration prompt fires — preventing further interaction until all tasks are resolved.
FR9: User can switch between dark and light mode. 
FR10: Each entry displays a symbol, text, and an optional formatted `when` label (time or date) when the entry has a scheduled time
FR11: App displays an empty state when no entries exist in the current view
FR12: App displays a loading state on initial data fetch (simulated 1000ms delay)
FR13: App displays an error state when data retrieval fails (simulated), with a retry action

### NonFunctional Requirements

NFR1: All UI updates are reflected instantly — no perceptible delay on any user interaction
NFR2: All interactive components must implement hover, active, and disabled states
NFR3: Layout must be responsive: desktop (centred layout, max-width ~1048px) and mobile (full-screen)
NFR4: All data interactions use mock data only — no backend integration required
NFR5: Typography — Kalam (Google Fonts) for entries/titles/symbols (weights 400, 700); Inter (Google Fonts) for tab labels, period label, metadata (weights 300, 400)
NFR6: Light mode: off-white background (#F5F4F0), near-black text (#1A1A1A), dot grid texture; Dark mode: near-black (#141414) + CSS grain texture, off-white text
NFR7: The prototype must feel production-ready despite minimal scope

### Additional Requirements

- No router required — view switching managed by local React state (`activeView`)
- CSS custom properties on `:root` used for theming to enable instant palette switching without re-render
- SVG animation for task completion via `stroke-dashoffset` CSS keyframes — no animation library dependency
- Mock data pre-seeded in `src/data/seed.ts` covering all four views
- Project scaffolded with `npm create vite@latest . -- --template react-ts` + Tailwind CSS v3
- Component architecture must not prevent future addition of: auth, priorities, deadlines, filtering, sorting

### UX Design Requirements

UX-DR1: Five BuJo symbols rendered correctly — `·` (task), animated SVG `×` (completed), `>` (migrated), `○` (event), `–` (note)
UX-DR2: Task completion animation — SVG `×` drawn via stroke-dashoffset in two sequential diagonal strokes (~150ms each)
UX-DR3: Completed and migrated entries display text at 28% opacity (dim) — no strikethrough; strikethrough is reserved for `originalText` when an entry was edited
UX-DR4: Entries display symbol + text; optional formatted `when` label (time/date) when set; migrated entries additionally show `→ destination` tag in muted Inter text
UX-DR5: Tab navigation — horizontal tab bar with icon + label (Inter) per tab; icons: ✦ Daily, ≡ Weekly, ⊞ Monthly, ≡ Future Log
UX-DR6: MigrationPrompt — modal for unresolved tasks from previous day, week, OR month
UX-DR7: ThemeSwitcher — Light/Dark toggle (sun/moon icon, top-right); dark mode applies grain/noise CSS texture
UX-DR9: EntryInput inline as the last row of the list — renders as `· Write a task...` placeholder, not a separate sticky form
UX-DR10: All interactive elements implement hover, active, and disabled states (buttons, tabs, bullets, toggles)
UX-DR11: Mobile layout: full-screen list, tab navigation visible at top
UX-DR12: Desktop layout: centred container (max-width ~1048px), horizontal tabs above the list
UX-DR13: EmptyState — contextualised message per view + visual CTA
UX-DR14: LoadingState — `. - >` symbol cycling animation (bullets variant, 380ms) within EntryList
UX-DR15: ErrorState — message + "Try again" retry button, wired to `retryLoad`
UX-DR16: Logo `• Journal` top-left — bullet character + wordmark, both Kalam bold; period header = small label (Inter small caps) + large title (Kalam bold) + squiggle SVG underline
UX-DR17: reminder banner 


### FR Coverage Map

FR1: Epic 2 — Entry creation via EntryInput + SymbolPicker
FR2: Epic 1 — ViewTabs navigation and view-scoped rendering
FR3: Epic 3 — Task completion with SVG animation (BulletSymbol)
FR5: Epic 3 — Unmark task as completed, revert to active (BulletSymbol / EntryActions)
FR6: Epic 2 — Entry deletion via EntryActions
FR7: Epic 4 — End-of-period reminder banner at 18:00 (EndOfPeriodBanner)
FR8: Epic 4 — Blocking migration ritual on period navigation (MigrationPrompt)
FR9: Epic 5 — ThemeSwitcher (dark / light mode)
FR10: Epic 2 — Entry display: symbol + text + optional `when` label (EntryRow)
FR11: Epic 1 — EmptyState component within EntryList
FR12: Epic 1 — LoadingState component + simulated 1000ms delay in useEntries
FR13: Epic 1 — ErrorState component + retryLoad in useEntries

---

## Epic List

### Epic 1: App Foundation & Navigation Shell
Users can open the app, see it load correctly, navigate between the four BuJo views, and encounter the right state (loading, empty, or error) depending on the data situation.
**FRs covered:** FR2, FR11, FR12, FR13

### Epic 2: Entry Management (Core CRUD)
Users can create new entries, view the full list of entries for the active view, and delete entries. Each entry correctly displays its BuJo symbol, text, and optional time/date when set.
**FRs covered:** FR1, FR6, FR10

### Epic 3: Task State Transitions
Users can mark a task as complete with a hand-drawn X animation, or revert it back to active.
**FRs covered:** FR3, FR5

### Epic 4: Migration Ritual
Users are reminded at 18:00 about unresolved tasks and guided through the blocking migration ritual when navigating into a period view after an unresolved period.
**FRs covered:** FR7, FR8

### Epic 5: Visual Theme & Dark/Light Mode
Users experience the full BuJo visual theme (Kalam font, ivory background, dot grid) and can switch between dark and light modes.
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
**Then** I see the app title and a single-column centred layout (max-width ~1048px on desktop)
**And** the Kalam font (Google Fonts) is loaded and applied to all text
**And** the background is ivory/cream (#F5F4F0) with a subtle dot grid texture visible
**And** on mobile (< 768px) the layout is full-width with appropriate horizontal padding
**And** no errors appear in the browser console

**Design Decisions:**
- Vite + React 18 + TypeScript + Tailwind CSS v3 as the tech stack
- Kalam loaded via Google Fonts `<link>` in `index.html`
- Dot grid implemented as an SVG background pattern on a root div
- Tailwind config extended with BuJo colour tokens (`bujo-ivory`, `bujo-ink`, etc.)
- Weekly view header format: `main = "{Month} · Week {N}"` (week-of-month, 1-indexed by Monday); `sup = "Mon DD – Sun DD MMM"` with both months/years shown when the week crosses a calendar boundary

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
- Active tab: ink colour (#1A1A1A), weight 600, full opacity — no underline indicator
- Tab font: Inter uppercase, letter-spacing 0.8, slightly smaller than body

---

### Story 1.3: Simulated Loading State

As a user,
I want to see a loading indicator while the app fetches my entries,
So that I understand the app is working and data is on its way.

**Acceptance Criteria:**

**Given** I open the app
**When** the initial data fetch begins (simulated 1000ms delay in `useEntries`)
**Then** the EntryList area shows the LoadingState component with the message **"Fetching the page…"**
**And** the LoadingState renders in the BuJo aesthetic (minimal, no generic spinner)
**And** the EntryInput and tabs are visible but EntryInput is in disabled state
**When** the 1000ms delay resolves
**Then** the LoadingState is replaced by the actual entry list (or EmptyState if no entries)

**Design Decisions:**
- Loading animation cycles through `. - >` symbols with scale+rotate entrance (380ms interval, `bullets` variant)
- `useEntries` sets `isLoading = true` on mount, resolves after 1000ms with mock data

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
- `retryLoad` in `useEntries` resets `hasError` and re-triggers the 1000ms simulated load
- Error state dev toggle: a small "Simulate error" button visible only in development

---

## Epic 2: Entry Management (Core CRUD)

Users can add new entries (tasks and events) to any view, see the full entry list with correct symbols and optional `when` labels, and delete entries they no longer need.

### Story 2.1: Display Entry List with Mock Data

As a user,
I want to see a pre-populated list of entries when I open the app,
So that I can immediately see the BuJo system in action and understand how entries look.

**Acceptance Criteria:**

**Given** the app has loaded successfully
**When** I view any of the four views
**Then** I see a list of pre-seeded mock entries relevant to that view
**And** each entry displays: a BuJo symbol on the left, the entry text, and a formatted time/date label on the right when `when` is set (no relative creation timestamp)
**And** mock entries include at least one task (·) and one event (○) per view
**And** entries are displayed oldest-first, newest at bottom (BuJo page-fill direction)
**And** the list is scrollable when entries exceed the visible area

**Design Decisions:**
- Mock data sourced from `src/data/seed.ts`, seeded for all 4 views
- Entry row component: `EntryRow.tsx` — symbol (22px fixed width, Kalam 700) + text (flex-grow, `.bj-write`) + optional `when` label via `formatWhen()` (0.45 opacity)
- `ago` field is a sort key only — never displayed as a relative timestamp
- All three columns (symbol, text, right slot) vertically aligned — `align-items: center` on the row grid

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
**Then** a compact menu shows the two addable types: task (·), event (○)
**When** I select a type and type text in the text field then press Enter (or tap a submit button on mobile)
**Then** the new entry appears immediately at the bottom of the current view's list (newest position)
**And** the entry shows the correct symbol and the text I typed (no relative creation timestamp; optional `when` if set via picker)
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

Users can mark a task complete with an animated X, or revert it back to active.

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
**And** the task text transitions to 28% opacity (dim) — no strikethrough
**And** the change is immediate — no server round-trip, no delay
**And** the completed entry remains in the list (not removed) unless the "Hide completed" filter is active

**Given** I see a completed entry with a `×` symbol
**When** I click or tap the `×` bullet
**Then** the symbol reverts to `·` and the entry text returns to full opacity
**And** the reversal is immediate with no animation

**Design Decisions:**
- BulletSymbol uses SVG with `stroke-dasharray` + `stroke-dashoffset` animated via CSS `@keyframes`
- Two `<line>` elements, each animated sequentially via `animation-delay`
- Text styling on completion: `opacity: 0.28` on glyph and entry text only — no strikethrough; the right-side action icons (delete, migrate, etc.) must remain at full opacity regardless of completion state
- `completeEntry(id)` updates the entry symbol to `completed` in `useEntries`
- `uncompleteEntry(id)` in `useEntries` resets status to `active` and symbol to `task`

**Event Completion Animation (Fix 3):**
- Clicking the `○` (event) bullet marks the event as done
- Animation: the circle interior fills with a hand-drawn-style animation — use an SVG `<circle>` with a `fill` that animates from transparent to ink colour, combined with a slight hand-drawn irregularity (e.g. a second slightly-offset stroke around the perimeter, animated similarly to the X strokes via `stroke-dashoffset`, ~200ms total)
- After animation: the circle appears filled (solid ink); event text dims to 28% opacity (same as tasks, no strikethrough)
- The fill animation should feel sequential and organic, consistent with the X drawing animation — not a CSS `opacity` fade
- `completeEntry(id)` already handles `done` status; ensure it works for `type: 'event'` entries as well as `type: 'task'`

---

## Epic 4: Migration Ritual

At 18:00, users are reminded to deal with unresolved tasks via a non-blocking banner. On first navigation into a period view (Daily/Weekly/Monthly), a blocking migration ritual fires if the view's period window is open and unresolved tasks exist from the previous period — preventing further interaction until tasks are resolved.

### Story 4.1: Migration Ritual — Evening Banner & Per-View Blocking Prompt

As a user,
I want to be reminded at 18:00 to deal with unresolved tasks before the day ends, and be required to deal with them when I next open a period view,
So that I consciously close out each period following the BuJo ritual — whether I'm actively using the app or not.

**Acceptance Criteria:**

**--- 18:00 TRIGGER (soft reminder) ---**

**Given** the app is open (or is opened) at or after 18:00
**When** there are active `task` entries in the current period (today's Daily, this week's Weekly, this month's Monthly)
**Then** the `EndOfPeriodBanner` appears immediately at the top of the current view with contextual copy:
  - Daily: "End of day. A new day starts tomorrow. Decide what to do with anything still on the page."
  - Weekly: "End of week. Tomorrow the week resets. Migrate what still matters; let the rest go."
  - Monthly: "End of month. A new month begins. Decide what carries forward — and what doesn't."
**And** the banner has a dismiss (×) button — clicking it hides the banner for the session
**And** the banner is not shown if there are no active tasks in the current period

**--- NAVIGATION TRIGGER (blocking modal, per view) ---**

**Given** the user navigates into a period view (Daily, Weekly, or Monthly) for the first time in a session
**And** the view's ritual window is open:
  - Daily: any day (ritual fires if there are unresolved tasks from before today's midnight)
  - Weekly: today is Monday, OR this is the first app-open since this week started (Monday)
  - Monthly: today is the 1st, OR this is the first app-open since this month started
**When** there are active `task` entries from the previous period for that view (yesterday's Daily, last week's Weekly, last month's Monthly)
**Then** the `MigrationPrompt` modal opens immediately for that view's queue and blocks all interaction — no dismiss, no "Maybe later"
**And** the modal title is **"The morning ritual"** with section header **"Yesterday's leftovers"** (or week/month equivalent)
**And** each unresolved task shows action buttons: **done (×)**, **today**, **migrate (→ submenu)**, **drop**
**And** a badge shows **"N left"** (count of unresolved tasks)
**And** the modal can only be closed once every task has been actioned
**When** I click "today" on a task
**Then** the task is migrated to the Daily view; the original entry gets `>` symbol + `→ today` destination tag
**When** I click "future" on a task
**Then** the task is migrated to the Future Log; the original gets `>` + `→ future` tag
**When** I click "drop" on a task
**Then** the task is permanently removed from the previous period's view
**And** once all tasks are actioned, the modal closes automatically
**And** if there are no unresolved tasks for that view's previous period, the modal is not shown
**And** each view's ritual fires independently — navigating from Daily to Weekly can trigger two separate rituals in the same session

**Design Decisions:**
- `useTimeReminder` hook handles the **18:00 banner only** — single `() => boolean` callback; the session flag is set only when the callback returns `true` (banner actually shown), so being in Backlog view at 18:00 does not consume the slot permanently
- **Ritual trigger is navigation-based**: `useEffect([view, isLoading, entries])` in `BuJoApp` fires on first entry to each period view per session
- `shouldFireRitualForView(view, prevLastOpen)` encodes per-view window rules:
  - Daily: always true (boundary is `createdAt < startOfToday()`)
  - Weekly: `isMonday || prevLastOpen < startOfThisWeek()`
  - Monthly: `isFirstOfMonth || prevLastOpen < startOfThisMonth()`
- `prevLastOpen`: read from `localStorage('bj-last-open')` on mount before overwriting — enables gap detection across app sessions (if last opened before this week/month started, ritual fires even on non-Monday/non-1st days)
- `ritualQueue`: `useState<MigrationItem[]>` captured at modal-open time — never recomputed from live view state while modal is open
- `shownRitualViews`: `useRef<Set<EntryView>>` — each view's ritual fires at most once per session
- `unresolvedFromPreviousPeriod()` in `useEntries` — compares `entry.view` + `createdAt` against the period boundary (`startOfToday/ThisWeek/ThisMonth`)
- `EndOfPeriodBanner` renders above EntryList; dismissed via × only (session only) — no "Review now" button
- `MigrationPrompt` with `canDefer={false}` when opened by the navigation ritual — hides "Maybe later" and disables backdrop dismiss
- Per-task actions: **done (×) / today / migrate (→ submenu) / drop**
- Both banner and ritual use `showBanner` / `migrationOpen` state shape in `App.tsx` — no new global state shape needed

---

## Epic 5: Visual Theme & Dark/Light Mode

Users experience the complete BuJo visual theme throughout the app and can switch between light (default) and dark modes.

### Story 5.1: BuJo Visual Theme Applied

As a user,
I want the app to look and feel like a digital Bullet Journal,
So that the aesthetic matches the calm, minimal, handwritten quality of a paper BuJo.

**Acceptance Criteria:**

**Given** I open the app in light mode (default)
**When** I look at the app
**Then** the background is ivory/cream (#F5F4F0) with a visible but subtle dot grid texture
**And** the Kalam font is applied at the correct weights: 300 for `when` labels/meta, 400 for body text, 700 for titles and symbols
**And** all text is in near-black (#1A1A1A)
**And** there are no heavy drop shadows, gradients, or decorative elements
**And** the visual weight feels minimal, clean, and calm

**Design Decisions:**
- Dot grid: CSS background using an SVG data URI with small circles at regular intervals
- BuJo colour tokens in `tailwind.config.ts`: `bujo-ivory`, `bujo-ink`, `bujo-muted`, `bujo-dim`
- Tailwind `fontFamily` extended with `kalam: ['Kalam', 'cursive']`

---

### Story 5.2: Switch Between Dark and Light Mode

As a user,
I want to toggle between light and dark mode,
So that I can use the app comfortably in different lighting conditions.

**Acceptance Criteria:**

**Given** the app is in light mode (default)
**When** I click the ThemeSwitcher (sun/moon icon)
**Then** the app switches to dark mode
**And** the background becomes near-black (#141414) with a CSS grain/noise texture
**And** all text becomes off-white
**And** the ThemeSwitcher icon updates to reflect the active mode
**When** I click the ThemeSwitcher again
**Then** the app returns to light mode (ivory background #F5F4F0, near-black text #1A1A1A, dot grid texture)
**And** all transitions are immediate with no perceptible delay
**And** the selected mode is persisted to localStorage and restored on next app open

**Design Decisions:**
- `useTheme` hook manages `colorMode: 'light' | 'dark'`
- CSS custom properties on `:root` swapped by `useTheme` to avoid React re-renders
- ThemeSwitcher: moon icon in light mode, sun icon in dark mode — top-right corner on desktop, within AppHeader on mobile
- Dark mode applies CSS grain texture (noise overlay) and swaps dot grid for grain
- Preference stored in `localStorage('bj-theme')`, read on mount before first render
