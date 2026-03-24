import prisma from '@/lib/prisma'
import { Card, Badge } from '@/components/ui'
import { areaLabel } from '@/lib/utils'

export default async function AdminMatchingPage() {
  const unmatched = await prisma.clientProfile.findMany({
    where: { therapistId: null },
    include: { user: true },
    orderBy: { user: { name: 'asc' } }
  })
  const therapists = await prisma.therapistProfile.findMany({ where: { isActive: true }, include: { user: true, _count: { select: { clients: true } } } })
  return (
    <div className="p-6 max-w-5xl">
      <div className="mb-6"><h1 className="text-2xl font-semibold">Therapist matching</h1><p className="text-gray-500 text-sm mt-0.5">{unmatched.length} clients waiting to be matched.</p></div>
      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <h3 className="font-medium text-sm mb-3">Unmatched clients ({unmatched.length})</h3>
          {unmatched.length === 0 ? <p className="text-xs text-gray-400 text-center py-4">All clients matched!</p> : (
            <div className="space-y-2">
              {unmatched.map(c => (
                <div key={c.id} className="flex items-center gap-3 p-3 bg-amber-50 border border-amber-100 rounded-xl">
                  <div className="w-8 h-8 bg-brand-500 rounded-full flex items-center justify-center text-white text-xs font-medium">{c.user.name.split(' ').map((n:string)=>n[0]).join('').slice(0,2)}</div>
                  <div className="flex-1"><div className="text-sm font-medium">{c.user.name}</div><div className="text-xs text-gray-400">{areaLabel(c.counsellingArea)}</div></div>
                  <Badge variant="amber" className="text-xs">Unmatched</Badge>
                </div>
              ))}
            </div>
          )}
        </Card>
        <Card>
          <h3 className="font-medium text-sm mb-3">Available therapists</h3>
          <div className="space-y-2">
            {therapists.map(t => (
              <div key={t.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                <div className="w-8 h-8 bg-brand-500 rounded-full flex items-center justify-center text-white text-xs font-medium">{t.user.name.split(' ').map((n:string)=>n[0]).join('').slice(0,2)}</div>
                <div className="flex-1"><div className="text-sm font-medium">{t.user.name}</div><div className="text-xs text-gray-400">{t._count.clients} clients · ★{t.rating}</div></div>
                <button className="btn-primary text-xs py-1 px-2.5">Match</button>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  )
}
