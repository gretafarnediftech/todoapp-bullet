# Story 2.2: Add a New Entry

Status: ready-for-dev

## Story

As a user,
I want to add a new entry to the current view by selecting a type and typing text,
so that I can record tasks and events in my BuJo without friction.

## Acceptance Criteria

1. **Given** I am in any view **When** I look at the bottom of the entry area **Then** I see the Composer with a type toggle (default `·` task) and a text field.
2. **When** I click the glyph toggle **Then** the type alternates between task (·) and event (○).
3. **When** I type text and press Enter **Then** the new entry appears in the current view's list.
4. **And** the entry shows the correct symbol and the text I typed.
5. **And** the text field is cleared after submit.
6. **And** empty text submissions are ignored (no empty entry created).
7. **And** Composer is disabled during loading and error states.

## Tasks / Subtasks

- [ ] **Verify Composer UI** (AC: 1, 2)
  - [ ] Glyph button toggles `task` ↔ `event` (click or ArrowUp/ArrowDown)
  - [ ] Placeholder: "Write a task…" / "Write an event…"
  - [ ] `WhenChip` visible for scheduling (bonus — not in epic AC but already implemented)

- [ ] **Verify add flow** (AC: 3, 4, 5, 6)
  - [ ] Enter key submits; empty/whitespace ignored
  - [ ] `add(view, type, text, when?)` called from App
  - [ ] New entry gets unique ID, `status: 'active'`, `ago: 0`, `createdAt: Date.now()`
  - [ ] Entry appears in filtered list for current view
  - [ ] Field clears; type resets to `task`

- [ ] **Verify disabled states** (AC: 7)
  - [ ] `disabled={isLoading || hasError}` passed from App
  - [ ] Reduced opacity + `pointer-events: none` when disabled

- [ ] **Manual test all 4 views** (AC: 1–7)
  - [ ] Add task in Daily, Weekly, Monthly, Backlog — each persists on reload
  - [ ] Run `npm run build` — exit 0

## Dev Notes

### Brownfield Project — Composer Fully Wired

Entry creation is **already implemented**. This story verifies behaviour and documents variances from the epic SymbolPicker spec.

**What already works:**
- `src/components/Composer.tsx` — inline composer at bottom of list area
- `src/hooks/useEntries.ts` — `add()` creates entry, persists to localStorage
- `src/components/App.tsx` — passes `onAdd={(type, text, when) => add(view, type, text, when)}`

**Variances from epic (do NOT "fix" unless user requests):**

| Epic spec | Actual |
|---|---|
| `SymbolPicker` compact menu (task/event/note) | Two-state glyph toggle (task/event only) |
| `note` type with `–` symbol | Not in `EntryType` — deferred |
| "Just now" relative timestamp | No relative timestamp; optional `when` if set; new entry at bottom (`ago: 0`) |
| Sticky bottom on mobile | Inline at bottom of scroll column |
| Submit button on mobile | Enter-only submit (no separate button) |

### Add Implementation (reference)

```typescript
// useEntries.add
const entry: Entry = {
  id: newId(), view, type, text,
  ago: 0, status: 'active', createdAt: Date.now(),
  ...(when ? { when } : {}),
}
```

### References

- Story requirements: [Source: epics.md#Story-2.2]
- UX spec: [Source: epics.md#UX-DR9] inline composer as last row
- Composer: [Source: src/components/Composer.tsx]
- Hook: [Source: src/hooks/useEntries.ts] — `add()`
- Story 1.3: disabled during load [Source: 1-3-simulated-loading-state.md]

## Dev Agent Record

### Agent Model Used

(pending)

### Debug Log References

### Completion Notes List

### File List
