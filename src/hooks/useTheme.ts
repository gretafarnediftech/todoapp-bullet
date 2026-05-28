import { useState, useCallback } from 'react'
import type { Palette } from '../types/entry'

const PALETTE_DEFS: Record<Palette, Record<string, string>> = {
  bw: {
    '--bj-bg':   '#fafaf7',
    '--bj-ink':  '#0a0a0a',
    '--bj-rule': 'rgba(0,0,0,0.10)',
    '--bj-soft': 'rgba(0,0,0,0.05)',
    '--bj-font': '"Kalam", system-ui, sans-serif',
    '--bj-ui-font': '"Inter", -apple-system, system-ui, sans-serif',
  },
  dark: {
    '--bj-bg':   '#0f0d0a',
    '--bj-ink':  '#f1ebde',
    '--bj-rule': 'rgba(241,235,222,0.16)',
    '--bj-soft': 'rgba(241,235,222,0.06)',
    '--bj-font': '"Kalam", system-ui, sans-serif',
    '--bj-ui-font': '"Inter", -apple-system, system-ui, sans-serif',
  },
}

export function useTheme() {
  const [palette, setPalette] = useState<Palette>('bw')

  const toggleDark = useCallback(() => {
    setPalette((p) => (p === 'dark' ? 'bw' : 'dark'))
  }, [])

  const themeStyle = PALETTE_DEFS[palette] as React.CSSProperties

  return { palette, toggleDark, themeStyle, isDark: palette === 'dark' }
}
