import prisma from '@/lib/prisma'
import { Card, Badge } from '@/components/ui'
import { AlertCircle } from 'lucide-react'
import { timeAgo } from '@/lib/utils'

export default async function AdminAlertsPage() {
  const alerts = await prisma.crisisAlert.findMany({
    include: { client: { include: { user: true } } },
    orderBy: { createdAt: 'desc' }, take: 30
  })
  return (
    <div className="p-6 max-w-4xl">
      <div className="mb-6"><h1 className="text-2xl font-semibold">System alerts</h1><p className="text-gray-500 text-sm mt-0.5">All platform alerts and crisis events.</p></div>
      <Card>
        {alerts.length === 0 ? <p className="text-center text-gray-400 py-8">No alerts yet</p> : (
          <div className="space-y-2">
            {alerts.map(a => (
              <div key={a.id} className={`flex items-center gap-3 p-3 rounded-xl border ${a.status === 'ACTIVE' ? 'bg-red-50 border-red-100' : 'bg-gray-50 border-gray-100'}`}>
                <AlertCircle className={`w-4 h-4 flex-shrink-0 ${a.status === 'ACTIVE' ? 'text-red-500' : 'text-gray-400'}`} />
                <div className="flex-1"><div className="text-sm font-medium">{a.client.user.name}</div><div className="text-xs text-gray-400">{a.type.replace('_',' ')} · {timeAgo(a.createdAt)}</div></div>
                <Badge variant={a.status === 'ACTIVE' ? 'red' : 'green'} className="text-xs">{a.status.toLowerCase()}</Badge>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  )
}
