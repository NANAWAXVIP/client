import { NextResponse } from 'next/server'

export async function GET() {
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? ''
  return NextResponse.json({
    key_length: key.length,
    key_start: key.slice(0, 20),
    key_end: key.slice(-20),
    expected_length: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9yendpenJ6emJqbnRieHVubHZiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODE4NjM2MDcsImV4cCI6MjA5NzQzOTYwN30.f_Zoih-CRHDcfPlZWt8cFb80mHEX26Z3H0ouhAF448s'.length,
  })
}
