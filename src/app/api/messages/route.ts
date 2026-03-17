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

    let therapist = null
    if (role === 'CLIENT') {
      const profile = await prisma.clientProfile.findUnique({
        where: { userId },
        include: { therapist: { include: { user: { select: { id: true, name: true, email: true } } } } }
      })
      therapist = profile?.therapist?.user ?? null
    }

    const messages = await prisma.message.findMany({
      where: {
        OR: [{ senderId: userId }, { receiverId: userId }]
      },
      orderBy: { createdAt: 'asc' },
      take: 100
    })

    // Mark messages as read
    await prisma.message.updateMany({
      where: { receiverId: userId, isRead: false },
      data: { isRead: true }
    })

    return NextResponse.json({ messages, therapist })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch messages' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const senderId = (session.user as any).id
    const { receiverId, content } = await req.json()

    if (!receiverId || !content?.trim()) {
      return NextResponse.json({ error: 'Receiver and content are required' }, { status: 400 })
    }

    const message = await prisma.message.create({
      data: { senderId, receiverId, content: content.trim() }
    })

    // Create notification for receiver
    await prisma.notification.create({
      data: {
        userId:  receiverId,
        title:   'New message',
        message: content.trim().slice(0, 80),
        type:    'MESSAGE',
        link:    '/client/messages'
      }
    })

    return NextResponse.json(message, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to send message' }, { status: 500 })
  }
}
