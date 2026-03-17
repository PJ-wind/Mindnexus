import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import prisma from '@/lib/prisma'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const userId = (session.user as any).id
    const profile = await prisma.clientProfile.findUnique({ where: { userId } })
    if (!profile) return NextResponse.json([])

    const entries = await prisma.moodEntry.findMany({
      where: { clientId: profile.id },
      orderBy: { createdAt: 'asc' },
      take: 30
    })

    return NextResponse.json(entries)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch mood entries' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const userId = (session.user as any).id
    const { mood, journal, sleep, water, exercise } = await req.json()

    const profile = await prisma.clientProfile.findUnique({ where: { userId } })
    if (!profile) return NextResponse.json({ error: 'Profile not found' }, { status: 404 })

    const entry = await prisma.moodEntry.create({
      data: {
        clientId: profile.id,
        mood,
        journal: journal || null,
        sleep:   sleep   ?? null,
        water:   water   ?? null,
        exercise: exercise ?? false
      }
    })

    return NextResponse.json(entry, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to save mood entry' }, { status: 500 })
  }
}
