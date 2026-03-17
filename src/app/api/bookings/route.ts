import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import prisma from '@/lib/prisma'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const userId = (session.user as any).id
    const role   = (session.user as any).role

    let bookings

    if (role === 'CLIENT') {
      const profile = await prisma.clientProfile.findUnique({ where: { userId } })
      bookings = await prisma.booking.findMany({
        where: { clientId: profile?.id },
        include: {
          client: { include: { user: true } }
        },
        orderBy: { scheduledAt: 'asc' }
      })
    } else {
      bookings = await prisma.booking.findMany({
        include: { client: { include: { user: true } } },
        orderBy: { scheduledAt: 'asc' }
      })
    }

    return NextResponse.json(bookings)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch bookings' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const userId = (session.user as any).id
    const { therapistId, scheduledAt, type, area, durationMins, notes } = await req.json()

    const profile = await prisma.clientProfile.findUnique({ where: { userId } })
    if (!profile)  return NextResponse.json({ error: 'Client profile not found' }, { status: 404 })

    const booking = await prisma.booking.create({
      data: {
        clientId:    profile.id,
        therapistId,
        scheduledAt: new Date(scheduledAt),
        type:        type        || 'VIDEO',
        area:        area        || 'INDIVIDUAL',
        durationMins: durationMins || 60,
        notes:       notes       || null,
        status:      'CONFIRMED'
      }
    })

    // Create a notification for the therapist
    const therapist = await prisma.therapistProfile.findUnique({
      where: { id: therapistId }
    })
    if (therapist) {
      await prisma.notification.create({
        data: {
          userId:  therapist.userId,
          title:   'New session booked',
          message: `A client has booked a ${type?.toLowerCase()} session with you.`,
          type:    'BOOKING',
          link:    '/therapist/sessions'
        }
      })
    }

    return NextResponse.json(booking, { status: 201 })
  } catch (error) {
    console.error('Booking error:', error)
    return NextResponse.json({ error: 'Failed to create booking' }, { status: 500 })
  }
}
