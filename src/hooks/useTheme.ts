import { useState, useEffect, useCallback } from 'react'
import type { ThemeMode } from '../types/entry'

const STORAGE_KEY = 'bj-theme'

const THEME_DEFS: Record<ThemeMode, Record<string, string>> = {
  light: {
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
  const [mode, setMode] = useState<ThemeMode>(() => {
    try {
      return localStorage.getItem(STORAGE_KEY) === 'dark' ? 'dark' : 'light'
    } catch {
      return 'light'
    }
  })

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, mode)
    } catch {
      // Storage unavailable (private browsing, sandboxed iframe) — ignore
    }
  }, [mode])

  const toggleDark = useCallback(() => {
    setMode((m) => (m === 'dark' ? 'light' : 'dark'))
  }, [])

  const themeStyle = THEME_DEFS[mode] as React.CSSProperties

  return { themeStyle, isDark: mode === 'dark', toggleDark }
}
