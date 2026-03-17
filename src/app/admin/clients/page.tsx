import prisma from '@/lib/prisma'
import { Card, Badge } from '@/components/ui'
import { areaLabel, formatDate } from '@/lib/utils'

export default async function AdminClients() {
  const clients = await prisma.clientProfile.findMany({
    include: {
      user:      true,
      therapist: { include: { user: { select: { name: true } } } },
      crisisAlerts: { where: { status: { in: ['ACTIVE','ASSIGNED'] } } }
    },
    orderBy: { user: { name: 'asc' } },
    take: 100
  })

  const planColors: Record<string,string> = { FREE: 'gray', STANDARD: 'blue', PREMIUM: 'purple' }

  return (
    <div className="p-6 max-w-6xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold">All clients</h1>
          <p className="text-gray-500 text-sm mt-0.5">{clients.length} registered clients</p>
        </div>
        <div className="flex gap-2">
          <input type="text" className="input text-sm w-52" placeholder="Search clients..." />
          <select className="input text-sm w-36">
            <option>All plans</option>
            <option>Free</option>
            <option>Standard</option>
            <option>Premium</option>
          </select>
        </div>
      </div>

      <Card>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-xs text-gray-400 font-medium border-b border-gray-100">
                <th className="text-left py-3 px-2">Client</th>
                <th className="text-left py-3 px-2">Plan</th>
                <th className="text-left py-3 px-2">Counselling area</th>
                <th className="text-left py-3 px-2">Therapist</th>
                <th className="text-left py-3 px-2">Sessions</th>
                <th className="text-left py-3 px-2">Joined</th>
                <th className="text-left py-3 px-2">Status</th>
                <th className="text-left py-3 px-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {clients.map(client => {
                const hasCrisis   = client.crisisAlerts.length > 0
                const isUnmatched = !client.therapistId
                return (
                  <tr key={client.id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50 transition-colors">
                    <td className="py-3 px-2">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-brand-500 rounded-full flex items-center justify-center text-white text-xs font-medium flex-shrink-0">
                          {client.user.name.split(' ').map((n:string)=>n[0]).join('').slice(0,2)}
                        </div>
                        <div>
                          <div className="font-medium text-xs">{client.user.name}</div>
                          <div className="text-[10px] text-gray-400">{client.user.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-2">
                      <Badge variant={planColors[client.plan] as any} className="text-xs">{client.plan}</Badge>
                    </td>
                    <td className="py-3 px-2 text-xs text-gray-600">{areaLabel(client.counsellingArea)}</td>
                    <td className="py-3 px-2 text-xs">
                      {client.therapist?.user?.name
                        ? <span className="text-gray-700">{client.therapist.user.name}</span>
                        : <span className="text-amber-500">Unassigned</span>}
                    </td>
                    <td className="py-3 px-2 text-xs text-gray-600">
                      {client.completedSessions}/{client.totalSessions}
                    </td>
                    <td className="py-3 px-2 text-xs text-gray-400">{formatDate(client.startDate)}</td>
                    <td className="py-3 px-2">
                      {hasCrisis
                        ? <Badge variant="red"   className="text-xs">Crisis</Badge>
                        : isUnmatched
                          ? <Badge variant="amber" className="text-xs">New</Badge>
                          : <Badge variant="green" className="text-xs">Active</Badge>}
                    </td>
                    <td className="py-3 px-2">
                      <div className="flex gap-1">
                        <button className="text-xs px-2 py-1 bg-gray-50 hover:bg-gray-100 rounded-lg border border-gray-200 transition-colors">View</button>
                        {isUnmatched && (
                          <button className="text-xs px-2 py-1 bg-brand-50 hover:bg-brand-100 rounded-lg border border-brand-200 text-brand-600 transition-colors">Match</button>
                        )}
                        {hasCrisis && (
                          <button className="text-xs px-2 py-1 bg-red-50 hover:bg-red-100 rounded-lg border border-red-200 text-red-600 transition-colors">Respond</button>
                        )}
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}
