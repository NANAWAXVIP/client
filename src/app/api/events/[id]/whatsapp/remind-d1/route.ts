import { NextRequest, NextResponse } from 'next/server'
import { MOCK_GUESTS, MOCK_EVENT } from '@/lib/mock-data'
import { sendWhatsAppD1Reminder } from '@/lib/whatsapp'
import { sendD1ReminderEmail } from '@/lib/email'

interface Params { params: Promise<{ id: string }> }

// Triggered manually (or by a cron job 24h before the event)
export async function POST(_req: NextRequest, { params }: Params) {
  const { id } = await params
  void id

  // In production:
  // const confirmedGuests = await supabase.from('guests').select('*').eq('event_id', id).eq('status', 'confirmed')
  const confirmedGuests = MOCK_GUESTS
    .filter(g => g.event_id === 'evt-1')
    .filter(g => g.status === 'confirmed')

  const results = await Promise.allSettled(
    confirmedGuests.flatMap(guest => [
      sendWhatsAppD1Reminder(guest, MOCK_EVENT),
      sendD1ReminderEmail(guest, MOCK_EVENT),
    ])
  )

  const sent = Math.round(results.filter(r => r.status === 'fulfilled').length / 2)

  return NextResponse.json({
    success: true,
    sent,
    total: confirmedGuests.length,
    message: `Rappel J-1 envoyé à ${sent} invitée${sent > 1 ? 's' : ''} confirmée${sent > 1 ? 's' : ''} (WhatsApp + email)`,
  })
}
