import { withAuth } from 'next-auth/middleware'
import { NextResponse } from 'next/server'

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token
    const path  = req.nextUrl.pathname

    // If logged in and visiting /dashboard, redirect to role-specific dashboard
    if (path === '/dashboard') {
      if (token?.role === 'THERAPIST') return NextResponse.redirect(new URL('/therapist', req.url))
      if (token?.role === 'ADMIN')     return NextResponse.redirect(new URL('/admin', req.url))
      return NextResponse.redirect(new URL('/client', req.url))
    }

    // Protect role-specific routes
    if (path.startsWith('/client')    && token?.role !== 'CLIENT')    return NextResponse.redirect(new URL('/auth/login', req.url))
    if (path.startsWith('/therapist') && token?.role !== 'THERAPIST') return NextResponse.redirect(new URL('/auth/login', req.url))
    if (path.startsWith('/admin')     && token?.role !== 'ADMIN')     return NextResponse.redirect(new URL('/auth/login', req.url))

    return NextResponse.next()
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const path = req.nextUrl.pathname
        const publicPaths = ['/', '/auth/login', '/auth/register', '/auth/error']
        if (publicPaths.includes(path)) return true
        return !!token
      }
    }
  }
)

export const config = {
  matcher: ['/dashboard', '/client/:path*', '/therapist/:path*', '/admin/:path*']
}
