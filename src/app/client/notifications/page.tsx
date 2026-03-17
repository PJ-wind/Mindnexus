'use client'
import { useState, useEffect } from 'react'
import { Card } from '@/components/ui'
import { Bell, Calendar, CheckSquare, MessageCircle, AlertCircle, TrendingUp } from 'lucide-react'
import { timeAgo } from '@/lib/utils'
import toast from 'react-hot-toast'
import Link from 'next/link'

const TYPE_ICONS: Record<string,any> = {
  BOOKING:  Calendar,
  HOMEWORK: CheckSquare,
  MESSAGE:  MessageCircle,
  CRISIS:   AlertCircle,
  MOOD:     TrendingUp,
  DEFAULT:  Bell,
}
const TYPE_COLORS: Record<string,string> = {
  BOOKING:  'bg-brand-50 text-brand-500',
  HOMEWORK: 'bg-green-50 text-green-500',
  MESSAGE:  'bg-purple-50 text-purple-500',
  CRISIS:   'bg-red-50 text-red-500',
  MOOD:     'bg-teal-50 text-teal-DEFAULT',
  DEFAULT:  'bg-gray-50 text-gray-500',
}

export default function NotificationsPage() {
  const [notifs, setNotifs]   = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/notifications').then(r => r.json()).then(data => {
      setNotifs(data)
      setLoading(false)
    })
  }, [])

  async function markAllRead() {
    await fetch('/api/notifications', { method: 'PATCH' })
    setNotifs(prev => prev.map(n => ({ ...n, isRead: true })))
    toast.success('All notifications marked as read')
  }

  const unread = notifs.filter(n => !n.isRead).length

  return (
    <div className="p-6 max-w-3xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold">Notifications</h1>
          <p className="text-gray-500 text-sm mt-0.5">
            {unread > 0 ? `${unread} unread notifications` : 'All caught up!'}
          </p>
        </div>
        {unread > 0 && (
          <button onClick={markAllRead} className="btn-secondary text-sm py-1.5">Mark all read</button>
        )}
      </div>

      <Card>
        {loading ? (
          <div className="text-center py-10 text-gray-400 text-sm">Loading...</div>
        ) : notifs.length === 0 ? (
          <div className="text-center py-12">
            <Bell className="w-10 h-10 mx-auto text-gray-200 mb-3" />
            <p className="text-sm text-gray-400">No notifications yet.</p>
          </div>
        ) : (
          <div className="space-y-1">
            {notifs.map(n => {
              const Icon  = TYPE_ICONS[n.type] ?? TYPE_ICONS.DEFAULT
              const color = TYPE_COLORS[n.type] ?? TYPE_COLORS.DEFAULT
              return (
                <div key={n.id}
                  className={`flex items-start gap-3 p-3 rounded-xl transition-colors ${n.isRead ? '' : 'bg-brand-50/40'}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${color}`}>
                    <Icon className="w-3.5 h-3.5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium">{n.title}</div>
                    <div className="text-xs text-gray-500 mt-0.5">{n.message}</div>
                    <div className="text-[10px] text-gray-400 mt-1">{timeAgo(n.createdAt)}</div>
                  </div>
                  {!n.isRead && <div className="w-2 h-2 bg-brand-500 rounded-full flex-shrink-0 mt-1" />}
                </div>
              )
            })}
          </div>
        )}
      </Card>
    </div>
  )
}
