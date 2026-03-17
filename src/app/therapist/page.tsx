import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import prisma from '@/lib/prisma'
import { Card, StatCard, Badge, ProgressBar } from '@/components/ui'
import { formatDateTime, formatDate, areaLabel } from '@/lib/utils'
import { AlertCircle, ArrowRight, Video, MessageCircle } from 'lucide-react'
import Link from 'next/link'

export default async function TherapistDashboard() {
  const session    = await getServerSession(authOptions)
  const userId     = (session?.user as any)?.id

  const therapist  = await prisma.therapistProfile.findUnique({
    where: { userId },
    include: {
      clients: {
        include: {
          user: true,
          moodEntries: { orderBy: { createdAt: 'desc' }, take: 1 },
          homeworkItems: { where: { isCompleted: false } }
        }
      }
    }
  })

  // Today's sessions
  const today      = new Date()
  const todayStart = new Date(today.setHours(0,0,0,0))
  const todayEnd   = new Date(today.setHours(23,59,59,999))

  const todaySessions = await prisma.session.findMany({
    where: {
      therapistId: therapist?.id,
      scheduledAt: { gte: todayStart, lte: todayEnd }
    },
    include: { client: { select: { name: true } } },
    orderBy: { scheduledAt: 'asc' }
  })

  // Active crisis alerts
  const crisisAlerts = await prisma.crisisAlert.findMany({
    where: {
      status: { in: ['ACTIVE', 'ASSIGNED'] },
      client: { therapistId: therapist?.id }
    },
    include: { client: { include: { user: true } } },
    orderBy: { createdAt: 'desc' }
  })

  const completedToday = todaySessions.filter(s => s.status === 'COMPLETED').length
  const pendingNotes   = todaySessions.filter(s => s.status === 'COMPLETED').length

  return (
    <div className="p-6 max-w-5xl">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold">Good day, {(session?.user as any)?.name?.split(' ')[0]}</h1>
        <p className="text-gray-500 text-sm mt-0.5">{todaySessions.length} sessions today · {completedToday} completed</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        <StatCard label="Active clients"      value={therapist?.clients.length ?? 0} />
        <StatCard label="Sessions today"      value={todaySessions.length} sub={`${completedToday} done`} subColor="green" />
        <StatCard label="Crisis alerts"       value={crisisAlerts.length}
          sub={crisisAlerts.length > 0 ? 'Need attention' : 'All clear'} subColor={crisisAlerts.length > 0 ? 'red' : 'green'} />
        <StatCard label="Pending notes"       value={pendingNotes} sub="from today" subColor={pendingNotes > 0 ? 'amber' : 'green'} />
      </div>

      {/* Crisis alert */}
      {crisisAlerts.length > 0 && (
        <div className="mb-6 space-y-2">
          {crisisAlerts.map(alert => (
            <div key={alert.id} className="bg-red-50 border border-red-200 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <AlertCircle className="w-4 h-4 text-red-500" />
                <Badge variant="red">Crisis</Badge>
                <span className="text-sm font-medium text-red-800">{alert.client.user.name}</span>
                <span className="text-xs text-red-400 ml-auto">
                  {new Date(alert.createdAt).toLocaleTimeString('en-GB', { hour:'2-digit', minute:'2-digit' })}
                </span>
              </div>
              {alert.message && <p className="text-xs text-red-700 italic mb-3">&ldquo;{alert.message}&rdquo;</p>}
              <Link href={`/therapist/crisis`} className="btn-danger text-xs py-1.5 px-4">
                Respond now
              </Link>
            </div>
          ))}
        </div>
      )}

      <div className="grid md:grid-cols-3 gap-4 mb-4">
        {/* Today's sessions */}
        <div className="md:col-span-2">
          <Card>
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-medium text-sm">Today&apos;s sessions</h4>
              <Link href="/therapist/sessions" className="text-xs text-brand-500 hover:underline flex items-center gap-1">
                All sessions <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
            {todaySessions.length === 0 ? (
              <p className="text-sm text-gray-400 text-center py-6">No sessions scheduled today</p>
            ) : (
              <div className="space-y-2">
                {todaySessions.map(s => {
                  const statusColors: Record<string,string> = {
                    SCHEDULED: 'gray', LIVE: 'blue', COMPLETED: 'green', CANCELLED: 'red'
                  }
                  const now = new Date()
                  const isNow = s.scheduledAt <= now && s.status === 'SCHEDULED'
                  return (
                    <div key={s.id} className={`flex items-center gap-3 p-3 rounded-lg border ${isNow ? 'bg-brand-50 border-brand-100' : 'bg-gray-50 border-gray-100'}`}>
                      <div className="w-2 h-2 rounded-full bg-green-500 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium">{s.client.name}</div>
                        <div className="text-xs text-gray-400">{areaLabel(s.area)} · {s.type.toLowerCase()}</div>
                      </div>
                      <div className="text-xs text-gray-500 text-right">
                        {new Date(s.scheduledAt).toLocaleTimeString('en-GB',{ hour:'2-digit', minute:'2-digit' })}
                      </div>
                      <Badge variant={statusColors[s.status] as any} className="text-xs">
                        {isNow ? 'Now' : s.status.toLowerCase()}
                      </Badge>
                      {isNow && (
                        <Link href={`/therapist/video`} className="btn-primary text-xs py-1 px-2.5 flex items-center gap-1">
                          <Video className="w-3 h-3" /> Join
                        </Link>
                      )}
                    </div>
                  )
                })}
              </div>
            )}
          </Card>
        </div>

        {/* Client mood alerts */}
        <div className="space-y-4">
          <Card>
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-sm font-medium">Client mood alerts</h4>
            </div>
            {therapist?.clients.slice(0, 5).map(client => {
              const latestMood = client.moodEntries[0]
              const isAtRisk   = latestMood?.mood === 'VERY_LOW' || latestMood?.mood === 'LOW'
              return (
                <div key={client.id} className={`flex items-center gap-2 py-2 border-b border-gray-50 last:border-0 ${isAtRisk ? 'bg-red-50 -mx-3 px-3 rounded' : ''}`}>
                  <div className="w-2 h-2 rounded-full flex-shrink-0"
                    style={{ background: isAtRisk ? '#ef4444' : '#22c55e' }} />
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-medium truncate">{client.user.name}</div>
                    <div className="text-[10px] text-gray-400">
                      {latestMood ? `Mood: ${latestMood.mood.replace('_',' ').toLowerCase()}` : 'No recent entry'}
                    </div>
                  </div>
                  {isAtRisk && <Badge variant="red" className="text-[10px]">At risk</Badge>}
                </div>
              )
            })}
          </Card>
        </div>
      </div>

      {/* Client progress overview */}
      <Card>
        <div className="flex items-center justify-between mb-4">
          <h4 className="font-medium text-sm">Client progress</h4>
          <Link href="/therapist/clients" className="text-xs text-brand-500 hover:underline">View all</Link>
        </div>
        <div className="grid md:grid-cols-2 gap-3">
          {therapist?.clients.slice(0, 4).map(client => {
            const pct = Math.round((client.completedSessions / Math.max(client.totalSessions, 1)) * 100)
            return (
              <Link key={client.id} href={`/therapist/clients/${client.user.id}`}
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                <div className="w-8 h-8 bg-brand-500 rounded-full flex items-center justify-center text-white text-xs font-medium flex-shrink-0">
                  {client.user.name.split(' ').map((n:string) => n[0]).join('').slice(0,2)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-medium">{client.user.name}</div>
                  <div className="text-[10px] text-gray-400 mb-1">{areaLabel(client.counsellingArea)}</div>
                  <ProgressBar value={pct} color={pct >= 70 ? 'bg-green-500' : 'bg-brand-500'} />
                </div>
                <span className="text-xs font-medium text-gray-500">{pct}%</span>
              </Link>
            )
          })}
        </div>
      </Card>
    </div>
  )
}
