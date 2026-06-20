'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { Check, ArrowLeft } from 'lucide-react'
import type { Guest, Event } from '@/lib/types'

interface Props {
  event: Event
  initialGuests: Guest[]
}

export function CheckinBoard({ event, initialGuests }: Props) {
  const router = useRouter()
  const [guests, setGuests] = useState<Guest[]>(initialGuests)
  const [loading, setLoading] = useState<string | null>(null)

  const checkedIn = guests.filter(g => g.checked_in).length

  async function toggle(guest: Guest) {
    setLoading(guest.id)
    const next = !guest.checked_in
    try {
      const res = await fetch(`/api/events/${event.id}/guests/${guest.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ checked_in: next }),
      })
      if (res.ok) {
        setGuests(prev =>
          prev.map(g => g.id === guest.id
            ? { ...g, checked_in: next, checked_in_at: next ? new Date().toISOString() : undefined }
            : g
          )
        )
      }
    } finally {
      setLoading(null)
    }
  }

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">

      {/* Header */}
      <header className="sticky top-0 z-30 bg-black border-b border-white/10 px-5 py-4">
        <div className="flex items-center justify-between max-w-xl mx-auto">
          <div className="flex items-center gap-3">
            <button onClick={() => router.back()} className="text-white/40 hover:text-white transition-colors">
              <ArrowLeft size={18} />
            </button>
            <Image src="/logo.png" alt="Nanawax" width={55} height={25} unoptimized className="invert" />
          </div>
          <div className="text-right">
            <p className="text-[10px] font-display uppercase tracking-[0.2em] text-nw-camel">Check-in</p>
            <p className="text-xl font-display font-thin">
              <span className="text-white">{checkedIn}</span>
              <span className="text-white/30"> / {guests.length}</span>
            </p>
          </div>
        </div>
      </header>

      {/* Event name */}
      <div className="px-5 py-5 max-w-xl mx-auto w-full border-b border-white/8">
        <p className="text-sm font-display font-light text-white/60">{event.name}</p>
        <div className="mt-2 h-1.5 bg-white/10 rounded-full overflow-hidden">
          <div
            className="h-full bg-nw-camel transition-all duration-500"
            style={{ width: guests.length ? `${(checkedIn / guests.length) * 100}%` : '0%' }}
          />
        </div>
      </div>

      {/* Guest list */}
      <div className="flex-1 px-5 py-4 max-w-xl mx-auto w-full">
        {guests.length === 0 && (
          <p className="text-center text-white/30 text-sm mt-12">Aucune invitée confirmée.</p>
        )}
        <div className="divide-y divide-white/8">
          {guests.map(guest => (
            <div key={guest.id} className="flex items-center gap-4 py-4">
              <div className="flex-1 min-w-0">
                <p className={`text-base font-display font-light transition-colors ${guest.checked_in ? 'text-white/40 line-through' : 'text-white'}`}>
                  {guest.name}
                </p>
                {guest.checked_in_at && (
                  <p className="text-[10px] text-nw-camel/70 mt-0.5">
                    {new Date(guest.checked_in_at).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                  </p>
                )}
              </div>
              <button
                onClick={() => toggle(guest)}
                disabled={loading === guest.id}
                className={`w-12 h-12 flex items-center justify-center transition-all shrink-0 ${
                  guest.checked_in
                    ? 'bg-nw-camel text-white'
                    : 'border border-white/20 text-white/20 hover:border-white/50 hover:text-white/50'
                } ${loading === guest.id ? 'opacity-40' : ''}`}
              >
                <Check size={20} strokeWidth={guest.checked_in ? 2.5 : 1.5} />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
