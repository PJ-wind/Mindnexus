import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const ref  = 'MNX-PHY-' + Date.now().toString(36).toUpperCase()

    // Notify admins of new physical session booking
    const admins = await prisma.user.findMany({ where: { role: 'ADMIN' } })
    for (const admin of admins) {
      await prisma.notification.create({
        data: {
          userId:  admin.id,
          title:   `New physical session booking`,
          message: `${body.name} booked a ${body.sessionType?.replace('_',' ')} session on ${new Date(body.date).toLocaleDateString()}. Ref: ${ref}`,
          type:    'BOOKING',
          link:    '/admin/sessions'
        }
      })
    }

    return NextResponse.json({ referenceCode: ref, message: 'Physical session booked successfully' }, { status: 201 })
  } catch (error) {
    console.error('Physical session error:', error)
    return NextResponse.json({ error: 'Failed to book session' }, { status: 500 })
  }
}
