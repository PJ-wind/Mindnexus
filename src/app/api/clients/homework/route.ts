import { NextResponse } from 'next/server'
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
    const items = await prisma.homeworkItem.findMany({
      where: { clientId: profile.id },
      orderBy: [{ isCompleted: 'asc' }, { createdAt: 'desc' }]
    })
    return NextResponse.json(items)
  } catch {
    return NextResponse.json({ error: 'Failed to fetch homework' }, { status: 500 })
  }
}
