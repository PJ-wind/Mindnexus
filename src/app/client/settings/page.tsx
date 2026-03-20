'use client'
import { useState } from 'react'
import { useSession, signOut } from 'next-auth/react'
import { Card } from '@/components/ui'
import { User, Lock, Bell, Shield, Video, CreditCard, Trash2, Check, Palette, Database, Link2, Smartphone } from 'lucide-react'
import toast from 'react-hot-toast'

const TABS = [
  { id: 'account',       label: 'Account',            icon: User },
  { id: 'security',      label: 'Security',            icon: Lock },
  { id: 'notifications', label: 'Notifications',       icon: Bell },
  { id: 'privacy',       label: 'Privacy',             icon: Shield },
  { id: 'appearance',    label: 'Appearance',          icon: Palette },
  { id: 'session',       label: 'Session preferences', icon: Video },
  { id: 'billing',       label: 'Billing',             icon: CreditCard },
  { id: 'data',          label: 'Data & storage',      icon: Database },
  { id: 'connected',     label: 'Connected accounts',  icon: Link2 },
  { id: 'danger',        label: 'Account actions',     icon: Trash2 },
]

function Toggle({ value, onChange }: { value: boolean; onChange: () => void }) {
  return (
    <button onClick={onChange}
      style={{ minWidth: '2.5rem', height: '1.375rem', background: value ? '#185FA5' : '#e5e7eb' }}
      className="flex-shrink-0 rounded-full transition-all relative">
      <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow-sm transition-transform duration-200 ${value ? 'translate-x-5' : 'translate-x-0.5'}`} />
    </button>
  )
}

export default function ClientSettingsPage() {
  const { data: session } = useSession()
  const user = session?.user as any

  const [tab, setTab]         = useState('account')
  const [saving, setSaving]   = useState(false)
  const [darkMode, setDarkMode] = useState(false)
  const [fontSize, setFontSize] = useState('medium')
  const [language, setLanguage] = useState('English')
  const [twoFA, setTwoFA]     = useState(false)

  const [name, setName]           = useState(user?.name ?? '')
  const [email, setEmail]         = useState(user?.email ?? '')
  const [phone, setPhone]         = useState('')
  const [dob, setDob]             = useState('')
  const [gender, setGender]       = useState('')
  const [location, setLocation]   = useState('')
  const [emergencyName, setEmergencyName] = useState('')
  const [emergencyPhone, setEmergencyPhone] = useState('')

  const [currentPw, setCurrentPw] = useState('')
  const [newPw, setNewPw]         = useState('')
  const [confirmPw, setConfirmPw] = useState('')

  const [emailNotif, setEmailNotif]     = useState(true)
  const [pushNotif, setPushNotif]       = useState(true)
  const [smsAlerts, setSmsAlerts]       = useState(true)
  const [inAppNotif, setInAppNotif]     = useState(true)
  const [reminder24h, setReminder24h]   = useState(true)
  const [reminder1h, setReminder1h]     = useState(true)
  const [newMessage, setNewMessage]     = useState(true)
  const [homeworkDue, setHomeworkDue]   = useState(true)
  const [moodReminder, setMoodReminder] = useState(true)
  const [newsletter, setNewsletter]     = useState(false)
  const [marketing, setMarketing]       = useState(false)

  const [shareProgress, setShareProgress]   = useState(true)
  const [shareMood, setShareMood]           = useState(true)
  const [allowAnon, setAllowAnon]           = useState(true)
  const [showOnline, setShowOnline]         = useState(true)
  const [profileVis, setProfileVis]         = useState('therapist')
  const [msgFrom, setMsgFrom]               = useState('therapist')

  const [sessType, setSessType]         = useState('VIDEO')
  const [sessDuration, setSessDuration] = useState('60')
  const [sessLang, setSessLang]         = useState('English')
  const [timezone, setTimezone]         = useState('Africa/Lagos')
  const [cameraOn, setCameraOn]         = useState(true)
  const [micOn, setMicOn]               = useState(true)

  async function save() {
    setSaving(true)
    await new Promise(r => setTimeout(r, 700))
    toast.success('Settings saved!')
    setSaving(false)
  }

  async function changePassword() {
    if (newPw !== confirmPw) { toast.error('Passwords do not match'); return }
    if (newPw.length < 8) { toast.error('Minimum 8 characters'); return }
    setSaving(true)
    await new Promise(r => setTimeout(r, 700))
    toast.success('Password updated!')
    setCurrentPw(''); setNewPw(''); setConfirmPw('')
    setSaving(false)
  }

  const initials = name ? name.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase() : 'U'

  return (
    <div className="p-6 max-w-4xl">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold">Settings</h1>
        <p className="text-gray-500 text-sm mt-0.5">Manage your account, security, preferences, and privacy.</p>
      </div>

      <div className="grid md:grid-cols-4 gap-6">
        {/* Sidebar */}
        <div className="card p-2 space-y-0.5 h-fit">
          {TABS.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)}
              className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm transition-colors text-left ${
                tab === t.id ? 'bg-brand-50 text-brand-600 font-medium'
                : t.id === 'danger' ? 'text-red-500 hover:bg-red-50'
                : 'text-gray-500 hover:bg-gray-50'}`}>
              <t.icon className="w-4 h-4 flex-shrink-0" />
              {t.label}
            </button>
          ))}
        </div>

        <div className="md:col-span-3 space-y-4">

          {/* ACCOUNT */}
          {tab === 'account' && (
            <Card>
              <h3 className="font-medium text-sm mb-4">Account settings</h3>
              <div className="flex items-center gap-4 mb-5 p-4 bg-gray-50 rounded-xl">
                <div className="w-16 h-16 bg-brand-500 rounded-full flex items-center justify-center text-white text-xl font-semibold flex-shrink-0">
                  {initials}
                </div>
                <div>
                  <div className="text-sm font-medium mb-1">Profile picture</div>
                  <div className="text-xs text-gray-400 mb-2">JPG or PNG. Max 5MB.</div>
                  <button className="btn-secondary text-xs py-1.5 px-3">Upload photo</button>
                </div>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Full name</label>
                  <input className="input text-sm" value={name} onChange={e => setName(e.target.value)} />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Email address</label>
                  <input type="email" className="input text-sm" value={email} onChange={e => setEmail(e.target.value)} />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Phone number</label>
                  <input type="tel" className="input text-sm" placeholder="+234 800 000 0000" value={phone} onChange={e => setPhone(e.target.value)} />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Date of birth</label>
                  <input type="date" className="input text-sm" value={dob} onChange={e => setDob(e.target.value)} />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Gender</label>
                  <select className="input text-sm" value={gender} onChange={e => setGender(e.target.value)}>
                    <option value="">Prefer not to say</option>
                    <option>Male</option>
                    <option>Female</option>
                    <option>Non-binary</option>
                    <option>Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">City / location</label>
                  <input className="input text-sm" placeholder="e.g. Lagos" value={location} onChange={e => setLocation(e.target.value)} />
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-gray-100">
                <div className="text-xs font-medium text-gray-600 mb-3">Emergency contact</div>
                <div className="grid md:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Contact name</label>
                    <input className="input text-sm" placeholder="Full name" value={emergencyName} onChange={e => setEmergencyName(e.target.value)} />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Contact phone</label>
                    <input type="tel" className="input text-sm" placeholder="+234 800 000 0000" value={emergencyPhone} onChange={e => setEmergencyPhone(e.target.value)} />
                  </div>
                </div>
              </div>
              <button onClick={save} disabled={saving} className="btn-primary mt-4 py-2 px-6 flex items-center gap-2">
                {saving ? 'Saving...' : <><Check className="w-3.5 h-3.5" /> Save changes</>}
              </button>
            </Card>
          )}

          {/* SECURITY */}
          {tab === 'security' && (
            <div className="space-y-4">
              <Card>
                <h3 className="font-medium text-sm mb-4">Change password</h3>
                <div className="space-y-3 max-w-sm">
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Current password</label>
                    <input type="password" className="input text-sm" value={currentPw} onChange={e => setCurrentPw(e.target.value)} />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">New password</label>
                    <input type="password" className="input text-sm" placeholder="At least 8 characters" value={newPw} onChange={e => setNewPw(e.target.value)} />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Confirm new password</label>
                    <input type="password" className="input text-sm" value={confirmPw} onChange={e => setConfirmPw(e.target.value)} />
                  </div>
                  <button onClick={changePassword} disabled={saving || !currentPw || !newPw} className="btn-primary py-2 px-6 disabled:opacity-40">
                    {saving ? 'Updating...' : 'Update password'}
                  </button>
                </div>
              </Card>
              <Card>
                <h3 className="font-medium text-sm mb-3">Two-factor authentication</h3>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                  <div>
                    <div className="text-sm font-medium">Authenticator app</div>
                    <div className="text-xs text-gray-400">Use Google Authenticator or Authy</div>
                  </div>
                  <Toggle value={twoFA} onChange={() => { setTwoFA(!twoFA); toast.success(twoFA ? '2FA disabled' : '2FA enabled') }} />
                </div>
              </Card>
              <Card>
                <h3 className="font-medium text-sm mb-3">Login activity</h3>
                <div className="space-y-2">
                  <div className="flex items-center gap-3 p-3 rounded-xl border border-green-200 bg-green-50">
                    <Smartphone className="w-4 h-4 text-green-500 flex-shrink-0" />
                    <div className="flex-1">
                      <div className="text-xs font-medium">Chrome · Windows PC</div>
                      <div className="text-[10px] text-gray-400">Lagos, Nigeria · Now — current session</div>
                    </div>
                    <span className="badge badge-green text-[10px]">Current</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 rounded-xl border border-gray-100 bg-gray-50">
                    <Smartphone className="w-4 h-4 text-gray-400 flex-shrink-0" />
                    <div className="flex-1">
                      <div className="text-xs font-medium">Safari · iPhone</div>
                      <div className="text-[10px] text-gray-400">Lagos, Nigeria · 2 days ago</div>
                    </div>
                    <button onClick={() => toast.success('Session ended')} className="text-[10px] text-red-500 hover:underline">End</button>
                  </div>
                </div>
              </Card>
            </div>
          )}

          {/* NOTIFICATIONS */}
          {tab === 'notifications' && (
            <Card>
              <h3 className="font-medium text-sm mb-4">Notification settings</h3>
              <div className="space-y-1">
                <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider py-2">Channels</div>
                {[
                  { label: 'Email notifications',  value: emailNotif,   set: setEmailNotif },
                  { label: 'Push notifications',   value: pushNotif,    set: setPushNotif },
                  { label: 'SMS alerts',           value: smsAlerts,    set: setSmsAlerts },
                  { label: 'In-app notifications', value: inAppNotif,   set: setInAppNotif },
                ].map(item => (
                  <div key={item.label} className="flex items-center justify-between py-2.5 border-b border-gray-50">
                    <span className="text-sm font-medium">{item.label}</span>
                    <Toggle value={item.value} onChange={() => item.set(!item.value)} />
                  </div>
                ))}
                <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider py-2 pt-4">Session alerts</div>
                {[
                  { label: '24-hour session reminder', value: reminder24h,   set: setReminder24h },
                  { label: '1-hour session reminder',  value: reminder1h,    set: setReminder1h },
                  { label: 'New therapist messages',   value: newMessage,    set: setNewMessage },
                  { label: 'Homework due reminders',   value: homeworkDue,   set: setHomeworkDue },
                  { label: 'Daily mood check-in',      value: moodReminder,  set: setMoodReminder },
                ].map(item => (
                  <div key={item.label} className="flex items-center justify-between py-2.5 border-b border-gray-50 last:border-0">
                    <span className="text-sm font-medium">{item.label}</span>
                    <Toggle value={item.value} onChange={() => item.set(!item.value)} />
                  </div>
                ))}
                <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider py-2 pt-4">Marketing</div>
                {[
                  { label: 'Mental health newsletter', value: newsletter, set: setNewsletter },
                  { label: 'Promotional emails',       value: marketing,  set: setMarketing },
                ].map(item => (
                  <div key={item.label} className="flex items-center justify-between py-2.5 border-b border-gray-50 last:border-0">
                    <span className="text-sm font-medium">{item.label}</span>
                    <Toggle value={item.value} onChange={() => item.set(!item.value)} />
                  </div>
                ))}
              </div>
              <button onClick={save} disabled={saving} className="btn-primary mt-4 py-2 px-6">
                {saving ? 'Saving...' : 'Save notification settings'}
              </button>
            </Card>
          )}

          {/* PRIVACY */}
          {tab === 'privacy' && (
            <div className="space-y-4">
              <Card>
                <h3 className="font-medium text-sm mb-4">Privacy settings</h3>
                <div className="grid md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Who can see my profile</label>
                    <select className="input text-sm" value={profileVis} onChange={e => setProfileVis(e.target.value)}>
                      <option value="therapist">My therapist only</option>
                      <option value="team">MindNexus team</option>
                      <option value="private">Private</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Who can message me</label>
                    <select className="input text-sm" value={msgFrom} onChange={e => setMsgFrom(e.target.value)}>
                      <option value="therapist">My therapist only</option>
                      <option value="team">MindNexus team only</option>
                      <option value="nobody">Nobody</option>
                    </select>
                  </div>
                </div>
                {[
                  { label: 'Share therapy progress with therapist', desc: 'Your therapist can see session history and progress.',     value: shareProgress, set: setShareProgress },
                  { label: 'Share mood journal with therapist',     desc: 'Your therapist can view your daily mood entries.',         value: shareMood,     set: setShareMood },
                  { label: 'Contribute anonymous data to research', desc: 'Help improve MindNexus. No personal info shared.',        value: allowAnon,     set: setAllowAnon },
                  { label: 'Show online status',                    desc: 'Let your therapist see when you are active.',              value: showOnline,    set: setShowOnline },
                ].map(item => (
                  <div key={item.label} className="flex items-start justify-between gap-4 py-2.5 border-b border-gray-50 last:border-0">
                    <div>
                      <div className="text-sm font-medium">{item.label}</div>
                      <div className="text-xs text-gray-400 mt-0.5">{item.desc}</div>
                    </div>
                    <Toggle value={item.value} onChange={() => item.set(!item.value)} />
                  </div>
                ))}
                <button onClick={save} disabled={saving} className="btn-primary mt-4 py-2 px-6">
                  {saving ? 'Saving...' : 'Save privacy settings'}
                </button>
              </Card>
              <div className="card bg-brand-50 border-brand-100">
                <p className="text-xs text-brand-700 leading-relaxed">
                  <strong>MindNexus confidentiality commitment:</strong> All session content is strictly confidential. We comply with CASSON ethical guidelines. Information is only shared if legally required to protect life.
                </p>
              </div>
            </div>
          )}

          {/* APPEARANCE */}
          {tab === 'appearance' && (
            <Card>
              <h3 className="font-medium text-sm mb-5">Appearance & display</h3>
              <div className="space-y-5">
                <div>
                  <div className="text-xs font-medium text-gray-600 mb-3">Theme</div>
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { id: 'light', label: 'Light',          bg: 'bg-white' },
                      { id: 'dark',  label: 'Dark',           bg: 'bg-gray-900' },
                      { id: 'auto',  label: 'System default', bg: 'bg-gradient-to-br from-white to-gray-900' },
                    ].map(t => (
                      <button key={t.id}
                        onClick={() => { setDarkMode(t.id === 'dark'); toast.success(`${t.label} mode set`) }}
                        className={`p-4 rounded-xl border-2 text-center transition-all ${darkMode && t.id === 'dark' ? 'border-brand-500' : !darkMode && t.id === 'light' ? 'border-brand-500' : 'border-gray-200 hover:border-gray-300'}`}>
                        <div className={`w-full h-10 rounded-lg mb-2 border border-gray-200 ${t.bg}`} />
                        <div className="text-xs font-medium">{t.label}</div>
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <div className="text-xs font-medium text-gray-600 mb-3">Font size</div>
                  <div className="flex gap-2">
                    {['small', 'medium', 'large'].map(size => (
                      <button key={size} onClick={() => setFontSize(size)}
                        className={`px-4 py-2 rounded-lg border text-sm font-medium capitalize transition-all ${fontSize === size ? 'border-brand-500 bg-brand-50 text-brand-600' : 'border-gray-200 text-gray-500 hover:border-gray-300'}`}>
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <div className="text-xs font-medium text-gray-600 mb-2">Language</div>
                  <select className="input text-sm max-w-xs" value={language} onChange={e => setLanguage(e.target.value)}>
                    <option>English</option>
                    <option>Yoruba</option>
                    <option>Igbo</option>
                    <option>Hausa</option>
                    <option>French</option>
                  </select>
                </div>
              </div>
              <button onClick={save} disabled={saving} className="btn-primary mt-5 py-2 px-6">
                {saving ? 'Saving...' : 'Save appearance settings'}
              </button>
            </Card>
          )}

          {/* SESSION PREFERENCES */}
          {tab === 'session' && (
            <Card>
              <h3 className="font-medium text-sm mb-4">Session preferences</h3>
              <div className="grid md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Preferred session type</label>
                  <select className="input text-sm" value={sessType} onChange={e => setSessType(e.target.value)}>
                    <option value="VIDEO">Video call</option>
                    <option value="VOICE">Voice call</option>
                    <option value="CHAT">Text / chat</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Preferred duration</label>
                  <select className="input text-sm" value={sessDuration} onChange={e => setSessDuration(e.target.value)}>
                    <option value="30">30 minutes</option>
                    <option value="60">60 minutes</option>
                    <option value="90">90 minutes</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Session language</label>
                  <select className="input text-sm" value={sessLang} onChange={e => setSessLang(e.target.value)}>
                    <option value="English">English</option>
                    <option value="Yoruba">Yoruba</option>
                    <option value="Igbo">Igbo</option>
                    <option value="Hausa">Hausa</option>
                    <option value="Pidgin">Pidgin</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Your timezone</label>
                  <select className="input text-sm" value={timezone} onChange={e => setTimezone(e.target.value)}>
                    <option value="Africa/Lagos">Lagos (WAT, UTC+1)</option>
                    <option value="Europe/London">London</option>
                    <option value="America/New_York">New York</option>
                  </select>
                </div>
              </div>
              <div className="pt-4 border-t border-gray-100 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm font-medium">Camera on by default</div>
                    <div className="text-xs text-gray-400">Start video sessions with camera enabled</div>
                  </div>
                  <Toggle value={cameraOn} onChange={() => setCameraOn(!cameraOn)} />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm font-medium">Microphone on by default</div>
                    <div className="text-xs text-gray-400">Start with microphone unmuted</div>
                  </div>
                  <Toggle value={micOn} onChange={() => setMicOn(!micOn)} />
                </div>
              </div>
              <button onClick={save} disabled={saving} className="btn-primary mt-4 py-2 px-6">
                {saving ? 'Saving...' : 'Save preferences'}
              </button>
            </Card>
          )}

          {/* BILLING */}
          {tab === 'billing' && (
            <div className="space-y-4">
              <Card>
                <h3 className="font-medium text-sm mb-4">Subscription plan</h3>
                <div className="bg-brand-50 border border-brand-100 rounded-xl p-4 mb-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-sm font-semibold text-brand-700">Free plan</div>
                      <div className="text-xs text-brand-600 mt-0.5">AI companion, mood tracker, library</div>
                    </div>
                    <span className="badge badge-green">Active</span>
                  </div>
                </div>
                <div className="grid md:grid-cols-2 gap-3">
                  {[
                    { name: 'Standard', price: '₦15,000/mo', features: ['4 therapy sessions/month', 'Unlimited messaging', 'Session notes & homework', 'Progress tracking'] },
                    { name: 'Premium',  price: '₦28,000/mo', features: ['Unlimited sessions', 'Psychiatric consultation', 'Priority matching', 'Dedicated case manager'] },
                  ].map(plan => (
                    <div key={plan.name} className="border border-gray-200 rounded-xl p-4">
                      <div className="flex justify-between mb-2">
                        <div className="font-medium text-sm">{plan.name}</div>
                        <div className="text-sm font-semibold text-brand-500">{plan.price}</div>
                      </div>
                      <ul className="space-y-1 mb-3">
                        {plan.features.map(f => (
                          <li key={f} className="flex items-center gap-1.5 text-xs text-gray-500">
                            <Check className="w-3 h-3 text-green-500 flex-shrink-0" />{f}
                          </li>
                        ))}
                      </ul>
                      <button className="btn-primary w-full py-1.5 text-xs">Upgrade to {plan.name}</button>
                    </div>
                  ))}
                </div>
              </Card>
              <Card>
                <h3 className="font-medium text-sm mb-3">Payment methods</h3>
                <div className="p-4 border border-gray-200 rounded-xl bg-gray-50 text-center">
                  <p className="text-sm text-gray-500 mb-3">No payment method saved yet.</p>
                  <button onClick={() => toast.success('Payment gateway coming soon!')} className="btn-primary py-2 px-4 text-sm">
                    + Add payment method
                  </button>
                </div>
              </Card>
            </div>
          )}

          {/* DATA */}
          {tab === 'data' && (
            <div className="space-y-4">
              <Card>
                <h3 className="font-medium text-sm mb-4">Data & storage</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-200">
                    <div>
                      <div className="text-sm font-medium">Download your data</div>
                      <div className="text-xs text-gray-400 mt-0.5">Export all your account data including mood entries and messages.</div>
                    </div>
                    <button onClick={() => toast.success('Data export requested. You will receive an email within 24 hours.')}
                      className="btn-secondary text-xs py-1.5 px-4 flex-shrink-0">Request export</button>
                  </div>
                </div>
              </Card>
              <Card>
                <h3 className="font-medium text-sm mb-3">Storage usage</h3>
                <div className="space-y-2">
                  {[['Mood journal entries', '2.1 MB'], ['Session notes', '0.8 MB'], ['Messages', '1.2 MB'], ['Other data', '0.3 MB']].map(([k, v]) => (
                    <div key={k} className="flex justify-between text-sm py-1.5 border-b border-gray-50 last:border-0">
                      <span className="text-gray-500">{k}</span>
                      <span className="font-medium">{v}</span>
                    </div>
                  ))}
                  <div className="flex justify-between text-sm font-semibold pt-2">
                    <span>Total used</span>
                    <span className="text-brand-500">4.4 MB</span>
                  </div>
                </div>
              </Card>
            </div>
          )}

          {/* CONNECTED */}
          {tab === 'connected' && (
            <Card>
              <h3 className="font-medium text-sm mb-4">Connected accounts</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-4 p-4 border border-gray-200 rounded-xl">
                  <div className="w-10 h-10 rounded-full bg-red-50 text-red-600 flex items-center justify-center font-bold text-sm flex-shrink-0">G</div>
                  <div className="flex-1">
                    <div className="text-sm font-medium">Google</div>
                    <div className="text-xs text-gray-400">Sign in with your Google account</div>
                  </div>
                  <button onClick={() => toast.success('Google integration coming soon!')}
                    className="text-xs px-4 py-1.5 rounded-lg border border-brand-200 text-brand-600 hover:bg-brand-50 font-medium transition-colors">
                    Connect
                  </button>
                </div>
                <div className="flex items-center gap-4 p-4 border border-gray-200 rounded-xl">
                  <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-sm flex-shrink-0">f</div>
                  <div className="flex-1">
                    <div className="text-sm font-medium">Facebook</div>
                    <div className="text-xs text-gray-400">Sign in with your Facebook account</div>
                  </div>
                  <button onClick={() => toast.success('Facebook integration coming soon!')}
                    className="text-xs px-4 py-1.5 rounded-lg border border-brand-200 text-brand-600 hover:bg-brand-50 font-medium transition-colors">
                    Connect
                  </button>
                </div>
              </div>
            </Card>
          )}

          {/* DANGER */}
          {tab === 'danger' && (
            <div className="space-y-4">
              <Card>
                <h3 className="font-medium text-sm mb-4">Account actions</h3>
                <div className="space-y-3">
                  <div className="p-4 bg-gray-50 border border-gray-200 rounded-xl flex items-center justify-between">
                    <div>
                      <div className="text-sm font-medium">Sign out</div>
                      <div className="text-xs text-gray-400">Sign out of your MindNexus account on this device.</div>
                    </div>
                    <button onClick={() => signOut({ callbackUrl: '/' })} className="btn-secondary text-xs py-1.5 px-4 flex-shrink-0">
                      Sign out
                    </button>
                  </div>
                  <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl">
                    <div className="text-sm font-medium text-amber-700 mb-1">Deactivate account</div>
                    <p className="text-xs text-amber-600 mb-3">Temporarily deactivate your account. Your data is preserved.</p>
                    <button onClick={() => toast.error('Contact support@mindnexus.ng to deactivate.')}
                      className="text-xs px-4 py-2 bg-amber-100 hover:bg-amber-200 text-amber-700 rounded-lg border border-amber-200">
                      Deactivate account
                    </button>
                  </div>
                  <div className="p-4 bg-red-50 border border-red-200 rounded-xl">
                    <div className="text-sm font-medium text-red-700 mb-1">Delete account permanently</div>
                    <p className="text-xs text-red-600 mb-3 leading-relaxed">Permanently delete your account and all data. <strong>This cannot be undone.</strong></p>
                    <button onClick={() => toast.error('Contact support@mindnexus.ng to request account deletion.')}
                      className="text-xs px-4 py-2 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg border border-red-200">
                      Request deletion
                    </button>
                  </div>
                </div>
              </Card>
            </div>
          )}

        </div>
      </div>
    </div>
  )
}
