'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Brain, MapPin, Users, User, Home, Presentation, Calendar, Clock, CheckCircle, Loader2, ChevronLeft, ChevronRight } from 'lucide-react'
import toast from 'react-hot-toast'

const SESSION_TYPES = [
  {
    id: 'individual',
    label: 'Individual session',
    subtitle: '1-on-1 with your therapist',
    icon: User,
    color: 'border-brand-200 bg-brand-50',
    activeColor: 'border-brand-500 bg-brand-50',
    iconColor: 'text-brand-500',
    description: 'A private, face-to-face counselling session with a licensed psychologist at our office or a location of your choice.',
    duration: '60 or 90 minutes',
    groupSize: null
  },
  {
    id: 'group',
    label: 'Group session',
    subtitle: 'Multiple clients, one therapist',
    icon: Users,
    color: 'border-purple-light bg-purple-light',
    activeColor: 'border-purple-DEFAULT bg-purple-light',
    iconColor: 'text-purple-DEFAULT',
    description: 'A structured group therapy session where 4–8 clients work together with a therapist on shared challenges — depression, anxiety, grief, addiction recovery, and more.',
    duration: '90 minutes',
    groupSize: '4–8 people'
  },
  {
    id: 'workshop',
    label: 'Workshop / seminar',
    subtitle: 'Educational group event',
    icon: Presentation,
    color: 'border-teal-light bg-teal-light',
    activeColor: 'border-teal-DEFAULT bg-teal-light',
    iconColor: 'text-teal-DEFAULT',
    description: 'An educational workshop or seminar led by our psychologists. Topics include stress management, parenting skills, relationship health, workplace wellness, and more.',
    duration: '2–4 hours',
    groupSize: '10–50 people'
  },
  {
    id: 'home_visit',
    label: 'Home visit',
    subtitle: 'Therapist comes to you',
    icon: Home,
    color: 'border-amber-100 bg-amber-50',
    activeColor: 'border-amber-400 bg-amber-50',
    iconColor: 'text-amber-600',
    description: 'A licensed therapist visits your home for a private session. Ideal for clients who are unable to travel, elderly clients, or those who prefer the comfort of their own space.',
    duration: '60 or 90 minutes',
    groupSize: null
  }
]

const WORKSHOP_TOPICS = [
  'Stress & anxiety management',
  'Grief & loss support group',
  'Relationship & communication skills',
  'Parenting & child development',
  'Workplace mental health & burnout',
  'Addiction recovery support group',
  'Trauma healing & PTSD',
  'Self-esteem & confidence building',
  'Anger management',
  'Mindfulness & emotional regulation',
  'Premarital preparation',
  'Teenagers & mental health'
]

const LOCATIONS = [
  'Lagos — Victoria Island office',
  'Lagos — Ikeja office',
  'Abuja — Maitama office',
  'Port Harcourt — GRA office',
  'Client-specified location (home visit only)'
]

const TIME_SLOTS = ['8:00 AM', '9:00 AM', '10:00 AM', '11:00 AM', '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM']
const MONTH_NAMES = ['January','February','March','April','May','June','July','August','September','October','November','December']
const DURATIONS = [
  { value: 60,  label: '60 minutes' },
  { value: 90,  label: '90 minutes' },
  { value: 120, label: '2 hours'    },
  { value: 240, label: '4 hours'    },
]

export default function PhysicalSessionsPage() {
  const [step, setStep]         = useState(1)
  const [confirmed, setConfirmed] = useState<any>(null)
  const [loading, setLoading]   = useState(false)
  const [therapists, setTherapists] = useState<any[]>([])
  const [month, setMonth]       = useState(new Date().getMonth())
  const [year, setYear]         = useState(new Date().getFullYear())

  const [form, setForm] = useState({
    sessionType:   '',
    therapistId:   '',
    therapistName: '',
    location:      '',
    customAddress: '',
    date:          null as Date | null,
    timeSlot:      '',
    duration:       60,
    groupSize:      1,
    workshopTopic: '',
    name:          '',
    email:         '',
    phone:         '',
    notes:         '',
    specialNeeds:  ''
  })

  useEffect(() => {
    fetch('/api/therapists').then(r => r.json()).then(setTherapists)
  }, [])

  function set(k: string, v: any) { setForm(f => ({ ...f, [k]: v })) }

  const today    = new Date()
  const firstDay = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()

  async function confirmBooking() {
    setLoading(true)
    try {
      await fetch('/api/physical-sessions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      })
      setConfirmed({
        ref: 'MNX-PHY-' + Date.now().toString(36).toUpperCase(),
        ...form
      })
    } catch {
      toast.error('Booking failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const selectedType = SESSION_TYPES.find(t => t.id === form.sessionType)

  if (confirmed) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md text-center">
        <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="w-8 h-8 text-green-500" />
        </div>
        <h2 className="text-2xl font-semibold mb-2">Session booked!</h2>
        <p className="text-gray-500 text-sm mb-5 leading-relaxed">
          Your physical session has been confirmed. You will receive a confirmation by email and SMS.
        </p>
        <div className="card text-left mb-5 space-y-2 text-sm">
          <div className="flex justify-between"><span className="text-gray-400">Reference</span><span className="font-semibold text-brand-500">{confirmed.ref}</span></div>
          <div className="flex justify-between"><span className="text-gray-400">Type</span><span className="font-medium capitalize">{confirmed.sessionType.replace('_', ' ')}</span></div>
          <div className="flex justify-between"><span className="text-gray-400">Therapist</span><span className="font-medium">{confirmed.therapistName || 'To be assigned'}</span></div>
          <div className="flex justify-between"><span className="text-gray-400">Location</span><span className="font-medium">{confirmed.location}</span></div>
          <div className="flex justify-between"><span className="text-gray-400">Date</span><span className="font-medium">{confirmed.date?.toLocaleDateString('en-GB', { day:'numeric', month:'long', year:'numeric' })}</span></div>
          <div className="flex justify-between"><span className="text-gray-400">Time</span><span className="font-medium">{confirmed.timeSlot}</span></div>
          <div className="flex justify-between"><span className="text-gray-400">Duration</span><span className="font-medium">{confirmed.duration} minutes</span></div>
        </div>
        <div className="flex gap-3">
          <Link href="/"          className="btn-secondary flex-1">Return home</Link>
          <Link href="/auth/login" className="btn-primary  flex-1">Sign in to manage</Link>
        </div>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <nav className="border-b border-gray-100 bg-white/95 backdrop-blur sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-6 h-16 flex items-center gap-8">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-brand-500 rounded-lg flex items-center justify-center">
              <Brain className="w-4 h-4 text-white" />
            </div>
            <span className="font-semibold">MindNexus</span>
          </Link>
          <div className="hidden md:flex items-center gap-1 ml-4">
            <Link href="/"                className="px-3 py-1.5 text-sm text-gray-500 hover:text-gray-900 hover:bg-gray-50 rounded-lg">Home</Link>
            <Link href="/blog"            className="px-3 py-1.5 text-sm text-gray-500 hover:text-gray-900 hover:bg-gray-50 rounded-lg">Blog</Link>
            <Link href="/report"          className="px-3 py-1.5 text-sm text-gray-500 hover:text-gray-900 hover:bg-gray-50 rounded-lg">Report a case</Link>
            <Link href="/physical-sessions" className="px-3 py-1.5 text-sm text-brand-500 font-medium bg-brand-50 rounded-lg">Physical sessions</Link>
          </div>
          <div className="ml-auto flex gap-2">
            <Link href="/auth/login"    className="btn-secondary text-sm py-1.5">Sign in</Link>
            <Link href="/auth/register" className="btn-primary  text-sm py-1.5">Get started</Link>
          </div>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto px-6 py-10">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-brand-50 text-brand-600 rounded-full text-xs font-medium mb-4 border border-brand-100">
            <MapPin className="w-3 h-3" /> In-person counselling sessions
          </div>
          <h1 className="text-3xl font-semibold text-gray-900 mb-3">Book a physical session</h1>
          <p className="text-gray-500 max-w-lg mx-auto text-sm leading-relaxed">
            Meet your therapist in person. Choose from individual sessions, group therapy, educational workshops, or home visits anywhere in Nigeria.
          </p>
        </div>

        {/* Step indicator */}
        <div className="flex items-center gap-2 mb-8 max-w-xl mx-auto">
          {['Session type','Date & time','Your details','Confirm'].map((label, i) => (
            <div key={i} className="flex items-center gap-2 flex-1">
              <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium flex-shrink-0 ${step > i+1 ? 'bg-green-500 text-white' : step === i+1 ? 'bg-brand-500 text-white' : 'bg-gray-100 text-gray-400'}`}>
                {step > i+1 ? '✓' : i+1}
              </div>
              <span className={`text-xs hidden sm:block ${step === i+1 ? 'font-medium text-gray-900' : 'text-gray-400'}`}>{label}</span>
              {i < 3 && <div className="flex-1 h-px bg-gray-200" />}
            </div>
          ))}
        </div>

        {/* Step 1 — Session type */}
        {step === 1 && (
          <div>
            <h2 className="text-lg font-medium text-center mb-6">What type of session would you like?</h2>
            <div className="grid md:grid-cols-2 gap-4 mb-6">
              {SESSION_TYPES.map(type => (
                <button key={type.id} onClick={() => set('sessionType', type.id)}
                  className={`text-left p-5 rounded-2xl border-2 transition-all ${form.sessionType === type.id ? type.activeColor + ' border-2' : 'border-gray-200 bg-white hover:border-gray-300'}`}>
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${form.sessionType === type.id ? 'bg-white' : 'bg-gray-50'}`}>
                    <type.icon className={`w-5 h-5 ${form.sessionType === type.id ? type.iconColor : 'text-gray-400'}`} />
                  </div>
                  <div className="font-medium text-sm mb-0.5">{type.label}</div>
                  <div className="text-xs text-gray-400 mb-2">{type.subtitle}</div>
                  <p className="text-xs text-gray-500 leading-relaxed mb-3">{type.description}</p>
                  <div className="flex gap-3 text-[10px] text-gray-400">
                    <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{type.duration}</span>
                    {type.groupSize && <span className="flex items-center gap-1"><Users className="w-3 h-3" />{type.groupSize}</span>}
                  </div>
                </button>
              ))}
            </div>

            {/* Workshop topic selector */}
            {form.sessionType === 'workshop' && (
              <div className="card mb-6">
                <h4 className="text-sm font-medium mb-3">Workshop topic</h4>
                <div className="grid grid-cols-2 gap-2">
                  {WORKSHOP_TOPICS.map(topic => (
                    <button key={topic} onClick={() => set('workshopTopic', topic)}
                      className={`text-xs text-left py-2 px-3 rounded-lg border transition-colors ${form.workshopTopic === topic ? 'border-brand-500 bg-brand-50 text-brand-600' : 'border-gray-200 text-gray-500 hover:border-gray-300'}`}>
                      {topic}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Group size */}
            {form.sessionType === 'group' && (
              <div className="card mb-6">
                <h4 className="text-sm font-medium mb-3">How many people will attend?</h4>
                <div className="flex items-center gap-4">
                  <button onClick={() => set('groupSize', Math.max(1, form.groupSize - 1))}
                    className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 text-sm font-medium">−</button>
                  <span className="text-2xl font-semibold w-8 text-center">{form.groupSize}</span>
                  <button onClick={() => set('groupSize', Math.min(50, form.groupSize + 1))}
                    className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 text-sm font-medium">+</button>
                  <span className="text-xs text-gray-400">attendees</span>
                </div>
              </div>
            )}

            {/* Therapist selection */}
            {(form.sessionType === 'individual' || form.sessionType === 'home_visit') && (
              <div className="card mb-6">
                <h4 className="text-sm font-medium mb-3">Choose a therapist <span className="text-gray-400 font-normal">(optional — we will match you if you skip)</span></h4>
                <div className="grid md:grid-cols-2 gap-2">
                  {therapists.map(t => (
                    <button key={t.id} onClick={() => { set('therapistId', t.id); set('therapistName', t.user.name) }}
                      className={`flex items-center gap-2.5 p-3 rounded-xl border text-left transition-all ${form.therapistId === t.id ? 'border-brand-500 bg-brand-50' : 'border-gray-200 hover:border-gray-300'}`}>
                      <div className="w-9 h-9 bg-brand-500 rounded-full flex items-center justify-center text-white text-xs font-medium flex-shrink-0">
                        {t.user.name.split(' ').map((n:string)=>n[0]).join('').slice(0,2)}
                      </div>
                      <div>
                        <div className="text-xs font-medium">{t.user.name}</div>
                        <div className="text-[10px] text-gray-400">★ {t.rating} · {t.yearsExperience} yrs exp</div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Location */}
            <div className="card mb-6">
              <h4 className="text-sm font-medium mb-3">
                {form.sessionType === 'home_visit' ? 'Your address' : 'Session location'}
              </h4>
              {form.sessionType === 'home_visit' ? (
                <input className="input text-sm" placeholder="Enter your full home address..."
                  value={form.customAddress} onChange={e => set('customAddress', e.target.value)} />
              ) : (
                <div className="grid md:grid-cols-2 gap-2">
                  {LOCATIONS.filter(l => !l.includes('home visit')).map(loc => (
                    <button key={loc} onClick={() => set('location', loc)}
                      className={`flex items-center gap-2 text-xs p-3 rounded-xl border text-left transition-all ${form.location === loc ? 'border-brand-500 bg-brand-50 text-brand-600' : 'border-gray-200 text-gray-500 hover:border-gray-300'}`}>
                      <MapPin className="w-3 h-3 flex-shrink-0" />{loc}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="flex justify-center">
              <button onClick={() => setStep(2)}
                disabled={!form.sessionType || (!form.location && !form.customAddress)}
                className="btn-primary py-3 px-10 disabled:opacity-40">
                Continue to pick date
              </button>
            </div>
          </div>
        )}

        {/* Step 2 — Date & time */}
        {step === 2 && (
          <div className="grid md:grid-cols-3 gap-6">
            <div className="md:col-span-2 card">
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
                  const d    = i + 1
                  const date = new Date(year, month, d)
                  const past = date < today
                  const sel  = form.date?.toDateString() === date.toDateString()
                  return (
                    <button key={d} disabled={past}
                      onClick={() => { set('date', date); set('timeSlot', '') }}
                      className={`aspect-square rounded-lg text-xs font-medium transition-all ${sel ? 'bg-brand-500 text-white' : past ? 'text-gray-200 cursor-default' : 'bg-gray-50 hover:bg-brand-50 hover:text-brand-600 text-gray-700'}`}>
                      {d}
                    </button>
                  )
                })}
              </div>

              {form.date && (
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <div className="text-xs font-medium text-gray-600 mb-3">
                    Available times — {form.date.toLocaleDateString('en-GB', { day:'numeric', month:'long' })}
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    {TIME_SLOTS.map(slot => (
                      <button key={slot} onClick={() => set('timeSlot', slot)}
                        className={`py-2 rounded-lg border text-xs font-medium transition-all ${form.timeSlot === slot ? 'bg-brand-500 text-white border-brand-500' : 'border-gray-200 text-gray-600 hover:border-brand-300'}`}>
                        {slot}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Duration */}
              <div className="mt-4 pt-4 border-t border-gray-100">
                <div className="text-xs font-medium text-gray-600 mb-3">Session duration</div>
                <div className="flex gap-2 flex-wrap">
                  {DURATIONS.filter(d => selectedType?.id === 'workshop' ? d.value >= 120 : d.value <= 90).map(d => (
                    <button key={d.value} onClick={() => set('duration', d.value)}
                      className={`px-4 py-2 rounded-lg border text-xs font-medium transition-all ${form.duration === d.value ? 'bg-brand-500 text-white border-brand-500' : 'border-gray-200 text-gray-600 hover:border-gray-300'}`}>
                      {d.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="card">
                <h4 className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-3">Summary</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between"><span className="text-gray-400">Type</span><span className="capitalize">{form.sessionType?.replace('_',' ')}</span></div>
                  <div className="flex justify-between"><span className="text-gray-400">Location</span><span className="text-right text-xs">{form.location || form.customAddress || '—'}</span></div>
                  <div className="flex justify-between"><span className="text-gray-400">Date</span><span>{form.date?.toLocaleDateString() ?? '—'}</span></div>
                  <div className="flex justify-between"><span className="text-gray-400">Time</span><span>{form.timeSlot || '—'}</span></div>
                  <div className="flex justify-between"><span className="text-gray-400">Duration</span><span>{form.duration} min</span></div>
                </div>
              </div>
              <div className="flex gap-2">
                <button onClick={() => setStep(1)} className="btn-secondary flex-1">Back</button>
                <button onClick={() => setStep(3)} disabled={!form.date || !form.timeSlot}
                  className="btn-primary flex-1 disabled:opacity-40">Continue</button>
              </div>
            </div>
          </div>
        )}

        {/* Step 3 — Your details */}
        {step === 3 && (
          <div className="grid md:grid-cols-3 gap-6">
            <div className="md:col-span-2 card space-y-4">
              <h3 className="font-medium text-sm">Your contact details</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Full name</label>
                  <input className="input text-sm" placeholder="Your full name"
                    value={form.name} onChange={e => set('name', e.target.value)} />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Email address</label>
                  <input type="email" className="input text-sm" placeholder="you@email.com"
                    value={form.email} onChange={e => set('email', e.target.value)} />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Phone number</label>
                  <input type="tel" className="input text-sm" placeholder="+234 800 000 0000"
                    value={form.phone} onChange={e => set('phone', e.target.value)} />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Reason for session <span className="text-gray-400">(optional)</span></label>
                <textarea rows={3} className="input resize-none text-sm"
                  placeholder="Brief description of what you would like to discuss..."
                  value={form.notes} onChange={e => set('notes', e.target.value)} />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Any special needs or accessibility requirements? <span className="text-gray-400">(optional)</span></label>
                <input className="input text-sm" placeholder="e.g. wheelchair access, sign language interpreter..."
                  value={form.specialNeeds} onChange={e => set('specialNeeds', e.target.value)} />
              </div>
            </div>

            <div className="space-y-4">
              <div className="card">
                <h4 className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-3">Booking summary</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between"><span className="text-gray-400">Type</span><span className="capitalize">{form.sessionType?.replace('_',' ')}</span></div>
                  <div className="flex justify-between"><span className="text-gray-400">Date</span><span>{form.date?.toLocaleDateString()}</span></div>
                  <div className="flex justify-between"><span className="text-gray-400">Time</span><span>{form.timeSlot}</span></div>
                  <div className="flex justify-between"><span className="text-gray-400">Duration</span><span>{form.duration} min</span></div>
                  <div className="flex justify-between"><span className="text-gray-400">Location</span><span className="text-xs text-right">{form.location || form.customAddress}</span></div>
                  <div className="divider" />
                  <div className="flex justify-between"><span className="text-gray-400">Platform fee</span><span className="badge badge-green">Free</span></div>
                </div>
              </div>
              <div className="flex gap-2">
                <button onClick={() => setStep(2)} className="btn-secondary flex-1">Back</button>
                <button onClick={() => setStep(4)} disabled={!form.name || !form.email || !form.phone}
                  className="btn-primary flex-1 disabled:opacity-40">Continue</button>
              </div>
            </div>
          </div>
        )}

        {/* Step 4 — Confirm */}
        {step === 4 && (
          <div className="max-w-lg mx-auto">
            <div className="card text-center">
              <div className="w-12 h-12 bg-brand-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <Calendar className="w-6 h-6 text-brand-500" />
              </div>
              <h3 className="font-semibold mb-2">Ready to confirm your physical session?</h3>
              <p className="text-sm text-gray-500 mb-5">Your booking will be confirmed immediately and our team will contact you to finalise the details.</p>

              <div className="text-left card bg-gray-50 mb-5 space-y-2 text-sm">
                <div className="flex justify-between"><span className="text-gray-400">Name</span><span className="font-medium">{form.name}</span></div>
                <div className="flex justify-between"><span className="text-gray-400">Session</span><span className="font-medium capitalize">{form.sessionType?.replace('_',' ')}</span></div>
                <div className="flex justify-between"><span className="text-gray-400">Date & time</span><span className="font-medium">{form.date?.toLocaleDateString()} · {form.timeSlot}</span></div>
                <div className="flex justify-between"><span className="text-gray-400">Duration</span><span className="font-medium">{form.duration} minutes</span></div>
                <div className="flex justify-between text-xs"><span className="text-gray-400">Location</span><span className="font-medium text-right max-w-48">{form.location || form.customAddress}</span></div>
                {form.therapistName && <div className="flex justify-between"><span className="text-gray-400">Therapist</span><span className="font-medium">{form.therapistName}</span></div>}
              </div>

              <div className="flex gap-2">
                <button onClick={() => setStep(3)} className="btn-secondary flex-1">Back</button>
                <button onClick={confirmBooking} disabled={loading}
                  className="btn-primary flex-1 flex items-center justify-center gap-2">
                  {loading ? <><Loader2 className="w-4 h-4 animate-spin" />Confirming...</> : 'Confirm booking'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      <footer className="border-t border-gray-100 py-8 px-6 mt-8">
        <div className="max-w-5xl mx-auto flex items-center justify-between text-xs text-gray-400">
          <span>© 2026 MindNexus. All rights reserved.</span>
          <span>Nigeria&apos;s leading virtual counselling platform</span>
        </div>
      </footer>
    </div>
  )
}
