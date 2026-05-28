# Sprint Change Proposal — Time-Based Reminder Triggers
**Date:** 2026-05-28
**Author:** Gretafarnedi
**Status:** Approved

---

## Section 1: Issue Summary

**Problem statement:** Story 4.1 ("Migration Ritual Prompt on App Open") specified the migration ritual trigger as "on app open" without defining any time-based logic. This left the timing of both the end-of-day reminder and the blocking migration modal undefined and unimplemented. The requirement has now been clarified: the two existing UI components (`EndOfPeriodBanner` and `MigrationPrompt`) must be triggered at specific times of day, immediately in-session.

**Discovery context:** Identified during sprint review of the current implementation. The components exist in code but `setMigrationOpen` is never called and `EndOfPeriodBanner` is never rendered — the wiring was deferred because timing had not been specified.

---

## Section 2: Impact Analysis

**Epic impact:**
- Epic 4 (Migration Ritual & Filters) — Story 4.1 significantly rewritten. Story 4.2 (filters) unaffected. No other epics affected.

**Story impact:**
- Story 4.1 — title, description, acceptance criteria, and design decisions all updated.
- No other stories require changes.

**Artifact conflicts resolved:**
- `epics.md` — FR7, Epic 4 description, Story 4.1 (title, story, AC, design decisions) updated.
- `project-brief.md` — Core User Flow 7 updated.

**Technical impact:**
- New `useTimeReminder` hook required — runs `setInterval` every 60s, checks against 18:00 and 00:01 thresholds.
- `unresolvedFromPreviousPeriod()` utility needed in `useEntries` — compares entry view + creation date against previous calendar period.
- `App.tsx` needs `showBanner` state wired to `EndOfPeriodBanner` render.
- `MigrationPrompt` needs `canDefer={false}` path to disable dismiss when opened by the 00:01 trigger.
- No new global state shape — uses existing `showBanner` / `migrationOpen` patterns.

---

## Section 3: Recommended Approach

**Selected path:** Option 1 — Direct Adjustment (modify Story 4.1, add implementation tasks).

**Rationale:** The components already exist. The change is purely additive — wire up time logic that was always intended but never specified. No rollback needed, no MVP scope change required. Effort is low, risk is low.

**Effort estimate:** Low
**Risk level:** Low
**Timeline impact:** None — Story 4.1 was not yet implemented.

---

## Section 4: Detailed Change Proposals

### Change 1 — `epics.md` · FR7
**Old:** "On app open, if unresolved tasks exist from the previous period, a migration ritual prompt is shown"
**New:** Two explicit time-based triggers: 18:00 (non-blocking banner) and 00:01 (blocking modal).

### Change 2 — `epics.md` · Story 4.1 title + description
**Old:** "Migration Ritual Prompt on App Open" / prompted on open
**New:** "Migration Ritual — Time-Triggered Banner & Blocking Prompt" / triggered at 18:00 and 00:01

### Change 3 — `epics.md` · Story 4.1 Acceptance Criteria
**Old:** Single "given app has loaded" trigger with "Maybe later" dismiss.
**New:** Two separate AC blocks — 18:00 (banner, dismissible via ×) and 00:01 (blocking modal, no dismiss until all tasks actioned).

### Change 4 — `epics.md` · Story 4.1 Design Decisions
**Old:** `unresolvedFromPreviousPeriod()` + banner with "Review now" + "Maybe later".
**New:** `useTimeReminder` hook with 60s interval; `canDefer={false}` on 00:01 modal; no "Review now" on banner.

### Change 5 — `project-brief.md` · Core User Flow 7
**Old:** "On first open each day/week/month..."
**New:** 18:00 dismissible banner + 00:01 blocking modal, both fire immediately in-session.

---

## Section 5: Implementation Handoff

**Change scope:** Minor — direct implementation by Developer agent.

**Handoff:** Developer agent (Amelia / `bmad-dev-story`)

**Responsibilities:**
1. Create `useTimeReminder` hook — `setInterval` every 60s, compares `new Date().getHours()` + `new Date().getMinutes()` against thresholds; fires callbacks on first crossing per session.
2. Add `unresolvedFromPreviousPeriod()` to `useEntries` — checks entries by view + date.
3. Wire `showBanner` state in `App.tsx` → render `EndOfPeriodBanner`.
4. Wire `migrationOpen: 'ritual'` trigger in `App.tsx` at 00:01.
5. Update `MigrationPrompt` to handle `canDefer={false}` (no backdrop dismiss, no "Maybe later").

**Success criteria:**
- At 18:00 (or with app open past 18:00), `EndOfPeriodBanner` appears immediately if active tasks exist.
- Banner dismisses cleanly with × and does not reappear in the same session.
- At 00:01 (or with app open past 00:01), `MigrationPrompt` opens immediately if previous-period tasks exist.
- Modal cannot be closed until all tasks are actioned (today / future / drop).
- Neither trigger fires if there are no qualifying tasks.

---

# Sprint Change Proposal — Story 2.1 Spec Alignment
**Date:** 2026-05-28
**Author:** Gretafarnedi
**Status:** Approved
**Trigger:** Story 2.1 code review (2026-05-28)

---

## Section 1: Issue Summary

**Problem statement:** Story 2.1 implementation diverged from the original epic text in three areas confirmed during code review: (1) sort order — epic said newest-first but product confirmed oldest-top / newest-bottom per `docs/bujo-design-spec.md`; (2) timestamps — epic and FR10 referenced relative creation timestamps but UX-DR4 and the running app use optional formatted `when` labels only; (3) component/file naming — epic referenced `mockEntries.ts` and `BulletEntry` but the brownfield codebase uses `seed.ts` and `EntryRow.tsx`.

**Discovery context:** Identified during Story 2.1 verification and adversarial code review. User confirmed both sort-order deviation and retention of d_y1/d_y2 seed scaffolding.

---

## Section 2: Impact Analysis

**Epic impact:**
- Epic 2 — Story 2.1 and Story 2.2 AC/design text updated. No scope reduction.

**Story impact:**
- Story 2.1 — done; specs now match implementation.
- Story 2.2 — "Just now" and "top of list" references corrected to match sort order.

**Artifact conflicts resolved:**
- `epics.md` — FR10, UX-DR4, Additional Requirements, Epic 2 description, Stories 2.1 & 2.2, Story 5.1 font-weight note.
- `project-brief.md` — Entry fields row and Design Constraints timestamp rule.
- `component-inventory.md` — Brownfield naming map and design decisions table.

**Technical impact:** None — documentation-only alignment. No code changes required.

---

## Section 3: Recommended Approach

**Selected path:** Option 1 — Direct Adjustment (update planning artifacts to match confirmed implementation).

**Rationale:** Implementation matches the authoritative design spec (`bujo-design-spec.md`) and was explicitly approved in code review. Updating epics/PRD-adjacent docs removes ambiguity for Stories 2.2+.

**Effort estimate:** Low | **Risk:** Low | **Timeline impact:** None

---

## Section 4: Detailed Change Proposals

### Change 1 — Sort order (Story 2.1 AC4)
**Old:** reverse-chronological (newest first)
**New:** oldest-first, newest at bottom (BuJo page-fill)
**Rationale:** Product confirmed during review; matches design spec § Sort order.

### Change 2 — Timestamps (FR10, UX-DR4, Story 2.1 AC2, Story 2.2)
**Old:** relative creation timestamp ("2h ago", "Just now")
**New:** optional formatted `when` label when scheduled; `ago` is sort-only, never displayed
**Rationale:** Resolves FR10 ↔ UX-DR4 conflict; matches `EntryRow.formatWhen()`.

### Change 3 — Entry types in Story 2.1 AC3
**Old:** task, event, and note per view
**New:** at least one task and one event per view (notes deferred — `EntryType` is `task | event` only)
**Rationale:** Matches `seed.ts` and Composer toggle.

### Change 4 — Naming (Story 2.1 design decisions, component inventory)
**Old:** `mockEntries.ts`, `BulletEntry`
**New:** `src/data/seed.ts`, `EntryRow.tsx`
**Rationale:** Brownfield naming map from Story 1.1.

### Change 5 — New entry position (Story 2.2)
**Old:** appears at top of list
**New:** appears at bottom (newest position, `ago: 0`)
**Rationale:** Consistent with sort comparator `b.ago - a.ago`.

---

## Section 5: Implementation Handoff

**Change scope:** Minor — documentation updates applied directly.

**Success criteria:**
- [x] `epics.md` Story 2.1/2.2 AC and design decisions match running app
- [x] FR10 and UX-DR4 no longer contradict each other
- [x] `project-brief.md` entry fields align with design constraints
- [x] `component-inventory.md` includes brownfield naming map
