'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Mail, Plus, ChevronRight, Gift, UserPlus } from 'lucide-react'
import { StatusBadge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { CapacitySlider } from './CapacitySlider'
import { InviteGuestModal } from './InviteGuestModal'
import type { EventWithStats, Guest } from '@/lib/types'
import { formatDate, formatTime } from '@/lib/utils'

interface Props {
  event: EventWithStats
  guests: Guest[]
}

export function AdminDashboard({ event, guests }: Props) {
  const router = useRouter()
  const [showInvite, setShowInvite] = useState(false)
  const [reminding, setReminding] = useState(false)
  const [reminderSent, setReminderSent] = useState(false)
  const [filter, setFilter] = useState<'all' | 'confirmed' | 'pending' | 'declined'>('all')

  const pendingGuests = guests.filter(g => g.status === 'pending')
  const filteredGuests = filter === 'all' ? guests : guests.filter(g => g.status === filter)

  async function handleRemind() {
    setReminding(true)
    try {
      await fetch(`/api/events/${event.id}/email/remind`, { method: 'POST' })
      setReminderSent(true)
    } finally {
      setReminding(false)
    }
  }

  return (
    <div className="min-h-screen bg-nw-white">
      {/* Header */}
      <div className="border-b border-nw-black/8 px-5 py-4 flex items-center justify-between">
        <div>
          <p className="text-[9px] font-display uppercase tracking-[0.2em] text-nw-black/35">Espace admin</p>
          <p className="text-[10px] font-display uppercase tracking-[0.15em] text-nw-black/60 mt-0.5">nanawax</p>
        </div>
        <a
          href="/admin/events/new"
          className="flex items-center gap-1.5 text-[10px] font-display uppercase tracking-[0.12em] text-nw-camel hover:text-nw-black/70 transition-colors"
        >
          <Plus size={12} />
          Nouvel événement
        </a>
      </div>

      <div className="px-5 py-6 max-w-2xl mx-auto space-y-8">
        {/* Event title */}
        <div>
          <h1 className="font-display font-light text-2xl leading-snug">{event.name}</h1>
          <p className="text-sm text-nw-black/50 mt-1">
            {formatDate(event.date)} · {formatTime(event.date)}
          </p>
          <p className="text-sm text-nw-black/40">{event.location}</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-3">
          <div className="border border-nw-sage/30 bg-nw-sage/5 p-5">
            <p className="text-3xl font-display font-light text-nw-sage">{event.confirmed_count}</p>
            <p className="text-[10px] font-display uppercase tracking-[0.15em] text-nw-sage/70 mt-1">Confirmées</p>
          </div>
          <div className="border border-nw-camel/30 bg-nw-camel/5 p-5">
            <p className="text-3xl font-display font-light text-nw-camel">{event.pending_count}</p>
            <p className="text-[10px] font-display uppercase tracking-[0.15em] text-nw-camel/70 mt-1">En attente</p>
          </div>
        </div>

        {/* Capacity */}
        <div className="border border-nw-black/10 p-5">
          <p className="text-[10px] font-display uppercase tracking-[0.15em] text-nw-black/40 mb-5">
            Gestion des places
          </p>
          <CapacitySlider
            eventId={event.id}
            initialCapacity={event.capacity}
            confirmed={event.confirmed_count}
          />
        </div>

        {/* Quick links */}
        <div className="space-y-2">
          <a
            href={`/admin/events/${event.id}/pre-register`}
            className="flex items-center justify-between border border-nw-camel/25 bg-nw-camel/4 p-4 hover:border-nw-camel/50 transition-colors group"
          >
            <div className="flex items-center gap-3">
              <UserPlus size={15} className="text-nw-camel shrink-0" />
              <div>
                <p className="text-sm font-display font-light">Liens d'inscription VIP</p>
                <p className="text-xs text-nw-black/40 mt-0.5">Envoyer des liens personnels aux intéressées</p>
              </div>
            </div>
            <ChevronRight size={16} className="text-nw-camel/30 group-hover:text-nw-camel/60 transition-colors" />
          </a>
          <a
            href={`/admin/events/${event.id}/catalog`}
            className="flex items-center justify-between border border-nw-black/10 p-4 hover:border-nw-black/25 transition-colors group"
          >
            <div>
              <p className="text-sm font-display font-light">Catalogue privé</p>
              <p className="text-xs text-nw-black/40 mt-0.5">Pièces visibles après confirmation</p>
            </div>
            <ChevronRight size={16} className="text-nw-black/25 group-hover:text-nw-black/50 transition-colors" />
          </a>
          <a
            href={`/admin/events/${event.id}/messages`}
            className="flex items-center justify-between border border-nw-black/10 p-4 hover:border-nw-black/25 transition-colors group"
          >
            <div className="flex items-center gap-3">
              <Gift size={15} className="text-nw-camel shrink-0" />
              <div>
                <p className="text-sm font-display font-light">Messagerie & cadeaux</p>
                <p className="text-xs text-nw-black/40 mt-0.5">Billets, fichiers, messages exclusifs</p>
              </div>
            </div>
            <ChevronRight size={16} className="text-nw-black/25 group-hover:text-nw-black/50 transition-colors" />
          </a>
        </div>

        {/* Guest list */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <p className="text-[10px] font-display uppercase tracking-[0.15em] text-nw-black/40">
              Invitées · {guests.length}
            </p>
            <div className="flex gap-2">
              {(['all', 'confirmed', 'pending', 'declined'] as const).map(f => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`text-[9px] font-display uppercase tracking-[0.1em] px-2 py-1 transition-colors ${
                    filter === f ? 'bg-nw-black text-nw-white' : 'text-nw-black/40 hover:text-nw-black/70'
                  }`}
                >
                  {f === 'all' ? 'Toutes' : f === 'confirmed' ? 'Conf.' : f === 'pending' ? 'Att.' : 'Décl.'}
                </button>
              ))}
            </div>
          </div>

          <div className="divide-y divide-nw-black/6">
            {filteredGuests.map(guest => (
              <div key={guest.id} className="flex items-center justify-between py-3.5">
                <div className="min-w-0 pr-3">
                  <p className="text-sm font-display font-light">{guest.name}</p>
                  <p className="text-xs text-nw-black/35 truncate">{guest.email}</p>
                </div>
                <StatusBadge status={guest.status} />
              </div>
            ))}
          </div>

          <button
            onClick={() => setShowInvite(true)}
            className="mt-4 flex items-center gap-2 text-[11px] font-display uppercase tracking-[0.1em] text-nw-black/40 hover:text-nw-camel transition-colors"
          >
            <Plus size={12} />
            Inviter une nouvelle cliente
          </button>
        </div>

        {/* Reminder button */}
        {pendingGuests.length > 0 && (
          <div className="border-t border-nw-black/8 pt-6">
            <Button
              variant="secondary"
              size="md"
              className="w-full flex items-center gap-2"
              loading={reminding}
              disabled={reminderSent}
              onClick={handleRemind}
            >
              <Mail size={14} />
              {reminderSent
                ? `Relance envoyée (${pendingGuests.length})`
                : `Relancer les en attente (${pendingGuests.length})`}
            </Button>
            {reminderSent && (
              <p className="text-[10px] text-nw-black/40 text-center mt-2">
                Un email de relance a été envoyé à {pendingGuests.length} invitée{pendingGuests.length > 1 ? 's' : ''}.
              </p>
            )}
          </div>
        )}
      </div>

      {showInvite && (
        <InviteGuestModal
          eventId={event.id}
          onClose={() => setShowInvite(false)}
          onSuccess={() => router.refresh()}
        />
      )}
    </div>
  )
}
