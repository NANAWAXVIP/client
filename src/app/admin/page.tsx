import { createClient } from '@/lib/supabase/server'
import { AdminDashboard } from '@/components/admin/AdminDashboard'
import type { EventWithStats, Guest } from '@/lib/types'

export const revalidate = 0

export default async function AdminPage() {
  const supabase = await createClient()

  const { data: event } = await supabase
    .from('events')
    .select('*')
    .order('date', { ascending: false })
    .limit(1)
    .single()

  if (!event) {
    return (
      <div className="min-h-screen bg-nw-white flex items-center justify-center">
        <div className="text-center space-y-3">
          <p className="font-display font-light text-lg">Aucun événement</p>
          <a href="/admin/events/new" className="text-sm text-nw-camel underline">
            Créer le premier événement →
          </a>
        </div>
      </div>
    )
  }

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

  return <AdminDashboard event={eventWithStats} guests={list} />
}
