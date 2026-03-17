import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import prisma from '@/lib/prisma'
import { formatDateTime, formatDate, moodLabel, areaLabel } from '@/lib/utils'
import { StatCard, Card, ProgressBar, Badge } from '@/components/ui'
import { CheckSquare, MessageCircle, AlertCircle, Calendar, ArrowRight } from 'lucide-react'
import Link from 'next/link'

export default async function ClientDashboard() {
  const session  = await getServerSession(authOptions)
  const userId   = (session?.user as any)?.id

  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      clientProfile: {
        include: {
          therapist: { include: { user: true } },
          goals: { orderBy: { createdAt: 'asc' } },
          homeworkItems: { where: { isCompleted: false }, orderBy: { dueDate: 'asc' }, take: 3 },
          moodEntries: { orderBy: { createdAt: 'desc' }, take: 7 }
        }
      }
    }
  })

  const cp = user?.clientProfile
  const therapist = cp?.therapist?.user

  // Next upcoming session
  const nextSession = await prisma.session.findFirst({
    where: {
      clientId: userId,
      status: 'SCHEDULED',
      scheduledAt: { gte: new Date() }
    },
    include: { therapist: { include: { user: true } } },
    orderBy: { scheduledAt: 'asc' }
  })

  // Unread messages count
  const unreadMessages = await prisma.message.count({
    where: { receiverId: userId, isRead: false }
  })

  const progressPct = cp
    ? Math.round((cp.completedSessions / Math.max(cp.totalSessions, 1)) * 100)
    : 0

  const moodDays = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun']
  const moodColors: Record<string, string> = {
    VERY_LOW: 'bg-red-400', LOW: 'bg-orange-400',
    NEUTRAL: 'bg-brand-400', GOOD: 'bg-green-400', GREAT: 'bg-green-600'
  }

  return (
    <div className="p-6 max-w-5xl">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-semibold">Good day, {user?.name?.split(' ')[0]} 👋</h1>
        <p className="text-gray-500 text-sm mt-0.5">
          {nextSession
            ? `You have a session with ${nextSession.therapist.user.name} ${formatDateTime(nextSession.scheduledAt)}`
            : 'No upcoming sessions. Book one when you are ready.'}
        </p>
      </div>

      {/* Next session banner */}
      {nextSession && (
        <div className="bg-brand-50 border border-brand-100 rounded-xl p-4 mb-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-brand-500 rounded-full flex items-center justify-center text-white font-medium text-sm">
              {nextSession.therapist.user.name.split(' ').map((n:string) => n[0]).join('').slice(0,2)}
            </div>
            <div className="flex-1">
              <div className="font-medium text-brand-800">{nextSession.therapist.user.name}</div>
              <div className="text-xs text-brand-600">{areaLabel(nextSession.area)} · {nextSession.type.toLowerCase()} · {nextSession.durationMins} min</div>
            </div>
            <Badge variant="green">{formatDateTime(nextSession.scheduledAt)}</Badge>
          </div>
          <div className="flex gap-2">
            <Link href={`/client/sessions/${nextSession.id}/join`} className="btn-primary py-2 px-4 text-sm">
              Join session
            </Link>
            <Link href="/client/sessions" className="btn-secondary py-2 px-4 text-sm">
              Reschedule
            </Link>
          </div>
        </div>
      )}

      {/* Stats row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        <StatCard label="Sessions completed" value={cp?.completedSessions ?? 0}
          sub={`of ${cp?.totalSessions ?? 0} total`} />
        <StatCard label="Days in therapy" value={cp?.daysInTherapy ?? 0} sub="since you started" />
        <StatCard label="Homework pending" value={cp?.homeworkItems?.length ?? 0}
          sub="tasks this week" subColor={cp?.homeworkItems?.length ? 'amber' : 'green'} />
        <StatCard label="Messages" value={unreadMessages}
          sub={unreadMessages > 0 ? 'unread' : 'all caught up'} subColor={unreadMessages > 0 ? 'amber' : 'green'} />
      </div>

      <div className="grid md:grid-cols-3 gap-4 mb-4">
        {/* Mood chart */}
        <div className="md:col-span-2">
          <Card>
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-medium text-sm">Mood this week</h4>
              <Link href="/client/mood" className="text-xs text-brand-500 hover:underline flex items-center gap-1">
                Full journal <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
            <div className="flex items-end gap-2 h-16 mb-2">
              {moodDays.map((day, i) => {
                const entry = cp?.moodEntries?.[cp.moodEntries.length - 7 + i]
                const h = entry ? { VERY_LOW:15, LOW:30, NEUTRAL:50, GOOD:70, GREAT:95 }[entry.mood] ?? 50 : 8
                return (
                  <div key={day} className="flex-1 flex flex-col items-center gap-1">
                    <div className={`w-full rounded-sm ${entry ? moodColors[entry.mood] : 'bg-gray-100'} transition-all`}
                      style={{ height: `${h}%` }} title={entry ? moodLabel(entry.mood) : 'No entry'} />
                    <span className="text-[10px] text-gray-400">{day}</span>
                  </div>
                )
              })}
            </div>
            <div className="flex gap-3 mt-2 pt-3 border-t border-gray-50">
              {[['bg-green-400','Good/Great'],['bg-brand-400','Neutral'],['bg-red-400','Low']].map(([c,l]) => (
                <div key={l} className="flex items-center gap-1.5"><div className={`w-2 h-2 rounded-full ${c}`} /><span className="text-[10px] text-gray-400">{l}</span></div>
              ))}
            </div>

            {/* Progress */}
            <div className="mt-4 pt-4 border-t border-gray-100">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-medium text-gray-600">Therapy progress</span>
                <span className="text-xs font-semibold text-green-600">{progressPct}%</span>
              </div>
              <ProgressBar value={progressPct} color="bg-green-500" />
              <div className="text-[10px] text-gray-400 mt-1">{cp?.completedSessions} of {cp?.totalSessions} sessions completed</div>
            </div>
          </Card>
        </div>

        {/* Homework + message preview */}
        <div className="flex flex-col gap-3">
          <Card>
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-sm font-medium">Pending homework</h4>
              <Link href="/client/homework" className="text-xs text-brand-500 hover:underline">All tasks</Link>
            </div>
            {cp?.homeworkItems && cp.homeworkItems.length > 0 ? (
              <div className="space-y-2">
                {cp.homeworkItems.map(hw => (
                  <div key={hw.id} className="flex items-center gap-2 py-1.5">
                    <CheckSquare className="w-3.5 h-3.5 text-gray-300 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-medium truncate">{hw.title}</div>
                      <div className="text-[10px] text-gray-400">
                        {hw.dueDate ? `Due ${formatDate(hw.dueDate)}` : 'No due date'}
                      </div>
                    </div>
                    <Badge variant="amber" className="text-[10px]">Pending</Badge>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-gray-400 text-center py-3">All homework complete!</p>
            )}
          </Card>

          {/* Last message */}
          <Card>
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-sm font-medium">Latest message</h4>
              <Link href="/client/messages" className="text-xs text-brand-500 hover:underline">Open chat</Link>
            </div>
            {therapist ? (
              <div className="flex gap-2">
                <div className="w-7 h-7 bg-brand-500 rounded-full flex items-center justify-center text-white text-[10px] font-medium flex-shrink-0">
                  {therapist.name.split(' ').map((n:string) => n[0]).join('').slice(0,2)}
                </div>
                <div>
                  <div className="text-xs font-medium">{therapist.name}</div>
                  <div className="text-xs text-gray-500 mt-0.5 leading-relaxed">
                    "Looking forward to our session. Please bring your journal notes."
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-xs text-gray-400">No therapist assigned yet.</p>
            )}
          </Card>
        </div>
      </div>

      {/* Goals */}
      {cp?.goals && cp.goals.length > 0 && (
        <Card>
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-medium text-sm">My therapy goals</h4>
            <Link href="/client/goals" className="text-xs text-brand-500 hover:underline flex items-center gap-1">
              All goals <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          <div className="grid md:grid-cols-2 gap-3">
            {cp.goals.slice(0, 4).map((goal, i) => (
              <div key={goal.id} className="flex gap-3">
                <div className="w-6 h-6 rounded-full bg-brand-50 text-brand-600 text-xs font-medium flex items-center justify-center flex-shrink-0 mt-0.5">
                  {i + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-medium mb-1 truncate">{goal.title}</div>
                  <ProgressBar value={goal.progress}
                    color={goal.progress >= 70 ? 'bg-green-500' : goal.progress >= 40 ? 'bg-brand-500' : 'bg-amber-400'} />
                  <div className="text-[10px] text-gray-400 mt-0.5">{goal.progress}% complete</div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Crisis alert */}
      <div className="mt-4 p-3 bg-red-50 border border-red-100 rounded-xl flex items-center gap-3">
        <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
        <div className="flex-1 text-xs text-red-700">
          If you are in crisis or need immediate support, tap the <strong>Crisis support</strong> button in the left sidebar. Your therapist will be notified immediately.
        </div>
      </div>
    </div>
  )
}
