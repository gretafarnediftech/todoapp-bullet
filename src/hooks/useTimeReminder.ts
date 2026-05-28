import { useEffect, useRef } from 'react'

/**
 * Fires onEveningBanner once per session when the clock reaches 18:00.
 *
 * The callback must return true if the banner was actually displayed.
 * If it returns false (e.g. no active tasks at that moment), the slot
 * is preserved and the callback is retried on the next 60-second tick,
 * so navigating into a period view after 18:00 will still trigger it.
 */
export function useTimeReminder(onEveningBanner: () => boolean): void {
  const banneredRef = useRef(false)
  const cb = useRef(onEveningBanner)
  cb.current = onEveningBanner

  useEffect(() => {
    function check() {
      if (!banneredRef.current && new Date().getHours() >= 18) {
        if (cb.current()) banneredRef.current = true
      }
    }

    check()
    const id = setInterval(check, 60_000)
    return () => clearInterval(id)
  }, [])
}
