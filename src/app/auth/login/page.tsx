'use client'
import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Brain, Eye, EyeOff, Loader2 } from 'lucide-react'
import toast from 'react-hot-toast'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [showPw, setShowPw]     = useState(false)
  const [loading, setLoading]   = useState(false)

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    const result = await signIn('credentials', { email, password, redirect: false })
    if (result?.error) {
      toast.error('Invalid email or password')
      setLoading(false)
    } else {
      toast.success('Welcome back!')
      router.push('/dashboard')
      router.refresh()
    }
  }

  const demoAccounts = [
    { label: 'Client demo',    email: 'amara@example.com',        pw: 'client123'     },
    { label: 'Therapist demo', email: 'dr.adeyemi@mindnexus.ng',  pw: 'therapist123'  },
    { label: 'Admin demo',     email: 'admin@mindnexus.ng',        pw: 'admin123'      },
  ]

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
          <h1 className="text-2xl font-semibold text-gray-900">Welcome back</h1>
          <p className="text-gray-500 mt-1 text-sm">Sign in to your account</p>
        </div>

        <div className="card shadow-sm">
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email address
              </label>
              <input type="email" className="input" placeholder="you@email.com"
                value={email} onChange={e => setEmail(e.target.value)} required />
            </div>
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-sm font-medium text-gray-700">Password</label>
                <Link href="/auth/forgot-password"
                  className="text-xs text-brand-500 hover:underline font-medium">
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <input type={showPw ? 'text' : 'password'} className="input pr-10"
                  placeholder="Your password"
                  value={password} onChange={e => setPassword(e.target.value)} required />
                <button type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  onClick={() => setShowPw(!showPw)}>
                  {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            <button type="submit" disabled={loading}
              className="btn-primary w-full py-2.5 flex items-center justify-center gap-2">
              {loading
                ? <><Loader2 className="w-4 h-4 animate-spin" /> Signing in...</>
                : 'Sign in'}
            </button>
          </form>

          <div className="divider" />

          <div>
            <p className="text-xs text-gray-400 text-center mb-3">Quick demo access</p>
            <div className="grid grid-cols-3 gap-2">
              {demoAccounts.map(acc => (
                <button key={acc.label}
                  onClick={() => { setEmail(acc.email); setPassword(acc.pw) }}
                  className="text-xs bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-lg py-2 px-1 text-gray-600 transition-colors">
                  {acc.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <p className="text-center text-sm text-gray-500 mt-4">
          Don&apos;t have an account?{' '}
          <Link href="/auth/register" className="text-brand-500 hover:underline font-medium">
            Sign up free
          </Link>
        </p>
      </div>
    </div>
  )
}
