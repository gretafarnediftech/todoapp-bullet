import { useEffect, useRef } from 'react'

/**
 * Runs a 60-second interval to detect time-based triggers:
 * - 18:00: fires onEveningBanner (once per session)
 * - 00:01: fires onMorningRitual (once per session)
 *
 * Both checks also run immediately on mount so the app responds
 * correctly if opened after the threshold has already passed.
 */
export function useTimeReminder(
  onEveningBanner: () => void,
  onMorningRitual: () => void,
): void {
  const banneredRef = useRef(false)
  const ritualRef = useRef(false)

  // Always call the latest version of the callbacks without restarting the interval
  const cbBanner = useRef(onEveningBanner)
  const cbRitual = useRef(onMorningRitual)
  cbBanner.current = onEveningBanner
  cbRitual.current = onMorningRitual

  useEffect(() => {
    function check() {
      const now = new Date()
      const h = now.getHours()
      const m = now.getMinutes()

      if (!banneredRef.current && h >= 18) {
        banneredRef.current = true
        cbBanner.current()
      }

      if (!ritualRef.current && h === 0 && m >= 1) {
        ritualRef.current = true
        cbRitual.current()
      }
    }

    check()
    const id = setInterval(check, 60_000)
    return () => clearInterval(id)
  }, []) // intentionally run once — callbacks are read via refs
}
