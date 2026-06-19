import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { sendConfirmationEmail } from '@/lib/email'

interface Params { params: Promise<{ id: string; guestId: string }> }

export async function PATCH(req: NextRequest, { params }: Params) {
  const { id, guestId } = await params
  const { status } = await req.json()

  if (!['confirmed', 'declined', 'pending'].includes(status)) {
    return NextResponse.json({ error: 'Statut invalide' }, { status: 400 })
  }

  const supabase = await createClient()

  const updates: Record<string, unknown> = { status }
  if (status === 'confirmed') updates.confirmed_at = new Date().toISOString()
  if (status !== 'confirmed') updates.confirmed_at = null

  const { data: guest, error } = await supabase
    .from('guests')
    .update(updates)
    .eq('id', guestId)
    .eq('event_id', id)
    .select('*, events(*)')
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  // Email de confirmation automatique
  if (status === 'confirmed') {
    const event = (guest as any).events
    if (event) await sendConfirmationEmail(guest, event).catch(() => {})
  }

  return NextResponse.json(guest)
}
