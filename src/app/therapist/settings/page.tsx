'use client'
import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { Card } from '@/components/ui'
import { User, Lock, Bell, Shield, Clock, CreditCard, Trash2, Check, Calendar } from 'lucide-react'
import toast from 'react-hot-toast'

const TABS = [
  { id: 'profile',       label: 'Profile',           icon: User },
  { id: 'password',      label: 'Password',           icon: Lock },
  { id: 'availability',  label: 'Availability',       icon: Calendar },
  { id: 'notifications', label: 'Notifications',      icon: Bell },
  { id: 'privacy',       label: 'Privacy',            icon: Shield },
  { id: 'session',       label: 'Session preferences',icon: Clock },
  { id: 'billing',       label: 'Earnings & payout',  icon: CreditCard },
  { id: 'danger',        label: 'Danger zone',        icon: Trash2 },
]

const DAYS = ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday']
const SLOTS = ['7:00 AM','8:00 AM','9:00 AM','10:00 AM','11:00 AM','12:00 PM','1:00 PM','2:00 PM','3:00 PM','4:00 PM','5:00 PM','6:00 PM','7:00 PM']

export default function TherapistSettingsPage() {
  const { data: session } = useSession()
  const user = session?.user as any

  const [tab, setTab]     = useState('profile')
  const [saving, setSaving] = useState(false)

  const [profile, setProfile] = useState({
    name: user?.name ?? '',
    email: user?.email ?? '',
    phone: '',
    bio: '',
    yearsExperience: '',
    licenseNumber: '',
    specialisations: [] as string[],
    languages: ['English'],
    location: '',
  })

  const [passwords, setPasswords] = useState({ current: '', newPw: '', confirm: '' })

  const [availability, setAvailability] = useState(
    DAYS.reduce<Record<string,{enabled:boolean;from:string;to:string}>>((acc, day) => {
      acc[day] = { enabled: ['Monday','Tuesday','Wednesday','Thursday','Friday'].includes(day), from: '9:00 AM', to: '5:00 PM' }
      return acc
    }, {})
  )

  const [notifications, setNotifications] = useState({
    newBooking: true,
    sessionReminder: true,
    newMessage: true,
    crisisAlert: true,
    clientMoodAlert: true,
    platformUpdates: false,
    paymentReceived: true,
  })

  const [sessionPrefs, setSessionPrefs] = useState({
    defaultDuration: '60',
    maxClientsPerDay: '6',
    bufferBetweenSessions: '15',
    autoAcceptBookings: false,
    videoDefault: true,
    requireNotes: true,
  })

  async function save() {
    setSaving(true)
    await new Promise(r => setTimeout(r, 800))
    toast.success('Settings saved!')
    setSaving(false)
  }

  async function changePassword() {
    if (passwords.newPw !== passwords.confirm) { toast.error('Passwords do not match'); return }
    if (passwords.newPw.length < 8) { toast.error('Password must be at least 8 characters'); return }
    setSaving(true)
    await new Promise(r => setTimeout(r, 800))
    toast.success('Password updated!')
    setPasswords({ current: '', newPw: '', confirm: '' })
    setSaving(false)
  }

  return (
    <div className="p-6 max-w-4xl">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold">Settings</h1>
        <p className="text-gray-500 text-sm mt-0.5">Manage your profile, availability, and preferences.</p>
      </div>

      <div className="grid md:grid-cols-4 gap-6">
        {/* Sidebar */}
        <div className="card p-2 space-y-0.5 h-fit">
          {TABS.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)}
              className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm transition-colors text-left ${
                tab === t.id ? 'bg-brand-50 text-brand-600 font-medium' : 'text-gray-500 hover:bg-gray-50'}`}>
              <t.icon className={`w-4 h-4 flex-shrink-0 ${t.id === 'danger' ? 'text-red-400' : ''}`} />
              <span className={t.id === 'danger' ? 'text-red-500' : ''}>{t.label}</span>
            </button>
          ))}
        </div>

        <div className="md:col-span-3 space-y-4">

          {/* Profile */}
          {tab === 'profile' && (
            <Card>
              <h3 className="font-medium text-sm mb-4">Professional profile</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Full name</label>
                  <input className="input text-sm" value={profile.name}
                    onChange={e => setProfile(p => ({ ...p, name: e.target.value }))} />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Email address</label>
                  <input type="email" className="input text-sm" value={profile.email}
                    onChange={e => setProfile(p => ({ ...p, email: e.target.value }))} />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Phone number</label>
                  <input type="tel" className="input text-sm" placeholder="+234 800 000 0000"
                    value={profile.phone} onChange={e => setProfile(p => ({ ...p, phone: e.target.value }))} />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Years of experience</label>
                  <input type="number" min="0" className="input text-sm"
                    value={profile.yearsExperience} onChange={e => setProfile(p => ({ ...p, yearsExperience: e.target.value }))} />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">License / registration number</label>
                  <input className="input text-sm" placeholder="CORBON-XXXXX"
                    value={profile.licenseNumber} onChange={e => setProfile(p => ({ ...p, licenseNumber: e.target.value }))} />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Office location / city</label>
                  <input className="input text-sm" placeholder="e.g. Lagos, Victoria Island"
                    value={profile.location} onChange={e => setProfile(p => ({ ...p, location: e.target.value }))} />
                </div>
              </div>
              <div className="mt-4">
                <label className="block text-xs font-medium text-gray-600 mb-1">Professional bio</label>
                <textarea rows={4} className="input resize-none text-sm"
                  placeholder="Tell clients about your background, approach, and what you specialise in..."
                  value={profile.bio} onChange={e => setProfile(p => ({ ...p, bio: e.target.value }))} />
              </div>
              <button onClick={save} disabled={saving} className="btn-primary mt-4 py-2 px-6 flex items-center gap-2">
                {saving ? 'Saving...' : <><Check className="w-3.5 h-3.5" /> Save profile</>}
              </button>
            </Card>
          )}

          {/* Password */}
          {tab === 'password' && (
            <Card>
              <h3 className="font-medium text-sm mb-4">Change password</h3>
              <div className="space-y-4 max-w-sm">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Current password</label>
                  <input type="password" className="input text-sm"
                    value={passwords.current} onChange={e => setPasswords(p => ({ ...p, current: e.target.value }))} />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">New password</label>
                  <input type="password" className="input text-sm"
                    value={passwords.newPw} onChange={e => setPasswords(p => ({ ...p, newPw: e.target.value }))} />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Confirm new password</label>
                  <input type="password" className="input text-sm"
                    value={passwords.confirm} onChange={e => setPasswords(p => ({ ...p, confirm: e.target.value }))} />
                </div>
                <button onClick={changePassword} disabled={saving || !passwords.current || !passwords.newPw}
                  className="btn-primary py-2 px-6 disabled:opacity-40">
                  {saving ? 'Updating...' : 'Update password'}
                </button>
              </div>
            </Card>
          )}

          {/* Availability */}
          {tab === 'availability' && (
            <Card>
              <h3 className="font-medium text-sm mb-4">Weekly availability</h3>
              <p className="text-xs text-gray-400 mb-4">Set the days and hours you are available for sessions. Clients can only book during these times.</p>
              <div className="space-y-3">
                {DAYS.map(day => (
                  <div key={day} className="flex items-center gap-3">
                    <button onClick={() => setAvailability(a => ({ ...a, [day]: { ...a[day], enabled: !a[day].enabled } }))}
                      className={`flex-shrink-0 rounded-full transition-colors relative`}
                      style={{ minWidth: '2.5rem', height: '1.375rem', background: availability[day].enabled ? '#185FA5' : '#e5e7eb' }}>
                      <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${availability[day].enabled ? 'translate-x-5' : 'translate-x-0.5'}`} />
                    </button>
                    <div className="w-24 text-sm font-medium text-gray-700">{day}</div>
                    {availability[day].enabled ? (
                      <div className="flex items-center gap-2 flex-1">
                        <select className="input text-xs py-1.5 flex-1"
                          value={availability[day].from}
                          onChange={e => setAvailability(a => ({ ...a, [day]: { ...a[day], from: e.target.value } }))}>
                          {SLOTS.map(s => <option key={s}>{s}</option>)}
                        </select>
                        <span className="text-xs text-gray-400">to</span>
                        <select className="input text-xs py-1.5 flex-1"
                          value={availability[day].to}
                          onChange={e => setAvailability(a => ({ ...a, [day]: { ...a[day], to: e.target.value } }))}>
                          {SLOTS.map(s => <option key={s}>{s}</option>)}
                        </select>
                      </div>
                    ) : (
                      <span className="text-xs text-gray-400 italic">Not available</span>
                    )}
                  </div>
                ))}
              </div>
              <button onClick={save} disabled={saving} className="btn-primary mt-4 py-2 px-6">
                {saving ? 'Saving...' : 'Save availability'}
              </button>
            </Card>
          )}

          {/* Notifications */}
          {tab === 'notifications' && (
            <Card>
              <h3 className="font-medium text-sm mb-4">Notification preferences</h3>
              <div className="space-y-3">
                {[
                  { key: 'newBooking',       label: 'New session bookings',     desc: 'Get notified when a client books a session' },
                  { key: 'sessionReminder',  label: 'Session reminders',        desc: 'Reminders before your upcoming sessions' },
                  { key: 'newMessage',       label: 'Client messages',          desc: 'Get notified when clients send messages' },
                  { key: 'crisisAlert',      label: 'Crisis alerts',            desc: 'Immediate notification when a client activates crisis support' },
                  { key: 'clientMoodAlert',  label: 'Low mood alerts',          desc: 'Alert when a client logs very low or low mood' },
                  { key: 'paymentReceived',  label: 'Payment notifications',    desc: 'Confirmation when session payments are received' },
                  { key: 'platformUpdates',  label: 'Platform updates',         desc: 'News and updates from MindNexus' },
                ].map(item => (
                  <div key={item.key} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                    <div>
                      <div className="text-sm font-medium">{item.label}</div>
                      <div className="text-xs text-gray-400">{item.desc}</div>
                    </div>
                    <button onClick={() => setNotifications(n => ({ ...n, [item.key]: !n[item.key as keyof typeof n] }))}
                      className={`flex-shrink-0 rounded-full transition-colors relative ${notifications[item.key as keyof typeof notifications] ? 'bg-brand-500' : 'bg-gray-200'}`}
                      style={{ minWidth: '2.5rem', height: '1.375rem' }}>
                      <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${notifications[item.key as keyof typeof notifications] ? 'translate-x-5' : 'translate-x-0.5'}`} />
                    </button>
                  </div>
                ))}
              </div>
              <button onClick={save} disabled={saving} className="btn-primary mt-4 py-2 px-6">
                {saving ? 'Saving...' : 'Save preferences'}
              </button>
            </Card>
          )}

          {/* Session preferences */}
          {tab === 'session' && (
            <Card>
              <h3 className="font-medium text-sm mb-4">Session preferences</h3>
              <div className="grid md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Default session duration</label>
                  <select className="input text-sm" value={sessionPrefs.defaultDuration}
                    onChange={e => setSessionPrefs(p => ({ ...p, defaultDuration: e.target.value }))}>
                    <option value="30">30 minutes</option>
                    <option value="60">60 minutes</option>
                    <option value="90">90 minutes</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Max sessions per day</label>
                  <input type="number" min="1" max="12" className="input text-sm"
                    value={sessionPrefs.maxClientsPerDay}
                    onChange={e => setSessionPrefs(p => ({ ...p, maxClientsPerDay: e.target.value }))} />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Buffer between sessions (minutes)</label>
                  <select className="input text-sm" value={sessionPrefs.bufferBetweenSessions}
                    onChange={e => setSessionPrefs(p => ({ ...p, bufferBetweenSessions: e.target.value }))}>
                    <option value="0">No buffer</option>
                    <option value="10">10 minutes</option>
                    <option value="15">15 minutes</option>
                    <option value="30">30 minutes</option>
                  </select>
                </div>
              </div>
              <div className="space-y-3 pt-4 border-t border-gray-100">
                {[
                  { key: 'autoAcceptBookings', label: 'Auto-accept bookings', desc: 'Automatically confirm client bookings without manual approval' },
                  { key: 'videoDefault',       label: 'Start sessions with video on', desc: 'Your camera is on by default when joining a session' },
                  { key: 'requireNotes',       label: 'Require session notes', desc: 'Remind you to complete session notes after each session' },
                ].map(item => (
                  <div key={item.key} className="flex items-center justify-between">
                    <div>
                      <div className="text-sm font-medium">{item.label}</div>
                      <div className="text-xs text-gray-400">{item.desc}</div>
                    </div>
                    <button onClick={() => setSessionPrefs(p => ({ ...p, [item.key]: !p[item.key as keyof typeof p] }))}
                      className={`flex-shrink-0 rounded-full transition-colors relative ${sessionPrefs[item.key as keyof typeof sessionPrefs] ? 'bg-brand-500' : 'bg-gray-200'}`}
                      style={{ minWidth: '2.5rem', height: '1.375rem' }}>
                      <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${sessionPrefs[item.key as keyof typeof sessionPrefs] ? 'translate-x-5' : 'translate-x-0.5'}`} />
                    </button>
                  </div>
                ))}
              </div>
              <button onClick={save} disabled={saving} className="btn-primary mt-4 py-2 px-6">
                {saving ? 'Saving...' : 'Save preferences'}
              </button>
            </Card>
          )}

          {/* Earnings */}
          {tab === 'billing' && (
            <Card>
              <h3 className="font-medium text-sm mb-4">Earnings & payout</h3>
              <div className="grid grid-cols-3 gap-3 mb-5">
                {[['₦0', 'This month'],['₦0', 'Last month'],['₦0', 'Total earned']].map(([v,l]) => (
                  <div key={l} className="stat-card text-center">
                    <div className="text-xl font-semibold text-brand-500">{v}</div>
                    <div className="text-xs text-gray-400 mt-0.5">{l}</div>
                  </div>
                ))}
              </div>
              <div className="p-4 bg-gray-50 rounded-xl border border-gray-200 mb-4">
                <div className="text-xs font-medium text-gray-600 mb-3">Payout bank account</div>
                <div className="grid md:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Bank name</label>
                    <select className="input text-sm">
                      <option>Select bank</option>
                      <option>Access Bank</option>
                      <option>GTBank</option>
                      <option>First Bank</option>
                      <option>Zenith Bank</option>
                      <option>UBA</option>
                      <option>Sterling Bank</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Account number</label>
                    <input className="input text-sm" placeholder="10-digit account number" />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Account name</label>
                    <input className="input text-sm" placeholder="Name on account" />
                  </div>
                </div>
                <button onClick={save} className="btn-primary mt-3 py-1.5 px-4 text-sm">Save bank details</button>
              </div>
              <p className="text-xs text-gray-400">Payouts are processed on the 1st and 15th of every month to your registered bank account.</p>
            </Card>
          )}

          {/* Danger */}
          {tab === 'danger' && (
            <Card className="border-red-100">
              <h3 className="font-medium text-sm text-red-600 mb-4">Danger zone</h3>
              <div className="space-y-4">
                <div className="p-4 border border-amber-100 rounded-xl bg-amber-50">
                  <div className="text-sm font-medium text-amber-700 mb-1">Go on leave</div>
                  <p className="text-xs text-amber-600 mb-3">Temporarily pause new bookings while you are away. Existing clients and sessions are not affected.</p>
                  <button onClick={() => toast.success('Leave mode activated. New bookings paused.')}
                    className="text-xs px-4 py-2 bg-amber-100 hover:bg-amber-200 text-amber-700 rounded-lg border border-amber-200 transition-colors">
                    Activate leave mode
                  </button>
                </div>
                <div className="p-4 border border-red-100 rounded-xl bg-red-50">
                  <div className="text-sm font-medium text-red-700 mb-1">Deactivate account</div>
                  <p className="text-xs text-red-600 mb-3">Deactivate your therapist account. Contact admin@mindnexus.ng to reactivate.</p>
                  <button onClick={() => toast.error('Please contact admin@mindnexus.ng to deactivate your account.')}
                    className="btn-danger text-xs py-2 px-4">
                    Request deactivation
                  </button>
                </div>
              </div>
            </Card>
          )}

          {tab === 'privacy' && (
            <Card>
              <h3 className="font-medium text-sm mb-4">Privacy settings</h3>
              <div className="p-3 bg-brand-50 rounded-xl border border-brand-100 mb-4">
                <p className="text-xs text-brand-700 leading-relaxed">
                  As a licensed counselling psychologist on MindNexus, you are bound by the ethical code of the Counselling Association of Nigeria (CASSON) and applicable Nigerian law regarding client confidentiality.
                </p>
              </div>
              <p className="text-xs text-gray-400">Privacy settings for therapists are managed at the platform level. Contact admin@mindnexus.ng for any privacy-related requests.</p>
            </Card>
          )}

        </div>
      </div>
    </div>
  )
}
