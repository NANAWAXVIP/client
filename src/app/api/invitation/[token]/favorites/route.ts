import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

interface Params { params: Promise<{ token: string }> }

export async function POST(req: NextRequest, { params }: Params) {
  const { token } = await params
  const { catalog_item_id } = await req.json()
  const supabase = await createClient()

  const { data: guest } = await supabase.from('guests').select('id').eq('token', token).single()
  if (!guest) return NextResponse.json({ error: 'Invitée introuvable' }, { status: 404 })

  await supabase.from('favorites').upsert({ guest_id: guest.id, catalog_item_id })
  return NextResponse.json({ success: true })
}

export async function DELETE(req: NextRequest, { params }: Params) {
  const { token } = await params
  const { catalog_item_id } = await req.json()
  const supabase = await createClient()

  const { data: guest } = await supabase.from('guests').select('id').eq('token', token).single()
  if (!guest) return NextResponse.json({ error: 'Invitée introuvable' }, { status: 404 })

  await supabase.from('favorites').delete().eq('guest_id', guest.id).eq('catalog_item_id', catalog_item_id)
  return NextResponse.json({ success: true })
}
