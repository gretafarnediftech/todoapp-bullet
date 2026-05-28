# Story 1.2: View Tab Navigation

Status: ready-for-dev

## Story

As a user,
I want to switch between Daily, Weekly, Monthly, and Future Log views using a tab bar,
so that I can access different time horizons for my entries without leaving the page.

## Acceptance Criteria

1. **Given** the app has loaded **When** I look at the header area **Then** I see four tabs labelled "Daily", "Weekly", "Monthly", "Future Log".
2. **And** the "Daily" tab is selected by default with a visually distinct active state (bottom border indicator).
3. **When** I click on "Weekly" **Then** the "Weekly" tab becomes active and the content area updates to show the weekly view; the "Daily" tab is no longer active.
4. **And** only one tab is active at a time.
5. **And** each tab is keyboard-navigable: Tab key moves focus between tabs, Enter and Space activate the focused tab.
6. **And** each tab has a visible `:focus-visible` ring (keyboard-focus outline) distinct from the hover state.
7. **And** each tab has hover and active states.

## Tasks / Subtasks

- [ ] **Add ARIA roles to Tabs component** (AC: 5)
  - [ ] Add `role="tablist"` to the `<nav>` element in `Tabs.tsx`
  - [ ] Add `role="tab"` to each `<button>` element
  - [ ] Add `aria-selected={active}` to each `<button>`
  - [ ] Add `tabIndex={active ? 0 : -1}` to each `<button>` so only the active tab is in the Tab stop sequence; arrow keys move between tabs
  - [ ] Add `onKeyDown` handler to nav: `ArrowRight`/`ArrowLeft` shift focus to the next/prev tab (wrapping), `Home`/`End` jump to first/last

- [ ] **Add focus-visible ring styling** (AC: 6)
  - [ ] In `src/styles/bj.css`, add `.bj-tab:focus-visible` rule with an outline (e.g. `outline: 2px solid var(--bj-ink); outline-offset: 2px; border-radius: 4px;`)
  - [ ] Verify the outline is suppressed on mouse click (`:focus-visible` vs `:focus`)

- [ ] **Verify all ACs pass in browser** (AC: 1–7)
  - [ ] Run `npm run dev`, open browser, confirm: four tabs visible with correct labels, Daily active by default, clicking tabs switches view, keyboard Tab/arrow navigation works, focus ring appears on keyboard focus, no console errors
  - [ ] Run `npm run build` and confirm exit 0, 0 TypeScript errors

## Dev Notes

### Brownfield Project — Tabs Component Already Implemented

This is a **brownfield story**. The `Tabs.tsx` component and its full visual design are already implemented and working. Do NOT recreate or replace existing files — only add ARIA semantics and CSS for focus-visible.

**What already works (do not touch):**
- `src/components/Tabs.tsx` — 4 tabs rendered as `<button>` elements inside `<nav className="bj-tabs">`, active state with bottom indicator, hover via `.bj-tab:hover` in CSS, icons via `TabDaily`/`TabWeekly`/`TabMonthly`/`TabBacklog` from `Doodle.tsx`
- `src/components/HeaderBar.tsx` — renders `<Tabs>` on desktop (inside the 680px column); `App.tsx` renders `<Tabs mobile />` as a sticky bottom bar on mobile
- `src/components/App.tsx` — owns `view` state (`useState<EntryView>('daily')`), passes it to `HeaderBar` and mobile `Tabs`

**What is missing (implement only this):**
- ARIA roles on the `<nav>` and `<button>` elements (currently bare)
- Arrow-key navigation between tabs
- `:focus-visible` CSS ring (currently no focus style at all)

### Tab Labels — "Backlog" vs "Future Log"

The Story 1.2 epic AC (epics.md line ~147) says the 4th tab should be labelled **"Backlog"**. The current `Tabs.tsx` implementation uses `label: 'Future Log'` (matching UX-DR5 which says "icons: ✦ Daily, ≡ Weekly, ⊞ Monthly, ≡ Future Log"). The view type in `entry.ts` is `'backlog'`.

**Decision: keep "Future Log" as the label.** The label is cosmetic; the view ID `'backlog'` is what matters in code. UX-DR5 is the authoritative design spec. The AC wording "Backlog" is a doc inconsistency. Do **not** change the label in `Tabs.tsx`.

### Keyboard Navigation Pattern (WAI-ARIA Tabs)

The WAI-ARIA authoring guide for tabs specifies:
- The tablist has `role="tablist"`
- Each tab has `role="tab"` + `aria-selected`
- Only the active (selected) tab is in the natural Tab sequence (`tabIndex={0}`); others use `tabIndex={-1}`
- Arrow keys move focus between tabs without activating them immediately ("manual activation" pattern is acceptable here; auto-activation on focus is also fine for this simple use case)

Simplest correct approach — **auto-activation on arrow key**:
```tsx
const handleKeyDown = (e: React.KeyboardEvent, currentIdx: number) => {
  const count = VIEWS.length
  let next = -1
  if (e.key === 'ArrowRight') next = (currentIdx + 1) % count
  if (e.key === 'ArrowLeft')  next = (currentIdx - 1 + count) % count
  if (e.key === 'Home')       next = 0
  if (e.key === 'End')        next = count - 1
  if (next >= 0) {
    e.preventDefault()
    onChange(VIEWS[next].id)
    // Focus the button imperatively so :focus-visible activates
    buttonRefs.current[next]?.focus()
  }
}
```

Use `useRef<Array<HTMLButtonElement | null>>([])` for `buttonRefs`. This is the minimal correct implementation.

### Focus-Visible CSS Rule

Add to `src/styles/bj.css` in the Tabs section (near `.bj-tab:hover`):

```css
.bj-tab:focus-visible {
  outline: 2px solid var(--bj-ink);
  outline-offset: 2px;
  border-radius: 4px;
}
```

`var(--bj-ink)` is `#1a1a1a` in light mode, `#f0ede4` in dark mode — it will automatically adapt without extra rules.

### Actual Component Names (Reminder)

| Component Inventory (doc) | Actual file | Notes |
|---|---|---|
| `ViewTabs.tsx` | `Tabs.tsx` | Already implemented |
| `AppHeader.tsx` | `HeaderBar.tsx` | Renders Tabs on desktop |

### Tech Stack (confirmed from Story 1.1)
- React 18.3.1 + TypeScript 5.7.3 + Vite 5.4 + Tailwind CSS 3.4 (via PostCSS)
- No router — view switching via `useState<EntryView>` in `App.tsx`
- Responsive breakpoint: `window.innerWidth < 768` (checked in `App.tsx`)
- BuJo design tokens via CSS custom properties in `src/styles/bj.css`; do NOT add Tailwind tokens

### Project Structure
```
src/
├── components/
│   ├── App.tsx                  ← renders mobile Tabs + owns view state
│   ├── HeaderBar.tsx            ← renders desktop Tabs
│   ├── Tabs.tsx                 ← ADD aria roles + keydown handler here
│   └── doodles/Doodle.tsx       ← tab icon components (read-only)
└── styles/bj.css                ← ADD :focus-visible rule here
```

### Files Expected to Change
- `src/components/Tabs.tsx` — add `role="tablist"`, `role="tab"`, `aria-selected`, `tabIndex`, `onKeyDown`, `buttonRefs`
- `src/styles/bj.css` — add `.bj-tab:focus-visible` rule

### References
- Story requirements: [Source: epics.md#Story-1.2] "each tab is keyboard-navigable (Tab key + Enter/Space to select)"
- UX spec: [Source: epics.md#UX-DR5] "Tab navigation — horizontal tab bar with icon + label (Inter) per tab"
- ARIA pattern: WAI-ARIA Tabs pattern (roving tabindex + arrow keys)
- CSS tokens: [Source: src/styles/bj.css] — use `var(--bj-ink)` for outline colour
- Story 1.1 learnings: [Source: 1-1-app-scaffold-layout-shell.md#Dev-Notes] — Tabs is already in HeaderBar (desktop) and App.tsx (mobile); both pass `view` and `onChange`

## Dev Agent Record

### Agent Model Used

_to be filled by dev agent_

### Debug Log References

_to be filled by dev agent_

### Completion Notes List

_to be filled by dev agent_

### File List

_to be filled by dev agent_

### Change Log

_to be filled by dev agent_
