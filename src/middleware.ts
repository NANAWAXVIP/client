import { NextRequest, NextResponse } from 'next/server'

export function middleware(req: NextRequest) {
  const isAdmin = req.nextUrl.pathname.startsWith('/admin')
  const cookie  = req.cookies.get('nw_admin')?.value

  if (isAdmin && cookie !== 'true') {
    return NextResponse.redirect(new URL('/espace-maureen', req.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*'],
}
