'use client'
import { useState } from 'react'
import Link from 'next/link'
import { Brain, AlertCircle, CheckCircle, Loader2, Shield, Phone } from 'lucide-react'
import toast from 'react-hot-toast'

const CONCERN_TYPES = [
  'Depression', 'Anxiety disorder', 'Panic attacks', 'Obsessive-compulsive disorder (OCD)',
  'Post-traumatic stress (PTSD)', 'Bipolar disorder', 'Schizophrenia', 'Eating disorder',
  'Addiction / substance use', 'Grief / bereavement', 'Suicidal thoughts',
  'Self-harm', 'Relationship problems', 'Domestic violence / abuse',
  'Childhood trauma', 'Work-related stress / burnout', 'Learning difficulties',
  'Behavioural problems (children)', 'Anger management', 'Social anxiety',
  'Phobias', 'Sleep disorders', 'Other'
]

const URGENCY_LEVELS = [
  { value: 'crisis',  label: 'Crisis — I need help immediately',        color: 'border-red-300 bg-red-50 text-red-700' },
  { value: 'urgent',  label: 'Urgent — within the next 24–48 hours',    color: 'border-amber-300 bg-amber-50 text-amber-700' },
  { value: 'soon',    label: 'Soon — within the next week',             color: 'border-brand-300 bg-brand-50 text-brand-700' },
  { value: 'routine', label: 'Routine — whenever a slot is available',  color: 'border-gray-200 bg-gray-50 text-gray-600' },
]

const WHO_IS_AFFECTED = [
  'Myself', 'My child', 'My spouse / partner', 'A family member', 'A friend', 'My student / client', 'Someone I am concerned about'
]

export default function ReportCasePage() {
  const [step, setStep]       = useState(1)
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    name: '', email: '', phone: '', anonymous: false,
    whoAffected: '', concernType: '', urgency: '',
    description: '', previousHelp: '', location: '',
    consent: false
  })
  const [refCode, setRefCode] = useState('')

  function set(k: string, v: any) { setForm(f => ({ ...f, [k]: v })) }

  async function submit() {
    if (!form.consent) { toast.error('Please tick the consent checkbox to continue.'); return }
    setLoading(true)
    try {
      const res = await fetch('/api/reports', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      })
      const data = await res.json()
      setRefCode(data.referenceCode ?? 'MNX-CASE-' + Date.now())
      setSubmitted(true)
    } catch {
      toast.error('Failed to submit. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (submitted) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md text-center">
        <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="w-8 h-8 text-green-500" />
        </div>
        <h2 className="text-2xl font-semibold mb-2">Case report submitted</h2>
        <p className="text-gray-500 text-sm mb-4 leading-relaxed">
          Thank you for reaching out. Your case has been received and will be reviewed by a MindNexus counsellor. You will be contacted within 24 hours.
        </p>
        <div className="card mb-4">
          <div className="text-xs text-gray-400 mb-1">Your reference number</div>
          <div className="text-lg font-semibold text-brand-500">{refCode}</div>
          <div className="text-xs text-gray-400 mt-1">Keep this number for follow-up</div>
        </div>
        {form.urgency === 'crisis' && (
          <div className="bg-red-50 border border-red-100 rounded-xl p-4 mb-4 text-left">
            <div className="flex items-center gap-2 mb-2">
              <Phone className="w-4 h-4 text-red-500" />
              <span className="text-sm font-medium text-red-700">Since this is a crisis — please also call:</span>
            </div>
            <div className="text-sm text-red-600 space-y-1">
              <div>NIMH Crisis Line: <strong>0800-NIMH-INFO</strong></div>
              <div>Emergency Services: <strong>112</strong></div>
            </div>
          </div>
        )}
        <div className="flex gap-3">
          <Link href="/"              className="btn-secondary flex-1">Return home</Link>
          <Link href="/auth/register" className="btn-primary flex-1">Create account</Link>
        </div>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <nav className="border-b border-gray-100 bg-white/95 backdrop-blur">
        <div className="max-w-4xl mx-auto px-6 h-16 flex items-center gap-8">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-brand-500 rounded-lg flex items-center justify-center">
              <Brain className="w-4 h-4 text-white" />
            </div>
            <span className="font-semibold">MindNexus</span>
          </Link>
          <div className="ml-auto flex gap-2">
            <Link href="/auth/login"    className="btn-secondary text-sm py-1.5">Sign in</Link>
            <Link href="/auth/register" className="btn-primary  text-sm py-1.5">Get started</Link>
          </div>
        </div>
      </nav>

      <div className="max-w-2xl mx-auto px-6 py-10">
        <div className="text-center mb-8">
          <div className="w-12 h-12 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-3">
            <AlertCircle className="w-6 h-6 text-red-500" />
          </div>
          <h1 className="text-2xl font-semibold mb-2">Report a psychological concern</h1>
          <p className="text-gray-500 text-sm leading-relaxed max-w-md mx-auto">
            You are in the right place. Whether this is for yourself or someone you care about, our team will respond with care and confidentiality.
          </p>
        </div>

        {/* Crisis banner */}
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6 flex gap-3">
          <Phone className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
          <div className="text-xs text-red-700 leading-relaxed">
            <strong>If this is a life-threatening emergency</strong> — please call emergency services on <strong>112</strong> or the NIMH crisis line on <strong>0800-NIMH-INFO</strong> immediately. Do not wait for this form to be processed.
          </div>
        </div>

        {/* Step indicator */}
        <div className="flex items-center gap-2 mb-6">
          {[1, 2, 3].map((s, i) => (
            <div key={s} className="flex items-center gap-2 flex-1">
              <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium flex-shrink-0 ${step > s ? 'bg-green-500 text-white' : step === s ? 'bg-brand-500 text-white' : 'bg-gray-100 text-gray-400'}`}>
                {step > s ? '✓' : s}
              </div>
              <span className={`text-xs hidden sm:block ${step === s ? 'text-gray-900 font-medium' : 'text-gray-400'}`}>
                {s === 1 ? 'About you' : s === 2 ? 'The concern' : 'Submit'}
              </span>
              {i < 2 && <div className="flex-1 h-px bg-gray-200 mx-1" />}
            </div>
          ))}
        </div>

        <div className="card">
          {/* Step 1 — About you */}
          {step === 1 && (
            <div className="space-y-4">
              <h3 className="font-medium text-sm mb-4">About the person reporting</h3>

              <label className="flex items-center gap-2 cursor-pointer p-3 bg-gray-50 rounded-lg border border-gray-200">
                <input type="checkbox" checked={form.anonymous}
                  onChange={e => set('anonymous', e.target.checked)} />
                <div>
                  <div className="text-sm font-medium">Submit anonymously</div>
                  <div className="text-xs text-gray-400">Your identity will not be shared with anyone</div>
                </div>
              </label>

              {!form.anonymous && (
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Your name</label>
                    <input className="input text-sm" placeholder="Full name"
                      value={form.name} onChange={e => set('name', e.target.value)} />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Email address</label>
                    <input type="email" className="input text-sm" placeholder="your@email.com"
                      value={form.email} onChange={e => set('email', e.target.value)} />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Phone number</label>
                    <input type="tel" className="input text-sm" placeholder="+234 800 000 0000"
                      value={form.phone} onChange={e => set('phone', e.target.value)} />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">City / location</label>
                    <input className="input text-sm" placeholder="e.g. Lagos, Abuja"
                      value={form.location} onChange={e => set('location', e.target.value)} />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-xs font-medium text-gray-600 mb-2">Who is this concern about?</label>
                <div className="grid grid-cols-2 gap-2">
                  {WHO_IS_AFFECTED.map(w => (
                    <button key={w} type="button" onClick={() => set('whoAffected', w)}
                      className={`text-xs py-2 px-3 rounded-lg border text-left transition-colors ${form.whoAffected === w ? 'border-brand-500 bg-brand-50 text-brand-600 font-medium' : 'border-gray-200 text-gray-500 hover:border-gray-300'}`}>
                      {w}
                    </button>
                  ))}
                </div>
              </div>

              <button onClick={() => setStep(2)} disabled={!form.whoAffected}
                className="btn-primary w-full py-2.5 disabled:opacity-40">
                Continue
              </button>
            </div>
          )}

          {/* Step 2 — The concern */}
          {step === 2 && (
            <div className="space-y-4">
              <h3 className="font-medium text-sm mb-4">About the concern</h3>

              <div>
                <label className="block text-xs font-medium text-gray-600 mb-2">What type of concern is this?</label>
                <div className="grid grid-cols-2 gap-2">
                  {CONCERN_TYPES.map(c => (
                    <button key={c} type="button" onClick={() => set('concernType', c)}
                      className={`text-xs py-2 px-3 rounded-lg border text-left transition-colors ${form.concernType === c ? 'border-brand-500 bg-brand-50 text-brand-600 font-medium' : 'border-gray-200 text-gray-500 hover:border-gray-300'}`}>
                      {c}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-600 mb-2">How urgent is this?</label>
                <div className="space-y-2">
                  {URGENCY_LEVELS.map(u => (
                    <button key={u.value} type="button" onClick={() => set('urgency', u.value)}
                      className={`w-full text-left py-2.5 px-3 rounded-lg border text-xs font-medium transition-all ${form.urgency === u.value ? u.color + ' border-2' : 'border-gray-200 text-gray-500 hover:border-gray-300'}`}>
                      {u.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">
                  Describe what is happening <span className="text-gray-400">(as much or little as you are comfortable sharing)</span>
                </label>
                <textarea rows={5} className="input resize-none text-sm"
                  placeholder="Tell us what you are experiencing or observing. There is no wrong way to describe this..."
                  value={form.description} onChange={e => set('description', e.target.value)} />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Have you or the person sought help before?</label>
                <textarea rows={2} className="input resize-none text-sm"
                  placeholder="e.g. previously saw a doctor, took medication, attended counselling..."
                  value={form.previousHelp} onChange={e => set('previousHelp', e.target.value)} />
              </div>

              <div className="flex gap-2">
                <button onClick={() => setStep(1)} className="btn-secondary flex-1">Back</button>
                <button onClick={() => setStep(3)} disabled={!form.concernType || !form.urgency || !form.description}
                  className="btn-primary flex-1 disabled:opacity-40">Continue</button>
              </div>
            </div>
          )}

          {/* Step 3 — Review & Submit */}
          {step === 3 && (
            <div className="space-y-4">
              <h3 className="font-medium text-sm mb-4">Review & submit</h3>

              <div className="bg-gray-50 rounded-xl p-4 space-y-2 text-sm">
                <div className="flex justify-between"><span className="text-gray-500">Submitted by</span><span className="font-medium">{form.anonymous ? 'Anonymous' : form.name || 'Not provided'}</span></div>
                <div className="flex justify-between"><span className="text-gray-500">Concern about</span><span className="font-medium">{form.whoAffected}</span></div>
                <div className="flex justify-between"><span className="text-gray-500">Type</span><span className="font-medium">{form.concernType}</span></div>
                <div className="flex justify-between"><span className="text-gray-500">Urgency</span><span className="font-medium capitalize">{form.urgency}</span></div>
              </div>

              <div className="bg-gray-50 rounded-xl p-4">
                <div className="text-xs font-medium text-gray-600 mb-1">Description</div>
                <p className="text-sm text-gray-600 leading-relaxed">{form.description}</p>
              </div>

              <div className="flex gap-2 p-3 bg-brand-50 rounded-xl border border-brand-100">
                <Shield className="w-4 h-4 text-brand-500 flex-shrink-0 mt-0.5" />
                <div className="text-xs text-brand-700 leading-relaxed">
                  Your report is handled with strict confidentiality by our licensed counselling team. Information is never shared without your consent.
                </div>
              </div>

              <label className="flex items-start gap-2 cursor-pointer">
                <input type="checkbox" className="mt-0.5" checked={form.consent}
                  onChange={e => set('consent', e.target.checked)} />
                <span className="text-xs text-gray-600 leading-relaxed">
                  I confirm that the information I have provided is accurate to the best of my knowledge, and I consent to a MindNexus counsellor contacting me or the relevant party about this concern.
                </span>
              </label>

              <div className="flex gap-2">
                <button onClick={() => setStep(2)} className="btn-secondary flex-1">Back</button>
                <button onClick={submit} disabled={loading || !form.consent}
                  className="btn-primary flex-1 disabled:opacity-40 flex items-center justify-center gap-2">
                  {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Submitting...</> : 'Submit report'}
                </button>
              </div>
            </div>
          )}
        </div>

        <p className="text-center text-xs text-gray-400 mt-4">
          Already have an account?{' '}
          <Link href="/auth/login" className="text-brand-500 hover:underline">Sign in</Link>
          {' '}for faster assistance.
        </p>
      </div>
    </div>
  )
}
