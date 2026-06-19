import { NextRequest, NextResponse } from 'next/server'

export async function DELETE() {
  const res = NextResponse.json({ success: true })
  res.cookies.set('nw_admin', '', { maxAge: 0, path: '/' })
  return res
}

export async function POST(req: NextRequest) {
  const { password } = await req.json()
  const correct = process.env.ADMIN_PASSWORD ?? 'Nanamdp'

  if (password !== correct) {
    return NextResponse.json({ error: 'Mot de passe incorrect.' }, { status: 401 })
  }

  const res = NextResponse.json({ success: true })
  res.cookies.set('nw_admin', 'true', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 30, // 30 jours
    path: '/',
  })
  return res
}
