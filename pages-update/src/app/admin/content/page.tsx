import prisma from '@/lib/prisma'
import { Card, Badge } from '@/components/ui'
import { BookOpen } from 'lucide-react'

export default async function AdminContentPage() {
  const resources = await prisma.resource.findMany({ orderBy: { createdAt: 'desc' } })
  return (
    <div className="p-6 max-w-4xl">
      <div className="flex items-center justify-between mb-6">
        <div><h1 className="text-2xl font-semibold">Content library</h1><p className="text-gray-500 text-sm mt-0.5">Manage psychoeducation resources available to clients.</p></div>
        <button className="btn-primary py-2 px-4 text-sm">+ Add resource</button>
      </div>
      <Card>
        <table className="w-full text-sm">
          <thead><tr className="text-xs text-gray-400 border-b border-gray-100"><th className="text-left py-2">Title</th><th className="text-left py-2">Type</th><th className="text-left py-2">Views</th><th className="text-left py-2">Status</th><th className="text-left py-2">Actions</th></tr></thead>
          <tbody>
            {resources.map(r => (
              <tr key={r.id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50">
                <td className="py-2.5 font-medium">{r.title}</td>
                <td className="py-2.5"><Badge variant="blue" className="text-xs">{r.type}</Badge></td>
                <td className="py-2.5 text-gray-500">{r.views}</td>
                <td className="py-2.5"><Badge variant={r.isPublished ? 'green' : 'amber'} className="text-xs">{r.isPublished ? 'Published' : 'Draft'}</Badge></td>
                <td className="py-2.5"><button className="btn-secondary text-xs py-1 px-2">Edit</button></td>
              </tr>
            ))}
          </tbody>
        </table>
        {resources.length === 0 && <div className="text-center py-8 text-gray-400"><BookOpen className="w-8 h-8 mx-auto mb-2 opacity-30" /><p className="text-sm">No resources yet</p></div>}
      </Card>
    </div>
  )
}
