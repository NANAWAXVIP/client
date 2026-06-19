import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

interface Params { params: Promise<{ id: string; itemId: string }> }

export async function DELETE(_req: NextRequest, { params }: Params) {
  const { itemId } = await params
  const supabase = await createClient()
  const { error } = await supabase.from('catalog_items').delete().eq('id', itemId)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ success: true })
}
