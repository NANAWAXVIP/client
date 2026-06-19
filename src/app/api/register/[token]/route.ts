import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

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
    .select('*')
    .eq('token', token)
    .single()

  if (!preReg)                     return NextResponse.json({ error: 'Lien invalide.' }, { status: 404 })
  if (preReg.status !== 'pending') return NextResponse.json({ error: 'Ce lien a déjà été utilisé.' }, { status: 410 })

  // Sauvegarde les infos dans la pre_registration — Maureen invite ensuite via l'admin
  const { error } = await supabase
    .from('pre_registrations')
    .update({ name: name.trim(), email: email.trim(), phone: phone?.trim() || null })
    .eq('token', token)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json({ success: true }, { status: 200 })
}
