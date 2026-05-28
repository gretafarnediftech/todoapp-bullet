# Sprint Change Proposal — Story 4.1 Post-Review Spec Alignment

**Date:** 2026-05-28
**Trigger story:** 4.1 — Migration Ritual — Evening Banner & Per-View Blocking Prompt
**Scope:** Minor — direct spec update, no backlog reorganisation or MVP change

---

## 1. Issue Summary

During code review of Story 4.1, the original `00:01` clock-based polling trigger for the migration ritual was redesigned following product clarification. The spec assumed a global `setInterval` checking for midnight; the actual product intent is:

- The ritual fires **on navigation into a view**, not on a global clock tick
- **Daily**: any day, on first entry to Daily view in a session, if there are tasks from before today's midnight
- **Weekly**: on Monday (or first app-open since the week started), on first entry to Weekly view
- **Monthly**: on the 1st (or first app-open since the month started), on first entry to Monthly view
- Each view's ritual is **independent** — both Daily and Weekly can fire in the same session
- The ritual queue is **stabilised** at modal-open time (not recomputed from live view state)
- The 18:00 banner trigger remains time-based and is **unchanged in intent**

---

## 2. Impact Analysis

| Area | Impact |
|------|--------|
| **Epic 4** | Intro text was wrong — referenced "00:01 blocking modal"; updated to navigation trigger |
| **Story 4.1 ACs** | "00:01 TRIGGER" section replaced entirely with "NAVIGATION TRIGGER" |
| **Story 4.1 Design Decisions** | Hook description, queue capture, session tracking updated |
| **FR7 (requirements inventory)** | Reworded to reflect navigation-based trigger and per-view windows |
| **UX Spec** | No references to time triggers — no changes needed |
| **Architecture doc** | Not present |
| **Future stories** | No dependent stories |
| **MVP scope** | Unchanged — FR7 is still fully covered |

---

## 3. Recommended Approach

**Direct Adjustment** — update `epics.md` in-place with before/after edits. No rollback, no sprint restructuring.

- Effort: Low
- Risk: Low
- Timeline impact: None (code already implemented and reviewed)

---

## 4. Detailed Change Proposals

### Change 1 — FR7 in Requirements Inventory

**OLD:**
> FR7: At 18:00, if unresolved tasks exist in the current period, a non-blocking end-of-day reminder banner is shown immediately (even if the app is already open). At 00:01, a blocking migration ritual modal is shown immediately in-session, preventing further interaction until the user resolves or dismisses all unresolved tasks.

**NEW:**
> FR7: At 18:00, if unresolved tasks exist in the current period view (Daily/Weekly/Monthly), a non-blocking end-of-day reminder banner is shown (retried on next 60s tick if the user is in Backlog view). On first navigation into a period view in a session, if unresolved tasks from the previous period exist and the view's ritual window is open (Daily: any day; Weekly: Monday or first app-open of the week; Monthly: 1st of month or first app-open of the month), a blocking migration prompt fires — preventing further interaction until all tasks are resolved.

---

### Change 2 — Epic 4 intro paragraph

**OLD:**
> At 18:00, users are reminded to deal with unresolved tasks via a non-blocking banner. At 00:01, a blocking modal prevents further interaction until tasks are resolved. Users can also filter the active view to hide completed tasks or notes.

**NEW:**
> At 18:00, users are reminded to deal with unresolved tasks via a non-blocking banner. On first navigation into a period view (Daily/Weekly/Monthly), a blocking migration ritual fires if the view's period window is open and unresolved tasks exist from the previous period — preventing further interaction until tasks are resolved. Users can also filter the active view to hide completed tasks or notes.

---

### Change 3 — Story 4.1 title and user story

**OLD:**
> Story 4.1: Migration Ritual — Time-Triggered Banner & Blocking Prompt
> As a user, I want to be reminded at 18:00 … and be required to act on them at 00:01…

**NEW:**
> Story 4.1: Migration Ritual — Evening Banner & Per-View Blocking Prompt
> As a user, I want to be reminded at 18:00 … and be required to deal with them when I next open a period view…

---

### Change 4 — Story 4.1 blocking modal AC section

Replaced "00:01 TRIGGER" section with "NAVIGATION TRIGGER" covering:
- Per-view ritual window rules (Daily/Monday/1st-of-month + gap detection)
- Independent per-view firing
- Queue scoped to that view's previous period

---

### Change 5 — Story 4.1 Design Decisions

Replaced interval/00:01 hook description with:
- `useTimeReminder` — banner-only, boolean callback, flag set only on actual display
- Navigation-based ritual via `useEffect([view, isLoading, entries])`
- `shouldFireRitualForView()` with per-view window logic
- `prevLastOpen` from localStorage for gap detection
- `ritualQueue` as stable `useState` (captured at open time)
- `shownRitualViews` ref Set for once-per-session-per-view guard

---

## 5. Implementation Handoff

**Scope classification:** Minor

All code changes are already implemented and verified (`npm run build` clean). This proposal covers spec alignment only.

**Files updated:**
- `_bmad-output/planning-artifacts/epics.md` — all 5 changes applied

**No further implementation required.** The Developer agent can proceed to the next story.

---

*Correct Course workflow complete, Gretafarnedi!*
