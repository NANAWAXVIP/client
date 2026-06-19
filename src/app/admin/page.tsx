import { createClient } from '@/lib/supabase/server'
import { AdminDashboard } from '@/components/admin/AdminDashboard'
import Image from 'next/image'
import Link from 'next/link'
import type { EventWithStats, Guest } from '@/lib/types'

export const revalidate = 0

export default async function AdminPage({
  searchParams,
}: {
  searchParams: Promise<{ event?: string }>
}) {
  const { event: eventId } = await searchParams
  const supabase = await createClient()

  const { data: events } = await supabase
    .from('events')
    .select('*')
    .order('date', { ascending: false })

  if (!events || events.length === 0) {
    return (
      <div className="min-h-screen bg-nw-black flex flex-col">
        <header className="px-6 py-8 flex items-center justify-between border-b border-nw-white/8">
          <Image src="/logo.png" alt="Nanawax" width={120} height={54} unoptimized className="invert" />
        </header>
        <div className="flex-1 flex flex-col items-center justify-center px-6 text-center space-y-8">
          <div className="relative">
            <div className="absolute inset-0 pattern-wax opacity-[0.04]" />
            <div className="relative z-10 space-y-6 py-16 px-8">
              <p className="text-[10px] font-display uppercase tracking-[0.3em] text-nw-camel">Espace admin</p>
              <h1 className="font-display font-thin text-4xl text-nw-white">Aucun événement</h1>
              <p className="text-sm text-nw-white/40">Créez votre premier événement pour commencer.</p>
            </div>
          </div>
          <Link
            href="/admin/events/new"
            className="bg-nw-camel text-nw-white font-display font-light text-sm uppercase tracking-[0.15em] px-10 py-5 hover:bg-[#a3744e] transition-colors"
          >
            + Créer un événement
          </Link>
        </div>
      </div>
    )
  }

  // L'événement sélectionné via ?event= ou le plus récent par défaut
  const event = (eventId ? events.find(e => e.id === eventId) : null) ?? events[0]

  const { data: guests } = await supabase
    .from('guests')
    .select('*')
    .eq('event_id', event.id)
    .order('created_at', { ascending: false })

  const list: Guest[] = guests ?? []
  const confirmed_count = list.filter(g => g.status === 'confirmed').length
  const pending_count   = list.filter(g => g.status === 'pending').length
  const declined_count  = list.filter(g => g.status === 'declined').length

  const eventWithStats: EventWithStats = {
    ...event,
    confirmed_count,
    pending_count,
    declined_count,
    remaining_spots: Math.max(0, event.capacity - confirmed_count),
  }

  return <AdminDashboard event={eventWithStats} allEvents={events} guests={list} />
}
