'use client'

import { useState } from 'react'
import { Check, X, RotateCcw } from 'lucide-react'
import type { GuestStatus } from '@/lib/types'

interface Props {
  guestId: string
  eventId: string
  currentStatus: GuestStatus
  onUpdate: (guestId: string, newStatus: GuestStatus) => void
}

export function GuestActions({ guestId, eventId, currentStatus, onUpdate }: Props) {
  const [loading, setLoading] = useState(false)

  async function updateStatus(status: GuestStatus) {
    setLoading(true)
    try {
      const res = await fetch(`/api/events/${eventId}/guests/${guestId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      })
      if (res.ok) onUpdate(guestId, status)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <span className="text-[10px] text-nw-white/25">…</span>
  }

  if (currentStatus === 'pending') {
    return (
      <div className="flex items-center gap-1.5 shrink-0">
        <button
          onClick={() => updateStatus('confirmed')}
          title="Confirmer"
          className="w-7 h-7 flex items-center justify-center bg-nw-sage/20 border border-nw-sage/30 hover:bg-nw-sage/40 transition-colors"
        >
          <Check size={12} className="text-nw-sage" />
        </button>
        <button
          onClick={() => updateStatus('declined')}
          title="Refuser"
          className="w-7 h-7 flex items-center justify-center bg-nw-white/6 border border-nw-white/10 hover:bg-red-500/20 hover:border-red-500/30 transition-colors"
        >
          <X size={12} className="text-nw-white/40" />
        </button>
      </div>
    )
  }

  if (currentStatus === 'confirmed') {
    return (
      <button
        onClick={() => updateStatus('pending')}
        title="Remettre en attente"
        className="w-7 h-7 flex items-center justify-center bg-nw-white/4 border border-nw-white/8 hover:bg-nw-white/10 transition-colors opacity-0 group-hover:opacity-100"
      >
        <RotateCcw size={10} className="text-nw-white/30" />
      </button>
    )
  }

  if (currentStatus === 'declined') {
    return (
      <button
        onClick={() => updateStatus('pending')}
        title="Remettre en attente"
        className="w-7 h-7 flex items-center justify-center bg-nw-white/4 border border-nw-white/8 hover:bg-nw-white/10 transition-colors opacity-0 group-hover:opacity-100"
      >
        <RotateCcw size={10} className="text-nw-white/30" />
      </button>
    )
  }

  return null
}
