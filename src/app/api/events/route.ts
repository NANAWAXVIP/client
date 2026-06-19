import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET() {
  const supabase = await createClient()
  const { data } = await supabase.from('events').select('*').order('date', { ascending: false })
  return NextResponse.json(data ?? [])
}

export async function POST(req: NextRequest) {
  const { name, date, location, capacity, time_slots } = await req.json()
  if (!name || !date || !location || !capacity) {
    return NextResponse.json({ error: 'Champs manquants' }, { status: 400 })
  }
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('events')
    .insert({ name, date, location, capacity, time_slots: time_slots ?? [] })
    .select()
    .single()
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data, { status: 201 })
}
