import prisma from '@/lib/prisma'
import { Card, Badge } from '@/components/ui'
import { formatDateTime, areaLabel } from '@/lib/utils'

export default async function AdminSessionsPage() {
  const sessions = await prisma.session.findMany({
    include: { client: { select: { name: true } }, therapist: { include: { user: { select: { name: true } } } } },
    orderBy: { scheduledAt: 'desc' }, take: 50
  })
  const statusColors: Record<string,string> = { SCHEDULED:'gray', LIVE:'blue', COMPLETED:'green', CANCELLED:'red' }
  return (
    <div className="p-6 max-w-5xl">
      <div className="mb-6"><h1 className="text-2xl font-semibold">All sessions</h1><p className="text-gray-500 text-sm mt-0.5">{sessions.length} sessions on the platform.</p></div>
      <div className="grid grid-cols-4 gap-3 mb-6">
        {[['Total',sessions.length,''],['Scheduled',sessions.filter(s=>s.status==='SCHEDULED').length,'text-brand-500'],['Completed',sessions.filter(s=>s.status==='COMPLETED').length,'text-green-600'],['Cancelled',sessions.filter(s=>s.status==='CANCELLED').length,'text-red-500']].map(([l,v,c]) => (
          <div key={l as string} className="stat-card text-center"><div className={`text-2xl font-semibold ${c}`}>{v}</div><div className="text-xs text-gray-500 mt-0.5">{l}</div></div>
        ))}
      </div>
      <Card>
        <table className="w-full text-sm">
          <thead><tr className="text-xs text-gray-400 border-b border-gray-100"><th className="text-left py-2">Client</th><th className="text-left py-2">Therapist</th><th className="text-left py-2">Area</th><th className="text-left py-2">Date</th><th className="text-left py-2">Type</th><th className="text-left py-2">Status</th></tr></thead>
          <tbody>
            {sessions.map(s => (
              <tr key={s.id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50">
                <td className="py-2.5 font-medium text-xs">{s.client.name}</td>
                <td className="py-2.5 text-xs text-gray-500">{s.therapist.user.name}</td>
                <td className="py-2.5 text-xs text-gray-500">{areaLabel(s.area)}</td>
                <td className="py-2.5 text-xs text-gray-400">{formatDateTime(s.scheduledAt)}</td>
                <td className="py-2.5"><Badge variant="blue" className="text-xs">{s.type}</Badge></td>
                <td className="py-2.5"><Badge variant={statusColors[s.status] as any} className="text-xs">{s.status.toLowerCase()}</Badge></td>
              </tr>
            ))}
          </tbody>
        </table>
        {sessions.length === 0 && <p className="text-center text-gray-400 py-6">No sessions yet</p>}
      </Card>
    </div>
  )
}
