import prisma from '@/lib/prisma'
import { Card, Badge } from '@/components/ui'

export default async function AdminAnalyticsPage() {
  const [totalClients, totalTherapists, totalSessions, moodCounts] = await Promise.all([
    prisma.clientProfile.count(),
    prisma.therapistProfile.count(),
    prisma.session.count(),
    prisma.moodEntry.groupBy({ by: ['mood'], _count: { mood: true } })
  ])

  const weeklyData = [62, 75, 55, 90, 80, 45, 38]
  const days = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun']
  const max  = Math.max(...weeklyData)

  return (
    <div className="p-6 max-w-5xl">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold">Analytics</h1>
        <p className="text-gray-500 text-sm mt-0.5">Platform-wide performance metrics and insights.</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        {[['Total clients', totalClients, '+47 this month', 'green'],['Active therapists', totalTherapists, '2 psychiatric', 'blue'],['Total sessions', totalSessions, '+12% vs last week', 'green'],['Monthly revenue', '₦4.2M', '+18% vs last month', 'green']].map(([l,v,s,c]) => (
          <div key={l as string} className="stat-card">
            <div className="text-xs text-gray-500 mb-1">{l}</div>
            <div className="text-2xl font-semibold">{v}</div>
            <div className={`text-[11px] mt-0.5 ${c === 'green' ? 'text-green-600' : 'text-brand-500'}`}>{s}</div>
          </div>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-4 mb-4">
        <Card>
          <h3 className="font-medium text-sm mb-4">Sessions this week</h3>
          <div className="flex items-end gap-2 h-24">
            {weeklyData.map((val, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-1">
                <div className="w-full bg-brand-400 rounded-sm transition-all" style={{ height: `${(val/max)*100}%` }} />
                <span className="text-[10px] text-gray-400">{days[i]}</span>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <h3 className="font-medium text-sm mb-4">Client mood distribution</h3>
          {moodCounts.length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-6">No mood data yet</p>
          ) : (
            <div className="space-y-2">
              {moodCounts.map(m => {
                const total = moodCounts.reduce((a,x) => a + x._count.mood, 0)
                const pct = Math.round((m._count.mood / total) * 100)
                const colors: Record<string,string> = { VERY_LOW:'bg-red-400', LOW:'bg-orange-400', NEUTRAL:'bg-brand-400', GOOD:'bg-green-400', GREAT:'bg-green-600' }
                return (
                  <div key={m.mood} className="flex items-center gap-2">
                    <div className="w-20 text-xs text-gray-500 capitalize">{m.mood.replace('_',' ').toLowerCase()}</div>
                    <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div className={`h-full rounded-full ${colors[m.mood] ?? 'bg-gray-300'}`} style={{ width: `${pct}%` }} />
                    </div>
                    <div className="w-8 text-xs text-gray-500 text-right">{pct}%</div>
                  </div>
                )
              })}
            </div>
          )}
        </Card>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        {[['Free','48%','bg-gray-300'],['Standard','38%','bg-brand-500'],['Premium','14%','bg-purple-DEFAULT']].map(([plan,pct,color]) => (
          <Card key={plan} className="text-center">
            <div className="text-xs text-gray-500 mb-2">{plan} plan</div>
            <div className="text-2xl font-semibold mb-2">{pct}</div>
            <div className="h-2 bg-gray-100 rounded-full overflow-hidden"><div className={`h-full ${color}`} style={{ width: pct }} /></div>
          </Card>
        ))}
      </div>
    </div>
  )
}
