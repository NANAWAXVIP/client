import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

interface Params { params: Promise<{ id: string }> }

export async function GET(_req: NextRequest, { params }: Params) {
  const { id } = await params
  const supabase = await createClient()
  const { data } = await supabase
    .from('pre_registrations')
    .select('*, guest:guests(name, email)')
    .eq('event_id', id)
    .order('created_at', { ascending: false })
  return NextResponse.json(data ?? [])
}

export async function POST(req: NextRequest, { params }: Params) {
  const { id } = await params
  const body = await req.json().catch(() => ({}))
  const count = Math.min(Number(body.count ?? 1), 50)

  const supabase = await createClient()
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? 'http://localhost:3000'

  const rows = Array.from({ length: count }, () => ({ event_id: id }))
  const { data, error } = await supabase
    .from('pre_registrations')
    .insert(rows)
    .select()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  const links = (data ?? []).map(r => ({ ...r, link: `${baseUrl}/?token=${r.token}` }))
  return NextResponse.json(links, { status: 201 })
}
