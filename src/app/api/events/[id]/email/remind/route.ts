import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { sendReminderEmail } from '@/lib/email'
import { sendWhatsAppReminder } from '@/lib/whatsapp'

interface Params { params: Promise<{ id: string }> }

export async function POST(req: NextRequest, { params }: Params) {
  const { id } = await params
  const minDays = Number(req.nextUrl.searchParams.get('minDays') ?? 0)
  const supabase = await createClient()

  const { data: event } = await supabase.from('events').select('*').eq('id', id).single()
  if (!event) return NextResponse.json({ error: 'Événement introuvable' }, { status: 404 })

  const { data: allPending } = await supabase
    .from('guests')
    .select('*')
    .eq('event_id', id)
    .eq('status', 'pending')

  const pendingGuests = minDays > 0
    ? (allPending ?? []).filter(g => {
        const days = (Date.now() - new Date(g.created_at).getTime()) / 86_400_000
        return days >= minDays
      })
    : (allPending ?? [])

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? 'http://localhost:3000'
  const results = await Promise.allSettled(
    (pendingGuests ?? []).flatMap(guest => [
      sendReminderEmail(guest, event, baseUrl),
      sendWhatsAppReminder(guest, event, baseUrl),
    ])
  )

  const sent = Math.round(results.filter(r => r.status === 'fulfilled').length / 2)
  return NextResponse.json({ success: true, sent, total: (pendingGuests ?? []).length })
}
