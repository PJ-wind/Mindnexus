'use client'
import { useState, useEffect } from 'react'
import { Card } from '@/components/ui'
import { Calendar, Clock, Video, Phone, MessageCircle, Users, Check, ChevronLeft, ChevronRight } from 'lucide-react'
import toast from 'react-hot-toast'
import { areaLabel } from '@/lib/utils'

const SESSION_TYPES = [
  { id: 'VIDEO',      label: 'Video call',  icon: Video },
  { id: 'VOICE',      label: 'Voice call',  icon: Phone },
  { id: 'CHAT',       label: 'Text / chat', icon: MessageCircle },
  { id: 'IN_PERSON',  label: 'In person',   icon: Users },
]
const DURATIONS = [
  { value: 30,  label: '30 minutes', badge: 'Quick check-in' },
  { value: 60,  label: '60 minutes', badge: 'Standard' },
  { value: 90,  label: '90 minutes', badge: 'Deep session' },
]
const AREAS = ['INDIVIDUAL','COUPLES','GRIEF_BEREAVEMENT','ADDICTION_SUBSTANCE','CAREER_VOCATIONAL','CRISIS','REHABILITATION','PREMARITAL','FAMILY_GROUP','SPIRITUAL_PASTORAL','CHILDREN_TEENS','SCHOOL_EDUCATIONAL']
const SLOTS = ['9:00 AM','10:00 AM','11:00 AM','1:00 PM','2:00 PM','3:00 PM','4:00 PM','5:00 PM']
const MONTH_NAMES = ['January','February','March','April','May','June','July','August','September','October','November','December']

export default function BookingPage() {
  const [step, setStep]           = useState(1)
  const [therapists, setTherapists] = useState<any[]>([])
  const [selected, setSelected]   = useState({ therapist: null as any, type: 'VIDEO', duration: 60, area: 'INDIVIDUAL', date: null as Date|null, slot: '', name: '', email: '', phone: '', notes: '' })
  const [month, setMonth]         = useState(new Date().getMonth())
  const [year, setYear]           = useState(new Date().getFullYear())
  const [booking, setBooking]     = useState(false)
  const [confirmed, setConfirmed] = useState<any>(null)

  useEffect(() => {
    fetch('/api/therapists').then(r => r.json()).then(setTherapists)
  }, [])

  function set(k: string, v: any) { setSelected(s => ({ ...s, [k]: v })) }

  const daysInMonth = new Date(year, month+1, 0).getDate()
  const firstDay    = new Date(year, month, 1).getDay()
  const today       = new Date()

  async function confirmBooking() {
    if (!selected.therapist || !selected.date || !selected.slot) return
    setBooking(true)
    try {
      const [h, ampm] = selected.slot.split(' ')
      const [hr, min] = h.split(':').map(Number)
      const hour24 = ampm === 'PM' && hr !== 12 ? hr + 12 : hr
      const dt = new Date(selected.date)
      dt.setHours(hour24, min, 0, 0)
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          therapistId:  selected.therapist.id,
          scheduledAt:  dt.toISOString(),
          type:         selected.type,
          area:         selected.area,
          durationMins: selected.duration,
          notes:        selected.notes
        })
      })
      if (!res.ok) throw new Error('Booking failed')
      const data = await res.json()
      setConfirmed(data)
      toast.success('Session booked successfully!')
    } catch {
      toast.error('Failed to book session. Please try again.')
    } finally {
      setBooking(false)
    }
  }

  if (confirmed) return (
    <div className="p-6 max-w-lg mx-auto text-center">
      <div className="w-14 h-14 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4">
        <Check className="w-7 h-7 text-green-500" />
      </div>
      <h2 className="text-xl font-semibold mb-2">Session booked successfully!</h2>
      <p className="text-gray-500 text-sm mb-4">Your session has been confirmed. You will receive a reminder before it starts.</p>
      <div className="card text-left mb-4">
        <div className="space-y-2 text-sm">
          <div className="flex justify-between"><span className="text-gray-500">Therapist</span><span className="font-medium">{selected.therapist?.user?.name}</span></div>
          <div className="flex justify-between"><span className="text-gray-500">Date & time</span><span className="font-medium">{selected.date?.toLocaleDateString()} · {selected.slot}</span></div>
          <div className="flex justify-between"><span className="text-gray-500">Type</span><span className="font-medium">{selected.type}</span></div>
          <div className="flex justify-between"><span className="text-gray-500">Duration</span><span className="font-medium">{selected.duration} minutes</span></div>
        </div>
      </div>
      <button onClick={() => { setConfirmed(null); setStep(1) }} className="btn-secondary">Book another session</button>
    </div>
  )

  return (
    <div className="p-6 max-w-5xl">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold">Book a counselling session</h1>
        <p className="text-gray-500 text-sm mt-0.5">Choose your therapist, session type, and a time that works for you.</p>
      </div>

      {/* Step indicator */}
      <div className="flex items-center gap-2 mb-6">
        {['Choose therapist','Pick date & time','Your details','Confirm'].map((label, i) => (
          <div key={i} className="flex items-center gap-2 flex-1">
            <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium flex-shrink-0 ${
              step > i+1 ? 'bg-green-500 text-white' : step === i+1 ? 'bg-brand-500 text-white' : 'bg-gray-100 text-gray-400'}`}>
              {step > i+1 ? '✓' : i+1}
            </div>
            <span className={`text-xs hidden sm:block ${step === i+1 ? 'text-gray-900 font-medium' : 'text-gray-400'}`}>{label}</span>
            {i < 3 && <div className="flex-1 h-px bg-gray-200 mx-1" />}
          </div>
        ))}
      </div>

      {/* Step 1: Therapist */}
      {step === 1 && (
        <div className="grid md:grid-cols-3 gap-4">
          <div className="md:col-span-2">
            <Card>
              <h4 className="font-medium text-sm mb-4">Select your therapist</h4>
              <div className="grid md:grid-cols-2 gap-3">
                {therapists.map(t => (
                  <button key={t.id} onClick={() => set('therapist', t)}
                    className={`text-left p-3 rounded-xl border transition-all ${selected.therapist?.id === t.id ? 'border-brand-500 bg-brand-50' : 'border-gray-200 hover:border-gray-300'}`}>
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-9 h-9 bg-brand-500 rounded-full flex items-center justify-center text-white text-xs font-medium">
                        {t.user.name.split(' ').map((n:string)=>n[0]).join('').slice(0,2)}
                      </div>
                      <div>
                        <div className="text-sm font-medium">{t.user.name}</div>
                        <div className="text-[10px] text-gray-400">{t.yearsExperience} yrs · ★{t.rating}</div>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {t.specialisations?.slice(0,2).map((s:string) => (
                        <span key={s} className="badge badge-blue text-[10px]">{areaLabel(s).split(' ')[0]}</span>
                      ))}
                    </div>
                  </button>
                ))}
              </div>
              <div className="mt-4 grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-2">Session type</label>
                  <div className="grid grid-cols-2 gap-2">
                    {SESSION_TYPES.map(t => (
                      <button key={t.id} onClick={() => set('type', t.id)}
                        className={`p-2.5 rounded-lg border text-xs flex flex-col items-center gap-1 transition-all ${selected.type === t.id ? 'border-brand-500 bg-brand-50 text-brand-600' : 'border-gray-200 text-gray-500 hover:border-gray-300'}`}>
                        <t.icon className="w-4 h-4" />
                        {t.label}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-2">Duration</label>
                  <div className="space-y-1.5">
                    {DURATIONS.map(d => (
                      <button key={d.value} onClick={() => set('duration', d.value)}
                        className={`w-full flex items-center justify-between p-2.5 rounded-lg border text-xs transition-all ${selected.duration === d.value ? 'border-brand-500 bg-brand-50 text-brand-600' : 'border-gray-200 text-gray-600 hover:border-gray-300'}`}>
                        <span className="font-medium">{d.label}</span>
                        <span className="badge badge-green text-[10px]">{d.badge}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </Card>
          </div>
          <div className="space-y-4">
            <Card>
              <h4 className="text-sm font-medium mb-3">Counselling area</h4>
              <select className="input text-sm" value={selected.area} onChange={e => set('area', e.target.value)}>
                {AREAS.map(a => <option key={a} value={a}>{areaLabel(a)}</option>)}
              </select>
            </Card>
            <div className="card bg-brand-50 border-brand-100">
              <h4 className="text-xs font-medium text-brand-700 mb-2">Booking summary</h4>
              <div className="space-y-1 text-xs text-brand-600">
                <div>Therapist: <strong>{selected.therapist?.user?.name ?? 'Not selected'}</strong></div>
                <div>Type: <strong>{selected.type.toLowerCase()}</strong></div>
                <div>Duration: <strong>{selected.duration} min</strong></div>
              </div>
            </div>
            <button onClick={() => selected.therapist && setStep(2)} disabled={!selected.therapist}
              className="btn-primary w-full py-2.5 disabled:opacity-40">Continue to pick date</button>
          </div>
        </div>
      )}

      {/* Step 2: Calendar */}
      {step === 2 && (
        <div className="grid md:grid-cols-3 gap-4">
          <div className="md:col-span-2">
            <Card>
              <div className="flex items-center justify-between mb-4">
                <button onClick={() => { if (month === 0) { setMonth(11); setYear(y=>y-1) } else setMonth(m=>m-1) }}
                  className="p-1.5 rounded-lg hover:bg-gray-100"><ChevronLeft className="w-4 h-4" /></button>
                <span className="font-medium text-sm">{MONTH_NAMES[month]} {year}</span>
                <button onClick={() => { if (month === 11) { setMonth(0); setYear(y=>y+1) } else setMonth(m=>m+1) }}
                  className="p-1.5 rounded-lg hover:bg-gray-100"><ChevronRight className="w-4 h-4" /></button>
              </div>
              <div className="grid grid-cols-7 gap-1 mb-1">
                {['Su','Mo','Tu','We','Th','Fr','Sa'].map(d => <div key={d} className="text-center text-[10px] text-gray-400 py-1">{d}</div>)}
              </div>
              <div className="grid grid-cols-7 gap-1">
                {Array.from({ length: firstDay }).map((_,i) => <div key={i} />)}
                {Array.from({ length: daysInMonth }).map((_,i) => {
                  const d = i+1
                  const date = new Date(year, month, d)
                  const isPast = date < today
                  const isWeekend = [0,6].includes(date.getDay())
                  const isSelected = selected.date?.toDateString() === date.toDateString()
                  const hasSlots = !isPast && !isWeekend
                  return (
                    <button key={d} disabled={!hasSlots}
                      onClick={() => { set('date', date); set('slot', '') }}
                      className={`aspect-square rounded-lg text-xs font-medium transition-all ${
                        isSelected ? 'bg-brand-500 text-white'
                        : hasSlots ? 'bg-gray-50 hover:bg-brand-50 hover:text-brand-600 text-gray-700'
                        : 'text-gray-200 cursor-default'}`}>
                      {d}
                    </button>
                  )
                })}
              </div>
              {selected.date && (
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <div className="text-xs font-medium text-gray-600 mb-3">Available times — {selected.date.toLocaleDateString('en-GB',{day:'numeric',month:'long'})}</div>
                  <div className="grid grid-cols-4 gap-2">
                    {SLOTS.map(slot => (
                      <button key={slot} onClick={() => set('slot', slot)}
                        className={`py-2 rounded-lg border text-xs font-medium transition-all ${
                          selected.slot === slot ? 'bg-brand-500 text-white border-brand-500' : 'border-gray-200 text-gray-600 hover:border-brand-300 hover:text-brand-600'}`}>
                        {slot}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </Card>
          </div>
          <div className="space-y-4">
            <Card>
              <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-3">Booking summary</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between"><span className="text-gray-500">Therapist</span><span className="font-medium">{selected.therapist?.user?.name}</span></div>
                <div className="flex justify-between"><span className="text-gray-500">Type</span><span className="font-medium">{selected.type}</span></div>
                <div className="flex justify-between"><span className="text-gray-500">Duration</span><span className="font-medium">{selected.duration} min</span></div>
                <div className="flex justify-between"><span className="text-gray-500">Date</span><span className="font-medium">{selected.date?.toLocaleDateString() ?? '—'}</span></div>
                <div className="flex justify-between"><span className="text-gray-500">Time</span><span className="font-medium">{selected.slot || '—'}</span></div>
              </div>
            </Card>
            <div className="flex gap-2">
              <button onClick={() => setStep(1)} className="btn-secondary flex-1">Back</button>
              <button onClick={() => selected.date && selected.slot && setStep(3)} disabled={!selected.date || !selected.slot}
                className="btn-primary flex-1 disabled:opacity-40">Continue</button>
            </div>
          </div>
        </div>
      )}

      {/* Step 3: Details */}
      {step === 3 && (
        <div className="grid md:grid-cols-3 gap-4">
          <div className="md:col-span-2">
            <Card>
              <h4 className="font-medium text-sm mb-4">Session details</h4>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Full name</label>
                  <input className="input" value={selected.name} onChange={e => set('name', e.target.value)} placeholder="Your full name" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Email</label>
                  <input type="email" className="input" value={selected.email} onChange={e => set('email', e.target.value)} placeholder="you@email.com" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Phone</label>
                  <input type="tel" className="input" value={selected.phone} onChange={e => set('phone', e.target.value)} placeholder="+234 800 000 0000" />
                </div>
              </div>
              <div className="mt-4">
                <label className="block text-xs font-medium text-gray-600 mb-1">Brief reason for session (optional)</label>
                <textarea rows={3} className="input resize-none" value={selected.notes} onChange={e => set('notes', e.target.value)}
                  placeholder="Share anything that will help your therapist prepare..." />
              </div>
              <div className="mt-4 p-3 bg-brand-50 rounded-xl">
                <div className="text-xs font-medium text-brand-700 mb-2">Reminder preferences</div>
                {['Email reminder (24 hrs before)', 'SMS reminder (1 hr before)'].map(r => (
                  <label key={r} className="flex items-center gap-2 text-xs text-brand-600 mb-1.5 cursor-pointer">
                    <input type="checkbox" defaultChecked className="rounded" />{r}
                  </label>
                ))}
              </div>
            </Card>
          </div>
          <div className="space-y-4">
            <Card>
              <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-3">Full booking summary</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between"><span className="text-gray-500">Therapist</span><span className="font-medium">{selected.therapist?.user?.name}</span></div>
                <div className="flex justify-between"><span className="text-gray-500">Type</span><span className="font-medium">{selected.type}</span></div>
                <div className="flex justify-between"><span className="text-gray-500">Duration</span><span className="font-medium">{selected.duration} min</span></div>
                <div className="flex justify-between"><span className="text-gray-500">Date</span><span className="font-medium">{selected.date?.toLocaleDateString()}</span></div>
                <div className="flex justify-between"><span className="text-gray-500">Time</span><span className="font-medium">{selected.slot}</span></div>
                <div className="divider" />
                <div className="flex justify-between"><span className="text-gray-500">Platform fee</span><span className="badge badge-green text-xs">Free</span></div>
              </div>
            </Card>
            <div className="flex gap-2">
              <button onClick={() => setStep(2)} className="btn-secondary flex-1">Back</button>
              <button onClick={() => setStep(4)} className="btn-primary flex-1">Confirm booking</button>
            </div>
          </div>
        </div>
      )}

      {/* Step 4: Confirm */}
      {step === 4 && (
        <div className="max-w-lg mx-auto">
          <Card className="text-center">
            <div className="w-12 h-12 bg-brand-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <Calendar className="w-6 h-6 text-brand-500" />
            </div>
            <h3 className="font-semibold mb-2">Ready to confirm your booking?</h3>
            <p className="text-sm text-gray-500 mb-5">Your session will be confirmed immediately and your therapist will be notified.</p>
            <div className="text-left card bg-gray-50 mb-5">
              <div className="space-y-2 text-sm">
                <div className="flex justify-between"><span className="text-gray-500">Therapist</span><span className="font-medium">{selected.therapist?.user?.name}</span></div>
                <div className="flex justify-between"><span className="text-gray-500">Date & time</span><span className="font-medium">{selected.date?.toLocaleDateString()} · {selected.slot}</span></div>
                <div className="flex justify-between"><span className="text-gray-500">Type</span><span className="font-medium">{selected.type}</span></div>
                <div className="flex justify-between"><span className="text-gray-500">Duration</span><span className="font-medium">{selected.duration} minutes</span></div>
              </div>
            </div>
            <div className="flex gap-2">
              <button onClick={() => setStep(3)} className="btn-secondary flex-1">Back</button>
              <button onClick={confirmBooking} disabled={booking} className="btn-primary flex-1">
                {booking ? 'Booking...' : 'Confirm booking'}
              </button>
            </div>
          </Card>
        </div>
      )}
    </div>
  )
}
