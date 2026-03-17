'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { signOut, useSession } from 'next-auth/react'
import { Brain, LogOut, AlertCircle } from 'lucide-react'
import { cn, getInitials } from '@/lib/utils'
import toast from 'react-hot-toast'

interface NavItem {
  label: string
  href:  string
  icon:  React.ReactNode
  badge?: number | string
  badgeColor?: string
}

interface SidebarProps {
  nav:        NavItem[]
  bottomNav?: NavItem[]
  role:       'client' | 'therapist' | 'admin'
}

export default function Sidebar({ nav, role }: SidebarProps) {
  const pathname  = usePathname()
  const { data: session } = useSession()
  const user = session?.user

  async function handleCrisis() {
    await fetch('/api/clients/crisis', { method: 'POST' })
    toast.error('Crisis support activated. Your therapist has been notified.')
  }

  return (
    <aside className="w-56 flex-shrink-0 bg-white border-r border-gray-100 flex flex-col h-screen sticky top-0">
      {/* Logo */}
      <div className="px-4 py-4 border-b border-gray-100">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-7 h-7 bg-brand-500 rounded-lg flex items-center justify-center">
            <Brain className="w-3.5 h-3.5 text-white" />
          </div>
          <div>
            <div className="text-sm font-semibold text-gray-900">MindNexus</div>
            <div className="text-[10px] text-gray-400 capitalize">{role} portal</div>
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-2 py-3 space-y-0.5">
        {nav.map(item => {
          const active = pathname === item.href || (item.href !== `/${role}` && pathname.startsWith(item.href))
          return (
            <Link key={item.href} href={item.href}
              className={cn('nav-item flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm', active && 'active')}>
              <span className="w-4 h-4 flex-shrink-0">{item.icon}</span>
              <span className="flex-1">{item.label}</span>
              {item.badge !== undefined && (
                <span className={cn('text-[10px] px-1.5 py-0.5 rounded-full font-medium',
                  item.badgeColor === 'red' ? 'bg-red-100 text-red-600' : 'bg-brand-50 text-brand-600')}>
                  {item.badge}
                </span>
              )}
            </Link>
          )
        })}
      </nav>

      {/* Crisis button for clients */}
      {role === 'client' && (
        <button onClick={handleCrisis}
          className="mx-3 mb-2 flex items-center gap-2 px-3 py-2.5 bg-red-50 hover:bg-red-100 border border-red-200 rounded-lg text-xs font-medium text-red-600 transition-colors">
          <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
          <div className="text-left">
            <div className="font-medium">Crisis support</div>
            <div className="text-[10px] text-red-400 font-normal">Tap if in distress</div>
          </div>
        </button>
      )}

      {/* User card */}
      <div className="px-3 pb-3 border-t border-gray-100 pt-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-brand-500 flex items-center justify-center text-white text-xs font-medium flex-shrink-0">
            {user?.name ? getInitials(user.name) : '?'}
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-xs font-medium text-gray-900 truncate">{user?.name}</div>
            <div className="text-[10px] text-gray-400 truncate">{user?.email}</div>
          </div>
          <button onClick={() => signOut({ callbackUrl: '/' })}
            className="text-gray-400 hover:text-gray-600 transition-colors">
            <LogOut className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </aside>
  )
}
