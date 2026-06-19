import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST() {
  const supabase = await createClient()

  // Prend le prochain événement à venir (ou le plus récent s'il n'y en a pas)
  const { data: next } = await supabase
    .from('events')
    .select('id')
    .gte('date', new Date().toISOString())
    .order('date', { ascending: true })
    .limit(1)
    .single()

  const { data: fallback } = next
    ? { data: null }
    : await supabase
        .from('events')
        .select('id')
        .order('date', { ascending: false })
        .limit(1)
        .single()

  const eventId = next?.id ?? fallback?.id ?? null

  const { data: preReg, error } = await supabase
    .from('pre_registrations')
    .insert({ event_id: eventId })
    .select('token')
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json({ token: preReg.token })
}
