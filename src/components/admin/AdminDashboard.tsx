'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { Mail, Plus, ChevronRight, Gift, UserPlus, ChevronDown, LogOut } from 'lucide-react'
import { StatusBadge } from '@/components/ui/Badge'
import { CapacitySlider } from './CapacitySlider'
import { InviteGuestModal } from './InviteGuestModal'
import { GuestActions } from './GuestActions'
import { DemandesSection } from './DemandesSection'
import type { EventWithStats, Guest, Event, GuestStatus, PreRegistration } from '@/lib/types'
import { formatDate, formatTime } from '@/lib/utils'

interface Props {
  event: EventWithStats
  allEvents: Event[]
  guests: Guest[]
  demandes: PreRegistration[]
}

export function AdminDashboard({ event, allEvents, guests: initialGuests, demandes }: Props) {
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
    { key: 'all' as const,       label: 'Toutes',                count: guests.length },
    { key: 'confirmed' as const, label: 'Confirmées',            count: confirmedCount },
    { key: 'pending' as const,   label: 'En attente de réponse', count: pendingGuests.length },
    { key: 'declined' as const,  label: 'Déclinées',             count: guests.filter(g => g.status === 'declined').length },
  ]

  return (
    <div className="min-h-screen bg-white">

      {/* ── HEADER NOIR ────────────────────────────────────── */}
      <header className="sticky top-0 z-30 bg-black border-b border-white/10 px-5 py-4">
        <div className="flex items-center justify-between max-w-2xl mx-auto">
          <a href="/admin"><Image src="/logo.png" alt="Nanawax" width={65} height={29} unoptimized className="invert" /></a>
          <div className="flex items-center gap-3">
            <a
              href="/admin/events/new"
              className="flex items-center gap-2 bg-nw-camel text-white text-[11px] font-display uppercase tracking-[0.12em] px-4 py-2.5 hover:bg-[#a3744e] transition-colors"
            >
              <Plus size={13} />
              Nouvel événement
            </a>
            <button onClick={handleLogout} className="text-white/40 hover:text-white transition-colors">
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
              className="w-full flex items-center justify-between border border-black/15 px-4 py-3 hover:border-black/40 transition-colors"
            >
              <div className="text-left">
                <p className="text-[9px] font-display uppercase tracking-[0.2em] text-black/40 mb-0.5">Événement actif</p>
                <p className="text-sm font-display font-light text-black">{event.name}</p>
              </div>
              <ChevronDown size={15} className={`text-black/50 transition-transform ${showEventPicker ? 'rotate-180' : ''}`} />
            </button>
            {showEventPicker && (
              <div className="absolute top-full left-0 right-0 z-20 bg-white border border-black/15 border-t-0 shadow-lg">
                {allEvents.map(e => (
                  <a
                    key={e.id}
                    href={`/admin?event=${e.id}`}
                    className={`flex items-center justify-between px-4 py-3 hover:bg-black/3 transition-colors ${e.id === event.id ? 'text-nw-camel' : 'text-black'}`}
                  >
                    <span className="text-sm font-display font-light">{e.name}</span>
                    <span className="text-[10px] text-black/40">{new Date(e.date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })}</span>
                  </a>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── TITRE ÉVÉNEMENT ───────────────────────────────── */}
        <div className="pt-2">
          <p className="text-[10px] font-display uppercase tracking-[0.25em] text-nw-camel mb-2">Événement</p>
          <h1 className="font-display font-thin text-3xl text-black leading-tight mb-2">{event.name}</h1>
          <p className="text-sm text-black">{formatDate(event.date)} · {formatTime(event.date)}</p>
          <p className="text-xs text-black/60 mt-0.5">{event.location}</p>
        </div>

        {/* ── PLACES ─────────────────────────────────────────── */}
        <div className="border border-black/15 p-6">
          <p className="text-[10px] font-display uppercase tracking-[0.2em] text-black mb-6">
            Gestion des places
          </p>
          <CapacitySlider
            eventId={event.id}
            initialCapacity={event.capacity}
            confirmed={event.confirmed_count}
            pending={event.pending_count}
            declined={event.declined_count}
          />
        </div>

        {/* ── ACTIONS ───────────────────────────────────────── */}
        <div className="space-y-2">
          <a href={`/admin/events/${event.id}/pre-register`}
            className="flex items-center justify-between bg-nw-camel/8 border border-nw-camel/50 p-5 hover:bg-nw-camel/15 transition-colors group">
            <div className="flex items-center gap-4">
              <div className="w-9 h-9 bg-nw-camel/20 flex items-center justify-center shrink-0">
                <UserPlus size={16} className="text-nw-camel" />
              </div>
              <div>
                <p className="text-sm font-display font-light text-black">Liens d'inscription VIP</p>
                <p className="text-xs text-black/60 mt-0.5">Générer des liens personnels</p>
              </div>
            </div>
            <ChevronRight size={16} className="text-nw-camel/50 group-hover:text-nw-camel transition-colors" />
          </a>

          <a href={`/admin/events/${event.id}/catalog`}
            className="flex items-center justify-between bg-nw-blue/5 border border-nw-blue/30 p-5 hover:bg-nw-blue/10 transition-colors group">
            <div className="flex items-center gap-4">
              <div className="w-9 h-9 bg-nw-blue/15 flex items-center justify-center shrink-0">
                <span className="text-base">👗</span>
              </div>
              <div>
                <p className="text-sm font-display font-light text-black">Catalogue privé</p>
                <p className="text-xs text-black/60 mt-0.5">Pièces visibles après confirmation</p>
              </div>
            </div>
            <ChevronRight size={16} className="text-nw-blue/40 group-hover:text-nw-blue transition-colors" />
          </a>

          <a href={`/admin/events/${event.id}/messages`}
            className="flex items-center justify-between bg-nw-sage/5 border border-nw-sage/30 p-5 hover:bg-nw-sage/10 transition-colors group">
            <div className="flex items-center gap-4">
              <div className="w-9 h-9 bg-nw-sage/15 flex items-center justify-center shrink-0">
                <Gift size={16} className="text-nw-sage" />
              </div>
              <div>
                <p className="text-sm font-display font-light text-black">Messagerie & cadeaux</p>
                <p className="text-xs text-black/60 mt-0.5">Billets, fichiers, messages exclusifs</p>
              </div>
            </div>
            <ChevronRight size={16} className="text-nw-sage/40 group-hover:text-nw-sage transition-colors" />
          </a>
        </div>

        {/* ── DEMANDES EN ATTENTE ───────────────────────────── */}
        <DemandesSection demandes={demandes} eventId={event.id} eventName={event.name} />

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
                    ? 'bg-black text-white'
                    : 'text-black border border-black/20 hover:border-black/50'
                }`}
              >
                {f.label}
                <span className={`text-[9px] ${filter === f.key ? 'text-white/60' : 'text-black/40'}`}>
                  {f.count}
                </span>
              </button>
            ))}
          </div>

          {/* Rows */}
          <div className="divide-y divide-black/8">
            {filteredGuests.length === 0 && (
              <p className="text-sm text-black/40 text-center py-8">Aucune invitée dans cette catégorie.</p>
            )}
            {filteredGuests.map(guest => (
              <div key={guest.id} className="flex items-center gap-3 py-4">
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-display font-light text-black">{guest.name}</p>
                  <p className="text-xs text-black/40 truncate">{guest.email}</p>
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
            className="mt-5 w-full border border-dashed border-black/20 py-4 flex items-center justify-center gap-2 text-[11px] font-display uppercase tracking-[0.12em] text-black/50 hover:border-nw-camel hover:text-nw-camel transition-colors"
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
              className="w-full flex items-center justify-center gap-3 bg-black text-white font-display font-light text-sm uppercase tracking-[0.12em] py-5 hover:bg-nw-camel transition-colors disabled:opacity-50"
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
