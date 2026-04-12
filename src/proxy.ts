import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth-edge'

export default auth((req) => {
  const { pathname } = req.nextUrl
  const isLoggedIn = !!req.auth
  
  // Normalize emails for strict comparison
  const userEmail = req.auth?.user?.email?.toLowerCase().trim()
  const adminEmail = process.env.ADMIN_EMAIL?.toLowerCase().trim()

  if (pathname === '/login') {
    if (isLoggedIn && userEmail === adminEmail) {
      return NextResponse.redirect(new URL('/admin', req.url))
    }
  }

  if (pathname.startsWith('/admin')) {
    if (!isLoggedIn) {
      return NextResponse.redirect(new URL('/login', req.url))
    }

    if (!userEmail || userEmail !== adminEmail) {
      console.warn(`[SECURITY] Acesso negado ao /admin para: ${userEmail || 'desconhecido'}`)
      return NextResponse.redirect(new URL('/blocked', req.url))
    }
  }

  return NextResponse.next()
})

export const config = {
  matcher: ['/admin/:path*', '/login'],
}

