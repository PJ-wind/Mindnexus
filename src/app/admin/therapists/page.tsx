import prisma from '@/lib/prisma'
import { Card, Badge } from '@/components/ui'
import { areaLabel } from '@/lib/utils'

export default async function AdminTherapists() {
  const therapists = await prisma.therapistProfile.findMany({
    include: {
      user: true,
      _count: { select: { clients: true, sessions: true } }
    },
    orderBy: { rating: 'desc' }
  })

  return (
    <div className="p-6 max-w-6xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold">Therapist management</h1>
          <p className="text-gray-500 text-sm mt-0.5">{therapists.length} therapists on the platform</p>
        </div>
        <div className="flex gap-2">
          <input type="text" className="input text-sm w-48" placeholder="Search therapists..." />
          <select className="input text-sm w-36">
            <option>All statuses</option>
            <option>Active</option>
            <option>On leave</option>
          </select>
          <button className="btn-primary text-sm py-2 px-4">+ Add therapist</button>
        </div>
      </div>

      <Card>
        <table className="w-full text-sm">
          <thead>
            <tr className="text-xs text-gray-400 font-medium border-b border-gray-100">
              <th className="text-left py-3 px-2">Therapist</th>
              <th className="text-left py-3 px-2">Specialisations</th>
              <th className="text-left py-3 px-2">Clients</th>
              <th className="text-left py-3 px-2">Sessions</th>
              <th className="text-left py-3 px-2">Rating</th>
              <th className="text-left py-3 px-2">Status</th>
              <th className="text-left py-3 px-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {therapists.map(t => (
              <tr key={t.id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50 transition-colors">
                <td className="py-3 px-2">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 bg-brand-500 rounded-full flex items-center justify-center text-white text-xs font-medium flex-shrink-0">
                      {t.user.name.split(' ').map((n:string)=>n[0]).join('').slice(0,2)}
                    </div>
                    <div>
                      <div className="font-medium text-xs">{t.user.name}</div>
                      <div className="text-[10px] text-gray-400">{t.yearsExperience} yrs exp · {t.licenseNumber}</div>
                    </div>
                  </div>
                </td>
                <td className="py-3 px-2">
                  <div className="flex flex-wrap gap-1">
                    {t.specialisations.slice(0,2).map(s => (
                      <Badge key={s} variant="blue" className="text-[10px]">{areaLabel(s).split(' ')[0]}</Badge>
                    ))}
                    {t.specialisations.length > 2 && (
                      <Badge variant="gray" className="text-[10px]">+{t.specialisations.length - 2}</Badge>
                    )}
                  </div>
                </td>
                <td className="py-3 px-2 text-xs font-medium">{t._count.clients}</td>
                <td className="py-3 px-2 text-xs text-gray-600">{t._count.sessions}</td>
                <td className="py-3 px-2 text-xs text-amber-500 font-medium">★ {t.rating}</td>
                <td className="py-3 px-2">
                  {t.isOnLeave
                    ? <Badge variant="amber" className="text-xs">On leave</Badge>
                    : t.isActive
                      ? <Badge variant="green" className="text-xs">Active</Badge>
                      : <Badge variant="gray"  className="text-xs">Inactive</Badge>}
                </td>
                <td className="py-3 px-2">
                  <div className="flex gap-1">
                    <button className="text-xs px-2 py-1 bg-gray-50 hover:bg-gray-100 rounded-lg border border-gray-200">View</button>
                    <button className="text-xs px-2 py-1 bg-gray-50 hover:bg-gray-100 rounded-lg border border-gray-200">Edit</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  )
}
