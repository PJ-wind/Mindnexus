'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Brain, Loader2 } from 'lucide-react'
import toast from 'react-hot-toast'

const AREAS = [
  'INDIVIDUAL','CHILDREN_TEENS','COUPLES','FAMILY_GROUP',
  'PREMARITAL','CAREER_VOCATIONAL','SCHOOL_EDUCATIONAL',
  'CRISIS','REHABILITATION','ADDICTION_SUBSTANCE','GRIEF_BEREAVEMENT','SPIRITUAL_PASTORAL'
]
const AREA_LABELS: Record<string,string> = {
  INDIVIDUAL:'Individual counselling',CHILDREN_TEENS:'Children & teens',
  COUPLES:'Couples counselling',FAMILY_GROUP:'Family & group',
  PREMARITAL:'Premarital counselling',CAREER_VOCATIONAL:'Career & vocational',
  SCHOOL_EDUCATIONAL:'School & educational',CRISIS:'Crisis counselling',
  REHABILITATION:'Rehabilitation',ADDICTION_SUBSTANCE:'Addiction & recovery',
  GRIEF_BEREAVEMENT:'Grief & bereavement',SPIRITUAL_PASTORAL:'Spiritual & pastoral'
}

export default function RegisterPage() {
  const router  = useRouter()
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({ name:'', email:'', password:'', area:'INDIVIDUAL', phone:'' })

  function update(k: string, v: string) { setForm(f => ({ ...f, [k]: v })) }

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      })
      if (!res.ok) { const d = await res.json(); throw new Error(d.error) }
      toast.success('Account created! Please sign in.')
      router.push('/auth/login')
    } catch (err: any) {
      toast.error(err.message || 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-4">
            <div className="w-9 h-9 bg-brand-500 rounded-xl flex items-center justify-center">
              <Brain className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-semibold">MindNexus</span>
          </Link>
          <h1 className="text-2xl font-semibold">Create your account</h1>
          <p className="text-gray-500 mt-1 text-sm">Start your healing journey today — free forever</p>
        </div>

        <div className="card shadow-sm">
          {/* Step indicator */}
          <div className="flex items-center gap-2 mb-6">
            {[1,2].map(s => (
              <div key={s} className={`flex items-center gap-1.5 ${s < 3 && s < 2 ? 'flex-1' : ''}`}>
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium
                  ${step >= s ? 'bg-brand-500 text-white' : 'bg-gray-100 text-gray-400'}`}>{s}</div>
                <span className={`text-xs ${step >= s ? 'text-gray-700' : 'text-gray-400'}`}>
                  {s === 1 ? 'Account' : 'Your needs'}
                </span>
                {s === 1 && <div className="flex-1 h-px bg-gray-200 ml-2" />}
              </div>
            ))}
          </div>

          <form onSubmit={handleRegister}>
            {step === 1 && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Full name</label>
                  <input className="input" placeholder="e.g. Amara Osei" value={form.name}
                    onChange={e => update('name', e.target.value)} required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email address</label>
                  <input type="email" className="input" placeholder="you@email.com" value={form.email}
                    onChange={e => update('email', e.target.value)} required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone number</label>
                  <input type="tel" className="input" placeholder="+234 800 000 0000" value={form.phone}
                    onChange={e => update('phone', e.target.value)} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                  <input type="password" className="input" placeholder="Min 8 characters" value={form.password}
                    onChange={e => update('password', e.target.value)} required minLength={8} />
                </div>
                <button type="button" className="btn-primary w-full py-2.5"
                  onClick={() => { if (form.name && form.email && form.password) setStep(2) }}>
                  Continue
                </button>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">What kind of support are you looking for?</label>
                  <div className="grid grid-cols-2 gap-2">
                    {AREAS.map(a => (
                      <button type="button" key={a}
                        onClick={() => update('area', a)}
                        className={`text-xs py-2 px-3 rounded-lg border text-left transition-colors
                          ${form.area === a ? 'border-brand-500 bg-brand-50 text-brand-600 font-medium' : 'border-gray-200 text-gray-600 hover:border-gray-300'}`}>
                        {AREA_LABELS[a]}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="flex gap-2">
                  <button type="button" className="btn-secondary flex-1 py-2.5" onClick={() => setStep(1)}>Back</button>
                  <button type="submit" disabled={loading} className="btn-primary flex-2 flex-1 py-2.5 flex items-center justify-center gap-2">
                    {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Creating...</> : 'Create account'}
                  </button>
                </div>
              </div>
            )}
          </form>
        </div>

        <p className="text-center text-sm text-gray-500 mt-4">
          Already have an account?{' '}
          <Link href="/auth/login" className="text-brand-500 hover:underline font-medium">Sign in</Link>
        </p>
      </div>
    </div>
  )
}
