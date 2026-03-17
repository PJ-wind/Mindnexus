import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import prisma from '@/lib/prisma'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const userId = (session.user as any).id
    const role   = (session.user as any).role

    let sessions

    if (role === 'THERAPIST') {
      const therapist = await prisma.therapistProfile.findUnique({ where: { userId } })
      sessions = await prisma.session.findMany({
        where: { therapistId: therapist?.id },
        include: {
          client:  { select: { name: true } },
          notes:   true,
          booking: true
        },
        orderBy: { scheduledAt: 'desc' },
        take: 50
      })
    } else if (role === 'CLIENT') {
      sessions = await prisma.session.findMany({
        where: { clientId: userId },
        include: { therapist: { include: { user: { select: { name: true } } } } },
        orderBy: { scheduledAt: 'desc' }
      })
    } else {
      sessions = await prisma.session.findMany({
        include: {
          client:   { select: { name: true } },
          therapist:{ include: { user: { select: { name: true } } } }
        },
        orderBy: { scheduledAt: 'desc' },
        take: 100
      })
    }

    return NextResponse.json(sessions)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch sessions' }, { status: 500 })
  }
}
