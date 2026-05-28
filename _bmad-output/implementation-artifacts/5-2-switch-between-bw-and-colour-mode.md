# Story 5.2: Switch Between B&W and Colour Mode

Status: ready-for-dev

## Story

As a user,
I want to toggle between B&W and Colour modes and pick a palette,
so that I can personalise the app's feel while keeping the BuJo aesthetic.

## Acceptance Criteria

1. **Given** the app is in B&W mode (default) **When** I click the ThemeSwitcher **Then** the app enters Colour mode with 4–5 palette option dots visible.
2. **When** I click a palette dot **Then** accent colours update instantly across tabs, symbols, and CTA elements.
3. **And** the change applies globally across all four views.
4. **When** I switch back to B&W **Then** colour theme is removed and pure black/white aesthetic returns.
5. **And** all transitions are immediate with no perceptible delay (CSS vars, not React re-render cascade).

## Tasks / Subtasks

- [ ] **Extend `useTheme` hook** (AC: 1, 2, 4, 5) — **MAJOR GAP**
  - [ ] Add `colorMode: 'bw' | 'color'` separate from dark/light
  - [ ] Add `activeTheme: ThemeKey` (5 presets: warm, cool, sage, terracotta, slate — names from epic)
  - [ ] Define palette CSS var sets for each theme (accent colour on tabs, glyphs, primary buttons)
  - [ ] Swap vars on `:root` via inline `themeStyle` — avoid re-rendering entry list

- [ ] **Build ThemeSwitcher UI** (AC: 1, 2, 4) — **GAP**
  - [ ] Current: sun/moon toggle in `HeaderBar` only switches bw ↔ dark
  - [ ] Extend or replace with ThemeSwitcher: B&W toggle + palette dots when in colour mode
  - [ ] Position: top-right desktop, within HeaderBar on mobile (epic UX-DR7 area)
  - [ ] Palette dots: small coloured circles, one selected state

- [ ] **Preserve dark mode** (integration decision)
  - [ ] Clarify interaction: dark mode (existing) vs colour palettes (new) — suggested: colour palettes apply accent vars; dark mode remains separate bg/ink swap OR colour mode replaces dark toggle
  - [ ] Document chosen UX in completion notes

- [ ] **Wire accent vars in bj.css** (AC: 2, 3)
  - [ ] Add `--bj-accent`, `--bj-accent-soft` (or similar) consumed by `.bj-tab` active, `.bj-btn-primary`, glyph hover
  - [ ] Default bw: accent = ink colour

- [ ] **Manual test + build** (AC: 1–5)
  - [ ] Toggle colour mode — palette dots appear
  - [ ] Click each palette — instant global accent change
  - [ ] Return to B&W — accents reset
  - [ ] Run `npm run build` — exit 0

## Dev Notes

### Brownfield Project — Only B&W / Dark Today

`useTheme` currently toggles between two palettes (`bw` | `dark`). Epic FR9 requires **B&W vs Colour mode with 5 preset accent palettes** — substantially new work.

**What exists:**
- `src/hooks/useTheme.ts` — `PALETTE_DEFS` for bw and dark only
- `src/components/HeaderBar.tsx` — sun/moon button calls `onToggleDark`
- CSS custom property architecture supports instant switching (Story 1.1)

**What must be built:**
- Colour mode state + 5 theme presets
- ThemeSwitcher component (or HeaderBar extension) with palette picker dots
- Accent CSS variables used by interactive elements

**Suggested type extension:**
```typescript
type ColorMode = 'bw' | 'color'
type ThemeKey = 'warm' | 'cool' | 'sage' | 'terracotta' | 'slate'

// useTheme returns:
{ colorMode, activeTheme, setColorMode, setActiveTheme, themeStyle, isDark?, toggleDark? }
```

**CSS var pattern (epic Design Decision):**
```typescript
const COLOR_THEMES: Record<ThemeKey, Record<string, string>> = {
  warm:       { '--bj-accent': '#C4713B', ... },
  cool:       { '--bj-accent': '#4A7FA5', ... },
  sage:       { '--bj-accent': '#6B8F71', ... },
  terracotta: { '--bj-accent': '#B85C38', ... },
  slate:      { '--bj-accent': '#5C6670', ... },
}
```

**Do NOT:**
- Persist theme to localStorage unless explicitly requested (Open Questions defer persistence)
- Use React context re-render for every pixel — keep var swap on `.bj-app` inline style

### References

- Story requirements: [Source: epics.md#Story-5.2]
- FR9: [Source: epics.md#FR9]
- UX spec: [Source: epics.md#UX-DR7] Light/Dark toggle — reconcile with colour mode
- Current hook: [Source: src/hooks/useTheme.ts]
- HeaderBar toggle: [Source: src/components/HeaderBar.tsx]
- Story 5.1: base theme audit [Source: 5-1-bujo-visual-theme-applied.md]

## Dev Agent Record

### Agent Model Used

(pending)

### Debug Log References

### Completion Notes List

### File List
