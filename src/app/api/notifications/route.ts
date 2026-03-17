import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import prisma from '@/lib/prisma'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const userId = (session.user as any).id

    const notifications = await prisma.notification.findMany({
      where:   { userId },
      orderBy: { createdAt: 'desc' },
      take:    30
    })

    return NextResponse.json(notifications)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch notifications' }, { status: 500 })
  }
}

export async function PATCH() {
  try {
    const session = await getServerSession(authOptions)
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const userId = (session.user as any).id

    await prisma.notification.updateMany({
      where: { userId, isRead: false },
      data:  { isRead: true }
    })

    return NextResponse.json({ message: 'All notifications marked as read' })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update notifications' }, { status: 500 })
  }
}
