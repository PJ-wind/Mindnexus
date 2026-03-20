import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const referenceCode = 'MNX-' + Date.now().toString(36).toUpperCase()

    // Store as a notification to admin for now
    const admins = await prisma.user.findMany({ where: { role: 'ADMIN' } })
    for (const admin of admins) {
      await prisma.notification.create({
        data: {
          userId:  admin.id,
          title:   `New case report — ${body.concernType}`,
          message: `${body.anonymous ? 'Anonymous' : body.name || 'Unknown'} reported a ${body.urgency} concern: ${body.concernType}. Ref: ${referenceCode}`,
          type:    body.urgency === 'crisis' ? 'CRISIS' : 'DEFAULT',
          link:    '/admin/crisis'
        }
      })
    }

    return NextResponse.json({ referenceCode, message: 'Report submitted successfully' }, { status: 201 })
  } catch (error) {
    console.error('Report error:', error)
    return NextResponse.json({ error: 'Failed to submit report' }, { status: 500 })
  }
}
