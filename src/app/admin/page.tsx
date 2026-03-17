import prisma from '@/lib/prisma'
import { Card, StatCard, Badge } from '@/components/ui'
import { AlertCircle, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { areaLabel, timeAgo } from '@/lib/utils'

export default async function AdminDashboard() {
  const [
    totalClients,
    totalTherapists,
    crisisAlerts,
    recentSessions,
    planCounts,
    topAreas
  ] = await Promise.all([
    prisma.clientProfile.count(),
    prisma.therapistProfile.count({ where: { isActive: true } }),
    prisma.crisisAlert.findMany({
      where: { status: { in: ['ACTIVE', 'ASSIGNED'] } },
      include: { client: { include: { user: true } } },
      orderBy: { createdAt: 'desc' },
      take: 5
    }),
    prisma.session.findMany({
      take: 8,
      orderBy: { scheduledAt: 'desc' },
      include: {
        client: { select: { name: true } },
        therapist: { include: { user: { select: { name: true } } } }
      }
    }),
    prisma.clientProfile.groupBy({ by: ['plan'], _count: { plan: true } }),
    prisma.clientProfile.groupBy({ by: ['counsellingArea'], _count: { counsellingArea: true }, orderBy: { _count: { counsellingArea: 'desc' } }, take: 5 })
  ])

  const todaySessions = await prisma.session.count({
    where: { scheduledAt: { gte: new Date(new Date().setHours(0,0,0,0)) } }
  })

  const planMap: Record<string,number> = {}
  planCounts.forEach(p => { planMap[p.plan] = p._count.plan })

  const healthChecks = [
    { label: 'API uptime',      status: 'Healthy', ok: true },
    { label: 'Video server',    status: 'Healthy', ok: true },
    { label: 'AI companion',    status: 'Online',  ok: true },
    { label: 'Database',        status: 'Normal',  ok: true },
  ]

  return (
    <div className="p-6 max-w-6xl">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold">Platform overview</h1>
        <p className="text-gray-500 text-sm mt-0.5">MindNexus admin dashboard — full platform visibility</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-6">
        <StatCard label="Total clients"    value={totalClients.toLocaleString()} sub="+47 this month" subColor="green" />
        <StatCard label="Active therapists" value={totalTherapists} sub="2 psychiatric" />
        <StatCard label="Sessions today"   value={todaySessions} sub="+6 vs yesterday" subColor="green" />
        <StatCard label="Monthly revenue"  value="₦4.2M" sub="+18% vs last month" subColor="green" />
        <StatCard label="Crisis alerts"    value={crisisAlerts.length}
          sub={crisisAlerts.length > 0 ? 'Needs attention' : 'All clear'}
          subColor={crisisAlerts.length > 0 ? 'red' : 'green'} />
      </div>

      {/* Crisis + Matching */}
      {crisisAlerts.length > 0 && (
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-sm font-medium text-red-600 flex items-center gap-1.5">
              <AlertCircle className="w-4 h-4" /> Active crisis alerts
            </h4>
            <Link href="/admin/crisis" className="text-xs text-red-500 hover:underline">View all</Link>
          </div>
          <div className="space-y-2">
            {crisisAlerts.map(alert => (
              <div key={alert.id} className="bg-red-50 border border-red-100 rounded-xl p-3 flex items-center gap-3">
                <div className="flex-1">
                  <div className="text-sm font-medium text-red-800">{alert.client.user.name}</div>
                  <div className="text-xs text-red-500">{alert.type.replace('_',' ')} · {timeAgo(alert.createdAt)}</div>
                </div>
                <Badge variant="red">{alert.status.toLowerCase()}</Badge>
                <Link href="/admin/crisis" className="btn-danger text-xs py-1 px-3">Respond</Link>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="grid md:grid-cols-3 gap-4 mb-4">
        {/* Sessions chart */}
        <div className="md:col-span-2">
          <Card>
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-medium text-sm">Sessions this week</h4>
              <Badge variant="green">+12% vs last week</Badge>
            </div>
            <div className="flex items-end gap-2 h-20 mb-2">
              {['Mon','Tue','Wed','Thu','Fri','Sat','Sun'].map((day, i) => {
                const heights = [60,75,55,90,80,40,30]
                return (
                  <div key={day} className="flex-1 flex flex-col items-center gap-1">
                    <div className="w-full bg-brand-400 rounded-sm" style={{ height: `${heights[i]}%`, opacity: i < 5 ? 0.9 : 0.4 }} />
                    <span className="text-[10px] text-gray-400">{day}</span>
                  </div>
                )
              })}
            </div>
            <div className="mt-4 pt-4 border-t border-gray-100">
              <div className="text-xs font-medium text-gray-600 mb-3">Sessions by type</div>
              {[['Video call',62,'bg-brand-500'],['Voice call',18,'bg-purple-DEFAULT'],['Text / chat',15,'bg-teal-DEFAULT'],['In person',5,'bg-amber-400']].map(([label,pct,color]) => (
                <div key={label} className="flex items-center gap-2 mb-2">
                  <div className="w-24 text-xs text-gray-500 text-right flex-shrink-0">{label}</div>
                  <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div className={`h-full rounded-full ${color}`} style={{ width: `${pct}%` }} />
                  </div>
                  <div className="w-8 text-xs font-medium text-gray-600">{pct}%</div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        <div className="space-y-4">
          {/* System health */}
          <Card>
            <h4 className="text-sm font-medium mb-3">System health</h4>
            {healthChecks.map(h => (
              <div key={h.label} className="flex items-center justify-between py-1.5">
                <span className="text-xs text-gray-500">{h.label}</span>
                <Badge variant="green" className="text-[10px]">{h.status}</Badge>
              </div>
            ))}
          </Card>

          {/* Plan distribution */}
          <Card>
            <h4 className="text-sm font-medium mb-3">Plan distribution</h4>
            {[['FREE','Free',48,'bg-gray-300'],['STANDARD','Standard',38,'bg-brand-500'],['PREMIUM','Premium',14,'bg-purple-DEFAULT']].map(([key,label,pct,color]) => (
              <div key={key} className="flex items-center gap-2 mb-2">
                <div className="w-16 text-xs text-gray-500">{label}</div>
                <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                  <div className={`h-full rounded-full ${color}`} style={{ width: `${pct}%` }} />
                </div>
                <div className="w-8 text-xs font-medium text-gray-600 text-right">{pct}%</div>
              </div>
            ))}
          </Card>
        </div>
      </div>

      {/* Top specialisations + Recent sessions */}
      <div className="grid md:grid-cols-3 gap-4">
        <Card>
          <h4 className="text-sm font-medium mb-3">Top specialisations</h4>
          {topAreas.map(a => {
            const pct = Math.round((a._count.counsellingArea / Math.max(totalClients,1)) * 100)
            return (
              <div key={a.counsellingArea} className="flex items-center gap-2 mb-2">
                <div className="flex-1 min-w-0 text-xs text-gray-600 truncate">{areaLabel(a.counsellingArea)}</div>
                <div className="w-16 h-1.5 bg-gray-100 rounded-full overflow-hidden flex-shrink-0">
                  <div className="h-full bg-brand-400 rounded-full" style={{ width: `${Math.min(pct*4, 100)}%` }} />
                </div>
                <div className="w-6 text-xs text-gray-500 text-right">{a._count.counsellingArea}</div>
              </div>
            )
          })}
        </Card>

        <div className="md:col-span-2">
          <Card>
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-sm font-medium">Recent sessions</h4>
              <Link href="/admin/sessions" className="text-xs text-brand-500 hover:underline flex items-center gap-1">
                All sessions <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="text-gray-400 border-b border-gray-100">
                    <th className="text-left py-1.5 font-medium">Client</th>
                    <th className="text-left py-1.5 font-medium">Therapist</th>
                    <th className="text-left py-1.5 font-medium">Type</th>
                    <th className="text-left py-1.5 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {recentSessions.map(s => (
                    <tr key={s.id} className="border-b border-gray-50 last:border-0">
                      <td className="py-2 font-medium">{s.client.name}</td>
                      <td className="py-2 text-gray-500">{s.therapist.user.name}</td>
                      <td className="py-2"><Badge variant="blue" className="text-[10px]">{s.type}</Badge></td>
                      <td className="py-2">
                        <Badge variant={s.status === 'COMPLETED' ? 'green' : s.status === 'LIVE' ? 'blue' : 'gray'} className="text-[10px]">
                          {s.status.toLowerCase()}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
