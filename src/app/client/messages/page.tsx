'use client'
import { useState, useEffect, useRef } from 'react'
import { Card } from '@/components/ui'
import { Send } from 'lucide-react'
import { useSession } from 'next-auth/react'

export default function MessagesPage() {
  const { data: session } = useSession()
  const [messages, setMessages]   = useState<any[]>([])
  const [therapist, setTherapist] = useState<any>(null)
  const [input, setInput]         = useState('')
  const [sending, setSending]     = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    fetch('/api/messages').then(r => r.json()).then(data => {
      setMessages(data.messages ?? [])
      setTherapist(data.therapist ?? null)
    })
  }, [])

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [messages])

  async function send() {
    if (!input.trim() || sending || !therapist) return
    const text = input.trim()
    setInput('')
    setSending(true)

    // Optimistic update
    setMessages(prev => [...prev, {
      id: Date.now().toString(),
      content: text,
      senderId: (session?.user as any)?.id,
      createdAt: new Date().toISOString()
    }])

    await fetch('/api/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ receiverId: therapist.userId, content: text })
    })
    setSending(false)
  }

  const myId = (session?.user as any)?.id

  return (
    <div className="p-6 max-w-4xl">
      <div className="mb-5">
        <h1 className="text-2xl font-semibold">Messages</h1>
        <p className="text-gray-500 text-sm mt-0.5">Chat with your therapist between sessions.</p>
      </div>

      <div className="grid md:grid-cols-4 gap-4">
        {/* Thread list */}
        <div className="card">
          <div className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-3">Conversations</div>
          {therapist ? (
            <div className="flex items-center gap-2.5 p-2.5 bg-brand-50 rounded-xl cursor-pointer">
              <div className="w-9 h-9 bg-brand-500 rounded-full flex items-center justify-center text-white text-xs font-medium flex-shrink-0">
                {therapist?.name?.split(' ').map((n:string) => n[0]).join('').slice(0,2)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-brand-800">{therapist?.name}</div>
                <div className="text-[10px] text-brand-500">Your therapist</div>
              </div>
              <div className="w-2 h-2 bg-brand-500 rounded-full flex-shrink-0" />
            </div>
          ) : (
            <p className="text-xs text-gray-400 text-center py-4">No therapist assigned yet.</p>
          )}
          <div className="mt-3 pt-3 border-t border-gray-100">
            <div className="flex items-center gap-2.5 p-2.5 rounded-xl cursor-pointer hover:bg-gray-50">
              <div className="w-9 h-9 bg-purple-DEFAULT rounded-full flex items-center justify-center text-white text-xs font-medium flex-shrink-0">MN</div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium">MindNexus support</div>
                <div className="text-[10px] text-gray-400">Platform help</div>
              </div>
            </div>
          </div>
        </div>

        {/* Chat window */}
        <div className="md:col-span-3">
          <Card className="flex flex-col" style={{ height: '520px' }}>
            {/* Header */}
            {therapist && (
              <div className="flex items-center gap-3 pb-3 border-b border-gray-100 mb-3">
                <div className="w-9 h-9 bg-brand-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
                  {therapist?.name?.split(' ').map((n:string) => n[0]).join('').slice(0,2)}
                </div>
                <div>
                  <div className="text-sm font-medium">{therapist?.name}</div>
                  <div className="text-xs text-green-500 flex items-center gap-1">
                    <div className="w-1.5 h-1.5 rounded-full bg-green-500" /> Online
                  </div>
                </div>
              </div>
            )}

            {/* Messages */}
            <div className="flex-1 overflow-y-auto space-y-3 pr-1">
              {messages.length === 0 && (
                <div className="text-center text-gray-400 text-sm pt-10">
                  No messages yet. Say hello to your therapist!
                </div>
              )}
              {messages.map((msg: any) => {
                const isMe = msg.senderId === myId
                return (
                  <div key={msg.id} className={`flex gap-2 ${isMe ? 'flex-row-reverse' : ''}`}>
                    <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-medium flex-shrink-0 ${isMe ? 'bg-brand-500 text-white' : 'bg-gray-100 text-gray-600'}`}>
                      {isMe ? 'You' : therapist?.name?.split(' ').map((n:string)=>n[0]).join('').slice(0,2)}
                    </div>
                    <div className={`max-w-[75%] px-3 py-2 rounded-2xl text-sm leading-relaxed ${isMe ? 'bg-brand-500 text-white rounded-tr-sm' : 'bg-gray-50 text-gray-800 rounded-tl-sm'}`}>
                      {msg.content}
                    </div>
                  </div>
                )
              })}
              <div ref={bottomRef} />
            </div>

            {/* Input */}
            <div className="pt-3 border-t border-gray-100 mt-3">
              <div className="flex gap-2">
                <input className="input flex-1 text-sm rounded-full"
                  placeholder={therapist ? `Message ${therapist.name}...` : 'No therapist assigned yet'}
                  value={input} onChange={e => setInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && !e.shiftKey && send()}
                  disabled={!therapist} />
                <button onClick={send} disabled={sending || !input.trim() || !therapist}
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
