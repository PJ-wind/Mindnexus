import Link from 'next/link'
import {
  Brain, Shield, Clock, Users, Star, CheckCircle,
  ArrowRight, Video, MessageCircle, Phone, Heart,
  BookOpen, Target, AlertCircle
} from 'lucide-react'

export default function HomePage() {
  const features = [
    { icon: Video, title: 'HD video sessions', desc: 'Secure, encrypted video counselling that feels as personal as sitting in the same room.', color: 'text-brand-500', bg: 'bg-brand-50' },
    { icon: Users, title: 'Therapist matching', desc: 'Our smart system connects you with the right specialist for your specific needs.', color: 'text-teal-DEFAULT', bg: 'bg-teal-light' },
    { icon: Brain, title: 'AI companion', desc: 'Nexus, our AI mental health companion, is available 24/7 between therapy sessions.', color: 'text-purple-DEFAULT', bg: 'bg-purple-light' },
    { icon: BookOpen, title: 'Session notes', desc: 'Every session is documented. Your therapist assigns homework and tracks your progress.', color: 'text-success', bg: 'bg-success-light' },
    { icon: Target, title: 'Mood tracker', desc: 'Log your daily mood, sleep, and wellbeing. Your therapist tailors sessions accordingly.', color: 'text-warning-DEFAULT', bg: 'bg-warning-light' },
    { icon: AlertCircle, title: 'Crisis support', desc: 'A dedicated crisis button connects you immediately to your therapist and emergency resources.', color: 'text-danger', bg: 'bg-danger-light' },
  ]

  const therapists = [
    { initials: 'DA', name: 'Dr. Adeyemi', role: 'Lead counsellor · 12 yrs', rating: 4.9, areas: ['Grief', 'Addiction'], color: 'bg-brand-500' },
    { initials: 'RO', name: 'Dr. Okafor', role: 'Couples specialist · 8 yrs', rating: 4.8, areas: ['Couples', 'Premarital'], color: 'bg-purple-DEFAULT' },
    { initials: 'KA', name: 'Dr. Abara', role: 'Crisis & trauma · 10 yrs', rating: 4.7, areas: ['Crisis', 'Trauma'], color: 'bg-teal-DEFAULT' },
    { initials: 'MF', name: 'Dr. Fashola', role: 'Career counsellor · 6 yrs', rating: 4.6, areas: ['Career', 'School'], color: 'bg-orange-600' },
  ]

  const steps = [
    { num: '1', title: 'Sign up free', desc: 'Create your account in under 2 minutes. No credit card required.' },
    { num: '2', title: 'Complete assessment', desc: 'Answer a short questionnaire so we can match you with the right therapist.' },
    { num: '3', title: 'Meet your therapist', desc: 'Book your first session — video, voice, or chat.' },
    { num: '4', title: 'Begin healing', desc: 'Attend sessions, track your mood, use AI support, and grow at your own pace.' },
  ]

  const testimonials = [
    { quote: 'I was sceptical about online therapy but MindNexus changed everything. Dr. Adeyemi helped me process grief I had been carrying for years.', name: 'Amara M.', role: 'Grief counselling client', initials: 'AM', color: 'bg-purple-DEFAULT' },
    { quote: 'The premarital counselling sessions gave my fiancé and I tools we never knew we needed. We communicate so much better now.', name: 'Kemi & Biodun O.', role: 'Premarital counselling', initials: 'KB', color: 'bg-teal-DEFAULT' },
    { quote: 'After 3 months on the addiction programme, I am 90 days clean. The therapist, the AI companion, the community — all of it helped.', name: 'Chidi E.', role: 'Addiction recovery client', initials: 'CE', color: 'bg-orange-600' },
  ]

  return (
    <div className="min-h-screen bg-white">
      {/* Navbar */}
      <nav className="border-b border-gray-100 sticky top-0 bg-white/95 backdrop-blur z-50">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center gap-8">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-brand-500 rounded-lg flex items-center justify-center">
              <Brain className="w-4 h-4 text-white" />
            </div>
            <span className="font-semibold text-gray-900">MindNexus</span>
          </Link>
          <div className="hidden md:flex items-center gap-1 ml-4">
            {['Services', 'Therapists', 'How it works', 'Pricing'].map(item => (
              <a key={item} href={`#${item.toLowerCase().replace(/ /g, '-')}`}
                className="px-3 py-1.5 text-sm text-gray-500 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors">
                {item}
              </a>
            ))}
            <Link href="/blog" className="px-3 py-1.5 text-sm text-gray-500 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors">Blog</Link>
            <Link href="/physical-sessions" className="px-3 py-1.5 text-sm text-gray-500 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors">Book in-person</Link>
            <Link href="/report" className="px-3 py-1.5 text-sm text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors">Report a case</Link>
          </div>
          <div className="ml-auto flex items-center gap-2">
            <Link href="/auth/login" className="btn-secondary text-sm py-1.5">Sign in</Link>
            <Link href="/auth/register" className="btn-primary text-sm py-1.5">Get started free</Link>
          </div>
        </div>
      </nav>

      {/* Hero - full-width background image */}
      <section className="relative overflow-hidden" style={{ minHeight: '580px' }}>
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=1600&q=80&auto=format&fit=crop"
            alt="Counselling session"
            className="w-full h-full object-cover"
            style={{ objectPosition: 'center 25%' }}
          />
          <div className="absolute inset-0" style={{ background: 'linear-gradient(to right, rgba(15,23,42,0.88) 0%, rgba(15,23,42,0.65) 50%, rgba(15,23,42,0.25) 100%)' }} />
        </div>
        <div className="relative z-10 max-w-6xl mx-auto px-6 py-24 md:py-32">
          <div className="max-w-xl">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/10 text-white rounded-full text-xs font-medium mb-6 border border-white/20">
              <Star className="w-3 h-3 text-yellow-400" /> A leading virtual counselling platform
            </div>
            <h1 className="text-4xl md:text-5xl font-semibold text-white mb-5 leading-tight">
              Professional mental health support,{' '}
              <span style={{ color: '#93c5fd' }}>from anywhere you are</span>
            </h1>
            <p className="text-lg text-gray-200 mb-8 leading-relaxed">
              MindNexus connects you with licensed counselling psychologists for real, effective therapy through video, voice, or chat. Available 24/7. Completely confidential.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 mb-10">
              <Link href="/auth/register" className="btn-primary py-3 px-8 text-base flex items-center justify-center gap-2">
                Start free assessment <ArrowRight className="w-4 h-4" />
              </Link>
              <Link href="/auth/login" className="py-3 px-8 text-base text-white border border-white/30 rounded-xl font-medium text-center" style={{ background: 'rgba(255,255,255,0.1)' }}>
                Browse therapists
              </Link>
            </div>
            <div className="flex flex-wrap items-center gap-5 text-sm text-gray-300">
              <div className="flex items-center gap-1.5"><CheckCircle className="w-4 h-4 text-green-400" /> Licensed therapists</div>
              <div className="flex items-center gap-1.5"><Clock className="w-4 h-4 text-green-400" /> Sessions within 24 hours</div>
              <div className="flex items-center gap-1.5"><Shield className="w-4 h-4 text-green-400" /> End-to-end encrypted</div>
              <div className="flex items-center gap-1.5"><Heart className="w-4 h-4 text-green-400" /> No judgment, no stigma</div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <div className="border-y border-gray-100 bg-gray-50">
        <div className="max-w-6xl mx-auto px-6 py-8 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {[['2,400+','Clients supported'],['7','Licensed therapists'],['12','Specialisations'],['4.9★','Average rating']].map(([v,l]) => (
            <div key={l}><div className="text-2xl font-semibold text-brand-500">{v}</div><div className="text-sm text-gray-500 mt-1">{l}</div></div>
          ))}
        </div>
      </div>

      {/* Features */}
      <section className="py-16 px-6 bg-gray-50" id="services">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-10">
            <div className="text-xs font-medium text-brand-500 uppercase tracking-widest mb-2">Platform features</div>
            <h2 className="text-3xl font-semibold mb-3">Everything you need for your healing journey</h2>
            <p className="text-gray-500 max-w-xl mx-auto">Built by counselling professionals and designed to feel safe and welcoming for every client.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-4">
            {features.map(f => (
              <div key={f.title} className="card hover:border-gray-300 transition-colors">
                <div className={`w-9 h-9 ${f.bg} rounded-lg flex items-center justify-center mb-3`}>
                  <f.icon className={`w-4 h-4 ${f.color}`} />
                </div>
                <h4 className="font-medium mb-1.5">{f.title}</h4>
                <p className="text-sm text-gray-500 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-16 px-6 bg-white" id="how-it-works">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-10">
            <div className="text-xs font-medium text-brand-500 uppercase tracking-widest mb-2">How it works</div>
            <h2 className="text-3xl font-semibold">Start your healing journey in 4 simple steps</h2>
          </div>
          <div className="grid md:grid-cols-4 gap-6">
            {steps.map((s, i) => (
              <div key={i} className="text-center">
                <div className="w-10 h-10 bg-brand-50 text-brand-600 rounded-full flex items-center justify-center text-sm font-semibold mx-auto mb-3">{s.num}</div>
                <h4 className="font-medium mb-1.5">{s.title}</h4>
                <p className="text-sm text-gray-500 leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Therapists */}
      <section className="py-16 px-6 bg-gray-50" id="therapists">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-10">
            <div className="text-xs font-medium text-brand-500 uppercase tracking-widest mb-2">Meet our team</div>
            <h2 className="text-3xl font-semibold mb-3">Licensed, experienced, compassionate therapists</h2>
            <p className="text-gray-500">All MindNexus therapists are licensed counselling psychologists with verified credentials.</p>
          </div>
          <div className="grid md:grid-cols-4 gap-4">
            {therapists.map(t => (
              <div key={t.name} className="card text-center hover:border-gray-300 transition-colors">
                <div className={`w-14 h-14 ${t.color} rounded-full flex items-center justify-center text-white font-semibold text-lg mx-auto mb-3`}>{t.initials}</div>
                <h4 className="font-medium">{t.name}</h4>
                <p className="text-xs text-gray-400 mt-0.5 mb-2">{t.role}</p>
                <div className="text-amber-500 text-xs mb-2">{'★'.repeat(Math.floor(t.rating))} {t.rating}</div>
                <div className="flex flex-wrap gap-1 justify-center">
                  {t.areas.map(a => <span key={a} className="badge badge-blue text-xs">{a}</span>)}
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-6">
            <Link href="/auth/register" className="btn-secondary">View all therapists</Link>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-10">
            <div className="text-xs font-medium text-brand-500 uppercase tracking-widest mb-2">Client stories</div>
            <h2 className="text-3xl font-semibold">Real people, real healing</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-4">
            {testimonials.map(t => (
              <div key={t.name} className="card bg-gray-50">
                <p className="text-sm text-gray-600 italic leading-relaxed mb-4">&ldquo;{t.quote}&rdquo;</p>
                <div className="flex items-center gap-2">
                  <div className={`w-8 h-8 ${t.color} rounded-full flex items-center justify-center text-white text-xs font-medium`}>{t.initials}</div>
                  <div><div className="text-sm font-medium">{t.name}</div><div className="text-xs text-gray-400">{t.role}</div></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-16 px-6 bg-gray-50" id="pricing">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <div className="text-xs font-medium text-brand-500 uppercase tracking-widest mb-2">Pricing</div>
            <h2 className="text-3xl font-semibold mb-3">Transparent, affordable plans</h2>
            <p className="text-gray-500">Start free. Upgrade only when you are ready.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-4">
            {[
              { name: 'Free', price: '₦0', period: 'Forever free', features: ['AI companion access', 'Mood & journal tracker', 'Psychoeducation library', 'Community support spaces'], missing: ['Live therapy sessions', 'Therapist messaging'], cta: 'Get started free', featured: false },
              { name: 'Standard', price: '₦15,000', period: 'per month', features: ['Everything in Free', '4 live therapy sessions', 'Unlimited therapist messaging', 'Session notes & homework', 'Progress tracking dashboard'], missing: ['Psychiatric consultation'], cta: 'Start Standard', featured: true },
              { name: 'Premium', price: '₦28,000', period: 'per month', features: ['Everything in Standard', 'Unlimited live sessions', 'Psychiatric consultation', 'Priority therapist matching', 'Family & group sessions', 'Dedicated case manager'], missing: [], cta: 'Start Premium', featured: false },
            ].map(p => (
              <div key={p.name} className={`card ${p.featured ? 'border-2 border-brand-500' : ''}`}>
                {p.featured && <div className="badge badge-blue text-xs mb-2">Most popular</div>}
                <h4 className="font-medium mb-1">{p.name}</h4>
                <div className="text-3xl font-semibold mb-0.5">{p.price}</div>
                <div className="text-xs text-gray-400 mb-4">{p.period}</div>
                <div className="space-y-2 mb-5">
                  {p.features.map(f => (
                    <div key={f} className="flex items-center gap-2 text-sm text-gray-600">
                      <CheckCircle className="w-3.5 h-3.5 text-success flex-shrink-0" />{f}
                    </div>
                  ))}
                  {p.missing.map(f => (
                    <div key={f} className="flex items-center gap-2 text-sm text-gray-400">
                      <div className="w-3.5 h-3.5 flex-shrink-0" />— {f}
                    </div>
                  ))}
                </div>
                <Link href="/auth/register" className={p.featured ? 'btn-primary w-full text-center block' : 'btn-secondary w-full text-center block'}>{p.cta}</Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-6 bg-brand-50 border-t border-brand-100">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl font-semibold text-gray-900 mb-3">Your mental health matters. Start today.</h2>
          <p className="text-gray-600 mb-8">Join thousands of people across Nigeria who are healing, growing, and thriving with MindNexus.</p>
          <Link href="/auth/register" className="btn-primary py-3 px-10 text-base inline-flex items-center gap-2">
            Get started free <ArrowRight className="w-4 h-4" />
          </Link>
          <p className="text-xs text-gray-400 mt-3">No credit card required · 100% confidential</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-100 py-10 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-7 h-7 bg-brand-500 rounded-lg flex items-center justify-center"><Brain className="w-3.5 h-3.5 text-white" /></div>
                <span className="font-semibold">MindNexus</span>
              </div>
              <p className="text-sm text-gray-400 leading-relaxed">A leading virtual counselling platform.</p>
            </div>
            {[
              { title: 'Platform', links: ['For clients', 'For therapists', 'AI companion', 'Blog', 'Book in-person', 'Report a case', 'Pricing'] },
              { title: 'Specialisations', links: ['Grief & bereavement', 'Addiction recovery', 'Couples counselling', 'Crisis support', 'Career counselling'] },
              { title: 'Company', links: ['About us', 'Our therapists', 'Privacy policy', 'Terms of service', 'Contact us'] },
            ].map(col => (
              <div key={col.title}>
                <div className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-3">{col.title}</div>
                {col.links.map(l => <div key={l} className="text-sm text-gray-500 hover:text-gray-900 cursor-pointer mb-1.5">{l}</div>)}
              </div>
            ))}
          </div>
          <div className="flex items-center justify-between border-t border-gray-100 pt-6 text-xs text-gray-400">
            <span>© 2026 MindNexus. All rights reserved.</span>
            <span>Licensed counselling platform · Nigeria</span>
          </div>
        </div>
      </footer>
    </div>
  )
}
