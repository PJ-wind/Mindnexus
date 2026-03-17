'use client'
import { useState, useEffect } from 'react'
import { Card, Badge, ProgressBar } from '@/components/ui'
import toast from 'react-hot-toast'

const MOODS = [
  { value: 'VERY_LOW', emoji: '😞', label: 'Very low' },
  { value: 'LOW',      emoji: '😔', label: 'Low' },
  { value: 'NEUTRAL',  emoji: '😐', label: 'Neutral' },
  { value: 'GOOD',     emoji: '🙂', label: 'Good' },
  { value: 'GREAT',    emoji: '😊', label: 'Great' },
]
const MOOD_H: Record<string,number> = { VERY_LOW:15, LOW:30, NEUTRAL:50, GOOD:72, GREAT:95 }
const MOOD_C: Record<string,string> = { VERY_LOW:'bg-red-400', LOW:'bg-orange-400', NEUTRAL:'bg-brand-400', GOOD:'bg-green-400', GREAT:'bg-green-600' }
const DAYS = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun']

export default function MoodPage() {
  const [selectedMood, setSelectedMood] = useState('GOOD')
  const [journal, setJournal]           = useState('')
  const [sleep, setSleep]               = useState(7)
  const [water, setWater]               = useState(6)
  const [exercise, setExercise]         = useState(false)
  const [saving, setSaving]             = useState(false)
  const [entries, setEntries]           = useState<any[]>([])

  useEffect(() => {
    fetch('/api/clients/mood').then(r => r.json()).then(setEntries)
  }, [])

  async function saveMood() {
    setSaving(true)
    try {
      await fetch('/api/clients/mood', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mood: selectedMood, journal, sleep, water, exercise })
      })
      toast.success('Mood entry saved!')
      const updated = await fetch('/api/clients/mood').then(r => r.json())
      setEntries(updated)
      setJournal('')
    } catch {
      toast.error('Failed to save mood entry')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="p-6 max-w-4xl">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold">Mood journal</h1>
        <p className="text-gray-500 text-sm mt-0.5">Track how you feel each day. Your therapist can see your entries before each session.</p>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        <div className="md:col-span-2 space-y-4">
          <Card>
            <h4 className="font-medium text-sm mb-4">How are you feeling today?</h4>
            <div className="flex gap-2 mb-5">
              {MOODS.map(m => (
                <button key={m.value} onClick={() => setSelectedMood(m.value)}
                  className={`flex-1 py-3 rounded-lg border text-center transition-all ${
                    selectedMood === m.value
                      ? 'border-brand-500 bg-brand-50 text-brand-600 font-medium'
                      : 'border-gray-100 hover:border-gray-200 bg-gray-50'}`}>
                  <div className="text-2xl mb-1">{m.emoji}</div>
                  <div className="text-[10px]">{m.label}</div>
                </button>
              ))}
            </div>

            <label className="block text-xs font-medium text-gray-600 mb-1.5">Journal entry</label>
            <textarea
              rows={5} className="input resize-none text-sm"
              placeholder="Write freely about how you are feeling today. This is private and shared only with your therapist..."
              value={journal} onChange={e => setJournal(e.target.value)} />

            <div className="mt-4 grid grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Sleep (hrs)</label>
                <input type="number" min={0} max={24} className="input text-sm" value={sleep}
                  onChange={e => setSleep(Number(e.target.value))} />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Water (glasses)</label>
                <input type="number" min={0} max={20} className="input text-sm" value={water}
                  onChange={e => setWater(Number(e.target.value))} />
              </div>
              <div className="flex flex-col">
                <label className="block text-xs font-medium text-gray-600 mb-1">Exercise</label>
                <button onClick={() => setExercise(!exercise)}
                  className={`flex-1 rounded-lg border text-sm font-medium transition-all ${
                    exercise ? 'bg-green-50 border-green-300 text-green-700' : 'bg-gray-50 border-gray-200 text-gray-500'}`}>
                  {exercise ? '✓ Done' : 'Not yet'}
                </button>
              </div>
            </div>

            <button onClick={saveMood} disabled={saving} className="btn-primary w-full mt-4 py-2.5">
              {saving ? 'Saving...' : 'Save mood & journal entry'}
            </button>
          </Card>
        </div>

        <div className="space-y-4">
          <Card>
            <h4 className="text-sm font-medium mb-3">Past 7 days</h4>
            <div className="flex items-end gap-1.5 h-16 mb-2">
              {DAYS.map((day, i) => {
                const entry = entries[entries.length - 7 + i]
                const h = entry ? MOOD_H[entry.mood] ?? 50 : 8
                return (
                  <div key={day} className="flex-1 flex flex-col items-center gap-1">
                    <div title={entry?.mood} className={`w-full rounded-sm transition-all ${entry ? MOOD_C[entry.mood] : 'bg-gray-100'}`}
                      style={{ height: `${h}%` }} />
                    <span className="text-[9px] text-gray-400">{day}</span>
                  </div>
                )
              })}
            </div>
            <div className="flex flex-col gap-1 pt-2 border-t border-gray-50">
              {[['bg-green-500','Good / Great'],['bg-brand-400','Neutral'],['bg-red-400','Low']].map(([c,l]) => (
                <div key={l} className="flex items-center gap-1.5">
                  <div className={`w-2 h-2 rounded-full ${c}`} />
                  <span className="text-[10px] text-gray-400">{l}</span>
                </div>
              ))}
            </div>
          </Card>

          <Card>
            <h4 className="text-sm font-medium mb-3">Recent entries</h4>
            {entries.length === 0
              ? <p className="text-xs text-gray-400 text-center py-3">No entries yet</p>
              : entries.slice(-5).reverse().map((e: any) => (
                <div key={e.id} className="flex items-center gap-2 py-1.5 border-b border-gray-50 last:border-0">
                  <span className="text-base">{MOODS.find(m => m.value === e.mood)?.emoji ?? '😐'}</span>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-medium">{MOODS.find(m => m.value === e.mood)?.label}</div>
                    {e.journal && <div className="text-[10px] text-gray-400 truncate">{e.journal}</div>}
                  </div>
                  <div className="text-[10px] text-gray-400 whitespace-nowrap">
                    {new Date(e.createdAt).toLocaleDateString('en-GB', { day:'numeric', month:'short' })}
                  </div>
                </div>
              ))}
          </Card>
        </div>
      </div>
    </div>
  )
}
