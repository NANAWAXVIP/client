'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { UserPlus } from 'lucide-react'
import type { PreRegistration } from '@/lib/types'

interface Props {
  demandes: PreRegistration[]
  eventId: string
  eventName: string
}

export function DemandesSection({ demandes: initial, eventId, eventName }: Props) {
  const router = useRouter()
  const [demandes, setDemandes] = useState(initial)
  const [inviting, setInviting] = useState<string | null>(null)

  async function handleInvite(demande: PreRegistration) {
    setInviting(demande.id)
    try {
      const res = await fetch(`/api/pre-registrations/${demande.id}/invite`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ eventId }),
      })
      if (res.ok) {
        setDemandes(prev => prev.filter(d => d.id !== demande.id))
        router.refresh()
      }
    } finally {
      setInviting(null)
    }
  }

  if (demandes.length === 0) return null

  return (
    <div className="border border-nw-camel/40 bg-nw-camel/5 p-5 space-y-4">
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-[10px] font-display uppercase tracking-[0.2em] text-nw-camel mb-1">
            Demandes — invitation à envoyer
          </p>
          <p className="text-[10px] text-black/50">
            Seront invitées à : <span className="text-black font-medium">{eventName}</span>
          </p>
        </div>
        <span className="text-[10px] font-display text-nw-camel bg-nw-camel/15 px-2 py-0.5 shrink-0">
          {demandes.length}
        </span>
      </div>

      <div className="h-px bg-black/8" />

      {/* Liste */}
      <div className="divide-y divide-black/8">
        {demandes.map(d => {
          const originalEvent  = (d as any).event?.name
          const differentEvent = originalEvent && d.event_id !== eventId

          return (
            <div key={d.id} className="flex items-center gap-3 py-3">
              <div className="min-w-0 flex-1">
                <p className="text-sm font-display font-light text-black">{d.name}</p>
                <p className="text-xs text-black/50 truncate">{d.email}</p>
                {d.phone && <p className="text-xs text-black/35 truncate">{d.phone}</p>}
                {differentEvent && (
                  <p className="text-[9px] text-nw-camel mt-1 truncate">
                    Demande initiale : {originalEvent}
                  </p>
                )}
              </div>
              <button
                onClick={() => handleInvite(d)}
                disabled={inviting === d.id}
                className="flex items-center gap-1.5 text-[10px] font-display uppercase tracking-[0.1em] bg-nw-camel text-white px-3 py-2 hover:bg-[#a3744e] transition-colors disabled:opacity-50 shrink-0"
              >
                <UserPlus size={11} />
                {inviting === d.id ? '…' : "Envoyer l'invitation"}
              </button>
            </div>
          )
        })}
      </div>
    </div>
  )
}
