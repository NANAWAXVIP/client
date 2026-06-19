import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function GET() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  const supabase = createClient(url, key)
  const { data, error } = await supabase.from('events').select('id, name')
  return NextResponse.json({
    url_prefix: url?.slice(0, 35),
    data,
    error: error?.message ?? null,
  })
}
