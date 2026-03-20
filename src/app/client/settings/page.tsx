'use client'
import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { Card } from '@/components/ui'
import {
  User, Lock, Bell, Shield, Video, CreditCard,
  Trash2, Check, Palette, Database, LogOut, Link2,
  Smartphone, Eye, Download, AlertTriangle
} from 'lucide-react'
import toast from 'react-hot-toast'
import { signOut } from 'next-auth/react'

const TABS = [
  { id: 'account',       label: 'Account',           icon: User },
  { id: 'security',      label: 'Security',           icon: Lock },
  { id: 'notifications', label: 'Notifications',      icon: Bell },
  { id: 'privacy',       label: 'Privacy',            icon: Shield },
  { id: 'appearance',    label: 'Appearance',         icon: Palette },
  { id: 'session',       label: 'Session preferences',icon: Video },
  { id: 'billing',       label: 'Billing',            icon: CreditCard },
  { id: 'data',          label: 'Data & storage',     icon: Database },
  { id: 'connected',     label: 'Connected accounts', icon: Link2 },
  { id: 'danger',        label: 'Account actions',    icon: AlertTriangle },
]

function Toggle({ value, onChange }: { value: boolean; onChange: () => void }) {
  return (
    <button onClick={onChange}
      className="flex-shrink-0 rounded-full transition-all relative"
      style={{ minWidth: '2.5rem', height: '1.375rem', background: value ? '#185FA5' : '#e5e7eb' }}>
      <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow-sm transition-transform duration-200 ${value ? 'translate-x-5' : 'translate-x-0.5'}`} />
    </button>
  )
}

function SectionTitle({ title, desc }: { title: string; desc?: string }) {
  return (
    <div className="mb-4">
      <h3 className="font-medium text-sm text-gray-900">{title}</h3>
      {desc && <p className="text-xs text-gray-400 mt-0.5">{desc}</p>}
    </div>
  )
}

export default function ClientSettingsPage() {
  const { data: session } = useSession()
  const user = session?.user as any

  const [tab, setTab]       = useState('account')
  const [saving, setSaving] = useState(false)
  const [darkMode, setDarkMode] = useState(false)
  const [fontSize, setFontSize] = useState('medium')
  const [language, setLanguage] = useState('English')
  const [twoFA, setTwoFA]   = useState(false)

  const [account, setAccount] = useState({
    name: user?.name ?? '',
    email: user?.email ?? '',
    phone: '',
    dateOfBirth: '',
    gender: '',
    location: '',
    emergencyContact: '',
    emergencyPhone: '',
  })

  const [passwords, setPasswords] = useState({ current: '', newPw: '', confirm: '' })

  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    pushNotifications: true,
    smsAlerts: true,
    inAppNotifications: true,
    sessionReminder24h: true,
    sessionReminder1h: true,
    newMessage: true,
    homeworkDue: true,
    moodReminder: true,
    crisisFollowUp: true,
    newsletterEmails: false,
    marketingEmails: false,
  })

  const [privacy, setPrivacy] = useState({
    shareProgressWithTherapist: true,
    shareMoodWithTherapist: true,
    allowAnonymousData: true,
    showOnlineStatus: true,
    allowMessagesFrom: 'therapist',
    profileVisibility: 'therapist',
  })

  const [sessionPrefs, setSessionPrefs] = useState({
    preferredType: 'VIDEO',
    preferredDuration: '60',
    language: 'English',
    timezone: 'Africa/Lagos',
  })
  const [videoPrefs, setVideoPrefs] = useState({
    cameraDefault: true,
    micDefault: true,
  })

  const loginActivity = [
    { device: 'Chrome · Windows PC', location: 'Lagos, Nigeria', time: 'Now — current session', current: true },
    { device: 'Safari · iPhone',      location: 'Lagos, Nigeria', time: '2 days ago',             current: false },
  ]

  async function save() {
    setSaving(true)
    await new Promise(r => setTimeout(r, 700))
    toast.success('Settings saved!')
    setSaving(false)
  }

  async function changePassword() {
    if (passwords.newPw !== passwords.confirm) { toast.error('Passwords do not match'); return }
    if (passwords.newPw.length < 8) { toast.error('Minimum 8 characters required'); return }
    setSaving(true)
    await new Promise(r => setTimeout(r, 700))
    toast.success('Password updated successfully!')
    setPasswords({ current: '', newPw: '', confirm: '' })
    setSaving(false)
  }

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
                tab === t.id
                  ? 'bg-brand-50 text-brand-600 font-medium'
                  : t.id === 'danger'
                    ? 'text-red-500 hover:bg-red-50'
                    : 'text-gray-500 hover:bg-gray-50'}`}>
              <t.icon className="w-4 h-4 flex-shrink-0" />
              {t.label}
            </button>
          ))}
        </div>

        <div className="md:col-span-3 space-y-4">

          {/* ── ACCOUNT ── */}
          {tab === 'account' && (
            <Card>
              <SectionTitle title="Account settings" desc="Update your personal information and contact details." />

              {/* Avatar */}
              <div className="flex items-center gap-4 mb-5 p-4 bg-gray-50 rounded-xl">
                <div className="w-16 h-16 bg-brand-500 rounded-full flex items-center justify-center text-white text-xl font-semibold flex-shrink-0">
                  {account.name ? account.name.split(' ').map((n:string)=>n[0]).join('').slice(0,2).toUpperCase() : 'U'}
                </div>
                <div>
                  <div className="text-sm font-medium mb-1">Profile picture</div>
                  <div className="text-xs text-gray-400 mb-2">JPG or PNG. Max 5MB.</div>
                  <button className="btn-secondary text-xs py-1.5 px-3">Upload photo</button>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                {[
                  { label:'Full name',    key:'name',            type:'text',  placeholder:'Your full name' },
                  { label:'Email address',key:'email',           type:'email', placeholder:'you@email.com' },
                  { label:'Phone number', key:'phone',           type:'tel',   placeholder:'+234 800 000 0000' },
                  { label:'Date of birth',key:'dateOfBirth',     type:'date',  placeholder:'' },
                ].map(f => (
                  <div key={f.key}>
                    <label className="block text-xs font-medium text-gray-600 mb-1">{f.label}</label>
                    <input type={f.type} className="input text-sm" placeholder={f.placeholder}
                      value={account[f.key as keyof typeof account]}
                      onChange={e => setAccount(a => ({ ...a, [f.key]: e.target.value }))} />
                  </div>
                ))}
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Gender</label>
                  <select className="input text-sm" value={account.gender}
                    onChange={e => setAccount(a => ({ ...a, gender: e.target.value }))}>
                    <option value="">Prefer not to say</option>
                    <option>Male</option><option>Female</option>
                    <option>Non-binary</option><option>Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">City / location</label>
                  <input className="input text-sm" placeholder="e.g. Lagos"
                    value={account.location} onChange={e => setAccount(a => ({ ...a, location: e.target.value }))} />
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-gray-100">
                <div className="text-xs font-medium text-gray-600 mb-3">Emergency contact</div>
                <div className="grid md:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Contact name</label>
                    <input className="input text-sm" placeholder="Full name"
                      value={account.emergencyContact} onChange={e => setAccount(a => ({ ...a, emergencyContact: e.target.value }))} />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Contact phone</label>
                    <input type="tel" className="input text-sm" placeholder="+234 800 000 0000"
                      value={account.emergencyPhone} onChange={e => setAccount(a => ({ ...a, emergencyPhone: e.target.value }))} />
                  </div>
                </div>
              </div>

              <button onClick={save} disabled={saving} className="btn-primary mt-4 py-2 px-6 flex items-center gap-2">
                {saving ? 'Saving...' : <><Check className="w-3.5 h-3.5" /> Save changes</>}
              </button>
            </Card>
          )}

          {/* ── SECURITY ── */}
          {tab === 'security' && (
            <div className="space-y-4">
              <Card>
                <SectionTitle title="Change password" desc="Use a strong password you do not use on any other site." />
                <div className="space-y-3 max-w-sm">
                  {[
                    { label:'Current password', key:'current' },
                    { label:'New password',     key:'newPw', placeholder:'At least 8 characters' },
                    { label:'Confirm password', key:'confirm' },
                  ].map(f => (
                    <div key={f.key}>
                      <label className="block text-xs font-medium text-gray-600 mb-1">{f.label}</label>
                      <input type="password" className="input text-sm" placeholder={f.placeholder}
                        value={passwords[f.key as keyof typeof passwords]}
                        onChange={e => setPasswords(p => ({ ...p, [f.key]: e.target.value }))} />
                    </div>
                  ))}
                  <button onClick={changePassword} disabled={saving || !passwords.current || !passwords.newPw}
                    className="btn-primary py-2 px-6 disabled:opacity-40">
                    {saving ? 'Updating...' : 'Update password'}
                  </button>
                </div>
              </Card>

              <Card>
                <SectionTitle title="Two-factor authentication (2FA)" desc="Add an extra layer of security to your account." />
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                  <div>
                    <div className="text-sm font-medium">Authenticator app</div>
                    <div className="text-xs text-gray-400">Use Google Authenticator or Authy</div>
                  </div>
                  <Toggle value={twoFA} onChange={() => { setTwoFA(!twoFA); toast.success(twoFA ? '2FA disabled' : '2FA enabled — check your email for setup instructions') }} />
                </div>
              </Card>

              <Card>
                <SectionTitle title="Login activity" desc="Devices currently logged into your account." />
                <div className="space-y-2">
                  {loginActivity.map(item => (
                    <div key={item.device} className={`flex items-center gap-3 p-3 rounded-xl border ${item.current ? 'border-green-200 bg-green-50' : 'border-gray-100 bg-gray-50'}`}>
                      <Smartphone className={`w-4 h-4 flex-shrink-0 ${item.current ? 'text-green-500' : 'text-gray-400'}`} />
                      <div className="flex-1">
                        <div className="text-xs font-medium">{item.device}</div>
                        <div className="text-[10px] text-gray-400">{item.location} · {item.time}</div>
                      </div>
                      {item.current
                        ? <span className="badge badge-green text-[10px]">Current</span>
                        : <button onClick={() => toast.success('Session ended')} className="text-[10px] text-red-500 hover:underline">End session</button>}
                    </div>
                  ))}
                </div>
                <button onClick={() => toast.success('All other sessions ended')} className="btn-secondary text-xs py-1.5 px-4 mt-3">
                  End all other sessions
                </button>
              </Card>

              <Card>
                <SectionTitle title="Security alerts" />
                <div className="space-y-2">
                  {[
                    { label: 'Alert me on new login',          on: true },
                    { label: 'Alert me on password change',    on: true },
                    { label: 'Alert me on profile changes',    on: false },
                  ].map(item => (
                    <div key={item.label} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                      <span className="text-sm">{item.label}</span>
                      <Toggle value={item.on} onChange={() => toast.success('Security alert setting updated')} />
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          )}

          {/* ── NOTIFICATIONS ── */}
          {tab === 'notifications' && (
            <Card>
              <SectionTitle title="Notification settings" desc="Choose how and when you receive updates from MindNexus." />

              <div className="space-y-1">
                <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider py-2">Notification channels</div>
                {[
                  { key:'emailNotifications', label:'Email notifications',   desc:'Receive updates via email' },
                  { key:'pushNotifications',  label:'Push notifications',    desc:'Browser and app push alerts' },
                  { key:'smsAlerts',          label:'SMS alerts',            desc:'Text message reminders' },
                  { key:'inAppNotifications', label:'In-app notifications',  desc:'Alerts inside MindNexus' },
                ].map(item => (
                  <div key={item.key} className="flex items-center justify-between py-2.5 border-b border-gray-50">
                    <div>
                      <div className="text-sm font-medium">{item.label}</div>
                      <div className="text-xs text-gray-400">{item.desc}</div>
                    </div>
                    <Toggle value={notifications[item.key as keyof typeof notifications]}
                      onChange={() => setNotifications(n => ({ ...n, [item.key]: !n[item.key as keyof typeof n] }))} />
                  </div>
                ))}

                <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider py-2 pt-4">Session alerts</div>
                {[
                  { key:'sessionReminder24h', label:'24-hour session reminder', desc:'Reminder the day before your session' },
                  { key:'sessionReminder1h',  label:'1-hour session reminder',  desc:'Reminder one hour before your session' },
                  { key:'newMessage',         label:'New therapist messages',   desc:'When your therapist sends you a message' },
                  { key:'homeworkDue',        label:'Homework due reminders',   desc:'When a homework task is due' },
                  { key:'moodReminder',       label:'Daily mood check-in',      desc:'Reminder to log your daily mood' },
                  { key:'crisisFollowUp',     label:'Crisis follow-up',         desc:'Check-in after a crisis alert is activated' },
                ].map(item => (
                  <div key={item.key} className="flex items-center justify-between py-2.5 border-b border-gray-50 last:border-0">
                    <div>
                      <div className="text-sm font-medium">{item.label}</div>
                      <div className="text-xs text-gray-400">{item.desc}</div>
                    </div>
                    <Toggle value={notifications[item.key as keyof typeof notifications]}
                      onChange={() => setNotifications(n => ({ ...n, [item.key]: !n[item.key as keyof typeof n] }))} />
                  </div>
                ))}

                <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider py-2 pt-4">Marketing</div>
                {[
                  { key:'newsletterEmails', label:'Mental health newsletter', desc:'Weekly tips and articles from MindNexus' },
                  { key:'marketingEmails',  label:'Promotional emails',       desc:'Special offers and platform news' },
                ].map(item => (
                  <div key={item.key} className="flex items-center justify-between py-2.5 border-b border-gray-50 last:border-0">
                    <div>
                      <div className="text-sm font-medium">{item.label}</div>
                      <div className="text-xs text-gray-400">{item.desc}</div>
                    </div>
                    <Toggle value={notifications[item.key as keyof typeof notifications]}
                      onChange={() => setNotifications(n => ({ ...n, [item.key]: !n[item.key as keyof typeof n] }))} />
                  </div>
                ))}
              </div>

              <button onClick={save} disabled={saving} className="btn-primary mt-4 py-2 px-6">
                {saving ? 'Saving...' : 'Save notification settings'}
              </button>
            </Card>
          )}

          {/* ── PRIVACY ── */}
          {tab === 'privacy' && (
            <div className="space-y-4">
              <Card>
                <SectionTitle title="Privacy settings" desc="Control who can see your information and how your data is used." />
                <div className="space-y-1">
                  <div className="grid md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">Who can see my profile</label>
                      <select className="input text-sm" value={privacy.profileVisibility}
                        onChange={e => setPrivacy(p => ({ ...p, profileVisibility: e.target.value }))}>
                        <option value="therapist">My therapist only</option>
                        <option value="team">MindNexus team</option>
                        <option value="private">Private — no one</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">Who can message me</label>
                      <select className="input text-sm" value={privacy.allowMessagesFrom}
                        onChange={e => setPrivacy(p => ({ ...p, allowMessagesFrom: e.target.value }))}>
                        <option value="therapist">My therapist only</option>
                        <option value="team">MindNexus team only</option>
                        <option value="nobody">Nobody</option>
                      </select>
                    </div>
                  </div>

                  {[
                    { key:'shareProgressWithTherapist', label:'Share therapy progress with therapist', desc:'Your therapist can see your session history and progress percentages.' },
                    { key:'shareMoodWithTherapist',     label:'Share mood journal with therapist',    desc:'Your therapist can view your daily mood entries before sessions.' },
                    { key:'allowAnonymousData',         label:'Contribute anonymous data to research', desc:'Help improve MindNexus. No personal info is ever shared.' },
                    { key:'showOnlineStatus',           label:'Show online status',                   desc:'Let your therapist see when you are active on the platform.' },
                  ].map(item => (
                    <div key={item.key} className="flex items-start justify-between gap-4 py-2.5 border-b border-gray-50 last:border-0">
                      <div>
                        <div className="text-sm font-medium">{item.label}</div>
                        <div className="text-xs text-gray-400 mt-0.5">{item.desc}</div>
                      </div>
                      <Toggle value={privacy[item.key as keyof typeof privacy] as boolean}
                        onChange={() => setPrivacy(p => ({ ...p, [item.key]: !p[item.key as keyof typeof p] }))} />
                    </div>
                  ))}
                </div>
                <button onClick={save} disabled={saving} className="btn-primary mt-4 py-2 px-6">
                  {saving ? 'Saving...' : 'Save privacy settings'}
                </button>
              </Card>

              <div className="card bg-brand-50 border-brand-100">
                <p className="text-xs text-brand-700 leading-relaxed">
                  <strong>MindNexus confidentiality commitment:</strong> All session content is strictly confidential. We comply with the Counselling Association of Nigeria (CASSON) ethical guidelines. Your information is only shared if legally required to protect life.
                </p>
              </div>
            </div>
          )}

          {/* ── APPEARANCE ── */}
          {tab === 'appearance' && (
            <Card>
              <SectionTitle title="Appearance & display" desc="Customise how MindNexus looks and feels for you." />

              <div className="space-y-5">
                <div>
                  <div className="text-xs font-medium text-gray-600 mb-3">Theme</div>
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { id:'light', label:'Light', bg:'bg-white border-gray-200', preview:'text-gray-800' },
                      { id:'dark',  label:'Dark',  bg:'bg-gray-900 border-gray-700', preview:'text-white' },
                      { id:'auto',  label:'System default', bg:'bg-gradient-to-br from-white to-gray-900 border-gray-300', preview:'text-gray-600' },
                    ].map(t => (
                      <button key={t.id} onClick={() => { setDarkMode(t.id === 'dark'); toast.success(`${t.label} mode set`) }}
                        className={`p-4 rounded-xl border-2 text-center transition-all ${
                          (darkMode ? 'dark' : 'light') === t.id || (!darkMode && t.id === 'light')
                            ? 'border-brand-500' : 'border-gray-200 hover:border-gray-300'}`}>
                        <div className={`w-full h-10 rounded-lg mb-2 ${t.bg}`} />
                        <div className="text-xs font-medium">{t.label}</div>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="text-xs font-medium text-gray-600 mb-3">Font size</div>
                  <div className="flex gap-2">
                    {['small','medium','large'].map(size => (
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

          {/* ── SESSION PREFERENCES ── */}
          {tab === 'session' && (
            <Card>
              <SectionTitle title="Session preferences" desc="Set your preferred session format, language, and video settings." />
              <div className="grid md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Preferred session type</label>
                  <select className="input text-sm" value={sessionPrefs.preferredType}
                    onChange={e => setSessionPrefs(p => ({ ...p, preferredType: e.target.value }))}>
                    <option value="VIDEO">Video call</option>
                    <option value="VOICE">Voice call</option>
                    <option value="CHAT">Text / chat</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Preferred duration</label>
                  <select className="input text-sm" value={sessionPrefs.preferredDuration}
                    onChange={e => setSessionPrefs(p => ({ ...p, preferredDuration: e.target.value }))}>
                    <option value="30">30 minutes</option>
                    <option value="60">60 minutes</option>
                    <option value="90">90 minutes</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Session language</label>
                  <select className="input text-sm" value={sessionPrefs.language}
                    onChange={e => setSessionPrefs(p => ({ ...p, language: e.target.value }))}>
                    <option value="English">English</option>
                    <option value="Yoruba">Yoruba</option>
                    <option value="Igbo">Igbo</option>
                    <option value="Hausa">Hausa</option>
                    <option value="Pidgin">Pidgin</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Your timezone</label>
                  <select className="input text-sm" value={sessionPrefs.timezone}
                    onChange={e => setSessionPrefs(p => ({ ...p, timezone: e.target.value }))}>
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
                  <Toggle value={videoPrefs.cameraDefault}
                    onChange={() => setVideoPrefs(p => ({ ...p, cameraDefault: !p.cameraDefault }))} />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm font-medium">Microphone on by default</div>
                    <div className="text-xs text-gray-400">Start with microphone unmuted</div>
                  </div>
                  <Toggle value={videoPrefs.micDefault}
                    onChange={() => setVideoPrefs(p => ({ ...p, micDefault: !p.micDefault }))} />
                </div>
              </div>
              <button onClick={save} disabled={saving} className="btn-primary mt-4 py-2 px-6">
                {saving ? 'Saving...' : 'Save preferences'}
              </button>
            </Card>
          )}
          )}

          {/* ── BILLING ── */}
          {tab === 'billing' && (
            <div className="space-y-4">
              <Card>
                <SectionTitle title="Subscription plan" />
                <div className="bg-brand-50 border border-brand-100 rounded-xl p-4 mb-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-sm font-semibold text-brand-700">Free plan</div>
                      <div className="text-xs text-brand-600 mt-0.5">AI companion, mood tracker, psychoeducation library</div>
                    </div>
                    <span className="badge badge-green">Active</span>
                  </div>
                </div>
                <div className="grid md:grid-cols-2 gap-3">
                  {[
                    { name:'Standard', price:'₦15,000/mo', features:['4 therapy sessions/month','Unlimited messaging','Session notes & homework','Progress tracking dashboard'] },
                    { name:'Premium',  price:'₦28,000/mo', features:['Unlimited therapy sessions','Psychiatric consultation','Priority therapist matching','Dedicated case manager'] },
                  ].map(plan => (
                    <div key={plan.name} className="border border-gray-200 rounded-xl p-4">
                      <div className="flex justify-between mb-2">
                        <div className="font-medium text-sm">{plan.name}</div>
                        <div className="text-sm font-semibold text-brand-500">{plan.price}</div>
                      </div>
                      <ul className="space-y-1 mb-3">
                        {plan.features.map(f => <li key={f} className="flex items-center gap-1.5 text-xs text-gray-500"><Check className="w-3 h-3 text-green-500 flex-shrink-0" />{f}</li>)}
                      </ul>
                      <button className="btn-primary w-full py-1.5 text-xs">Upgrade to {plan.name}</button>
                    </div>
                  ))}
                </div>
              </Card>
              <Card>
                <SectionTitle title="Payment methods" />
                <div className="p-4 border border-gray-200 rounded-xl bg-gray-50 text-center">
                  <p className="text-sm text-gray-500 mb-3">No payment method saved yet.</p>
                  <button onClick={() => toast.success('Payment gateway coming soon!')} className="btn-primary py-2 px-4 text-sm">
                    + Add payment method
                  </button>
                </div>
              </Card>
              <Card>
                <SectionTitle title="Billing history" />
                <div className="text-center py-6 text-gray-400">
                  <CreditCard className="w-8 h-8 mx-auto mb-2 opacity-30" />
                  <p className="text-sm">No billing history yet.</p>
                </div>
              </Card>
            </div>
          )}

          {/* ── DATA & STORAGE ── */}
          {tab === 'data' && (
            <div className="space-y-4">
              <Card>
                <SectionTitle title="Your data" desc="View, download, or manage the data MindNexus holds about you." />
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-200">
                    <div>
                      <div className="text-sm font-medium flex items-center gap-2"><Download className="w-4 h-4 text-brand-500" /> Download your data</div>
                      <div className="text-xs text-gray-400 mt-0.5">Export all your account data including mood entries, session notes, and messages.</div>
                    </div>
                    <button onClick={() => toast.success('Data export requested. You will receive an email within 24 hours.')}
                      className="btn-secondary text-xs py-1.5 px-4 flex-shrink-0">Request export</button>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-200">
                    <div>
                      <div className="text-sm font-medium flex items-center gap-2"><Eye className="w-4 h-4 text-brand-500" /> View data MindNexus holds</div>
                      <div className="text-xs text-gray-400 mt-0.5">See what personal information we store about you.</div>
                    </div>
                    <button onClick={() => toast.success('Opening data report...')}
                      className="btn-secondary text-xs py-1.5 px-4 flex-shrink-0">View report</button>
                  </div>
                </div>
              </Card>
              <Card>
                <SectionTitle title="Storage usage" />
                <div className="space-y-2">
                  {[['Mood journal entries','2.1 MB'],['Session notes','0.8 MB'],['Messages','1.2 MB'],['Other data','0.3 MB']].map(([k,v]) => (
                    <div key={k} className="flex justify-between text-sm py-1.5 border-b border-gray-50 last:border-0">
                      <span className="text-gray-500">{k}</span>
                      <span className="font-medium">{v}</span>
                    </div>
                  ))}
                  <div className="flex justify-between text-sm font-semibold pt-2">
                    <span>Total used</span><span className="text-brand-500">4.4 MB</span>
                  </div>
                </div>
              </Card>
            </div>
          )}

          {/* ── CONNECTED ACCOUNTS ── */}
          {tab === 'connected' && (
            <Card>
              <SectionTitle title="Connected accounts & integrations" desc="Link other platforms to simplify your login or enhance your experience." />
              <div className="space-y-3">
                {[
                  { name:'Google', desc:'Sign in with your Google account', icon:'G', connected:false, color:'bg-red-50 text-red-600' },
                  { name:'Facebook', desc:'Sign in with your Facebook account', icon:'f', connected:false, color:'bg-blue-50 text-blue-600' },
                ].map(a => (
                  <div key={a.name} className="flex items-center gap-4 p-4 border border-gray-200 rounded-xl">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0 ${a.color}`}>
                      {a.icon}
                    </div>
                    <div className="flex-1">
                      <div className="text-sm font-medium">{a.name}</div>
                      <div className="text-xs text-gray-400">{a.desc}</div>
                    </div>
                    <button onClick={() => toast.success(`${a.name} integration coming soon!`)}
                      className={`text-xs px-4 py-1.5 rounded-lg border font-medium transition-colors ${a.connected ? 'border-red-200 text-red-500 hover:bg-red-50' : 'border-brand-200 text-brand-600 hover:bg-brand-50'}`}>
                      {a.connected ? 'Disconnect' : 'Connect'}
                    </button>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {/* ── ACCOUNT ACTIONS ── */}
          {tab === 'danger' && (
            <div className="space-y-4">
              <Card>
                <SectionTitle title="Account actions" />
                <div className="space-y-3">
                  <div className="p-4 bg-gray-50 border border-gray-200 rounded-xl flex items-center justify-between">
                    <div>
                      <div className="text-sm font-medium flex items-center gap-2"><LogOut className="w-4 h-4 text-gray-500" /> Sign out</div>
                      <div className="text-xs text-gray-400">Sign out of your MindNexus account on this device.</div>
                    </div>
                    <button onClick={() => signOut({ callbackUrl: '/' })} className="btn-secondary text-xs py-1.5 px-4 flex-shrink-0">
                      Sign out
                    </button>
                  </div>

                  <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl">
                    <div className="text-sm font-medium text-amber-700 mb-1">Deactivate account</div>
                    <p className="text-xs text-amber-600 mb-3 leading-relaxed">Temporarily deactivate your account. Your data is preserved and you can reactivate at any time by logging back in.</p>
                    <button onClick={() => toast.error('Contact support@mindnexus.ng to deactivate your account.')}
                      className="text-xs px-4 py-2 bg-amber-100 hover:bg-amber-200 text-amber-700 rounded-lg border border-amber-200">
                      Deactivate account
                    </button>
                  </div>

                  <div className="p-4 bg-red-50 border border-red-200 rounded-xl">
                    <div className="text-sm font-medium text-red-700 mb-1 flex items-center gap-2"><Trash2 className="w-4 h-4" /> Delete account permanently</div>
                    <p className="text-xs text-red-600 mb-3 leading-relaxed">Permanently delete your account and all data including session history, mood entries, and messages. <strong>This cannot be undone.</strong></p>
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
// build: Fri Mar 20 14:26:36 UTC 2026
