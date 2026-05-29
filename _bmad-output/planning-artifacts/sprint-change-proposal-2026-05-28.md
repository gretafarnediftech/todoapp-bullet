# Sprint Change Proposal — Story 5.2 Theme Scope Correction

**Date:** 2026-05-28
**Trigger story:** 5.2 — Theme switching
**Scope:** Moderate — implementation and tracking correction, no MVP or epic restructure

---

## 1. Issue Summary

During review and implementation of Story 5.2, the work drifted from the approved requirement. The approved scope is a single theme toggle between **light** and **dark** mode. The current implementation and implementation artifact instead introduce a separate **B&W / Colour** mode with palette dots and accent presets.

This is not a new product requirement. It is a mismatch between the approved planning artifacts and the implementation target.

### Trigger and evidence

- Triggering issue: Story 5.2 implementation drifted away from approved scope
- Evidence 1: [epics.md](/Users/gretafarnedi/projects/todo-app/_bmad-output/planning-artifacts/epics.md) defines FR9 and Story 5.2 as light/dark only
- Evidence 2: [useTheme.ts](/Users/gretafarnedi/projects/todo-app/src/hooks/useTheme.ts) defines `ColorMode = 'bw' | 'color'` and palette presets
- Evidence 3: [HeaderBar.tsx](/Users/gretafarnedi/projects/todo-app/src/components/HeaderBar.tsx) renders a `B&W` / `Colour` button and theme dots
- Evidence 4: [App.tsx](/Users/gretafarnedi/projects/todo-app/src/components/App.tsx) threads colour-mode props through the app shell
- Evidence 5: [bj.css](/Users/gretafarnedi/projects/todo-app/src/styles/bj.css) contains colour-mode selectors and palette-dot styles
- Evidence 6: [5-2-switch-between-dark-and-light-mode.md](/Users/gretafarnedi/projects/todo-app/_bmad-output/implementation-artifacts/5-2-switch-between-dark-and-light-mode.md) documents the current developer handoff artifact

### Problem statement

The project currently has a **requirements-traceability break** between approved planning artifacts and the implementation target for Story 5.2. If left unchanged, the backlog and source code will continue to reinforce the wrong feature.

---

## 2. Impact Analysis

### Epic impact

- **Epic 5 remains valid as written.** No epic rewrite is needed.
- The affected scope is limited to Story 5.2 execution and tracking.
- Epic order and sprint sequencing do not need to change.

### Story impact

- Story 5.2 implementation artifact must be corrected from B&W/Colour to light/dark.
- Story 5.2 should be reset from `review` or drifted implementation status back to `ready-for-dev`, because the reviewed work targeted the wrong requirement.
- No new stories are required.
- No future epics are invalidated.

### Artifact conflicts

| Artifact | Conflict | Action Needed |
|---|---|---|
| PRD | No product-goal conflict | No PRD change required |
| Epics | Already correct | No `epics.md` change required |
| UX spec | Already aligned at high level with light/dark ThemeSwitcher | No UX rewrite required |
| Architecture | No architecture document present | N/A |
| Implementation artifact 5.2 | Wrong title, ACs, tasks, notes, and file identity | Replace with correct light/dark story |
| Sprint status | Tracks wrong story slug | Rename slug and reset status to `ready-for-dev` |
| Source code | Implements unapproved colour-mode path | Remove colour-mode path and restore light/dark-only implementation |

### Technical impact

- Theme hook API becomes smaller and simpler
- Header state and props shrink
- CSS loses colour-mode-only branches and palette-dot styles
- Implementation should add localStorage persistence for theme mode because approved Story 5.2 requires it

### MVP impact

- MVP is unchanged
- Scope is reduced back to the approved requirement, not expanded
- No backlog replan is required beyond correcting Story 5.2 execution

---

## 3. Recommended Approach

**Selected path:** Option 1 — Direct Adjustment

### Option evaluation

- **Option 1: Direct Adjustment** — Viable
  - Effort: Medium
  - Risk: Low
  - Notes: Correct the implementation artifact, sprint tracking, and source files directly

- **Option 2: Potential Rollback** — Not viable
  - Effort: High relative to value
  - Risk: Medium
  - Notes: Full rollback is unnecessary; only the drifted 5.2 slice needs correction

- **Option 3: PRD MVP Review** — Not viable
  - Effort: Unnecessary
  - Risk: Low
  - Notes: The approved MVP is still achievable and already clear

### Rationale

Direct adjustment preserves momentum, minimizes change surface, and restores alignment between planning and implementation. The issue is not strategic ambiguity. It is a local execution error in one story and its dependent artifacts.

### Timeline and risk

- Timeline impact: Low
- Delivery risk: Low
- Main risk if uncorrected: repeated reimplementation churn caused by the wrong feature remaining in both code and artifacts

---

## 4. Detailed Change Proposals

### A. Story artifact corrections

#### Change A1 — Story 5.2 title and user story

**Artifact:** `_bmad-output/implementation-artifacts/5-2-switch-between-dark-and-light-mode.md`

**OLD:**

```md
# Story 5.2: Switch Between Dark and Light Mode

As a user,
I want to toggle between B&W and Colour modes and pick a palette,
so that I can personalise the app's feel while keeping the BuJo aesthetic.
```

**NEW:**

```md
# Story 5.2: Switch Between Dark and Light Mode

As a user,
I want to toggle between light and dark mode,
so that I can use the app comfortably in different lighting conditions.
```

**Rationale:** Restores the story to the approved Epic 5 requirement.

#### Change A2 — Story 5.2 acceptance criteria and tasks

**OLD direction:**

- B&W default
- Colour mode with palette dots
- Palette switching across tabs, glyphs, and CTAs
- Return to B&W mode

**NEW direction:**

- Light mode default
- Sun/moon ThemeSwitcher toggles to dark mode
- Dark mode applies near-black background, off-white text, and grain/noise texture
- Toggling back restores light mode
- Mode persists across reloads
- Theme changes remain immediate

**Rationale:** Replaces the wrong implementation target with the approved acceptance surface.

#### Change A3 — Story file identity

**OLD:**

- File path: `_bmad-output/implementation-artifacts/5-2-switch-between-dark-and-light-mode.md`

**NEW:**

- File path: `_bmad-output/implementation-artifacts/5-2-switch-between-dark-and-light-mode.md`

**Rationale:** The file name should not continue advertising the wrong feature.

### B. Sprint tracking corrections

#### Change B1 — Reset Story 5.2 tracking to the correct slug and status

**Artifact:** `_bmad-output/implementation-artifacts/sprint-status.yaml`

**OLD:**

```yaml
epic-5:
  5-2-switch-between-dark-and-light-mode: ready-for-dev
```

**NEW:**

```yaml
epic-5:
  5-2-switch-between-dark-and-light-mode: ready-for-dev
```

**Rationale:** The story slug should match the corrected implementation artifact and approved requirement.

### C. Source code corrections

#### Change C1 — Simplify theme hook

**Artifact:** `src/hooks/useTheme.ts`

**OLD:**

```ts
type ColorMode = 'bw' | 'color'
type ThemeKey = 'warm' | 'cool' | 'sage' | 'terracotta' | 'slate'
...
const [colorMode, setColorMode] = useState<ColorMode>('bw')
const [activeTheme, setActiveTheme] = useState<ThemeKey>('warm')
```

**NEW:**

```ts
type ToneMode = 'light' | 'dark'
...
const [tone, setTone] = useState<ToneMode>('light')
```

And:

- persist selected tone to localStorage
- restore persisted tone on app load
- expose only `themeStyle`, `isDark`, and `toggleDark`

**Rationale:** Removes the unapproved theme axis and adds the approved persistence requirement.

#### Change C2 — Remove colour switcher UI

**Artifact:** `src/components/HeaderBar.tsx`

**OLD:**

- B&W/Colour button
- palette dot group
- dark/light icon button

**NEW:**

- retain bullet-key button
- retain sun/moon dark-light toggle only
- remove palette UI entirely

**Rationale:** Matches the approved ThemeSwitcher behavior.

#### Change C3 — Remove colour-mode app wiring

**Artifact:** `src/components/App.tsx`

**OLD:**

- passes `colorMode`, `onToggleColorMode`, `activeTheme`, `onSetTheme`
- sets `data-color-mode` on app root

**NEW:**

- remove colour-mode props and state wiring
- keep only dark/light theme props from `useTheme`
- remove `data-color-mode`

**Rationale:** Collapses the app shell back to the approved theme model.

#### Change C4 — Remove colour-mode CSS branches

**Artifact:** `src/styles/bj.css`

**OLD:**

- `.bj-app[data-color-mode="color"] .bj-glyph...`
- `.bj-app[data-color-mode="color"] .bj-submit...`
- `.bj-theme-dots`, `.bj-theme-dot`

**NEW:**

- delete all colour-mode-only selectors
- keep dark/light tokens only
- use ink-based styling where accent tokens are no longer needed

**Rationale:** Removes dead feature styling and prevents UI drift.

---

## 5. Implementation Handoff

**Scope classification:** Moderate

### Handoff recipients and responsibilities

- **Developer agent**
  - Correct Story 5.2 implementation artifact
  - Rename the Story 5.2 file slug
  - Update `sprint-status.yaml`
  - Remove colour-mode implementation from source
  - Add theme persistence for dark/light mode
  - Validate with `npm run build` and a browser check of the header toggle

- **Product Owner / Developer coordination**
  - Confirm the corrected story slug is the one used for future sprint tracking
  - Ensure no further work references the retired B&W/Colour story name

### Success criteria

- Story 5.2 artifact describes only light/dark mode
- Sprint tracking references only the corrected Story 5.2 slug and status
- Header shows only bullet key plus dark/light toggle
- No palette dots or B&W/Colour control remain
- Theme preference persists across reloads
- Build passes cleanly

### High-level action plan

1. Replace the wrong 5.2 implementation artifact with the corrected light/dark version
2. Rename the story slug in implementation artifacts and sprint tracking
3. Remove colour-mode code path from theme hook, header, app shell, and CSS
4. Add localStorage-backed dark/light persistence
5. Rebuild and visually verify the ThemeSwitcher behavior

---

## 6. Workflow Status

Checklist summary:

- 1.1 Trigger identified — [x] Done
- 1.2 Core problem defined — [x] Done
- 1.3 Evidence collected — [x] Done
- 2.1 Epic impact assessed — [x] Done
- 2.2 Epic-level changes identified — [x] Done
- 2.3 Future epics reviewed — [x] Done
- 2.4 New/invalid epics checked — [N/A]
- 2.5 Priority/order check — [x] Done
- 3.1 PRD conflict check — [x] Done
- 3.2 Architecture conflict check — [N/A] (document not present)
- 3.3 UX conflict check — [x] Done
- 3.4 Secondary artifact check — [x] Done
- 4.1 Option 1 evaluated — [x] Viable
- 4.2 Option 2 evaluated — [x] Not viable
- 4.3 Option 3 evaluated — [x] Not viable
- 4.4 Path selected — [x] Done
- 5.1 Issue summary — [x] Done
- 5.2 Impact and artifact adjustments — [x] Done
- 5.3 Recommended path with rationale — [x] Done
- 5.4 MVP impact and action plan — [x] Done
- 5.5 Agent handoff plan — [x] Done
- 6.1 Checklist completion review — [x] Done
- 6.2 Proposal consistency review — [x] Done
- 6.3 User approval — [ ] Pending
- 6.4 Sprint-status update to approved changes — [ ] Pending final approval
- 6.5 Confirm next steps and handoff — [ ] Pending final approval

Correct Course workflow in progress, Gretafarnedi.
