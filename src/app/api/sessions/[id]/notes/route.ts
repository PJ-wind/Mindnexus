import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import prisma from '@/lib/prisma'

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const userId    = (session.user as any).id
    const therapist = await prisma.therapistProfile.findUnique({ where: { userId } })
    if (!therapist) return NextResponse.json({ error: 'Therapist not found' }, { status: 404 })

    const { content } = await req.json()

    const note = await prisma.sessionNote.upsert({
      where:  { sessionId: params.id },
      update: { content },
      create: { sessionId: params.id, therapistId: therapist.id, content }
    })

    return NextResponse.json(note)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to save note' }, { status: 500 })
  }
}

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const note = await prisma.sessionNote.findUnique({ where: { sessionId: params.id } })
    return NextResponse.json(note)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch note' }, { status: 500 })
  }
}
