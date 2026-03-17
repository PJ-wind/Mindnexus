import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import prisma from '@/lib/prisma'

export async function POST() {
  try {
    const session = await getServerSession(authOptions)
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const userId  = (session.user as any).id
    const profile = await prisma.clientProfile.findUnique({ where: { userId } })
    if (!profile)  return NextResponse.json({ error: 'Profile not found' }, { status: 404 })

    // Create crisis alert
    const alert = await prisma.crisisAlert.create({
      data: {
        clientId:   profile.id,
        type:       'CRISIS_BUTTON',
        status:     'ACTIVE',
        message:    'Client activated crisis support button'
      }
    })

    // Notify therapist if assigned
    if (profile.therapistId) {
      const therapist = await prisma.therapistProfile.findUnique({
        where: { id: profile.therapistId },
        include: { user: true }
      })
      if (therapist) {
        await prisma.notification.create({
          data: {
            userId:  therapist.userId,
            title:   '🚨 Crisis alert',
            message: `Your client has activated the crisis support button. Please respond immediately.`,
            type:    'CRISIS',
            link:    `/therapist/clients/${userId}`
          }
        })
      }
    }

    return NextResponse.json({ message: 'Crisis alert sent', alertId: alert.id })
  } catch (error) {
    console.error('Crisis alert error:', error)
    return NextResponse.json({ error: 'Failed to send crisis alert' }, { status: 500 })
  }
}
