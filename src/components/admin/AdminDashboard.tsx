'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { Mail, Plus, ChevronRight, Gift, UserPlus, ChevronDown, LogOut } from 'lucide-react'
import { StatusBadge } from '@/components/ui/Badge'
import { CapacitySlider } from './CapacitySlider'
import { InviteGuestModal } from './InviteGuestModal'
import { GuestActions } from './GuestActions'
import type { EventWithStats, Guest, Event, GuestStatus } from '@/lib/types'
import { formatDate, formatTime } from '@/lib/utils'

interface Props {
  event: EventWithStats
  allEvents: Event[]
  guests: Guest[]
}

export function AdminDashboard({ event, allEvents, guests: initialGuests }: Props) {
  const router = useRouter()
  const [guests, setGuests] = useState<Guest[]>(initialGuests)
  const [showInvite, setShowInvite] = useState(false)
  const [reminding, setReminding] = useState(false)
  const [reminderSent, setReminderSent] = useState(false)
  const [filter, setFilter] = useState<'all' | 'confirmed' | 'pending' | 'declined'>('all')
  const [showEventPicker, setShowEventPicker] = useState(false)

  function handleGuestUpdate(guestId: string, newStatus: GuestStatus) {
    setGuests(prev => prev.map(g => g.id === guestId ? { ...g, status: newStatus } : g))
  }

  const confirmedCount = guests.filter(g => g.status === 'confirmed').length
  const pendingGuests  = guests.filter(g => g.status === 'pending')
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

  async function handleLogout() {
    await fetch('/api/admin-login', { method: 'DELETE' })
    router.push('/espace-maureen')
  }

  const filters = [
    { key: 'all' as const,       label: 'Toutes',     count: guests.length },
    { key: 'confirmed' as const, label: 'Confirmées', count: confirmedCount },
    { key: 'pending' as const,   label: 'En attente', count: pendingGuests.length },
    { key: 'declined' as const,  label: 'Déclinées',  count: guests.filter(g => g.status === 'declined').length },
  ]

  return (
    <div className="min-h-screen bg-nw-black">

      {/* ── HEADER ─────────────────────────────────────────── */}
      <header className="sticky top-0 z-30 bg-nw-black/95 backdrop-blur-sm border-b border-nw-white/8 px-5 py-4">
        <div className="flex items-center justify-between max-w-2xl mx-auto">
          <Image src="/logo.png" alt="Nanawax" width={100} height={44} unoptimized className="invert" />
          <div className="flex items-center gap-3">
            <a
              href="/admin/events/new"
              className="flex items-center gap-2 bg-nw-camel text-nw-white text-[11px] font-display uppercase tracking-[0.12em] px-4 py-2.5 hover:bg-[#a3744e] transition-colors"
            >
              <Plus size={13} />
              Nouvel événement
            </a>
            <button onClick={handleLogout} className="text-nw-white/25 hover:text-nw-white/50 transition-colors">
              <LogOut size={15} />
            </button>
          </div>
        </div>
      </header>

      <div className="px-5 py-6 max-w-2xl mx-auto space-y-6">

        {/* ── SÉLECTEUR D'ÉVÉNEMENT ──────────────────────────── */}
        {allEvents.length > 1 && (
          <div className="relative">
            <button
              onClick={() => setShowEventPicker(s => !s)}
              className="w-full flex items-center justify-between bg-nw-white/5 border border-nw-white/10 px-4 py-3 hover:border-nw-white/20 transition-colors"
            >
              <div className="text-left">
                <p className="text-[9px] font-display uppercase tracking-[0.2em] text-nw-white/30 mb-0.5">Événement actif</p>
                <p className="text-sm font-display font-light text-nw-white">{event.name}</p>
              </div>
              <ChevronDown size={15} className={`text-nw-white/40 transition-transform ${showEventPicker ? 'rotate-180' : ''}`} />
            </button>
            {showEventPicker && (
              <div className="absolute top-full left-0 right-0 z-20 bg-[#1a1a1a] border border-nw-white/10 border-t-0">
                {allEvents.map(e => (
                  <a
                    key={e.id}
                    href={`/admin?event=${e.id}`}
                    className={`flex items-center justify-between px-4 py-3 hover:bg-nw-white/5 transition-colors ${e.id === event.id ? 'text-nw-camel' : 'text-nw-white/60'}`}
                  >
                    <span className="text-sm font-display font-light">{e.name}</span>
                    <span className="text-[10px] text-nw-white/25">{new Date(e.date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })}</span>
                  </a>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── TITRE ÉVÉNEMENT ───────────────────────────────── */}
        <div className="pt-2">
          <p className="text-[10px] font-display uppercase tracking-[0.25em] text-nw-camel mb-2">Événement</p>
          <h1 className="font-display font-thin text-3xl text-nw-white leading-tight mb-2">{event.name}</h1>
          <p className="text-sm text-nw-white/40">{formatDate(event.date)} · {formatTime(event.date)}</p>
          <p className="text-xs text-nw-white/25 mt-0.5">{event.location}</p>
        </div>

        {/* ── STATS ─────────────────────────────────────────── */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-nw-white/5 border border-nw-sage/20 p-6">
            <p className="text-5xl font-display font-thin text-nw-sage mb-2">{confirmedCount}</p>
            <p className="text-[10px] font-display uppercase tracking-[0.2em] text-nw-sage/60">Confirmées</p>
          </div>
          <div className="bg-nw-white/5 border border-nw-camel/20 p-6">
            <p className="text-5xl font-display font-thin text-nw-camel mb-2">{pendingGuests.length}</p>
            <p className="text-[10px] font-display uppercase tracking-[0.2em] text-nw-camel/60">En attente</p>
          </div>
        </div>

        {/* ── PLACES ─────────────────────────────────────────── */}
        <div className="bg-nw-white/5 border border-nw-white/8 p-6">
          <p className="text-[10px] font-display uppercase tracking-[0.2em] text-nw-white/30 mb-6">
            Gestion des places
          </p>
          <CapacitySlider eventId={event.id} initialCapacity={event.capacity} confirmed={event.confirmed_count} />
        </div>

        {/* ── ACTIONS ───────────────────────────────────────── */}
        <div className="space-y-2">
          <a href={`/admin/events/${event.id}/pre-register`}
            className="flex items-center justify-between bg-nw-camel/10 border border-nw-camel/25 p-5 hover:bg-nw-camel/15 transition-colors group">
            <div className="flex items-center gap-4">
              <div className="w-9 h-9 bg-nw-camel/20 flex items-center justify-center shrink-0">
                <UserPlus size={16} className="text-nw-camel" />
              </div>
              <div>
                <p className="text-sm font-display font-light text-nw-white">Liens d'inscription VIP</p>
                <p className="text-xs text-nw-white/35 mt-0.5">Générer des liens personnels</p>
              </div>
            </div>
            <ChevronRight size={16} className="text-nw-camel/40 group-hover:text-nw-camel transition-colors" />
          </a>

          <a href={`/admin/events/${event.id}/catalog`}
            className="flex items-center justify-between bg-nw-white/4 border border-nw-white/8 p-5 hover:bg-nw-white/8 transition-colors group">
            <div className="flex items-center gap-4">
              <div className="w-9 h-9 bg-nw-white/8 flex items-center justify-center shrink-0">
                <span className="text-base">👗</span>
              </div>
              <div>
                <p className="text-sm font-display font-light text-nw-white">Catalogue privé</p>
                <p className="text-xs text-nw-white/35 mt-0.5">Pièces visibles après confirmation</p>
              </div>
            </div>
            <ChevronRight size={16} className="text-nw-white/20 group-hover:text-nw-white/50 transition-colors" />
          </a>

          <a href={`/admin/events/${event.id}/messages`}
            className="flex items-center justify-between bg-nw-white/4 border border-nw-white/8 p-5 hover:bg-nw-white/8 transition-colors group">
            <div className="flex items-center gap-4">
              <div className="w-9 h-9 bg-nw-white/8 flex items-center justify-center shrink-0">
                <Gift size={16} className="text-nw-white/60" />
              </div>
              <div>
                <p className="text-sm font-display font-light text-nw-white">Messagerie & cadeaux</p>
                <p className="text-xs text-nw-white/35 mt-0.5">Billets, fichiers, messages exclusifs</p>
              </div>
            </div>
            <ChevronRight size={16} className="text-nw-white/20 group-hover:text-nw-white/50 transition-colors" />
          </a>
        </div>

        {/* ── LISTE INVITÉES ─────────────────────────────────── */}
        <div>
          {/* Filtres */}
          <div className="flex gap-1 mb-4 overflow-x-auto pb-1">
            {filters.map(f => (
              <button
                key={f.key}
                onClick={() => setFilter(f.key)}
                className={`flex items-center gap-1.5 text-[10px] font-display uppercase tracking-[0.1em] px-3 py-2 whitespace-nowrap transition-colors ${
                  filter === f.key
                    ? 'bg-nw-white text-nw-black'
                    : 'text-nw-white/40 hover:text-nw-white/70 border border-nw-white/10'
                }`}
              >
                {f.label}
                <span className={`text-[9px] ${filter === f.key ? 'text-nw-black/50' : 'text-nw-white/30'}`}>
                  {f.count}
                </span>
              </button>
            ))}
          </div>

          {/* Rows */}
          <div className="divide-y divide-nw-white/6">
            {filteredGuests.length === 0 && (
              <p className="text-sm text-nw-white/25 text-center py-8">Aucune invitée dans cette catégorie.</p>
            )}
            {filteredGuests.map(guest => (
              <div key={guest.id} className="flex items-center gap-3 py-4 group">
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-display font-light text-nw-white">{guest.name}</p>
                  <p className="text-xs text-nw-white/30 truncate">{guest.email}</p>
                </div>
                <StatusBadge status={guest.status} />
                <GuestActions
                  guestId={guest.id}
                  eventId={event.id}
                  currentStatus={guest.status}
                  onUpdate={handleGuestUpdate}
                />
              </div>
            ))}
          </div>

          {/* Inviter */}
          <button
            onClick={() => setShowInvite(true)}
            className="mt-5 w-full border border-dashed border-nw-white/15 py-4 flex items-center justify-center gap-2 text-[11px] font-display uppercase tracking-[0.12em] text-nw-white/40 hover:border-nw-camel/40 hover:text-nw-camel transition-colors"
          >
            <Plus size={13} />
            Inviter une nouvelle cliente
          </button>
        </div>

        {/* ── RELANCER ──────────────────────────────────────── */}
        {pendingGuests.length > 0 && (
          <div className="pb-8">
            <button
              disabled={reminding || reminderSent}
              onClick={handleRemind}
              className="w-full flex items-center justify-center gap-3 bg-nw-white text-nw-black font-display font-light text-sm uppercase tracking-[0.12em] py-5 hover:bg-nw-camel hover:text-nw-white transition-colors disabled:opacity-50"
            >
              <Mail size={15} />
              {reminding ? 'Envoi en cours…'
                : reminderSent ? `Relance envoyée (${pendingGuests.length})`
                : `Relancer les en attente · ${pendingGuests.length}`}
            </button>
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
