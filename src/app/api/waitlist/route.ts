import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST() {
  const supabase = await createClient()

  // Crée une pre_registration sans event_id — Maureen assigne l'événement depuis l'admin
  const { data: preReg, error } = await supabase
    .from('pre_registrations')
    .insert({ event_id: null })
    .select('token')
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json({ token: preReg.token })
}
