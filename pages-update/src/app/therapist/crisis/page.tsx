import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import prisma from '@/lib/prisma'
import { Card, Badge } from '@/components/ui'
import { AlertCircle, Phone, MessageCircle, CheckCircle } from 'lucide-react'
import { timeAgo } from '@/lib/utils'

export default async function TherapistCrisisPage() {
  const session    = await getServerSession(authOptions)
  const userId     = (session?.user as any)?.id
  const therapist  = await prisma.therapistProfile.findUnique({ where: { userId } })

  const alerts = await prisma.crisisAlert.findMany({
    where: { client: { therapistId: therapist?.id } },
    include: { client: { include: { user: true } } },
    orderBy: { createdAt: 'desc' },
    take: 20
  })

  const active    = alerts.filter(a => a.status === 'ACTIVE' || a.status === 'ASSIGNED')
  const resolved  = alerts.filter(a => a.status === 'RESOLVED')

  return (
    <div className="p-6 max-w-4xl">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold">Crisis alerts</h1>
        <p className="text-gray-500 text-sm mt-0.5">Monitor and respond to client crisis events immediately.</p>
      </div>

      {active.length > 0 && (
        <div className="mb-6">
          <h3 className="text-sm font-medium text-red-600 flex items-center gap-2 mb-3">
            <AlertCircle className="w-4 h-4" /> Active alerts ({active.length})
          </h3>
          <div className="space-y-3">
            {active.map(alert => (
              <div key={alert.id} className="bg-red-50 border border-red-200 rounded-xl p-4">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <div className="font-medium text-red-800">{alert.client.user.name}</div>
                    <div className="text-xs text-red-500">{timeAgo(alert.createdAt)} · {alert.type.replace('_',' ')}</div>
                  </div>
                  <Badge variant="red">Active</Badge>
                </div>
                {alert.message && <p className="text-xs text-red-700 italic mb-3">&ldquo;{alert.message}&rdquo;</p>}
                <div className="flex gap-2">
                  <a href={`tel:+234800000000`} className="flex items-center gap-1.5 btn-danger text-xs py-1.5 px-3">
                    <Phone className="w-3 h-3" /> Call client
                  </a>
                  <a href={`/therapist/messages`} className="flex items-center gap-1.5 btn-secondary text-xs py-1.5 px-3">
                    <MessageCircle className="w-3 h-3" /> Send message
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {active.length === 0 && (
        <div className="mb-6 bg-green-50 border border-green-100 rounded-xl p-6 text-center">
          <CheckCircle className="w-10 h-10 text-green-400 mx-auto mb-2" />
          <h3 className="font-medium text-green-700 mb-1">All clear</h3>
          <p className="text-xs text-green-600">No active crisis alerts. Your clients are safe.</p>
        </div>
      )}

      {resolved.length > 0 && (
        <Card>
          <h3 className="text-sm font-medium mb-3 text-gray-500">Previous alerts ({resolved.length})</h3>
          <div className="space-y-2">
            {resolved.map(alert => (
              <div key={alert.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                <div className="flex-1">
                  <div className="text-sm font-medium">{alert.client.user.name}</div>
                  <div className="text-xs text-gray-400">{timeAgo(alert.createdAt)}</div>
                </div>
                <Badge variant="green" className="text-[10px]">Resolved</Badge>
              </div>
            ))}
          </div>
        </Card>
      )}

      {alerts.length === 0 && (
        <Card className="text-center py-10">
          <AlertCircle className="w-10 h-10 text-gray-200 mx-auto mb-3" />
          <p className="text-sm text-gray-400">No crisis alerts yet.</p>
          <p className="text-xs text-gray-400 mt-1">When a client activates crisis support, it will appear here immediately.</p>
        </Card>
      )}
    </div>
  )
}
