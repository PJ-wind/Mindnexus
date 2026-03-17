import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { format, formatDistanceToNow } from 'date-fns'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: Date | string) {
  return format(new Date(date), 'dd MMM yyyy')
}

export function formatTime(date: Date | string) {
  return format(new Date(date), 'h:mm a')
}

export function formatDateTime(date: Date | string) {
  return format(new Date(date), 'dd MMM yyyy · h:mm a')
}

export function timeAgo(date: Date | string) {
  return formatDistanceToNow(new Date(date), { addSuffix: true })
}

export function getInitials(name: string) {
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
}

export function moodToNumber(mood: string): number {
  const map: Record<string, number> = {
    VERY_LOW: 10, LOW: 30, NEUTRAL: 50, GOOD: 75, GREAT: 95
  }
  return map[mood] ?? 50
}

export function moodLabel(mood: string): string {
  const map: Record<string, string> = {
    VERY_LOW: 'Very low', LOW: 'Low', NEUTRAL: 'Neutral', GOOD: 'Good', GREAT: 'Great'
  }
  return map[mood] ?? mood
}

export function areaLabel(area: string): string {
  const map: Record<string, string> = {
    INDIVIDUAL:         'Individual counselling',
    CHILDREN_TEENS:     'Children & teens',
    COUPLES:            'Couples counselling',
    FAMILY_GROUP:       'Family & group',
    PREMARITAL:         'Premarital counselling',
    CAREER_VOCATIONAL:  'Career & vocational',
    SCHOOL_EDUCATIONAL: 'School & educational',
    CRISIS:             'Crisis counselling',
    REHABILITATION:     'Rehabilitation',
    ADDICTION_SUBSTANCE:'Addiction & recovery',
    GRIEF_BEREAVEMENT:  'Grief & bereavement',
    SPIRITUAL_PASTORAL: 'Spiritual & pastoral'
  }
  return map[area] ?? area
}

export function avatarColors(name: string): string {
  const colors = [
    'bg-brand-500', 'bg-purple-DEFAULT', 'bg-teal-DEFAULT',
    'bg-orange-600',  'bg-rose-600',      'bg-emerald-700'
  ]
  const idx = name.charCodeAt(0) % colors.length
  return colors[idx]
}
