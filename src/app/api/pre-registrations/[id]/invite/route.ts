import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

interface Params { params: Promise<{ id: string }> }

export async function POST(req: NextRequest, { params }: Params) {
  const { id } = await params
  const { eventId } = await req.json()

  if (!eventId) return NextResponse.json({ error: 'eventId requis.' }, { status: 400 })

  const supabase = await createClient()

  const { data: preReg } = await supabase
    .from('pre_registrations')
    .select('*')
    .eq('id', id)
    .single()

  if (!preReg)      return NextResponse.json({ error: 'Demande introuvable.' }, { status: 404 })
  if (!preReg.name) return NextResponse.json({ error: 'Informations incomplètes.' }, { status: 400 })
  if (preReg.guest_id) return NextResponse.json({ error: 'Déjà invitée.' }, { status: 409 })

  // Créer le guest
  const { data: guest, error } = await supabase
    .from('guests')
    .insert({
      event_id: eventId,
      name:     preReg.name,
      email:    preReg.email,
      phone:    preReg.phone ?? null,
    })
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  // Marquer la pre_registration comme traitée
  await supabase
    .from('pre_registrations')
    .update({ status: 'registered', guest_id: guest.id, registered_at: new Date().toISOString() })
    .eq('id', id)

  // Déclencher le webhook Make (si configuré)
  const webhookUrl = process.env.MAKE_WEBHOOK_URL
  if (webhookUrl) {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? 'http://localhost:3000'
    await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name:           guest.name,
        email:          guest.email,
        phone:          guest.phone ?? null,
        invitationLink: `${baseUrl}/invitation/${guest.token}`,
      }),
    }).catch(() => null)
  }

  return NextResponse.json({ success: true, guestToken: guest.token })
}
