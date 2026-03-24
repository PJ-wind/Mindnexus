import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import prisma from '@/lib/prisma'
import { Card, Badge } from '@/components/ui'
import { formatDateTime, areaLabel } from '@/lib/utils'
import Link from 'next/link'
import { Video } from 'lucide-react'

export default async function TherapistSessionsPage() {
  const session   = await getServerSession(authOptions)
  const userId    = (session?.user as any)?.id
  const therapist = await prisma.therapistProfile.findUnique({ where: { userId } })

  const sessions = await prisma.session.findMany({
    where: { therapistId: therapist?.id },
    include: { client: { select: { name: true } } },
    orderBy: { scheduledAt: 'desc' },
    take: 50
  })

  const upcoming  = sessions.filter(s => s.status === 'SCHEDULED' && new Date(s.scheduledAt) >= new Date())
  const past      = sessions.filter(s => s.status !== 'SCHEDULED' || new Date(s.scheduledAt) < new Date())

  const statusColors: Record<string,string> = { SCHEDULED:'gray', LIVE:'blue', COMPLETED:'green', CANCELLED:'red' }

  return (
    <div className="p-6 max-w-4xl">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold">Sessions</h1>
        <p className="text-gray-500 text-sm mt-0.5">View and manage all your counselling sessions.</p>
      </div>

      <div className="grid grid-cols-3 gap-3 mb-6">
        <div className="stat-card text-center"><div className="text-2xl font-semibold text-brand-500">{upcoming.length}</div><div className="text-xs text-gray-500 mt-0.5">Upcoming</div></div>
        <div className="stat-card text-center"><div className="text-2xl font-semibold text-green-600">{sessions.filter(s=>s.status==='COMPLETED').length}</div><div className="text-xs text-gray-500 mt-0.5">Completed</div></div>
        <div className="stat-card text-center"><div className="text-2xl font-semibold">{sessions.length}</div><div className="text-xs text-gray-500 mt-0.5">Total</div></div>
      </div>

      {upcoming.length > 0 && (
        <div className="mb-6">
          <h3 className="text-sm font-medium mb-3">Upcoming sessions</h3>
          <div className="space-y-2">
            {upcoming.map(s => (
              <div key={s.id} className="flex items-center gap-3 p-4 bg-brand-50 border border-brand-100 rounded-xl">
                <div className="flex-1">
                  <div className="font-medium text-sm">{s.client.name}</div>
                  <div className="text-xs text-gray-500">{areaLabel(s.area)} · {s.type.toLowerCase()} · {s.durationMins} min</div>
                  <div className="text-xs text-brand-600 mt-0.5">{formatDateTime(s.scheduledAt)}</div>
                </div>
                <Link href="/therapist/video" className="btn-primary text-xs py-1.5 px-3 flex items-center gap-1.5">
                  <Video className="w-3 h-3" /> Join
                </Link>
              </div>
            ))}
          </div>
        </div>
      )}

      <Card>
        <h3 className="text-sm font-medium mb-3">All sessions</h3>
        {sessions.length === 0 ? (
          <p className="text-sm text-gray-400 text-center py-6">No sessions yet.</p>
        ) : (
          <table className="w-full text-sm">
            <thead><tr className="text-xs text-gray-400 border-b border-gray-100">
              <th className="text-left py-2">Client</th>
              <th className="text-left py-2">Area</th>
              <th className="text-left py-2">Date & time</th>
              <th className="text-left py-2">Type</th>
              <th className="text-left py-2">Status</th>
            </tr></thead>
            <tbody>
              {sessions.map(s => (
                <tr key={s.id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50">
                  <td className="py-2.5 font-medium">{s.client.name}</td>
                  <td className="py-2.5 text-xs text-gray-500">{areaLabel(s.area)}</td>
                  <td className="py-2.5 text-xs text-gray-500">{formatDateTime(s.scheduledAt)}</td>
                  <td className="py-2.5"><Badge variant="blue" className="text-xs">{s.type}</Badge></td>
                  <td className="py-2.5"><Badge variant={statusColors[s.status] as any} className="text-xs">{s.status.toLowerCase()}</Badge></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </Card>
    </div>
  )
}
