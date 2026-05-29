# Sprint Change Proposal — Period Display & Event Ritual Bug Fixes

**Date:** 2026-05-29
**Trigger:** Two behavioral bugs observed in the running app
**Scope:** Minor — two new bug-fix stories, no MVP or epic restructure

---

## 1. Issue Summary

Two behavioral gaps were identified in the running prototype that diverge from expected BuJo behavior:

### Bug 1: Completed/migrated entries from previous periods visible in current view

When navigating a period view (Daily, Weekly, Monthly), entries from previous periods — whether completed (`×`), migrated (`>`), or active — are still shown in the current period's list. The BuJo convention requires each period to show only its own entries; past entries are accessible only via the migration ritual queue, not the main list.

- **Affected story:** 2.1 — Display Entry List with Mock Data (status: `done`)
- **Affected files:** `useEntries.ts`, `App.tsx`
- **Missing requirement:** FR14 — period-scoped display was not in the original FR list. It has since been added to epics.md and the FR inventory.

### Bug 2: Unresolved events excluded from migration ritual and 18:00 banner

The `EndOfPeriodBanner` (18:00 trigger) and `MigrationPrompt` (morning ritual) only surface unresolved `task` entries. Unresolved `event` entries (status not `done`) are silently ignored — they are never shown to the user for resolution.

- **Affected stories:**
  - 4.1 — Migration Ritual / Evening Banner (status: `done`)
  - 4.2 — Morning Migration Ritual (status: `review`) — can incorporate before review closes
- **Affected files:** `useEntries.ts` (`unresolvedFromPreviousPeriod()`), `useTimeReminder.ts`, `MigrationPrompt.tsx`, `EndOfPeriodBanner.tsx`
- **Root cause:** FR7 and FR8 were under-specified as "tasks only". Both FRs have since been corrected in epics.md.

---

## 2. Impact Analysis

### Checklist results

| # | Item | Status |
|---|---|---|
| 1.1 | Triggering stories identified | ✅ Done |
| 1.2 | Issue type: under-specified requirements + missing FR | ✅ Done |
| 1.3 | Evidence: observed in running app at localhost:4173 | ✅ Done |
| 2.1 | Epic 2 (done) — needs a patch story; no epic rewrite | ✅ Done |
| 2.2 | Epic 4 (in-progress) — 4.2 still in review, can absorb events behavior | ✅ Done |
| 2.3 | No other epics affected | ✅ N/A |
| 2.4 | No epics invalidated; no new epics needed | ✅ N/A |
| 2.5 | No resequencing needed | ✅ N/A |
| 3.1 | PRD: FR7, FR8 were under-specified; epics.md corrected; PRD not impacted at goal level | ✅ Done |
| 3.2 | Architecture: no architecture doc in project | ✅ N/A |
| 3.3 | UX spec: stub only (step-01), no migration/ritual content — no conflict | ✅ N/A |
| 3.4 | Deferred-work: no deferred items reference period-scoped display or event ritual — no conflict | ✅ N/A |
| 4.1 | Option 1 (Direct Adjustment): viable — 2 small fix stories | ✅ Viable |
| 4.2 | Option 2 (Rollback): not justified — fixes are additive, not contradictory | ❌ Not viable |
| 4.3 | Option 3 (MVP Review): not needed — no scope reduction required | ❌ Not viable |

### Epic impact

| Epic | Impact |
|---|---|
| Epic 2 (done) | Bug in Story 2.1 — period-scoped filtering not implemented. New Story 2.4 added. |
| Epic 4 (in-progress) | Bug in Story 4.1 (done). Story 4.2 (in review) — absorb events before review closes. New Story 4.3 for EndOfPeriodBanner events patch. |
| Epics 1, 3, 5 | No impact. |

### Artifact conflicts

| Artifact | Conflict | Action |
|---|---|---|
| epics.md | FR7, FR8, FR14 under-specified; Epic 2 + 4 descriptions | ✅ Already corrected in prior session |
| PRD | No product-goal conflict | No PRD change required |
| UX spec | Stub only — no conflict | No change required |
| sprint-status.yaml | New stories 2.4 and 4.3 not tracked | Update after approval |
| Implementation artifact 4.2 | In review — events behavior must be incorporated before review closes | Amend story spec |

---

## 3. Recommended Approach

**Option 1 — Direct Adjustment.** Two new fix stories, one per bug. Story 4.2 (in review) absorbs its portion of Fix 2 before closing.

### Rationale

- Both fixes are additive (new filtering logic + expanded entity set) with no destructive changes
- Fix 2 for 4.2 is most efficient to absorb during review rather than opening a third patch story
- No rollback or MVP reduction warranted — the bugs are gaps in spec, not architectural mistakes

---

## 4. Detailed Change Proposals

### Story 2.4 — Period-scoped Entry Display (new story)

**Epic:** 2 — Entry Management (Core CRUD)
**Covers:** FR14

> As a user,
> I want each period view to show only the current period's entries,
> So that past days/weeks/months don't pollute my current page.

**Acceptance Criteria:**

- **Given** I am in Daily view
  **When** the entry list renders
  **Then** only entries with `createdAt >= startOfToday()` are shown
  **And** entries from previous days (active, completed `×`, or migrated `>`) are not visible

- **Given** I am in Weekly view
  **When** the entry list renders
  **Then** only entries with `createdAt >= startOfThisWeek()` are shown

- **Given** I am in Monthly view
  **When** the entry list renders
  **Then** only entries with `createdAt >= startOfThisMonth()` are shown

- **Given** I am in Backlog view
  **Then** no period filtering is applied — all backlog entries are shown regardless of date

**Design Decisions:**
- Period filtering is applied in `useEntries` (or `App.tsx` computed list) using `startOfToday/ThisWeek/ThisMonth` boundary helpers already present in the codebase
- Filtered-out entries remain in state (available for `unresolvedFromPreviousPeriod()`) — they are display-only excluded
- Seed data in `seed.ts` must include entries with `createdAt` values from previous periods (already seeded as `d_y1`, `d_y2`) to verify this behavior

---

### Story 4.3 — Events in End-of-Period Banner (new story)

**Epic:** 4 — Migration Ritual
**Covers:** FR7 (amended), FR8 (partial — banner side)

> As a user,
> I want the 18:00 reminder banner to appear when I have unresolved events as well as tasks,
> So that I am reminded to close out all entries — not just tasks — before the period ends.

**Acceptance Criteria:**

- **Given** the app is open at or after 18:00
  **When** the current period has unresolved `event` entries (status not `done`) but no active `task` entries
  **Then** the `EndOfPeriodBanner` still appears with the standard contextual copy

- **Given** the banner is shown
  **And** all tasks are resolved but unresolved events remain
  **Then** the banner is still shown — it only dismisses when explicitly closed (×) or the session ends

**Design Decisions:**
- `activePeriodTasks` selector in `App.tsx` (or `useEntries`) must be expanded to include `event` entries with `status !== 'done'`; rename to `activePeriodEntries` or add a companion `activePeriodEvents` flag
- `useTimeReminder` receives the updated boolean — no internal changes needed

---

### Story 4.2 amendment — Events in Morning Ritual Queue (absorb into in-review story)

**Story:** 4.2 — Morning Migration Ritual (status: `review`)

Before Story 4.2 is marked `done`, the following behavior must be incorporated:

**OLD acceptance criteria (implicit):**
- The `MigrationPrompt` ritual queue contains only active `task` entries from the previous period

**NEW acceptance criteria (add):**
- **Given** the ritual fires for a period view
  **When** the previous period contains unresolved `event` entries (status not `done`) alongside tasks
  **Then** the events appear in the ritual queue alongside tasks, with the same action set: **done (●)**, **today**, **migrate (→ submenu)**, **drop**

- **Given** all tasks are resolved but unresolved events remain in the queue
  **Then** the modal does not close — the "N left" badge counts events too

**Design Decisions:**
- `unresolvedFromPreviousPeriod()` already updated in epics.md to return both tasks and events
- `MigrationItem` type must accept `type: 'event'`; the "done" button renders `EventDot` (filled circle) instead of `XGlyph`
- `completeEntry(id)` already handles `done` status for events — wire through `MigrationPrompt` action handler

---

## 5. Implementation Handoff

**Change scope:** Minor — direct implementation by Developer agent.

| Story | Action | Priority |
|---|---|---|
| 4.2 amendment | Incorporate events into ritual queue **before review closes** | Immediate |
| 4.3 — Events in Banner | New story, implement after 4.2 closes | Next |
| 2.4 — Period-scoped Display | New story, can run in parallel with 4.3 | Next |

**Success criteria:**
- Navigating Daily view shows only today's entries; yesterday's completed/migrated entries are hidden
- The 18:00 banner fires when unresolved events exist, even with no active tasks
- The morning ritual modal shows events alongside tasks in the queue; modal cannot close until events are also actioned
- `sprint-status.yaml` updated to track stories 2.4 and 4.3

**Artifacts to update post-approval:**
- `sprint-status.yaml` — add 2.4 and 4.3 entries
- `_bmad-output/implementation-artifacts/4-2-morning-migration-ritual.md` — append amendment section before review closes
