import { NextResponse } from 'next/server'

export async function GET() {
  return NextResponse.json({
    url_set: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
    url_prefix: process.env.NEXT_PUBLIC_SUPABASE_URL?.slice(0, 30),
    key_set: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    key_prefix: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.slice(0, 20),
  })
}
