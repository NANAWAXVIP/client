import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { sendConfirmationEmail } from '@/lib/email'

interface Params { params: Promise<{ token: string }> }

export async function GET(_req: NextRequest, { params }: Params) {
  const { token } = await params
  const supabase = await createClient()

  const { data: guest } = await supabase.from('guests').select('*, events(*)').eq('token', token).single()
  if (!guest) return NextResponse.json({ error: 'Invitation introuvable' }, { status: 404 })
  return NextResponse.json(guest)
}

export async function POST(req: NextRequest, { params }: Params) {
  const { token } = await params
  const body = await req.json()
  const { action, time_slot } = body
  const supabase = await createClient()

  const { data: guest } = await supabase.from('guests').select('*, events(*)').eq('token', token).single()
  if (!guest) return NextResponse.json({ error: 'Invitation introuvable' }, { status: 404 })

  if (action === 'confirm') {
    await supabase.from('guests').update({ status: 'confirmed', confirmed_at: new Date().toISOString() }).eq('token', token)

    // Promotion liste d'attente si la capacité est dépassée — rien à faire ici car on confirme
    const event = (guest as any).events
    if (event) await sendConfirmationEmail(guest, event).catch(() => {})

    return NextResponse.json({ success: true, status: 'confirmed' })
  }

  if (action === 'decline') {
    await supabase.from('guests').update({ status: 'declined' }).eq('token', token)

    // Promouvoir le premier en attente si une place se libère
    const event = (guest as any).events
    if (event) {
      const { data: next } = await supabase
        .from('guests')
        .select('*')
        .eq('event_id', event.id)
        .eq('status', 'pending')
        .order('created_at', { ascending: true })
        .limit(1)
        .single()

      if (next) {
        const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? 'http://localhost:3000'
        const { sendInvitationEmail } = await import('@/lib/email')
        await sendInvitationEmail(next, event, baseUrl).catch(() => {})
      }
    }

    return NextResponse.json({ success: true, status: 'declined' })
  }

  if (action === 'slot' && time_slot) {
    await supabase.from('guests').update({ time_slot }).eq('token', token)
    return NextResponse.json({ success: true, time_slot })
  }

  return NextResponse.json({ error: 'Action invalide' }, { status: 400 })
}
