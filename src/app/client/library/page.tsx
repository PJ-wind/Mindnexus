import prisma from '@/lib/prisma'
import { Card, Badge } from '@/components/ui'
import { BookOpen, Play, FileText, Clipboard } from 'lucide-react'
import { areaLabel } from '@/lib/utils'

const TYPE_ICONS: Record<string, any> = {
  Article:  FileText,
  Video:    Play,
  Exercise: Clipboard,
  Guide:    BookOpen,
}
const TYPE_COLORS: Record<string, string> = {
  Article:  'badge-blue',
  Video:    'badge-purple',
  Exercise: 'badge-teal',
  Guide:    'badge-green',
}

export default async function LibraryPage() {
  const resources = await prisma.resource.findMany({
    where: { isPublished: true },
    orderBy: { views: 'desc' }
  })

  const categories = [...new Set(resources.filter(r => r.area).map(r => r.area!))]

  return (
    <div className="p-6 max-w-5xl">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold">Psychoeducation library</h1>
        <p className="text-gray-500 text-sm mt-0.5">Evidence-based articles, videos, and exercises to support your mental health journey.</p>
      </div>

      {/* Category tags */}
      <div className="flex flex-wrap gap-2 mb-6">
        <span className="badge badge-blue px-3 py-1 cursor-pointer text-xs">All resources</span>
        {categories.map(cat => (
          <span key={cat} className="badge bg-gray-100 text-gray-600 px-3 py-1 cursor-pointer text-xs hover:bg-gray-200 transition-colors">
            {areaLabel(cat)}
          </span>
        ))}
      </div>

      {/* Featured */}
      <h4 className="text-sm font-medium text-gray-600 mb-3">Featured resources</h4>
      <div className="grid md:grid-cols-3 gap-4 mb-6">
        {resources.slice(0, 3).map(r => {
          const Icon = TYPE_ICONS[r.type] ?? BookOpen
          return (
            <div key={r.id} className="card hover:border-gray-300 transition-colors cursor-pointer">
              <div className="flex items-center gap-2.5 mb-3">
                <div className="w-9 h-9 bg-brand-50 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Icon className="w-4 h-4 text-brand-500" />
                </div>
                <span className={`badge ${TYPE_COLORS[r.type] ?? 'badge-blue'} text-xs`}>{r.type}</span>
              </div>
              <h4 className="text-sm font-medium mb-1">{r.title}</h4>
              {r.description && <p className="text-xs text-gray-400 mb-2 leading-relaxed">{r.description}</p>}
              <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-50">
                {r.area && <span className="text-[10px] text-gray-400">{areaLabel(r.area)}</span>}
                <span className="text-[10px] text-gray-400">{r.views.toLocaleString()} views</span>
              </div>
            </div>
          )
        })}
      </div>

      {/* All resources */}
      <h4 className="text-sm font-medium text-gray-600 mb-3">All resources</h4>
      <Card>
        <div className="space-y-1">
          {resources.map(r => {
            const Icon = TYPE_ICONS[r.type] ?? BookOpen
            return (
              <div key={r.id} className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
                <div className="w-8 h-8 bg-gray-50 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Icon className="w-3.5 h-3.5 text-gray-500" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium">{r.title}</div>
                  <div className="text-xs text-gray-400">{r.type} · {r.area ? areaLabel(r.area) : 'General'}</div>
                </div>
                <div className="text-[10px] text-gray-400">{r.views.toLocaleString()} views</div>
                <span className={`badge ${TYPE_COLORS[r.type] ?? 'badge-blue'} text-[10px]`}>{r.type}</span>
              </div>
            )
          })}
        </div>
      </Card>
    </div>
  )
}
