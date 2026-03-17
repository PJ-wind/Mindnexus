import { cn } from '@/lib/utils'
import { Loader2 } from 'lucide-react'

// ── Card ──────────────────────────────────────────────────────────
export function Card({ children, className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('card', className)} {...props}>{children}</div>
}

// ── Badge ─────────────────────────────────────────────────────────
type BadgeVariant = 'blue' | 'green' | 'amber' | 'purple' | 'teal' | 'red' | 'gray'
export function Badge({ children, variant = 'blue', className }: {
  children: React.ReactNode; variant?: BadgeVariant; className?: string
}) {
  const styles: Record<BadgeVariant, string> = {
    blue:   'bg-brand-50 text-brand-600',
    green:  'bg-green-50 text-green-700',
    amber:  'bg-amber-50 text-amber-700',
    purple: 'bg-purple-50 text-purple-700',
    teal:   'bg-teal-50 text-teal-700',
    red:    'bg-red-50 text-red-600',
    gray:   'bg-gray-100 text-gray-600'
  }
  return <span className={cn('badge', styles[variant], className)}>{children}</span>
}

// ── StatCard ──────────────────────────────────────────────────────
export function StatCard({ label, value, sub, subColor = 'gray' }: {
  label: string; value: React.ReactNode; sub?: string; subColor?: 'green' | 'amber' | 'red' | 'gray'
}) {
  const subColors = { green: 'text-green-600', amber: 'text-amber-600', red: 'text-red-500', gray: 'text-gray-400' }
  return (
    <div className="stat-card">
      <div className="text-xs text-gray-500 mb-1">{label}</div>
      <div className="text-2xl font-semibold">{value}</div>
      {sub && <div className={cn('text-[11px] mt-0.5', subColors[subColor])}>{sub}</div>}
    </div>
  )
}

// ── ProgressBar ───────────────────────────────────────────────────
export function ProgressBar({ value, color = 'bg-brand-500', className }: {
  value: number; color?: string; className?: string
}) {
  return (
    <div className={cn('h-1.5 rounded-full bg-gray-100 overflow-hidden', className)}>
      <div className={cn('h-full rounded-full transition-all', color)} style={{ width: `${Math.min(100, value)}%` }} />
    </div>
  )
}

// ── Avatar ────────────────────────────────────────────────────────
export function Avatar({ name, size = 'md', color = 'bg-brand-500' }: {
  name: string; size?: 'sm' | 'md' | 'lg'; color?: string
}) {
  const initials = name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
  const sizes = { sm: 'w-7 h-7 text-xs', md: 'w-9 h-9 text-sm', lg: 'w-12 h-12 text-base' }
  return (
    <div className={cn('rounded-full flex items-center justify-center text-white font-medium flex-shrink-0', color, sizes[size])}>
      {initials}
    </div>
  )
}

// ── Button ────────────────────────────────────────────────────────
type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'ghost'
export function Button({ children, variant = 'secondary', loading, className, ...props }:
  React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: ButtonVariant; loading?: boolean }) {
  const styles: Record<ButtonVariant, string> = {
    primary:   'btn-primary',
    secondary: 'btn-secondary',
    danger:    'btn-danger',
    ghost:     'text-gray-500 hover:text-gray-900 hover:bg-gray-50 px-3 py-1.5 rounded-lg text-sm transition-colors'
  }
  return (
    <button className={cn(styles[variant], 'flex items-center justify-center gap-1.5', className)} disabled={loading || props.disabled} {...props}>
      {loading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
      {children}
    </button>
  )
}

// ── EmptyState ────────────────────────────────────────────────────
export function EmptyState({ icon, title, desc, action }: {
  icon: React.ReactNode; title: string; desc?: string; action?: React.ReactNode
}) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center mb-3 text-gray-400">{icon}</div>
      <h4 className="font-medium text-gray-900 mb-1">{title}</h4>
      {desc && <p className="text-sm text-gray-400 max-w-xs mb-4">{desc}</p>}
      {action}
    </div>
  )
}

// ── Spinner ───────────────────────────────────────────────────────
export function Spinner({ className }: { className?: string }) {
  return <Loader2 className={cn('w-5 h-5 animate-spin text-brand-500', className)} />
}

// ── SectionHeader ─────────────────────────────────────────────────
export function SectionHeader({ title, action }: { title: string; action?: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between mb-3">
      <h4 className="text-sm font-medium text-gray-700">{title}</h4>
      {action && <div className="text-xs text-brand-500 cursor-pointer hover:underline">{action}</div>}
    </div>
  )
}
