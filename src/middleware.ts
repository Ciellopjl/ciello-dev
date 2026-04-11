import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth-edge'

export default auth((req) => {
  const { pathname } = req.nextUrl
  const isLoggedIn = !!req.auth

  if (pathname.startsWith('/admin')) {
    if (!isLoggedIn) {
      return NextResponse.redirect(new URL('/login', req.url))
    }

    if (req.auth?.user?.email !== process.env.ADMIN_EMAIL) {
      return NextResponse.redirect(new URL('/blocked', req.url))
    }
  }

  return NextResponse.next()
})

export const config = {
  matcher: ['/admin/:path*'],
}
