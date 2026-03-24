import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import prisma from '@/lib/prisma'
import { Card, ProgressBar, Badge } from '@/components/ui'
import { areaLabel } from '@/lib/utils'
import { TrendingUp } from 'lucide-react'

export default async function TherapistProgressPage() {
  const session   = await getServerSession(authOptions)
  const userId    = (session?.user as any)?.id
  const therapist = await prisma.therapistProfile.findUnique({
    where: { userId },
    include: {
      clients: {
        include: {
          user: true,
          goals: true,
          moodEntries: { orderBy: { createdAt: 'desc' }, take: 7 },
          homeworkItems: true,
        }
      }
    }
  })

  const clients = therapist?.clients ?? []

  return (
    <div className="p-6 max-w-5xl">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold">Client progress</h1>
        <p className="text-gray-500 text-sm mt-0.5">Track therapy outcomes, mood trends, and goal completion for all your clients.</p>
      </div>

      {clients.length === 0 ? (
        <Card className="text-center py-12">
          <TrendingUp className="w-10 h-10 text-gray-200 mx-auto mb-3" />
          <p className="text-sm text-gray-400">No clients yet. Progress reports will appear here once you have active clients.</p>
        </Card>
      ) : (
        <div className="space-y-4">
          {clients.map(client => {
            const sessProgress = Math.round((client.completedSessions / Math.max(client.totalSessions, 1)) * 100)
            const goalsDone    = client.goals.filter(g => g.isCompleted).length
            const hwDone       = client.homeworkItems.filter(h => h.isCompleted).length
            const avgMood      = client.moodEntries.length > 0
              ? { VERY_LOW:1, LOW:2, NEUTRAL:3, GOOD:4, GREAT:5 }[client.moodEntries[0].mood] ?? 3
              : null

            const moodColors: Record<string,string> = { VERY_LOW:'text-red-500', LOW:'text-orange-500', NEUTRAL:'text-gray-500', GOOD:'text-green-500', GREAT:'text-green-600' }
            const latestMood = client.moodEntries[0]?.mood

            return (
              <Card key={client.id}>
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-10 h-10 bg-brand-500 rounded-full flex items-center justify-center text-white text-sm font-medium flex-shrink-0">
                    {client.user.name.split(' ').map((n:string)=>n[0]).join('').slice(0,2)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-medium">{client.user.name}</h3>
                      {latestMood && (
                        <span className={`text-xs font-medium ${moodColors[latestMood] ?? 'text-gray-500'}`}>
                          {latestMood.replace('_',' ').toLowerCase()} mood
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-gray-400">{areaLabel(client.counsellingArea)} · {client.daysInTherapy} days in therapy</div>
                  </div>
                  <Badge variant={sessProgress >= 75 ? 'green' : sessProgress >= 50 ? 'blue' : 'amber'}>
                    {sessProgress}% complete
                  </Badge>
                </div>

                <div className="grid md:grid-cols-3 gap-4">
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-gray-500">Session progress</span>
                      <span className="font-medium">{client.completedSessions}/{client.totalSessions}</span>
                    </div>
                    <ProgressBar value={sessProgress} color={sessProgress >= 75 ? 'bg-green-500' : 'bg-brand-500'} />
                  </div>
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-gray-500">Goals completed</span>
                      <span className="font-medium">{goalsDone}/{client.goals.length}</span>
                    </div>
                    <ProgressBar value={client.goals.length ? Math.round((goalsDone/client.goals.length)*100) : 0} color="bg-purple-DEFAULT" />
                  </div>
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-gray-500">Homework done</span>
                      <span className="font-medium">{hwDone}/{client.homeworkItems.length}</span>
                    </div>
                    <ProgressBar value={client.homeworkItems.length ? Math.round((hwDone/client.homeworkItems.length)*100) : 0} color="bg-teal-DEFAULT" />
                  </div>
                </div>

                {client.moodEntries.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <div className="text-xs font-medium text-gray-500 mb-2">Mood — last 7 entries</div>
                    <div className="flex items-end gap-1 h-8">
                      {client.moodEntries.slice(0,7).reverse().map((entry, i) => {
                        const h = { VERY_LOW:20, LOW:40, NEUTRAL:60, GOOD:80, GREAT:100 }[entry.mood] ?? 60
                        const c = { VERY_LOW:'bg-red-400', LOW:'bg-orange-400', NEUTRAL:'bg-brand-400', GOOD:'bg-green-400', GREAT:'bg-green-600' }[entry.mood] ?? 'bg-gray-300'
                        return <div key={i} className={`flex-1 rounded-sm ${c}`} style={{ height: `${h}%` }} title={entry.mood} />
                      })}
                    </div>
                  </div>
                )}
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}
