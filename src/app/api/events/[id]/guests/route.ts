import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { sendInvitationEmail } from '@/lib/email'
import { sendWhatsAppInvitation } from '@/lib/whatsapp'

interface Params { params: Promise<{ id: string }> }

export async function GET(_req: NextRequest, { params }: Params) {
  const { id } = await params
  const supabase = await createClient()
  const { data } = await supabase.from('guests').select('*').eq('event_id', id).order('created_at', { ascending: false })
  return NextResponse.json(data ?? [])
}

export async function POST(req: NextRequest, { params }: Params) {
  const { id } = await params
  const { name, email, phone } = await req.json()
  if (!name || !email) return NextResponse.json({ error: 'Nom et email requis' }, { status: 400 })

  const supabase = await createClient()
  const { data: event } = await supabase.from('events').select('*').eq('id', id).single()
  if (!event) return NextResponse.json({ error: 'Événement introuvable' }, { status: 404 })

  const { data: guest, error } = await supabase
    .from('guests')
    .insert({ event_id: id, name: name.trim(), email: email.trim(), phone: phone?.trim() || null })
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? 'http://localhost:3000'
  await Promise.allSettled([
    sendInvitationEmail(guest, event, baseUrl),
    sendWhatsAppInvitation(guest, event, baseUrl),
  ])

  return NextResponse.json(guest, { status: 201 })
}
