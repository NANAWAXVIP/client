import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { sendInvitationEmail } from '@/lib/email'
import { sendWhatsAppInvitation } from '@/lib/whatsapp'

interface Params { params: Promise<{ token: string }> }

function maskPhone(phone: string): string {
  if (phone.length < 6) return phone
  const visible = phone.slice(-2)
  const prefix = phone.startsWith('+') ? phone.slice(0, 4) : phone.slice(0, 3)
  return `${prefix} ·· ·· ·· ${visible}`
}

export async function GET(_req: NextRequest, { params }: Params) {
  const { token } = await params
  const supabase = await createClient()

  const { data: preReg } = await supabase
    .from('pre_registrations')
    .select('*, event:events(name, date)')
    .eq('token', token)
    .single()

  if (!preReg) return NextResponse.json({ error: 'Lien invalide ou expiré.' }, { status: 404 })
  if (preReg.status === 'registered') return NextResponse.json({ error: 'used' }, { status: 410 })
  if (preReg.status === 'expired')    return NextResponse.json({ error: 'expired' }, { status: 410 })

  return NextResponse.json({
    valid: true,
    maskedPhone: preReg.phone ? maskPhone(preReg.phone) : null,
    eventName: (preReg.event as any)?.name,
  })
}

export async function POST(req: NextRequest, { params }: Params) {
  const { token } = await params
  const { name, email, phone } = await req.json()

  if (!name?.trim() || !email?.trim()) {
    return NextResponse.json({ error: 'Prénom, nom et email requis.' }, { status: 400 })
  }

  const supabase = await createClient()

  const { data: preReg } = await supabase
    .from('pre_registrations')
    .select('*, event:events(*)')
    .eq('token', token)
    .single()

  if (!preReg)                     return NextResponse.json({ error: 'Lien invalide.' }, { status: 404 })
  if (preReg.status !== 'pending') return NextResponse.json({ error: 'Ce lien a déjà été utilisé.' }, { status: 410 })

  // ── Lien généré par Maureen (event_id connu) ──────────────────────
  // Crée le guest immédiatement et envoie l'invitation
  if (preReg.event_id) {
    const event = (preReg as any).event

    const { data: guest, error } = await supabase
      .from('guests')
      .insert({ event_id: preReg.event_id, name: name.trim(), email: email.trim(), phone: phone?.trim() || null })
      .select()
      .single()

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })

    await supabase
      .from('pre_registrations')
      .update({ status: 'registered', guest_id: guest.id, registered_at: new Date().toISOString() })
      .eq('token', token)

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? 'http://localhost:3000'
    await Promise.allSettled([
      sendInvitationEmail(guest, event, baseUrl),
      sendWhatsAppInvitation(guest, event, baseUrl),
    ])

    return NextResponse.json({ success: true, guestToken: guest.token }, { status: 201 })
  }

  // ── Lien landing page (pas d'event_id) ───────────────────────────
  // Sauvegarde uniquement les infos — Maureen envoie l'invitation depuis l'admin
  const { error } = await supabase
    .from('pre_registrations')
    .update({ name: name.trim(), email: email.trim(), phone: phone?.trim() || null })
    .eq('token', token)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json({ success: true }, { status: 200 })
}
