import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { authOptions } from '@/lib/auth'
import Sidebar from '@/components/layout/Sidebar'
import {
  LayoutDashboard, Calendar, CheckSquare, MessageCircle,
  BookOpen, Users, Bell, Target, Brain
} from 'lucide-react'

export default async function ClientLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions)
  if (!session || (session.user as any).role !== 'CLIENT') redirect('/auth/login')

  const nav = [
    { label: 'Dashboard',    href: '/client',              icon: <LayoutDashboard className="w-4 h-4" /> },
    { label: 'Sessions',     href: '/client/sessions',     icon: <Calendar className="w-4 h-4" /> },
    { label: 'Mood journal', href: '/client/mood',         icon: <span className="text-sm">🙂</span> },
    { label: 'Goals',        href: '/client/goals',        icon: <Target className="w-4 h-4" /> },
    { label: 'Homework',     href: '/client/homework',     icon: <CheckSquare className="w-4 h-4" />, badge: 3, badgeColor: 'red' },
    { label: 'Messages',     href: '/client/messages',     icon: <MessageCircle className="w-4 h-4" />, badge: 2 },
    { label: 'AI companion', href: '/client/ai',           icon: <Brain className="w-4 h-4" /> },
    { label: 'Community',    href: '/client/community',    icon: <Users className="w-4 h-4" /> },
    { label: 'Library',      href: '/client/library',      icon: <BookOpen className="w-4 h-4" /> },
    { label: 'Notifications',href: '/client/notifications',icon: <Bell className="w-4 h-4" />, badge: 4, badgeColor: 'red' },
  ]

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      <Sidebar nav={nav} role="client" />
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>
    </div>
  )
}
