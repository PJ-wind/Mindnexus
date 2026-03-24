import prisma from '@/lib/prisma'
import { Card, Badge } from '@/components/ui'
import { AlertCircle, CheckCircle } from 'lucide-react'
import { timeAgo } from '@/lib/utils'

export default async function AdminCrisisPage() {
  const alerts = await prisma.crisisAlert.findMany({
    include: { client: { include: { user: true, therapist: { include: { user: { select:{ name:true } } } } } } },
    orderBy: { createdAt: 'desc' }
  })
  const active   = alerts.filter(a => a.status === 'ACTIVE' || a.status === 'ASSIGNED')
  const resolved = alerts.filter(a => a.status === 'RESOLVED')
  return (
    <div className="p-6 max-w-4xl">
      <div className="mb-6"><h1 className="text-2xl font-semibold">Crisis log</h1><p className="text-gray-500 text-sm mt-0.5">All crisis alerts across the platform.</p></div>
      {active.length > 0 && (
        <div className="mb-6 space-y-3">
          <h3 className="text-sm font-medium text-red-600 flex items-center gap-2"><AlertCircle className="w-4 h-4" /> Active ({active.length})</h3>
          {active.map(a => (
            <div key={a.id} className="bg-red-50 border border-red-200 rounded-xl p-4">
              <div className="flex items-center justify-between"><div><div className="font-medium text-red-800">{a.client.user.name}</div><div className="text-xs text-red-500">{timeAgo(a.createdAt)} · Therapist: {a.client.therapist?.user.name ?? 'Unassigned'}</div></div><Badge variant="red">Active</Badge></div>
            </div>
          ))}
        </div>
      )}
      <Card>
        <h3 className="text-sm font-medium mb-3">All crisis events ({alerts.length})</h3>
        {alerts.length === 0 ? <p className="text-center text-gray-400 py-6">No crisis events recorded.</p> : (
          <div className="space-y-2">
            {alerts.map(a => (
              <div key={a.id} className="flex items-center gap-3 p-3 rounded-xl bg-gray-50">
                {a.status === 'RESOLVED' ? <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" /> : <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0" />}
                <div className="flex-1"><div className="text-sm font-medium">{a.client.user.name}</div><div className="text-xs text-gray-400">{timeAgo(a.createdAt)}</div></div>
                <Badge variant={a.status === 'RESOLVED' ? 'green' : 'red'} className="text-xs">{a.status.toLowerCase()}</Badge>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  )
}
