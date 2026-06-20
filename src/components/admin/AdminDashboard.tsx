'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { Mail, Plus, ChevronRight, Gift, UserPlus, ChevronDown, LogOut, Scan, MapPin, Calendar } from 'lucide-react'
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

function Initials({ name }: { name: string }) {
  const parts = name.trim().split(' ')
  const letters = parts.length >= 2
    ? parts[0][0] + parts[parts.length - 1][0]
    : parts[0].slice(0, 2)
  return (
    <div className="w-9 h-9 rounded-full bg-nw-camel/15 border border-nw-camel/30 flex items-center justify-center shrink-0">
      <span className="text-[10px] font-display font-bold text-nw-camel uppercase tracking-wide">{letters}</span>
    </div>
  )
}

const statusColor: Record<string, string> = {
  confirmed: 'bg-emerald-500',
  pending:   'bg-amber-400',
  declined:  'bg-red-400',
}
const statusLabel: Record<string, string> = {
  confirmed: 'Confirmée',
  pending:   'En attente',
  declined:  'Déclinée',
}

export function AdminDashboard({ event, allEvents, guests: initialGuests, demandes }: Props) {
  const router = useRouter()
  const [guests, setGuests] = useState<Guest[]>(initialGuests)
  const [showInvite, setShowInvite] = useState(false)
  const [reminding, setReminding] = useState(false)
  const [reminderSent, setReminderSent] = useState(false)
  const [reminderDays, setReminderDays] = useState<0 | 3 | 7>(0)
  const [filter, setFilter] = useState<'all' | 'confirmed' | 'pending' | 'declined'>('all')
  const [showEventPicker, setShowEventPicker] = useState(false)
  const [live, setLive] = useState(false)
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null)

  function handleGuestUpdate(guestId: string, newStatus: GuestStatus) {
    setGuests(prev => prev.map(g => g.id === guestId ? { ...g, status: newStatus } : g))
  }

  useEffect(() => {
    async function poll() {
      try {
        const res = await fetch(`/api/events/${event.id}/guests`)
        if (res.ok) {
          setGuests(await res.json())
          setLive(true)
          setTimeout(() => setLive(false), 1500)
        }
      } catch { /* silencieux */ }
    }
    pollRef.current = setInterval(poll, 30_000)
    return () => { if (pollRef.current) clearInterval(pollRef.current) }
  }, [event.id])

  const confirmedCount = guests.filter(g => g.status === 'confirmed').length
  const declinedCount  = guests.filter(g => g.status === 'declined').length
  const pendingGuests  = guests.filter(g => g.status === 'pending')
  const remaining      = Math.max(0, event.capacity - confirmedCount)
  const filteredGuests = filter === 'all' ? guests : guests.filter(g => g.status === filter)

  const pendingToRemind = reminderDays === 0
    ? pendingGuests
    : pendingGuests.filter(g => {
        const days = (Date.now() - new Date(g.created_at).getTime()) / 86_400_000
        return days >= reminderDays
      })

  async function handleRemind() {
    if (pendingToRemind.length === 0) return
    setReminding(true)
    try {
      await fetch(`/api/events/${event.id}/email/remind?minDays=${reminderDays}`, { method: 'POST' })
      setReminderSent(true)
    } finally {
      setReminding(false)
    }
  }

  async function handleLogout() {
    await fetch('/api/admin-login', { method: 'DELETE' })
    router.push('/espace-maureen')
  }

  const stats = [
    { label: 'Confirmées',   value: confirmedCount,      accent: 'text-emerald-400' },
    { label: 'En attente',   value: pendingGuests.length, accent: 'text-amber-400'  },
    { label: 'Déclinées',    value: declinedCount,        accent: 'text-red-400'    },
    { label: 'Places libres',value: remaining,            accent: 'text-nw-camel'   },
  ]

  const filterTabs = [
    { key: 'all' as const,       label: 'Toutes',     count: guests.length },
    { key: 'confirmed' as const, label: 'Confirmées', count: confirmedCount },
    { key: 'pending' as const,   label: 'En attente', count: pendingGuests.length },
    { key: 'declined' as const,  label: 'Déclinées',  count: declinedCount },
  ]

  return (
    <div className="min-h-screen bg-[#F5F4F2]">

      {/* ── HEADER ──────────────────────────────────────────── */}
      <header className="sticky top-0 z-30 bg-black px-5 py-3.5">
        <div className="flex items-center justify-between max-w-2xl mx-auto">
          <a href="/admin">
            <Image src="/logo.png" alt="Nanawax" width={60} height={27} unoptimized className="invert" />
          </a>
          <div className="flex items-center gap-2">
            <span className={`w-1.5 h-1.5 rounded-full transition-colors duration-500 ${live ? 'bg-emerald-400' : 'bg-white/15'}`} />
            <a
              href={`/admin/events/${event.id}/checkin`}
              className="flex items-center gap-1.5 border border-white/15 text-white/60 text-[10px] font-display uppercase tracking-[0.12em] px-3 py-2 hover:border-nw-camel hover:text-nw-camel transition-colors"
              title="Check-in jour J"
            >
              <Scan size={12} />
              Check-in
            </a>
            <a
              href="/admin/events/new"
              className="flex items-center gap-1.5 bg-nw-camel text-white text-[10px] font-display uppercase tracking-[0.12em] px-3 py-2 hover:bg-[#a3744e] transition-colors"
            >
              <Plus size={12} />
              Événement
            </a>
            <button onClick={handleLogout} className="text-white/30 hover:text-white transition-colors ml-1">
              <LogOut size={14} />
            </button>
          </div>
        </div>
      </header>

      {/* ── HERO SOMBRE ─────────────────────────────────────── */}
      <div className="bg-black pb-0">
        <div className="max-w-2xl mx-auto px-5 pt-7 pb-6">

          {/* Sélecteur événement */}
          {allEvents.length > 1 && (
            <div className="relative mb-5">
              <button
                onClick={() => setShowEventPicker(s => !s)}
                className="flex items-center gap-2 text-white/40 hover:text-white/70 transition-colors"
              >
                <span className="text-[10px] font-display uppercase tracking-[0.2em]">{event.name}</span>
                <ChevronDown size={12} className={`transition-transform ${showEventPicker ? 'rotate-180' : ''}`} />
              </button>
              {showEventPicker && (
                <div className="absolute top-full left-0 z-20 mt-2 min-w-[220px] bg-[#111] border border-white/10 shadow-2xl">
                  {allEvents.map(e => (
                    <a
                      key={e.id}
                      href={`/admin?event=${e.id}`}
                      className={`flex items-center justify-between px-4 py-3 hover:bg-white/5 transition-colors ${e.id === event.id ? 'text-nw-camel' : 'text-white/70'}`}
                    >
                      <span className="text-sm font-display font-light">{e.name}</span>
                      <span className="text-[10px] text-white/30 ml-4">
                        {new Date(e.date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })}
                      </span>
                    </a>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Nom + infos */}
          <h1 className="font-display font-thin text-3xl text-white leading-snug mb-3">{event.name}</h1>
          <div className="flex flex-wrap gap-x-5 gap-y-1 text-white text-xs font-display">
            <span className="flex items-center gap-1.5">
              <Calendar size={11} />
              {formatDate(event.date)} · {formatTime(event.date)}
            </span>
            <span className="flex items-center gap-1.5">
              <MapPin size={11} />
              {event.location}
            </span>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-4 gap-3 mt-6">
            {stats.map(s => (
              <div key={s.label} className="bg-white/5 border border-white/8 rounded-sm px-3 py-3 text-center">
                <p className={`text-2xl font-display font-thin ${s.accent}`}>{s.value}</p>
                <p className="text-[9px] font-display uppercase tracking-[0.15em] text-white/70 mt-1 leading-tight">{s.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Barre de remplissage */}
        <div className="h-0.5 bg-white/8">
          <div
            className="h-full bg-nw-camel transition-all duration-700"
            style={{ width: event.capacity ? `${(confirmedCount / event.capacity) * 100}%` : '0%' }}
          />
        </div>
      </div>

      {/* ── CONTENU ─────────────────────────────────────────── */}
      <div className="px-5 py-6 max-w-2xl mx-auto space-y-5">

        {/* Capacité */}
        <div className="bg-white border border-black/8 rounded-sm p-5 shadow-sm">
          <p className="text-[10px] font-display uppercase tracking-[0.2em] text-black/40 mb-4">Capacité totale</p>
          <CapacitySlider
            eventId={event.id}
            initialCapacity={event.capacity}
            confirmed={confirmedCount}
            pending={pendingGuests.length}
            declined={declinedCount}
          />
        </div>

        {/* Actions */}
        <div className="grid grid-cols-3 gap-2">
          {[
            { href: `/admin/events/${event.id}/pre-register`, icon: <UserPlus size={15} />, label: 'Inscriptions', sub: 'Liens VIP' },
            { href: `/admin/events/${event.id}/catalog`,      icon: <span className="text-sm">👗</span>, label: 'Catalogue', sub: 'Pièces privées' },
            { href: `/admin/events/${event.id}/messages`,     icon: <Gift size={15} />,    label: 'Messages', sub: 'Billets & fichiers' },
          ].map(a => (
            <a
              key={a.href}
              href={a.href}
              className="bg-white border border-black/8 rounded-sm p-4 flex flex-col gap-3 hover:border-nw-camel/50 hover:shadow-md transition-all group"
            >
              <span className="text-nw-camel">{a.icon}</span>
              <div>
                <p className="text-xs font-display font-light text-black">{a.label}</p>
                <p className="text-[10px] text-black/40 mt-0.5">{a.sub}</p>
              </div>
              <ChevronRight size={12} className="text-black/20 group-hover:text-nw-camel transition-colors self-end mt-auto" />
            </a>
          ))}
        </div>

        {/* Demandes */}
        <DemandesSection demandes={demandes} eventId={event.id} eventName={event.name} />

        {/* Liste invitées */}
        <div className="bg-white border border-black/8 rounded-sm shadow-sm overflow-hidden">
          {/* Onglets filtre */}
          <div className="flex border-b border-black/8">
            {filterTabs.map(f => (
              <button
                key={f.key}
                onClick={() => setFilter(f.key)}
                className={`flex-1 py-3 text-[10px] font-display uppercase tracking-[0.1em] transition-colors ${
                  filter === f.key
                    ? 'bg-black text-white'
                    : 'text-black/40 hover:text-black hover:bg-black/3'
                }`}
              >
                {f.label}
                <span className={`ml-1 ${filter === f.key ? 'text-white/50' : 'text-black/30'}`}>
                  {f.count}
                </span>
              </button>
            ))}
          </div>

          {/* Lignes */}
          <div className="divide-y divide-black/5">
            {filteredGuests.length === 0 && (
              <p className="text-sm text-black/30 text-center py-10">Aucune invitée.</p>
            )}
            {filteredGuests.map(guest => (
              <div key={guest.id} className="flex items-center gap-3 px-4 py-3.5">
                <Initials name={guest.name} />
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-display font-light text-black leading-tight">{guest.name}</p>
                  <p className="text-[10px] text-black/35 truncate mt-0.5">{guest.email}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="hidden sm:flex items-center gap-1.5">
                    <span className={`w-1.5 h-1.5 rounded-full ${statusColor[guest.status]}`} />
                    <span className="text-[10px] text-black/50">{statusLabel[guest.status]}</span>
                  </span>
                  <GuestActions
                    guestId={guest.id}
                    eventId={event.id}
                    currentStatus={guest.status}
                    onUpdate={handleGuestUpdate}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Bouton inviter */}
          <div className="border-t border-black/8 p-4">
            <button
              onClick={() => setShowInvite(true)}
              className="w-full border border-dashed border-black/20 py-3.5 flex items-center justify-center gap-2 text-[10px] font-display uppercase tracking-[0.12em] text-black/40 hover:border-nw-camel hover:text-nw-camel transition-colors rounded-sm"
            >
              <Plus size={12} />
              Inviter une nouvelle cliente
            </button>
          </div>
        </div>

        {/* Relance ciblée */}
        {pendingGuests.length > 0 && (
          <div className="bg-white border border-black/8 rounded-sm shadow-sm p-5 space-y-4">
            <p className="text-[10px] font-display uppercase tracking-[0.2em] text-black/40">Relance</p>
            {!reminderSent && (
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs text-black/50 shrink-0">En attente depuis</span>
                {([0, 3, 7] as const).map(d => (
                  <button
                    key={d}
                    onClick={() => setReminderDays(d)}
                    className={`text-[10px] font-display uppercase tracking-[0.1em] px-3 py-1.5 rounded-sm transition-colors ${
                      reminderDays === d ? 'bg-black text-white' : 'border border-black/15 text-black/60 hover:border-black/40'
                    }`}
                  >
                    {d === 0 ? 'Toutes' : `${d}j+`}
                  </button>
                ))}
              </div>
            )}
            <button
              disabled={reminding || reminderSent || pendingToRemind.length === 0}
              onClick={handleRemind}
              className="w-full flex items-center justify-center gap-2.5 bg-black text-white text-[11px] font-display uppercase tracking-[0.12em] py-4 rounded-sm hover:bg-nw-camel transition-colors disabled:opacity-40"
            >
              <Mail size={13} />
              {reminding    ? 'Envoi en cours…'
               : reminderSent ? `Relance envoyée · ${pendingToRemind.length}`
               : pendingToRemind.length === 0 ? 'Aucune à relancer'
               : `Relancer · ${pendingToRemind.length} invitée${pendingToRemind.length > 1 ? 's' : ''}`}
            </button>
          </div>
        )}

        <div className="pb-6" />
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
