import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import prisma from '@/lib/prisma'
import { Card, Badge, ProgressBar } from '@/components/ui'
import { areaLabel } from '@/lib/utils'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

export default async function TherapistClients() {
  const session   = await getServerSession(authOptions)
  const userId    = (session?.user as any)?.id

  const therapist = await prisma.therapistProfile.findUnique({
    where: { userId },
    include: {
      clients: {
        include: {
          user: true,
          moodEntries:  { orderBy: { createdAt: 'desc' }, take: 1 },
          homeworkItems:{ where: { isCompleted: false } },
          crisisAlerts: { where: { status: { in: ['ACTIVE','ASSIGNED'] } } }
        },
        orderBy: { user: { name: 'asc' } }
      }
    }
  })

  const clients = therapist?.clients ?? []

  function statusBadge(client: any) {
    if (client.crisisAlerts.length > 0) return { label: 'Crisis',   variant: 'red'   as const }
    const mood = client.moodEntries[0]?.mood
    if (mood === 'VERY_LOW' || mood === 'LOW') return { label: 'At risk', variant: 'amber' as const }
    return { label: 'Active', variant: 'green' as const }
  }

  return (
    <div className="p-6 max-w-5xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold">My clients</h1>
          <p className="text-gray-500 text-sm mt-0.5">{clients.length} active clients</p>
        </div>
      </div>

      {/* Search bar */}
      <div className="mb-4">
        <input type="text" className="input max-w-sm text-sm" placeholder="Search clients by name..." />
      </div>

      <Card>
        {clients.length === 0 ? (
          <div className="text-center py-12 text-gray-400">
            <p className="text-sm">No clients assigned yet.</p>
          </div>
        ) : (
          <div className="space-y-1">
            {clients.map(client => {
              const pct    = Math.round((client.completedSessions / Math.max(client.totalSessions, 1)) * 100)
              const status = statusBadge(client)
              return (
                <Link key={client.id} href={`/therapist/clients/${client.userId}`}
                  className="flex items-center gap-4 p-3 rounded-xl hover:bg-gray-50 transition-colors group">
                  {/* Avatar */}
                  <div className="w-10 h-10 bg-brand-500 rounded-full flex items-center justify-center text-white text-sm font-medium flex-shrink-0">
                    {client.user.name.split(' ').map((n:string)=>n[0]).join('').slice(0,2)}
                  </div>
                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium">{client.user.name}</div>
                    <div className="text-xs text-gray-400">{areaLabel(client.counsellingArea)} · Session {client.completedSessions}/{client.totalSessions}</div>
                    <ProgressBar value={pct} className="mt-1.5 max-w-32" color={pct >= 70 ? 'bg-green-500' : 'bg-brand-400'} />
                  </div>
                  {/* Meta */}
                  <div className="text-right flex-shrink-0">
                    <Badge variant={status.variant} className="text-xs mb-1 block">{status.label}</Badge>
                    {client.homeworkItems.length > 0 && (
                      <div className="text-[10px] text-amber-500">{client.homeworkItems.length} hw pending</div>
                    )}
                  </div>
                  <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-gray-500 transition-colors flex-shrink-0" />
                </Link>
              )
            })}
          </div>
        )}
      </Card>
    </div>
  )
}
