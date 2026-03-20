import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import crypto from 'crypto'

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json()
    if (!email) return NextResponse.json({ error: 'Email required' }, { status: 400 })

    const user = await prisma.user.findUnique({ where: { email } })

    // Always return success even if user not found (security best practice)
    if (!user) return NextResponse.json({ message: 'If this email exists, a reset link has been sent.' })

    const token   = crypto.randomBytes(32).toString('hex')
    const expires = new Date(Date.now() + 1000 * 60 * 60) // 1 hour

    // Store token in notification (simple approach without extra DB table)
    await prisma.notification.create({
      data: {
        userId:  user.id,
        title:   'Password reset requested',
        message: `Reset token: ${token} — expires at ${expires.toISOString()}`,
        type:    'PASSWORD_RESET',
        link:    `/auth/reset-password?token=${token}`
      }
    })

    // In production: send email with reset link
    // The reset link would be: https://yourdomain.com/auth/reset-password?token=${token}
    console.log(`Password reset link for ${email}: /auth/reset-password?token=${token}`)

    return NextResponse.json({ message: 'Reset link sent successfully.' })
  } catch (error) {
    console.error('Forgot password error:', error)
    return NextResponse.json({ error: 'Failed to process request' }, { status: 500 })
  }
}
