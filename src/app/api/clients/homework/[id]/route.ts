import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import prisma from '@/lib/prisma'

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    const { isCompleted } = await req.json()
    const item = await prisma.homeworkItem.update({
      where: { id: params.id },
      data: { isCompleted, completedAt: isCompleted ? new Date() : null }
    })
    return NextResponse.json(item)
  } catch {
    return NextResponse.json({ error: 'Failed to update homework' }, { status: 500 })
  }
}
