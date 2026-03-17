'use client'
import { useState, useEffect } from 'react'
import { Card } from '@/components/ui'
import { CheckSquare, Square } from 'lucide-react'
import toast from 'react-hot-toast'
import { formatDate } from '@/lib/utils'

export default function HomeworkPage() {
  const [items, setItems] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/clients/homework').then(r=>r.json()).then(data => { setItems(data); setLoading(false) })
  }, [])

  async function toggle(id: string, done: boolean) {
    await fetch(`/api/clients/homework/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ isCompleted: !done })
    })
    setItems(prev => prev.map(i => i.id === id ? { ...i, isCompleted: !done } : i))
    toast.success(!done ? 'Homework completed!' : 'Marked as incomplete')
  }

  const pending   = items.filter(i => !i.isCompleted)
  const completed = items.filter(i => i.isCompleted)
  const pct = items.length ? Math.round((completed.length / items.length) * 100) : 0

  return (
    <div className="p-6 max-w-3xl">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold">Homework assignments</h1>
        <p className="text-gray-500 text-sm mt-0.5">Tasks assigned by your therapist. Tap to mark as complete.</p>
      </div>

      <div className="grid grid-cols-3 gap-3 mb-6">
        <div className="stat-card text-center"><div className="text-2xl font-semibold">{items.length}</div><div className="text-xs text-gray-500 mt-0.5">Total</div></div>
        <div className="stat-card text-center"><div className="text-2xl font-semibold text-green-600">{completed.length}</div><div className="text-xs text-gray-500 mt-0.5">Completed</div></div>
        <div className="stat-card text-center"><div className="text-2xl font-semibold text-amber-600">{pending.length}</div><div className="text-xs text-gray-500 mt-0.5">Pending</div></div>
      </div>

      <div className="mb-6">
        <div className="flex justify-between text-xs text-gray-500 mb-1">
          <span>Completion rate</span><span className="font-medium text-green-600">{pct}%</span>
        </div>
        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
          <div className="h-full bg-green-500 rounded-full transition-all" style={{ width: `${pct}%` }} />
        </div>
      </div>

      {loading ? <p className="text-center text-gray-400 py-8">Loading...</p> : (
        <>
          {pending.length > 0 && (
            <Card className="mb-4">
              <h4 className="text-sm font-medium mb-3">Pending ({pending.length})</h4>
              <div className="space-y-2">
                {pending.map(hw => (
                  <div key={hw.id} className="flex items-center gap-3 py-2.5 border-b border-gray-50 last:border-0 cursor-pointer" onClick={() => toggle(hw.id, hw.isCompleted)}>
                    <Square className="w-5 h-5 text-gray-300 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium">{hw.title}</div>
                      {hw.description && <div className="text-xs text-gray-400 mt-0.5">{hw.description}</div>}
                    </div>
                    {hw.dueDate && <div className="text-xs text-amber-600 flex-shrink-0">Due {formatDate(hw.dueDate)}</div>}
                  </div>
                ))}
              </div>
            </Card>
          )}
          {completed.length > 0 && (
            <Card>
              <h4 className="text-sm font-medium mb-3 text-gray-400">Completed ({completed.length})</h4>
              <div className="space-y-2">
                {completed.map(hw => (
                  <div key={hw.id} className="flex items-center gap-3 py-2.5 border-b border-gray-50 last:border-0 cursor-pointer opacity-60" onClick={() => toggle(hw.id, hw.isCompleted)}>
                    <CheckSquare className="w-5 h-5 text-green-500 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium line-through text-gray-400">{hw.title}</div>
                    </div>
                    <div className="text-xs text-green-500">Done</div>
                  </div>
                ))}
              </div>
            </Card>
          )}
          {items.length === 0 && (
            <div className="text-center py-12 text-gray-400">
              <CheckSquare className="w-10 h-10 mx-auto mb-3 opacity-30" />
              <p className="text-sm">No homework assigned yet.</p>
              <p className="text-xs mt-1">Your therapist will assign tasks after your first session.</p>
            </div>
          )}
        </>
      )}
    </div>
  )
}
