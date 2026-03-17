import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import prisma from '@/lib/prisma'
import { Card, ProgressBar, Badge } from '@/components/ui'
import { Target, CheckCircle } from 'lucide-react'

export default async function GoalsPage() {
  const session = await getServerSession(authOptions)
  const userId  = (session?.user as any)?.id

  const profile = await prisma.clientProfile.findUnique({
    where: { userId },
    include: { goals: { orderBy: { createdAt: 'asc' } } }
  })

  const goals    = profile?.goals ?? []
  const done     = goals.filter(g => g.isCompleted).length
  const avgProg  = goals.length ? Math.round(goals.reduce((a,g) => a + g.progress, 0) / goals.length) : 0

  const milestones = [
    { label: 'First week completed',      done: (profile?.daysInTherapy ?? 0) >= 7 },
    { label: '7-day mood streak',         done: true },
    { label: 'Sleep improved to 7+ hrs',  done: true },
    { label: 'First homework completed',  done: true },
    { label: 'Complete all homework',     done: false },
    { label: 'Reach 75% therapy progress',done: avgProg >= 75 },
  ]

  return (
    <div className="p-6 max-w-4xl">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold">Goals & progress</h1>
        <p className="text-gray-500 text-sm mt-0.5">Your therapy goals set with your counsellor. Track your journey.</p>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        <div className="stat-card text-center">
          <div className="text-2xl font-semibold text-brand-500">{avgProg}%</div>
          <div className="text-xs text-gray-500 mt-0.5">Overall progress</div>
        </div>
        <div className="stat-card text-center">
          <div className="text-2xl font-semibold text-green-600">{done}</div>
          <div className="text-xs text-gray-500 mt-0.5">Goals completed</div>
        </div>
        <div className="stat-card text-center">
          <div className="text-2xl font-semibold">{goals.length - done}</div>
          <div className="text-xs text-gray-500 mt-0.5">In progress</div>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        <div className="md:col-span-2">
          <Card>
            <h4 className="font-medium text-sm mb-4">My therapy goals</h4>
            {goals.length === 0 ? (
              <div className="text-center py-10 text-gray-400">
                <Target className="w-10 h-10 mx-auto mb-3 opacity-30" />
                <p className="text-sm">No goals set yet.</p>
                <p className="text-xs mt-1">Goals will be set with your therapist during your first session.</p>
              </div>
            ) : (
              <div className="space-y-5">
                {goals.map((goal, i) => (
                  <div key={goal.id} className="flex gap-4">
                    <div className="w-7 h-7 rounded-full bg-brand-50 text-brand-600 text-xs font-semibold flex items-center justify-center flex-shrink-0 mt-0.5">
                      {i + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-1.5">
                        <div className="text-sm font-medium">{goal.title}</div>
                        <Badge
                          variant={goal.progress >= 80 ? 'green' : goal.progress >= 50 ? 'blue' : 'amber'}
                          className="text-xs flex-shrink-0">
                          {goal.progress}%
                        </Badge>
                      </div>
                      {goal.description && (
                        <p className="text-xs text-gray-400 mb-2">{goal.description}</p>
                      )}
                      <ProgressBar
                        value={goal.progress}
                        color={goal.progress >= 80 ? 'bg-green-500' : goal.progress >= 50 ? 'bg-brand-500' : 'bg-amber-400'}
                      />
                      <div className="text-[10px] text-gray-400 mt-1">
                        {goal.progress >= 100 ? 'Completed ✓' : `${goal.progress}% complete — keep going`}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>

        <div className="space-y-4">
          {/* Overall progress */}
          <Card>
            <h4 className="text-sm font-medium mb-3">Overall journey</h4>
            <div className="text-center py-3">
              <div className="text-4xl font-semibold text-green-600 mb-1">{avgProg}%</div>
              <div className="text-xs text-gray-400 mb-3">Therapy journey</div>
              <ProgressBar value={avgProg} color="bg-green-500" className="mb-2" />
              <div className="text-[10px] text-gray-400">
                {profile?.completedSessions} of {profile?.totalSessions} sessions completed
              </div>
            </div>
          </Card>

          {/* Milestones */}
          <Card>
            <h4 className="text-sm font-medium mb-3">Milestones reached</h4>
            <div className="space-y-2">
              {milestones.map(m => (
                <div key={m.label} className="flex items-center gap-2.5">
                  <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 ${m.done ? 'bg-green-50' : 'bg-gray-100'}`}>
                    {m.done
                      ? <CheckCircle className="w-3.5 h-3.5 text-green-500" />
                      : <div className="w-2 h-2 rounded-full bg-gray-300" />}
                  </div>
                  <span className={`text-xs ${m.done ? 'text-gray-700' : 'text-gray-400'}`}>{m.label}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
