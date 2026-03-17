'use client'
import { useState, useEffect } from 'react'
import { Card } from '@/components/ui'
import { Save, Check } from 'lucide-react'
import toast from 'react-hot-toast'
import { formatDateTime, areaLabel } from '@/lib/utils'

const QUICK_NOTES = [
  'Client shows signs of progress — more open today.',
  'Requires follow-up on previous homework assignment.',
  'Referred to psychiatry for further evaluation.',
  'Crisis indicators discussed — safety plan reviewed.',
  'Breathing exercise practiced. Client responded positively.',
  'Homework assigned for next session.',
  'Goal progress discussed and updated.',
  'Client expressed gratitude for session.',
]

export default function NotesPage() {
  const [sessions, setSessions]   = useState<any[]>([])
  const [selected, setSelected]   = useState<any>(null)
  const [noteText, setNoteText]   = useState('')
  const [saving, setSaving]       = useState(false)
  const [saved, setSaved]         = useState(false)

  useEffect(() => {
    fetch('/api/sessions').then(r => r.json()).then(data => {
      setSessions(data)
      if (data.length > 0) {
        setSelected(data[0])
        setNoteText(data[0]?.notes?.content ?? '')
      }
    })
  }, [])

  function selectSession(s: any) {
    setSelected(s)
    setNoteText(s?.notes?.content ?? '')
    setSaved(false)
  }

  function addQuickNote(text: string) {
    setNoteText(prev => prev ? prev + '\n' + text : text)
  }

  async function saveNote() {
    if (!selected) return
    setSaving(true)
    try {
      await fetch(`/api/sessions/${selected.id}/notes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: noteText })
      })
      setSaved(true)
      toast.success('Session notes saved!')
      setTimeout(() => setSaved(false), 3000)
    } catch {
      toast.error('Failed to save notes')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="p-6 max-w-5xl">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold">Session notes</h1>
        <p className="text-gray-500 text-sm mt-0.5">Write and save clinical notes during or after sessions.</p>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        {/* Session list */}
        <Card>
          <h4 className="text-sm font-medium mb-3">Sessions</h4>
          <div className="space-y-1">
            {sessions.length === 0 && <p className="text-xs text-gray-400 text-center py-4">No sessions found</p>}
            {sessions.map(s => (
              <button key={s.id} onClick={() => selectSession(s)}
                className={`w-full text-left p-3 rounded-lg transition-colors ${selected?.id === s.id ? 'bg-brand-50 border border-brand-100' : 'hover:bg-gray-50'}`}>
                <div className="text-xs font-medium">{s.client?.name}</div>
                <div className="text-[10px] text-gray-400 mt-0.5">{areaLabel(s.area)} · {formatDateTime(s.scheduledAt)}</div>
                {s.notes ? (
                  <div className="text-[10px] text-green-500 mt-1 flex items-center gap-1"><Check className="w-3 h-3" /> Notes saved</div>
                ) : (
                  <div className="text-[10px] text-amber-500 mt-1">No notes yet</div>
                )}
              </button>
            ))}
          </div>
        </Card>

        {/* Note editor */}
        <div className="md:col-span-2 space-y-4">
          {selected ? (
            <>
              <Card>
                <div className="flex items-center justify-between mb-1">
                  <div>
                    <h4 className="text-sm font-medium">{selected.client?.name}</h4>
                    <p className="text-xs text-gray-400">{areaLabel(selected.area)} · {formatDateTime(selected.scheduledAt)}</p>
                  </div>
                  <button onClick={saveNote} disabled={saving}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${saved ? 'bg-green-50 text-green-600 border border-green-200' : 'btn-primary'}`}>
                    {saved ? <><Check className="w-3.5 h-3.5" /> Saved</> : saving ? 'Saving...' : <><Save className="w-3.5 h-3.5" /> Save notes</>}
                  </button>
                </div>
                <div className="divider" />
                <textarea
                  className="input resize-none text-sm leading-relaxed w-full"
                  rows={10}
                  placeholder="Write your clinical notes here during or after the session..."
                  value={noteText}
                  onChange={e => setNoteText(e.target.value)}
                />
              </Card>

              <Card>
                <h4 className="text-sm font-medium mb-3">Quick note templates</h4>
                <div className="grid grid-cols-2 gap-2">
                  {QUICK_NOTES.map(note => (
                    <button key={note} onClick={() => addQuickNote(note)}
                      className="text-left text-xs p-2.5 bg-gray-50 hover:bg-gray-100 rounded-lg text-gray-600 transition-colors leading-snug">
                      {note}
                    </button>
                  ))}
                </div>
              </Card>
            </>
          ) : (
            <Card className="flex items-center justify-center h-64">
              <p className="text-sm text-gray-400">Select a session from the left to write notes.</p>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
