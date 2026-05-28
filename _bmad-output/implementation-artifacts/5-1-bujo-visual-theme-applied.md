# Story 5.1: BuJo Visual Theme Applied

Status: ready-for-dev

## Story

As a user,
I want the app to look and feel like a digital Bullet Journal,
so that the aesthetic matches the calm, minimal, handwritten quality of a paper BuJo.

## Acceptance Criteria

1. **Given** I open the app in B&W mode (default) **When** I look at the app **Then** the background is ivory/cream (`#FAFAF7`) with a visible but subtle dot grid texture.
2. **And** Kalam is applied at correct weights: 300 for meta/when labels, 400 for body, 700 for symbols/titles via `.bj-write` and glyph classes.
3. **And** Inter is applied to UI chrome: tabs, period header, metadata tags.
4. **And** text is near-black (`#0A0A0A` in code, epic says `#1A1A1A` — close enough unless user wants exact match).
5. **And** no heavy drop shadows, gradients, or decorative clutter.
6. **And** the visual weight feels minimal, clean, and calm.

## Tasks / Subtasks

- [ ] **Verify dot grid + background** (AC: 1)
  - [ ] `.bj-paper` full-bleed dot grid on `.bj-app[data-grid="dot"]`
  - [ ] Default `--bj-bg: #fafaf7` from `useTheme` bw palette
  - [ ] Grid visible but subtle — not overpowering

- [ ] **Verify typography split** (AC: 2, 3)
  - [ ] Google Fonts loaded in `index.html`: Kalam 300/400/700, Inter 300–700
  - [ ] Entry text/composer/glyphs: `var(--bj-font)` (Kalam)
  - [ ] Tabs, ViewHeader, EmptyState lead, migrated tags: `var(--bj-ui-font)` (Inter)
  - [ ] Logo `• Journal`: Kalam 700 in HeaderBar

- [ ] **Verify colour tokens** (AC: 4, 5)
  - [ ] CSS custom properties: `--bj-bg`, `--bj-ink`, `--bj-rule`, `--bj-soft`
  - [ ] No Tailwind BuJo tokens needed — `bj.css` is authoritative (Story 1.1 decision)
  - [ ] Scan for inline heavy shadows/gradients — remove if found

- [ ] **Verify dark mode baseline** (related NFR6)
  - [ ] Dark palette in `useTheme` — near-black bg, off-white ink
  - [ ] Grain texture for dark mode listed in NFR6 — **optional gap**; document if missing

- [ ] **Visual audit** (AC: 1–6)
  - [ ] Desktop 1048px centred column + mobile full-width padding
  - [ ] All 4 views — consistent theme
  - [ ] Run `npm run build` — exit 0

## Dev Notes

### Brownfield Project — Theme Largely Complete

The BuJo visual system was translated from the HTML prototype into `bj.css` (~764 lines). Story 5.1 is primarily **audit and gap-fill**, not greenfield theming.

**What already works:**
- `src/styles/bj.css` — complete design system, dot grid, typography, component classes
- `src/hooks/useTheme.ts` — bw/dark palettes via CSS vars on `.bj-app`
- `index.html` — Google Fonts links
- `HeaderBar`, `Tabs`, `ViewHeader`, state components — all use `.bj-*` classes

**Do NOT:**
- Migrate to Tailwind BuJo tokens — rejected in Story 1.1
- Rename components to match inventory doc

**Optional polish gaps:**
- Dark mode grain/noise texture (NFR6) — not in `bj.css` today
- Epic ivory `#FAFAF7` vs code `#fafaf7` — identical
- Ink: code `#0a0a0a` vs epic `#1A1A1A` — minor; align only if visually requested

**Story 5.2 scope boundary:**
- Colour palette picker (warm/sage/etc.) is Story 5.2 — NOT this story
- This story = B&W default aesthetic audit

### References

- Story requirements: [Source: epics.md#Story-5.1]
- Design spec: [Source: docs/bujo-design-spec.md]
- CSS system: [Source: src/styles/bj.css]
- Theme hook: [Source: src/hooks/useTheme.ts]
- Story 1.1 theming decision: [Source: 1-1-app-scaffold-layout-shell.md#Tailwind-vs-CSS-Custom-Properties]

## Dev Agent Record

### Agent Model Used

(pending)

### Debug Log References

### Completion Notes List

### File List
