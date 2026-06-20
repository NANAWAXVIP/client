'use client'

import { useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'

const IDLE_MS = 2 * 60 * 1000 // 2 minutes d'inactivité

export function IdleLogout() {
  const router = useRouter()
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    async function logout() {
      await fetch('/api/admin-login', { method: 'DELETE' })
      router.push('/espace-maureen')
    }

    function reset() {
      if (timer.current) clearTimeout(timer.current)
      timer.current = setTimeout(logout, IDLE_MS)
    }

    const events = ['mousemove', 'mousedown', 'keydown', 'touchstart', 'scroll', 'click']
    events.forEach(e => window.addEventListener(e, reset, { passive: true }))
    reset()

    return () => {
      if (timer.current) clearTimeout(timer.current)
      events.forEach(e => window.removeEventListener(e, reset))
    }
  }, [router])

  return null
}
