'use client'
import { useState } from 'react'
import { Card } from '@/components/ui'
import { Settings, Globe, Shield, Bell, CreditCard, Users, Check, AlertTriangle } from 'lucide-react'
import toast from 'react-hot-toast'

const TABS = [
  { id: 'general',    label: 'General',         icon: Globe },
  { id: 'security',   label: 'Security',        icon: Shield },
  { id: 'platform',   label: 'Platform',        icon: Settings },
  { id: 'billing',    label: 'Billing & plans', icon: CreditCard },
  { id: 'team',       label: 'Admin team',      icon: Users },
  { id: 'alerts',     label: 'Alert settings',  icon: Bell },
  { id: 'danger',     label: 'Danger zone',     icon: AlertTriangle },
]

export default function AdminSettingsPage() {
  const [tab, setTab]     = useState('general')
  const [saving, setSaving] = useState(false)

  const [general, setGeneral] = useState({
    platformName: 'MindNexus',
    tagline: 'A leading virtual counselling platform',
    supportEmail: 'support@mindnexus.ng',
    adminEmail: 'admin@mindnexus.ng',
    phone: '+234 800 MINDNEXUS',
    address: 'Victoria Island, Lagos, Nigeria',
    timezone: 'Africa/Lagos',
    currency: 'NGN',
    maintenanceMode: false,
    registrationOpen: true,
    requireEmailVerification: true,
  })

  const [platform, setPlatform] = useState({
    maxClientsPerTherapist: 30,
    sessionDurationOptions: [30, 60, 90],
    freeTrialDays: 0,
    autoMatchClients: true,
    requireTherapistApproval: true,
    enableAICompanion: true,
    enableCommunity: true,
    enableBlog: true,
    enablePhysicalSessions: true,
  })

  const [alertSettings, setAlertSettings] = useState({
    crisisAlertEmail: true,
    crisisAlertSMS: true,
    dailyReportEmail: true,
    weeklyReportEmail: true,
    newRegistrationAlert: false,
    paymentFailureAlert: true,
  })

  async function save() {
    setSaving(true)
    await new Promise(r => setTimeout(r, 800))
    toast.success('Settings saved successfully!')
    setSaving(false)
  }

  function Toggle({ value, onChange }: { value: boolean; onChange: () => void }) {
    return (
      <button onClick={onChange}
        className="flex-shrink-0 rounded-full transition-colors relative"
        style={{ minWidth: '2.5rem', height: '1.375rem', background: value ? '#185FA5' : '#e5e7eb' }}>
        <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${value ? 'translate-x-5' : 'translate-x-0.5'}`} />
      </button>
    )
  }

  return (
    <div className="p-6 max-w-4xl">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold">Platform settings</h1>
        <p className="text-gray-500 text-sm mt-0.5">Configure MindNexus platform-wide settings and preferences.</p>
      </div>

      <div className="grid md:grid-cols-4 gap-6">
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

          {/* General */}
          {tab === 'general' && (
            <Card>
              <h3 className="font-medium text-sm mb-4">General platform settings</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Platform name</label>
                  <input className="input text-sm" value={general.platformName}
                    onChange={e => setGeneral(g => ({ ...g, platformName: e.target.value }))} />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Platform tagline</label>
                  <input className="input text-sm" value={general.tagline}
                    onChange={e => setGeneral(g => ({ ...g, tagline: e.target.value }))} />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Support email</label>
                  <input type="email" className="input text-sm" value={general.supportEmail}
                    onChange={e => setGeneral(g => ({ ...g, supportEmail: e.target.value }))} />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Admin email</label>
                  <input type="email" className="input text-sm" value={general.adminEmail}
                    onChange={e => setGeneral(g => ({ ...g, adminEmail: e.target.value }))} />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Support phone</label>
                  <input type="tel" className="input text-sm" value={general.phone}
                    onChange={e => setGeneral(g => ({ ...g, phone: e.target.value }))} />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Office address</label>
                  <input className="input text-sm" value={general.address}
                    onChange={e => setGeneral(g => ({ ...g, address: e.target.value }))} />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Default timezone</label>
                  <select className="input text-sm" value={general.timezone}
                    onChange={e => setGeneral(g => ({ ...g, timezone: e.target.value }))}>
                    <option value="Africa/Lagos">Lagos (WAT, UTC+1)</option>
                    <option value="Africa/Abidjan">Abidjan (GMT)</option>
                    <option value="Europe/London">London</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Currency</label>
                  <select className="input text-sm" value={general.currency}
                    onChange={e => setGeneral(g => ({ ...g, currency: e.target.value }))}>
                    <option value="NGN">Nigerian Naira (₦)</option>
                    <option value="USD">US Dollar ($)</option>
                    <option value="GBP">British Pound (£)</option>
                  </select>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-gray-100 space-y-3">
                {[
                  { key: 'maintenanceMode',         label: 'Maintenance mode',            desc: 'Take the platform offline for maintenance. Only admins can access.' },
                  { key: 'registrationOpen',         label: 'Open registration',           desc: 'Allow new clients and therapists to register.' },
                  { key: 'requireEmailVerification', label: 'Require email verification',  desc: 'Users must verify their email address before accessing the platform.' },
                ].map(item => (
                  <div key={item.key} className="flex items-center justify-between">
                    <div>
                      <div className="text-sm font-medium">{item.label}</div>
                      <div className="text-xs text-gray-400">{item.desc}</div>
                    </div>
                    <Toggle value={general[item.key as keyof typeof general] as boolean}
                      onChange={() => setGeneral(g => ({ ...g, [item.key]: !g[item.key as keyof typeof g] }))} />
                  </div>
                ))}
              </div>

              <button onClick={save} disabled={saving} className="btn-primary mt-4 py-2 px-6 flex items-center gap-2">
                {saving ? 'Saving...' : <><Check className="w-3.5 h-3.5" /> Save settings</>}
              </button>
            </Card>
          )}

          {/* Platform */}
          {tab === 'platform' && (
            <Card>
              <h3 className="font-medium text-sm mb-4">Platform feature settings</h3>
              <div className="grid md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Max clients per therapist</label>
                  <input type="number" min="1" max="100" className="input text-sm"
                    value={platform.maxClientsPerTherapist}
                    onChange={e => setPlatform(p => ({ ...p, maxClientsPerTherapist: Number(e.target.value) }))} />
                </div>
              </div>

              <div className="space-y-3 pt-4 border-t border-gray-100">
                {[
                  { key: 'autoMatchClients',        label: 'Auto-match new clients',        desc: 'Automatically assign new clients to available therapists' },
                  { key: 'requireTherapistApproval',label: 'Require therapist approval',     desc: 'New therapists must be approved by admin before going live' },
                  { key: 'enableAICompanion',       label: 'Enable AI companion',            desc: 'Allow clients to access the Nexus AI companion' },
                  { key: 'enableCommunity',         label: 'Enable community section',       desc: 'Allow clients to access community support spaces' },
                  { key: 'enableBlog',              label: 'Enable blog',                    desc: 'Show the public blog page' },
                  { key: 'enablePhysicalSessions',  label: 'Enable physical session booking',desc: 'Allow booking of in-person sessions' },
                ].map(item => (
                  <div key={item.key} className="flex items-center justify-between py-1.5 border-b border-gray-50 last:border-0">
                    <div>
                      <div className="text-sm font-medium">{item.label}</div>
                      <div className="text-xs text-gray-400">{item.desc}</div>
                    </div>
                    <Toggle value={platform[item.key as keyof typeof platform] as boolean}
                      onChange={() => setPlatform(p => ({ ...p, [item.key]: !p[item.key as keyof typeof p] }))} />
                  </div>
                ))}
              </div>
              <button onClick={save} disabled={saving} className="btn-primary mt-4 py-2 px-6">
                {saving ? 'Saving...' : 'Save settings'}
              </button>
            </Card>
          )}

          {/* Billing */}
          {tab === 'billing' && (
            <Card>
              <h3 className="font-medium text-sm mb-4">Subscription plans</h3>
              <div className="space-y-3">
                {[
                  { plan: 'Free',     price: '₦0',      sessions: 0,  features: 'AI companion, mood tracker, library' },
                  { plan: 'Standard', price: '₦15,000', sessions: 4,  features: '4 sessions, messaging, notes, homework' },
                  { plan: 'Premium',  price: '₦28,000', sessions: -1, features: 'Unlimited sessions, psychiatry, case manager' },
                ].map(p => (
                  <div key={p.plan} className="p-4 border border-gray-200 rounded-xl">
                    <div className="flex items-center justify-between mb-2">
                      <div className="font-medium text-sm">{p.plan}</div>
                      <div className="text-sm font-semibold text-brand-500">{p.price}/month</div>
                    </div>
                    <div className="text-xs text-gray-400 mb-3">{p.features}</div>
                    <div className="flex gap-2">
                      <button className="btn-secondary text-xs py-1.5 px-3">Edit plan</button>
                      <button className="text-xs px-3 py-1.5 text-gray-500 hover:bg-gray-100 rounded-lg border border-gray-200 transition-colors">View subscribers</button>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {/* Admin team */}
          {tab === 'team' && (
            <Card>
              <h3 className="font-medium text-sm mb-4">Admin team members</h3>
              <div className="space-y-2 mb-4">
                {[
                  { name: 'Super Admin', email: 'admin@mindnexus.ng', role: 'Super admin' },
                ].map(admin => (
                  <div key={admin.email} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                    <div className="w-8 h-8 bg-brand-500 rounded-full flex items-center justify-center text-white text-xs font-medium">SA</div>
                    <div className="flex-1">
                      <div className="text-sm font-medium">{admin.name}</div>
                      <div className="text-xs text-gray-400">{admin.email} · {admin.role}</div>
                    </div>
                    <span className="badge badge-blue text-xs">Active</span>
                  </div>
                ))}
              </div>
              <button onClick={() => toast.success('Invite sent!')} className="btn-primary py-2 px-4 text-sm">
                + Invite admin
              </button>
            </Card>
          )}

          {/* Alert settings */}
          {tab === 'alerts' && (
            <Card>
              <h3 className="font-medium text-sm mb-4">Alert & report settings</h3>
              <div className="space-y-3">
                {[
                  { key: 'crisisAlertEmail',    label: 'Crisis alert emails',      desc: 'Send email to admin when a crisis alert is triggered' },
                  { key: 'crisisAlertSMS',      label: 'Crisis alert SMS',         desc: 'Send SMS to admin phone when crisis is triggered' },
                  { key: 'dailyReportEmail',    label: 'Daily platform report',    desc: 'Daily summary email of sessions, signups, and alerts' },
                  { key: 'weeklyReportEmail',   label: 'Weekly platform report',   desc: 'Weekly overview of platform metrics and performance' },
                  { key: 'newRegistrationAlert',label: 'New registration alerts',  desc: 'Alert when a new therapist registers and needs approval' },
                  { key: 'paymentFailureAlert', label: 'Payment failure alerts',   desc: 'Alert when a client payment fails' },
                ].map(item => (
                  <div key={item.key} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                    <div>
                      <div className="text-sm font-medium">{item.label}</div>
                      <div className="text-xs text-gray-400">{item.desc}</div>
                    </div>
                    <Toggle value={alertSettings[item.key as keyof typeof alertSettings]}
                      onChange={() => setAlertSettings(a => ({ ...a, [item.key]: !a[item.key as keyof typeof a] }))} />
                  </div>
                ))}
              </div>
              <button onClick={save} disabled={saving} className="btn-primary mt-4 py-2 px-6">
                {saving ? 'Saving...' : 'Save alert settings'}
              </button>
            </Card>
          )}

          {/* Security */}
          {tab === 'security' && (
            <Card>
              <h3 className="font-medium text-sm mb-4">Security settings</h3>
              <div className="space-y-3">
                {[
                  { label: 'Two-factor authentication', desc: 'Require 2FA for all admin accounts', enabled: false },
                  { label: 'Session timeout',           desc: 'Auto-logout after 30 minutes of inactivity', enabled: true },
                  { label: 'IP allowlist',              desc: 'Restrict admin access to specific IP addresses', enabled: false },
                  { label: 'Audit logging',             desc: 'Log all admin actions for security review', enabled: true },
                ].map(item => (
                  <div key={item.label} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                    <div>
                      <div className="text-sm font-medium">{item.label}</div>
                      <div className="text-xs text-gray-400">{item.desc}</div>
                    </div>
                    <Toggle value={item.enabled} onChange={() => toast.success('Security setting updated')} />
                  </div>
                ))}
              </div>
              <div className="mt-4 pt-4 border-t border-gray-100">
                <div className="text-xs font-medium text-gray-600 mb-2">Change admin password</div>
                <div className="flex gap-2">
                  <input type="password" className="input text-sm flex-1" placeholder="New password" />
                  <button onClick={save} className="btn-primary py-2 px-4 text-sm">Update</button>
                </div>
              </div>
            </Card>
          )}

          {/* Danger zone */}
          {tab === 'danger' && (
            <Card className="border-red-100">
              <h3 className="font-medium text-sm text-red-600 mb-4">Danger zone</h3>
              <div className="space-y-4">
                <div className="p-4 border border-amber-100 rounded-xl bg-amber-50">
                  <div className="text-sm font-medium text-amber-700 mb-1">Enable maintenance mode</div>
                  <p className="text-xs text-amber-600 mb-3">Take the entire platform offline. Only admins can access during maintenance.</p>
                  <button onClick={() => { setGeneral(g => ({ ...g, maintenanceMode: true })); toast.success('Maintenance mode enabled') }}
                    className="text-xs px-4 py-2 bg-amber-100 hover:bg-amber-200 text-amber-700 rounded-lg border border-amber-200 transition-colors">
                    Enable maintenance mode
                  </button>
                </div>
                <div className="p-4 border border-red-100 rounded-xl bg-red-50">
                  <div className="text-sm font-medium text-red-700 mb-1">Reset platform data</div>
                  <p className="text-xs text-red-600 mb-3">Delete all demo/test data from the platform. This cannot be undone.</p>
                  <button onClick={() => toast.error('This action requires confirmation from the technical team.')}
                    className="btn-danger text-xs py-2 px-4">
                    Request data reset
                  </button>
                </div>
              </div>
            </Card>
          )}

        </div>
      </div>
    </div>
  )
}
