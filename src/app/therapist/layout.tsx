import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { authOptions } from '@/lib/auth'
import Sidebar from '@/components/layout/Sidebar'
import {
  LayoutDashboard, Users, Calendar, FileText,
  CheckSquare, MessageCircle, Video, AlertCircle,
  BarChart2, Settings, FlaskConical, BookOpen
} from 'lucide-react'

export default async function TherapistLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions)
  if (!session || (session.user as any).role !== 'THERAPIST') redirect('/auth/login')

  const nav = [
    { label: 'Dashboard',   href: '/therapist',               icon: <LayoutDashboard className="w-4 h-4" /> },
    { label: 'My clients',  href: '/therapist/clients',        icon: <Users className="w-4 h-4" />, badge: 24 },
    { label: 'Sessions',    href: '/therapist/sessions',       icon: <Calendar className="w-4 h-4" /> },
    { label: 'Video room',  href: '/therapist/video',          icon: <Video className="w-4 h-4" /> },
    { label: 'Session notes',href: '/therapist/notes',         icon: <FileText className="w-4 h-4" /> },
    { label: 'Psych tests',    href: '/therapist/tests',       icon: <FlaskConical className="w-4 h-4" /> },
    { label: 'Theories',       href: '/therapist/theories',    icon: <BookOpen className="w-4 h-4" /> },
    { label: 'Assignments', href: '/therapist/assignments',    icon: <CheckSquare className="w-4 h-4" /> },
    { label: 'Messages',    href: '/therapist/messages',       icon: <MessageCircle className="w-4 h-4" />, badge: 3 },
    { label: 'Crisis alerts',href: '/therapist/crisis',        icon: <AlertCircle className="w-4 h-4" />, badge: 1, badgeColor: 'red' },
    { label: 'Progress',    href: '/therapist/progress',       icon: <BarChart2 className="w-4 h-4" /> },
    { label: 'Settings',    href: '/therapist/settings',       icon: <Settings className="w-4 h-4" /> },
  ]

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      <Sidebar nav={nav} role="therapist" />
      <main className="flex-1 overflow-y-auto">{children}</main>
    </div>
  )
}
