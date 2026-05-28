// All hand-drawn SVG marks — strokes use currentColor so they inherit the active palette.

interface DoodleProps {
  size?: number
  opacity?: number
}

export function Squiggle({ w = 140, opacity = 0.4 }: { w?: number; opacity?: number }) {
  return (
    <svg width={w} height={10} viewBox={`0 0 ${w} 10`} style={{ display: 'block', opacity, overflow: 'visible' }} aria-hidden>
      <path
        d={`M2 6 Q ${w * 0.12} 1 ${w * 0.24} 6 T ${w * 0.48} 6 T ${w * 0.72} 6 T ${w - 4} 6`}
        fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"
      />
    </svg>
  )
}

export function Asterisk({ size = 13, opacity = 0.85 }: DoodleProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 14 14" style={{ display: 'block', opacity, overflow: 'visible' }} aria-hidden>
      <g stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" fill="none">
        <path d="M7 1.4 V12.6" /><path d="M1.6 7 H12.4" />
        <path d="M3 3 L11 11" /><path d="M11 3 L3 11" />
      </g>
    </svg>
  )
}

export function Star({ size = 18, opacity = 0.4 }: DoodleProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 22 22" style={{ display: 'block', opacity, overflow: 'visible' }} aria-hidden>
      <path d="M11 1.5 L13.6 8.2 L20.5 8.6 L15.2 13 L17 19.5 L11 15.8 L5 19.5 L6.8 13 L1.5 8.6 L8.4 8.2 Z"
        fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" strokeLinecap="round" />
    </svg>
  )
}

export function Flourish({ opacity = 0.35 }: { opacity?: number }) {
  return (
    <svg width={64} height={28} viewBox="0 0 64 28" style={{ display: 'block', opacity, overflow: 'visible' }} aria-hidden>
      <g fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round">
        <path d="M2 22 C 14 4 30 4 42 18 C 48 25 56 22 60 14" />
        <circle cx="62" cy="10" r="1" fill="currentColor" stroke="none" />
      </g>
    </svg>
  )
}

export function TodayArrow({ opacity = 0.5 }: { opacity?: number }) {
  return (
    <svg width={86} height={44} viewBox="0 0 86 44" style={{ display: 'block', opacity, overflow: 'visible' }} aria-hidden>
      <g fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round">
        <path d="M80 4 C 70 6 60 8 50 14 C 38 21 26 28 14 34" />
        <path d="M20 28 L 14 34 L 21 38" />
      </g>
    </svg>
  )
}

// ─── Tab icons ───
export function TabDaily({ size = 16, opacity = 1 }: DoodleProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 18 18" style={{ display: 'block', opacity, overflow: 'visible' }} aria-hidden>
      <g fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
        <path d="M2 13.5 L 16 13.5" />
        <path d="M5 13.5 A 4 4 0 0 1 13 13.5" />
        <path d="M9 4 L 9 6.5" />
        <path d="M3.6 8 L 5.2 8.8" />
        <path d="M14.4 8 L 12.8 8.8" />
      </g>
    </svg>
  )
}

export function TabWeekly({ size = 16, opacity = 1 }: DoodleProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 18 18" style={{ display: 'block', opacity, overflow: 'visible' }} aria-hidden>
      <g fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M6 2 L 6 4.5" /><path d="M12 2 L 12 4.5" />
        <rect x="2.5" y="4" width="13" height="11.5" rx=".6" />
        <line x1="2.5" y1="7.5" x2="15.5" y2="7.5" />
        <rect x="2.5" y="9.5" width="13" height="2.8" fill="currentColor" stroke="none" opacity=".3" />
      </g>
    </svg>
  )
}

export function TabMonthly({ size = 16, opacity = 1 }: DoodleProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 18 18" style={{ display: 'block', opacity, overflow: 'visible' }} aria-hidden>
      <g fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 4.5 L 15.2 4 L 15 15 L 3 15.2 Z" />
        <path d="M3 8 L 15 8" />
        <path d="M7 8 L 7.2 15" />
        <path d="M11 8 L 11 15" />
      </g>
    </svg>
  )
}

export function TabBacklog({ size = 16, opacity = 1 }: DoodleProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 18 18" style={{ display: 'block', opacity, overflow: 'visible' }} aria-hidden>
      <g fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round">
        <path d="M3 4 L 15 4.3" />
        <path d="M3.2 9 L 15 8.7" />
        <path d="M3 14 L 11 14.2" />
      </g>
    </svg>
  )
}

// ─── Header logo ───
export function LogoBook({ size = 30 }: { size?: number }) {
  return (
    <svg width={size} height={size * 0.66} viewBox="0 0 30 20" style={{ display: 'block', overflow: 'visible' }} aria-hidden>
      <g fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
        <path d="M2 4.2 Q 8 2 14 5.2 L 14 17 Q 8 14 2 16 Z" />
        <path d="M15 5.2 Q 20 2 28 4 L 28 16 Q 20 14 15 17 Z" />
        <path d="M5 8 L 11 8.5"  opacity=".45" />
        <path d="M5 11 L 10 11"  opacity=".45" />
        <path d="M18 8 L 25 8.4" opacity=".45" />
        <path d="M18 11 L 24 11" opacity=".45" />
      </g>
    </svg>
  )
}

// ─── Theme toggle ───
export function Sun({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" style={{ display: 'block', overflow: 'visible' }} aria-hidden>
      <g fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="10" cy="10" r="3.5" />
        <path d="M10 2 V 4" /><path d="M10 16 V 18" />
        <path d="M2 10 H 4" /><path d="M16 10 H 18" />
        <path d="M4 4 L 5.5 5.5" /><path d="M14.5 14.5 L 16 16" />
        <path d="M16 4 L 14.5 5.5" /><path d="M5.5 14.5 L 4 16" />
      </g>
    </svg>
  )
}

export function Moon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" style={{ display: 'block', overflow: 'visible' }} aria-hidden>
      <g fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 3 A 8 8 0 1 0 14 17 A 6 8 0 1 1 14 3 Z" />
      </g>
    </svg>
  )
}

// ─── Info icon ───
export function Info({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" style={{ display: 'block', overflow: 'visible' }} aria-hidden>
      <g fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="10" cy="10" r="7.5" />
        <path d="M10 14 V 9" />
        <circle cx="10" cy="6.4" r=".9" fill="currentColor" stroke="none" />
      </g>
    </svg>
  )
}

// ─── Action icons ───
export function EditIcon() {
  return (
    <svg width={13} height={13} viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'block' }}>
      <path d="M2 12 L 2 9 L 9 2 L 12 5 L 5 12 Z" />
      <path d="M8 3 L 11 6" />
    </svg>
  )
}

export function MigrateIcon() {
  return (
    <svg width={14} height={14} viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'block' }}>
      <path d="M5 3 L 10 7 L 5 11" />
    </svg>
  )
}

export function Trash({ size = 20, opacity = 1 }: DoodleProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" style={{ display: 'block', opacity, overflow: 'visible' }} aria-hidden>
      <g fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3.2 5.4 L16.8 5.4" />
        <path d="M8 3.4 L12 3.4 L12 5.2 L8 5.2 Z" />
        <path d="M4.4 5.6 L5.4 16.5 Q5.5 17.2 6.2 17.2 L13.8 17.2 Q14.5 17.2 14.6 16.5 L15.6 5.6" />
        <path d="M8.2 8.4 L8.6 14.6" />
        <path d="M11.8 8.4 L11.4 14.6" />
      </g>
    </svg>
  )
}

export function Undo({ size = 16, opacity = 1 }: DoodleProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" style={{ display: 'block', opacity, overflow: 'visible' }} aria-hidden>
      <g fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 7.5 Q 3 3.2 8 3.2 Q 13 3.2 13 8.5 Q 13 12.5 9 12.5" />
        <path d="M3 7.5 L 1.2 6.2" />
        <path d="M3 7.5 L 5 6.5" />
      </g>
    </svg>
  )
}

// ─── Pickers ───
export function ClockIcon() {
  return (
    <svg width={14} height={14} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'block' }}>
      <circle cx="8" cy="8" r="6" />
      <path d="M8 4.5 V 8 L 10.5 9.5" />
    </svg>
  )
}

export function CalendarPlusIcon() {
  return (
    <svg width={14} height={14} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'block' }}>
      <rect x="2.2" y="3.5" width="11.6" height="10.3" rx="1" />
      <path d="M2.2 6.5 H 13.8" />
      <path d="M5 2 V 4.5" />
      <path d="M11 2 V 4.5" />
      <path d="M8 9 V 12" />
      <path d="M6.5 10.5 H 9.5" />
    </svg>
  )
}

// ─── Empty state ───
export function DownArrow({ opacity = 0.5 }: { opacity?: number }) {
  return (
    <svg width={40} height={56} viewBox="0 0 40 56" style={{ display: 'block', opacity, overflow: 'visible' }} aria-hidden>
      <g fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 4 C 26 12 12 22 24 30 C 32 36 16 42 22 48" />
        <path d="M16 42 L 22 48 L 28 42" />
      </g>
    </svg>
  )
}

export function Notebook({ size = 60, opacity = 0.5 }: DoodleProps) {
  return (
    <svg width={size} height={size * 1.12} viewBox="0 0 50 56" style={{ display: 'block', opacity, overflow: 'visible' }} aria-hidden>
      <g fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round">
        <rect x="5" y="4" width="40" height="48" rx="1.5" />
        <line x1="13" y1="6" x2="13" y2="50" />
        <path d="M11 11 Q 13 11 13.5 13 Q 13 15 11 15" />
        <path d="M11 20 Q 13 20 13.5 22 Q 13 24 11 24" />
        <path d="M11 29 Q 13 29 13.5 31 Q 13 33 11 33" />
        <path d="M11 38 Q 13 38 13.5 40 Q 13 42 11 42" />
        <circle cx="19" cy="16" r="1.1" fill="currentColor" stroke="none" />
        <path d="M22 16 L 39 16" opacity=".55" />
        <circle cx="19" cy="26" r="1.1" fill="currentColor" stroke="none" />
        <path d="M22 26 L 35 26" opacity=".55" />
        <circle cx="19" cy="36" r="1.1" fill="currentColor" stroke="none" />
        <path d="M22 36 L 37 36" opacity=".4" />
      </g>
    </svg>
  )
}

// ─── Mascots ───
export function MascotMountain({ size = 90 }: { size?: number }) {
  return (
    <svg viewBox="0 0 100 56" width={size} height={size * 0.56} style={{ display: 'block', overflow: 'visible' }}>
      <g fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
        <circle className="bj-mtn-sun" cx="72" cy="16" r="5" />
        <path d="M4 46 L 26 18 L 42 32 L 60 12 L 76 26 L 88 18 L 96 46" />
        <path d="M0 46 L 100 46" opacity=".35" />
      </g>
    </svg>
  )
}

export function MascotMoon({ size = 70 }: { size?: number }) {
  return (
    <svg viewBox="0 0 60 56" width={size * 0.85} height={size * 0.79} style={{ display: 'block', overflow: 'visible' }}>
      <g fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
        <path d="M40 6 A 22 22 0 1 0 40 50 A 16 22 0 1 1 40 6 Z" />
        <g className="bj-moon-stars">
          <circle cx="10" cy="16" r=".9" fill="currentColor" stroke="none" />
          <circle cx="14" cy="32" r=".9" fill="currentColor" stroke="none" />
          <circle cx="8"  cy="46" r=".9" fill="currentColor" stroke="none" />
        </g>
      </g>
    </svg>
  )
}

export function MascotPlant({ size = 70 }: { size?: number }) {
  return (
    <svg viewBox="0 0 60 60" width={size} height={size} style={{ display: 'block', overflow: 'visible' }}>
      <g fill="none" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round">
        <line x1="30" y1="55" x2="30" y2="28" />
        <path className="bj-leaf bj-leaf-l" d="M30 38 Q 14 28 18 12 Q 30 20 30 38" />
        <path className="bj-leaf bj-leaf-r" d="M30 28 Q 46 16 44 4 Q 32 12 30 28" />
      </g>
    </svg>
  )
}

export function MascotFrog({ size = 70 }: { size?: number }) {
  return (
    <svg viewBox="0 0 60 60" width={size} height={size} style={{ display: 'block', overflow: 'visible' }}>
      <g fill="none" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round">
        <path d="M10 35 Q 8 20 18 16 Q 30 12 42 16 Q 52 20 50 35 Q 50 50 30 52 Q 10 50 10 35 Z" />
        <path d="M6 18 Q 10 10 18 16" />
        <path d="M54 18 Q 50 10 42 16" />
        <g className="bj-frog-eyes">
          <circle cx="21" cy="22" r="3.5" />
          <circle cx="39" cy="22" r="3.5" />
          <circle cx="22" cy="23" r="1" fill="currentColor" stroke="none" />
          <circle cx="40" cy="23" r="1" fill="currentColor" stroke="none" />
        </g>
        <path d="M24 36 Q 30 40 36 36" />
      </g>
    </svg>
  )
}

export function MascotRocket({ size = 80 }: { size?: number }) {
  return (
    <svg viewBox="0 0 80 90" width={size} height={size * 1.125} style={{ display: 'block', overflow: 'visible' }}>
      <g fill="none" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round">
        <path d="M40 10 Q 52 18 54 40 L 54 62 Q 46 70 40 72 Q 34 70 26 62 L 26 40 Q 28 18 40 10 Z" />
        <path d="M26 50 Q 16 56 14 68 L 26 62" />
        <path d="M54 50 Q 64 56 66 68 L 54 62" />
        <path className="bj-rocket-flame" d="M32 72 Q 40 82 48 72" />
        <circle cx="40" cy="38" r="6" />
        <g className="bj-rocket-stars">
          <circle cx="14" cy="20" r=".8" fill="currentColor" stroke="none" />
          <circle cx="68" cy="30" r=".8" fill="currentColor" stroke="none" />
          <circle cx="10" cy="46" r=".8" fill="currentColor" stroke="none" />
        </g>
      </g>
    </svg>
  )
}
