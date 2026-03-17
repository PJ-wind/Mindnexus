'use client'
import { useState, useRef, useEffect } from 'react'
import { Card } from '@/components/ui'
import { Send, Brain } from 'lucide-react'

const MODES = [
  { id: 'general',    label: 'General support' },
  { id: 'grief',      label: 'Grief support' },
  { id: 'breathing',  label: 'Breathing & calm' },
  { id: 'career',     label: 'Career' },
  { id: 'addiction',  label: 'Addiction' },
  { id: 'guided',     label: 'Guided therapy' },
]

const PROMPTS = [
  'I have been feeling very anxious lately',
  'I lost someone I love recently',
  'I need help with a breathing exercise',
  'I feel stuck in my career',
  'I am struggling with my relationship',
]

interface Message { role: 'user' | 'assistant'; content: string }

export default function AICompanionPage() {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: 'Hello! I am Nexus, your MindNexus AI companion. I am here to listen without judgement and support you at your own pace. What would you like to talk about today?' }
  ])
  const [input, setInput]   = useState('')
  const [loading, setLoading] = useState(false)
  const [mode, setMode]     = useState('general')
  const bottomRef           = useRef<HTMLDivElement>(null)

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [messages])

  async function sendMessage() {
    if (!input.trim() || loading) return
    const userMsg = input.trim()
    setInput('')
    setMessages(prev => [...prev, { role: 'user', content: userMsg }])
    setLoading(true)

    try {
      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMsg, mode, history: messages.slice(-10) })
      })
      const data = await res.json()
      setMessages(prev => [...prev, { role: 'assistant', content: data.reply }])
    } catch {
      setMessages(prev => [...prev, { role: 'assistant', content: 'I am here with you. There was a brief issue — please try again in a moment.' }])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-6 max-w-4xl">
      <div className="mb-5">
        <h1 className="text-2xl font-semibold">Nexus AI companion</h1>
        <p className="text-gray-500 text-sm mt-0.5">Your 24/7 mental health support. Safe, confidential, always available.</p>
      </div>

      <div className="grid md:grid-cols-4 gap-4">
        {/* Sidebar */}
        <div className="space-y-4">
          <Card className="p-3">
            <div className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">Session mode</div>
            <div className="space-y-1">
              {MODES.map(m => (
                <button key={m.id} onClick={() => setMode(m.id)}
                  className={`w-full text-left text-xs px-2.5 py-2 rounded-lg transition-colors ${
                    mode === m.id ? 'bg-brand-50 text-brand-600 font-medium' : 'text-gray-500 hover:bg-gray-50'}`}>
                  {m.label}
                </button>
              ))}
            </div>
          </Card>

          <Card className="p-3">
            <div className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">Try asking</div>
            <div className="space-y-1">
              {PROMPTS.map(p => (
                <button key={p} onClick={() => setInput(p)}
                  className="w-full text-left text-xs px-2.5 py-2 rounded-lg text-gray-500 hover:bg-gray-50 hover:text-gray-700 transition-colors leading-snug">
                  {p}
                </button>
              ))}
            </div>
          </Card>

          <div className="bg-amber-50 border border-amber-100 rounded-xl p-3 text-xs text-amber-700 leading-relaxed">
            This AI provides emotional support only. For clinical diagnosis or emergencies, always contact a licensed therapist or emergency services.
          </div>
        </div>

        {/* Chat */}
        <div className="md:col-span-3">
          <Card className="flex flex-col" style={{ height: '600px' }}>
            {/* Header */}
            <div className="flex items-center gap-3 pb-3 border-b border-gray-100 mb-3">
              <div className="w-9 h-9 bg-brand-500 rounded-full flex items-center justify-center">
                <Brain className="w-4 h-4 text-white" />
              </div>
              <div>
                <div className="text-sm font-medium">Nexus — AI mental health companion</div>
                <div className="text-xs text-green-500 flex items-center gap-1">
                  <div className="w-1.5 h-1.5 rounded-full bg-green-500" /> Online and ready
                </div>
              </div>
              <div className="ml-auto">
                <span className="badge badge-blue text-xs capitalize">{MODES.find(m => m.id === mode)?.label}</span>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto space-y-4 pr-1">
              {messages.map((msg, i) => (
                <div key={i} className={`flex gap-2 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-medium flex-shrink-0 ${
                    msg.role === 'assistant' ? 'bg-brand-50 text-brand-500' : 'bg-brand-500 text-white'}`}>
                    {msg.role === 'assistant' ? 'N' : 'You'}
                  </div>
                  <div className={`max-w-[75%] px-3 py-2.5 rounded-2xl text-sm leading-relaxed ${
                    msg.role === 'assistant'
                      ? 'bg-gray-50 text-gray-800 rounded-tl-sm'
                      : 'bg-brand-500 text-white rounded-tr-sm'}`}>
                    {msg.content}
                  </div>
                </div>
              ))}

              {loading && (
                <div className="flex gap-2">
                  <div className="w-7 h-7 rounded-full bg-brand-50 flex items-center justify-center text-xs text-brand-500">N</div>
                  <div className="bg-gray-50 rounded-2xl rounded-tl-sm px-3 py-3 flex gap-1">
                    {[0,1,2].map(i => (
                      <div key={i} className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"
                        style={{ animationDelay: `${i * 0.15}s` }} />
                    ))}
                  </div>
                </div>
              )}
              <div ref={bottomRef} />
            </div>

            {/* Input */}
            <div className="pt-3 border-t border-gray-100 mt-3">
              <div className="flex gap-2">
                <input className="input flex-1 text-sm rounded-full"
                  placeholder="Share what is on your mind..."
                  value={input} onChange={e => setInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && !e.shiftKey && sendMessage()} />
                <button onClick={sendMessage} disabled={loading || !input.trim()}
                  className="w-9 h-9 bg-brand-500 rounded-full flex items-center justify-center text-white hover:bg-brand-600 disabled:opacity-40 transition-colors flex-shrink-0">
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
