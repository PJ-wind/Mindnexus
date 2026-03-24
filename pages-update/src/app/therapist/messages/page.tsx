'use client'
import { useState, useEffect, useRef } from 'react'
import { useSession } from 'next-auth/react'
import { Card } from '@/components/ui'
import { Send } from 'lucide-react'
import toast from 'react-hot-toast'

export default function TherapistMessagesPage() {
  const { data: session } = useSession()
  const [messages, setMessages] = useState<any[]>([
    { id: '1', senderId: 'client', content: 'Good morning Dr. Adeyemi. I wanted to let you know I completed the breathing exercise.', createdAt: new Date(Date.now() - 3600000).toISOString() },
    { id: '2', senderId: 'me', content: 'That is wonderful to hear! How did it feel? Did you notice any difference in your anxiety levels?', createdAt: new Date(Date.now() - 3000000).toISOString() },
    { id: '3', senderId: 'client', content: 'Yes, I felt much calmer after doing it. I will keep it up before our next session.', createdAt: new Date(Date.now() - 1800000).toISOString() },
  ])
  const [input, setInput]     = useState('')
  const [sending, setSending] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)

  const clients = [{ id: 'amara', name: 'Amara Musa', initials: 'AM', online: true }]
  const [activeClient] = useState(clients[0])

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [messages])

  async function send() {
    if (!input.trim() || sending) return
    const text = input.trim()
    setInput('')
    setSending(true)
    setMessages(prev => [...prev, { id: Date.now().toString(), senderId: 'me', content: text, createdAt: new Date().toISOString() }])
    await fetch('/api/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ receiverId: 'client-id', content: text })
    }).catch(() => {})
    setSending(false)
  }

  const myId = (session?.user as any)?.id

  return (
    <div className="p-6 max-w-4xl">
      <div className="mb-5">
        <h1 className="text-2xl font-semibold">Messages</h1>
        <p className="text-gray-500 text-sm mt-0.5">Communicate with your clients between sessions.</p>
      </div>

      <div className="grid md:grid-cols-4 gap-4">
        <Card className="p-2">
          <div className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-3 px-2">Clients</div>
          {clients.map(c => (
            <div key={c.id} className="flex items-center gap-2.5 p-2.5 bg-brand-50 rounded-xl cursor-pointer">
              <div className="w-9 h-9 bg-brand-500 rounded-full flex items-center justify-center text-white text-xs font-medium flex-shrink-0">{c.initials}</div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-brand-800">{c.name}</div>
                <div className="text-[10px] text-brand-500 flex items-center gap-1"><div className="w-1.5 h-1.5 rounded-full bg-green-500" /> Online</div>
              </div>
            </div>
          ))}
        </Card>

        <div className="md:col-span-3">
          <Card className="flex flex-col" style={{ height: '520px' }}>
            <div className="flex items-center gap-3 pb-3 border-b border-gray-100 mb-3">
              <div className="w-9 h-9 bg-brand-500 rounded-full flex items-center justify-center text-white text-sm font-medium">{activeClient.initials}</div>
              <div>
                <div className="text-sm font-medium">{activeClient.name}</div>
                <div className="text-xs text-green-500 flex items-center gap-1"><div className="w-1.5 h-1.5 rounded-full bg-green-500" /> Online</div>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto space-y-3 pr-1">
              {messages.map(msg => {
                const isMe = msg.senderId === 'me'
                return (
                  <div key={msg.id} className={`flex gap-2 ${isMe ? 'flex-row-reverse' : ''}`}>
                    <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-medium flex-shrink-0 ${isMe ? 'bg-brand-500 text-white' : 'bg-gray-100 text-gray-600'}`}>
                      {isMe ? 'DA' : 'AM'}
                    </div>
                    <div className={`max-w-[75%] px-3 py-2 rounded-2xl text-sm leading-relaxed ${isMe ? 'bg-brand-500 text-white rounded-tr-sm' : 'bg-gray-50 text-gray-800 rounded-tl-sm'}`}>
                      {msg.content}
                    </div>
                  </div>
                )
              })}
              <div ref={bottomRef} />
            </div>

            <div className="pt-3 border-t border-gray-100 mt-3">
              <div className="flex gap-2">
                <input className="input flex-1 text-sm rounded-full"
                  placeholder={`Message ${activeClient.name}...`}
                  value={input} onChange={e => setInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && !e.shiftKey && send()} />
                <button onClick={send} disabled={sending || !input.trim()}
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
