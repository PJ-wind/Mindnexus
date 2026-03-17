import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { authOptions } from '@/lib/auth'
import Sidebar from '@/components/layout/Sidebar'
import {
  LayoutDashboard, Users, UserCheck, Calendar,
  DollarSign, AlertCircle, BarChart2, FileText,
  Activity, Settings, BookOpen
} from 'lucide-react'

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions)
  if (!session || (session.user as any).role !== 'ADMIN') redirect('/auth/login')

  const nav = [
    { label: 'Overview',       href: '/admin',               icon: <LayoutDashboard className="w-4 h-4" /> },
    { label: 'Analytics',      href: '/admin/analytics',     icon: <BarChart2 className="w-4 h-4" /> },
    { label: 'System alerts',  href: '/admin/alerts',        icon: <AlertCircle className="w-4 h-4" />, badge: 5, badgeColor: 'red' },
    { label: 'Therapists',     href: '/admin/therapists',    icon: <UserCheck className="w-4 h-4" />, badge: 7 },
    { label: 'All clients',    href: '/admin/clients',       icon: <Users className="w-4 h-4" /> },
    { label: 'Matching',       href: '/admin/matching',      icon: <UserCheck className="w-4 h-4" />, badge: 8, badgeColor: 'red' },
    { label: 'Sessions',       href: '/admin/sessions',      icon: <Calendar className="w-4 h-4" /> },
    { label: 'Revenue',        href: '/admin/revenue',       icon: <DollarSign className="w-4 h-4" /> },
    { label: 'Crisis log',     href: '/admin/crisis',        icon: <AlertCircle className="w-4 h-4" />, badge: 2, badgeColor: 'red' },
    { label: 'Content library',href: '/admin/content',      icon: <BookOpen className="w-4 h-4" /> },
    { label: 'Activity logs',  href: '/admin/logs',          icon: <Activity className="w-4 h-4" /> },
    { label: 'Settings',       href: '/admin/settings',      icon: <Settings className="w-4 h-4" /> },
  ]

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      <Sidebar nav={nav} role="admin" />
      <main className="flex-1 overflow-y-auto">{children}</main>
    </div>
  )
}
