'use client'
import { useState } from 'react'
import { Card, Badge } from '@/components/ui'
import { Plus, CheckSquare, Square, Trash2, Send } from 'lucide-react'
import toast from 'react-hot-toast'

const DEMO = [
  { id: '1', clientName: 'Amara Musa', title: 'Daily mood journal entry', description: 'Write 3 things you are grateful for each morning', dueDate: '2026-03-20', done: false },
  { id: '2', clientName: 'Amara Musa', title: 'Grief letter exercise', description: 'Write a letter to your loved one expressing unspoken feelings', dueDate: '2026-03-22', done: false },
  { id: '3', clientName: 'Amara Musa', title: 'Breathing exercise log', description: 'Practice 4-7-8 breathing twice daily and log your experience', dueDate: '2026-03-18', done: true },
]

export default function AssignmentsPage() {
  const [items, setItems]       = useState(DEMO)
  const [client, setClient]     = useState('Amara Musa')
  const [title, setTitle]       = useState('')
  const [desc, setDesc]         = useState('')
  const [due, setDue]           = useState('')
  const [saving, setSaving]     = useState(false)

  async function assign() {
    if (!title.trim()) { toast.error('Please enter a title'); return }
    setSaving(true)
    await new Promise(r => setTimeout(r, 600))
    setItems(prev => [...prev, { id: Date.now().toString(), clientName: client, title, description: desc, dueDate: due, done: false }])
    setTitle(''); setDesc(''); setDue('')
    toast.success('Homework assigned to client!')
    setSaving(false)
  }

  const pending   = items.filter(i => !i.done)
  const completed = items.filter(i => i.done)

  return (
    <div className="p-6 max-w-5xl">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold">Homework assignments</h1>
        <p className="text-gray-500 text-sm mt-0.5">Assign tasks to clients between sessions to reinforce therapy progress.</p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <Card>
          <h3 className="font-medium text-sm mb-4 flex items-center gap-2"><Plus className="w-4 h-4 text-brand-500" /> New assignment</h3>
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Client</label>
              <select className="input text-sm" value={client} onChange={e => setClient(e.target.value)}>
                <option>Amara Musa</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Task title</label>
              <input className="input text-sm" placeholder="e.g. Daily mood journal" value={title} onChange={e => setTitle(e.target.value)} />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Instructions</label>
              <textarea rows={3} className="input resize-none text-sm" placeholder="What should the client do?" value={desc} onChange={e => setDesc(e.target.value)} />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Due date</label>
              <input type="date" className="input text-sm" value={due} onChange={e => setDue(e.target.value)} />
            </div>
            <button onClick={assign} disabled={saving || !title.trim()} className="btn-primary w-full py-2 flex items-center justify-center gap-2 disabled:opacity-40">
              <Send className="w-3.5 h-3.5" />{saving ? 'Assigning...' : 'Assign homework'}
            </button>
          </div>
        </Card>

        <div className="md:col-span-2 space-y-4">
          <div className="grid grid-cols-3 gap-3">
            <div className="stat-card text-center"><div className="text-2xl font-semibold">{items.length}</div><div className="text-xs text-gray-500 mt-0.5">Total</div></div>
            <div className="stat-card text-center"><div className="text-2xl font-semibold text-amber-600">{pending.length}</div><div className="text-xs text-gray-500 mt-0.5">Pending</div></div>
            <div className="stat-card text-center"><div className="text-2xl font-semibold text-green-600">{completed.length}</div><div className="text-xs text-gray-500 mt-0.5">Completed</div></div>
          </div>

          <Card>
            <h4 className="text-sm font-medium mb-3">Pending ({pending.length})</h4>
            {pending.length === 0 ? <p className="text-xs text-gray-400 text-center py-4">All homework completed!</p> : (
              <div className="space-y-2">
                {pending.map(a => (
                  <div key={a.id} className="flex items-start gap-3 p-3 bg-gray-50 rounded-xl">
                    <Square className="w-4 h-4 text-gray-300 flex-shrink-0 mt-0.5" />
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium">{a.title}</div>
                      <div className="text-xs text-gray-400">{a.clientName}</div>
                      {a.description && <div className="text-xs text-gray-500 mt-1">{a.description}</div>}
                    </div>
                    <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
                      {a.dueDate && <div className="text-[10px] text-amber-600">Due {new Date(a.dueDate).toLocaleDateString('en-GB',{day:'numeric',month:'short'})}</div>}
                      <button onClick={() => { setItems(p => p.filter(x => x.id !== a.id)); toast.success('Removed') }} className="text-red-400 hover:text-red-600"><Trash2 className="w-3.5 h-3.5" /></button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>

          {completed.length > 0 && (
            <Card>
              <h4 className="text-sm font-medium mb-3 text-gray-400">Completed ({completed.length})</h4>
              <div className="space-y-2">
                {completed.map(a => (
                  <div key={a.id} className="flex items-center gap-3 p-3 bg-green-50 rounded-xl">
                    <CheckSquare className="w-4 h-4 text-green-500 flex-shrink-0" />
                    <div className="flex-1"><div className="text-sm line-through text-gray-400">{a.title}</div><div className="text-xs text-gray-400">{a.clientName}</div></div>
                    <Badge variant="green" className="text-[10px]">Done</Badge>
                  </div>
                ))}
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
