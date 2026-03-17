import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import prisma from '@/lib/prisma'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const therapists = await prisma.therapistProfile.findMany({
      where: { isActive: true },
      include: {
        user: { select: { id: true, name: true, email: true, phone: true } },
        _count: { select: { clients: true } }
      },
      orderBy: { rating: 'desc' }
    })

    return NextResponse.json(therapists)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch therapists' }, { status: 500 })
  }
}
