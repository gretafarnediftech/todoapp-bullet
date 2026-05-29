# Sprint Change Proposal — Epic 4 Story Split: 4.1 → 4.1 + 4.2

**Date:** 2026-05-28
**Trigger:** Planning refinement — Story 4.1 collapsed two distinct UX patterns into one story; ritual trigger missing post-midnight time gate
**Scope:** Minor — epics.md story split + sprint-status update + small code change to ritual trigger

---

## 1. Issue Summary

Story 4.1 ("Migration Ritual — Evening Banner & Per-View Blocking Prompt") combined two behaviourally different features under a single story:

1. **18:00 soft reminder** — `EndOfPeriodBanner`, dismissible, non-blocking
2. **Post-midnight blocking modal** — `MigrationPrompt`, forces task resolution before continuing

These have separate triggers, separate components, separate UX patterns, and separate acceptance criteria. Keeping them as one story makes it harder to track completion status and spec them independently.

Additionally, the existing ritual trigger (`useEffect` in `BuJoApp`) lacks a **post-midnight time gate**: it currently fires on navigation regardless of time of day, meaning at 22:00 the blocking modal and the 18:00 banner can both be active simultaneously. The user's requirement is that the ritual modal fires **only after midnight** — morning/daytime use only.

---

## 2. Impact Analysis

### Epic impact

- **Epic 4** gains one new story (4.2). Its status reverts from `done` to `in-progress` while Story 4.2 is delivered.
- Epic 4 description updated to reflect the split trigger model.

### Story impact

| Story | Change | New Status |
|---|---|---|
| 4.1 | Trimmed to 18:00 banner only; ACs and design decisions for ritual removed | `done` (already implemented) |
| 4.2 | New story: post-midnight navigation trigger for blocking ritual | `ready-for-dev` |

### Artifact conflicts

| Artifact | Change Required |
|---|---|
| `epics.md` | Split Story 4.1 → 4.1 + 4.2; update Epic 4 description | ✅ Done |
| `sprint-status.yaml` | Add 4.2 as `ready-for-dev`; revert `epic-4` to `in-progress` | ✅ Done |
| `4-1-migration-ritual-prompt-on-app-open.md` | No change — covers the banner implementation which is complete |
| `App.tsx` (ritual `useEffect`) | Add `if (new Date().getHours() >= 18) return` guard to ritual trigger | Needed in 4.2 dev |
| PRD | No change — FR7 (banner) and FR8 (ritual) are already separate requirements |
| UX spec | No change — components already distinct |

### Technical impact

Story 4.2 requires a **single-line code change** in `App.tsx`:

```ts
// Navigation-triggered ritual: fires on first entry to each view per session
useEffect(() => {
  if (isLoading || view === 'backlog') return
  if (shownRitualViews.current.has(view)) return
+ if (new Date().getHours() >= 18) return  // ritual is a morning concern; evening = banner
  if (!shouldFireRitualForView(view, prevLastOpen.current)) return
  // …
}, [view, isLoading, entries])
```

This ensures the ritual and the 18:00 banner never compete in the same session.

---

## 3. Recommended Approach

**Selected path:** Direct Adjustment

- Split is a planning-only change for Story 4.1 (already done)
- Story 4.2 requires one small guard added to `App.tsx` + a new implementation artifact
- No new components, hooks, or state shapes required
- Effort: low (< 1 dev session)

---

## 4. Detailed Change Proposals

### 4a. epics.md — Story 4.1 (revised, done)

**OLD:** Story 4.1 contained both 18:00 TRIGGER and NAVIGATION TRIGGER sections under one user story.

**NEW:** Story 4.1 covers only the 18:00 soft reminder banner.

- User story: "I want to be reminded at 18:00 to deal with unresolved tasks before the period ends"
- ACs: banner appears at 18:00, contextual copy per view, dismiss × button, hidden when no active tasks or in Backlog
- Design decisions: `useTimeReminder` (18:00 only), session slot retained if in Backlog view

### 4b. epics.md — Story 4.2 (new)

**NEW:** Story 4.2 is the post-midnight navigation trigger for the blocking ritual.

Key changes from the original NAVIGATION TRIGGER section:
- Added AC: "the current time is after midnight (before 18:00)" — explicit time gate
- Added AC: "if current time ≥ 18:00, ritual does NOT fire — the 18:00 banner handles that window"
- Design decisions: `hours < 18` guard in `useEffect`; `unresolvedFromPreviousPeriod` period boundary implicitly enforces "after midnight" for the data side

### 4c. sprint-status.yaml

```yaml
# Before
epic-4: done
4-1-migration-ritual-prompt-on-app-open: done

# After
epic-4: in-progress
4-1-migration-ritual-prompt-on-app-open: done    # 18:00 banner — complete
4-2-morning-migration-ritual: ready-for-dev      # post-midnight navigation trigger
```

---

## 5. Implementation Handoff

**Scope:** Minor — implementable directly by Developer agent.

**Story 4.2 dev tasks:**
1. Add `if (new Date().getHours() >= 18) return` in the ritual `useEffect` in `App.tsx` (before the `shouldFireRitualForView` call)
2. Create implementation artifact `4-2-morning-migration-ritual.md`
3. Mark 4.2 as `done` and `epic-4` as `done` in `sprint-status.yaml` when complete

**Success criteria:**
- At 22:30 with yesterday's tasks, only the 18:00 banner fires — no blocking modal
- At 09:00 with yesterday's tasks, the blocking modal fires on first navigation to Daily
- At 18:01 with yesterday's tasks, the banner fires; navigating to Daily does NOT open the modal
