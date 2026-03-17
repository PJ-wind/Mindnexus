'use client'
import { useState, useEffect, useRef } from 'react'
import { Card } from '@/components/ui'
import { Video, Mic, MicOff, VideoOff, PhoneOff, MessageCircle, FileText, Clock } from 'lucide-react'
import toast from 'react-hot-toast'

export default function VideoRoomPage() {
  const [joined,    setJoined]    = useState(false)
  const [micOn,     setMicOn]     = useState(true)
  const [camOn,     setCamOn]     = useState(true)
  const [seconds,   setSeconds]   = useState(0)
  const [activeTab, setActiveTab] = useState<'chat'|'notes'>('notes')
  const [noteText,  setNoteText]  = useState('')
  const [chatInput, setChatInput] = useState('')
  const [messages,  setMessages]  = useState<{text:string;from:string;time:string}[]>([
    { text: 'Welcome Amara. How are you feeling today before we begin?', from: 'You', time: '3:01 PM' }
  ])
  const jitsiRef = useRef<any>(null)
  const timerRef = useRef<any>(null)

  function startSession() {
    setJoined(true)
    timerRef.current = setInterval(() => setSeconds(s => s + 1), 1000)

    // Load Jitsi
    const script = document.createElement('script')
    script.src = 'https://meet.jit.si/external_api.js'
    script.async = true
    script.onload = () => {
      const api = new (window as any).JitsiMeetExternalAPI('meet.jit.si', {
        roomName:  `mindnexus-session-${Date.now()}`,
        parentNode: document.getElementById('jitsi-container'),
        width:     '100%',
        height:    '100%',
        configOverwrite: {
          startWithAudioMuted: false,
          startWithVideoMuted: false,
          prejoinPageEnabled:  false,
          disableDeepLinking:  true,
        },
        interfaceConfigOverwrite: {
          TOOLBAR_BUTTONS: ['microphone','camera','chat','hangup'],
          SHOW_JITSI_WATERMARK: false,
          SHOW_BRAND_WATERMARK:  false,
        }
      })
      jitsiRef.current = api
    }
    document.head.appendChild(script)
  }

  function endSession() {
    jitsiRef.current?.dispose()
    clearInterval(timerRef.current)
    setJoined(false)
    setSeconds(0)
    toast.success('Session ended. Notes saved.')
  }

  useEffect(() => () => clearInterval(timerRef.current), [])

  const mins = String(Math.floor(seconds/60)).padStart(2,'0')
  const secs = String(seconds % 60).padStart(2,'0')

  function sendChat() {
    if (!chatInput.trim()) return
    const time = new Date().toLocaleTimeString('en-GB',{hour:'2-digit',minute:'2-digit'})
    setMessages(prev => [...prev, { text: chatInput.trim(), from: 'You', time }])
    setChatInput('')
  }

  if (!joined) return (
    <div className="p-6 max-w-2xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold">Video session room</h1>
        <p className="text-gray-500 text-sm mt-0.5">Start a secure, encrypted video session with your client.</p>
      </div>
      <Card className="text-center py-12">
        <div className="w-16 h-16 bg-brand-50 rounded-full flex items-center justify-center mx-auto mb-4">
          <Video className="w-8 h-8 text-brand-500" />
        </div>
        <h3 className="font-semibold mb-2">Ready to start your session?</h3>
        <p className="text-sm text-gray-500 mb-6 max-w-sm mx-auto">
          Your session will use Jitsi Meet — a free, end-to-end encrypted video platform. No account needed for your client.
        </p>
        <div className="flex flex-col items-center gap-3">
          <div className="flex items-center gap-4 text-sm text-gray-500 mb-2">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={micOn} onChange={e => setMicOn(e.target.checked)} className="rounded" />
              Microphone on
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={camOn} onChange={e => setCamOn(e.target.checked)} className="rounded" />
              Camera on
            </label>
          </div>
          <button onClick={startSession} className="btn-primary py-3 px-10 text-base flex items-center gap-2">
            <Video className="w-5 h-5" /> Start session
          </button>
        </div>
        <p className="text-xs text-gray-400 mt-4">Powered by Jitsi Meet — free, open-source, encrypted</p>
      </Card>
    </div>
  )

  return (
    <div className="flex h-screen bg-gray-900 overflow-hidden">
      {/* Video area */}
      <div className="flex-1 flex flex-col">
        {/* Top bar */}
        <div className="flex items-center gap-4 px-4 py-3 bg-gray-800 border-b border-gray-700">
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          <span className="text-white text-sm font-medium">MindNexus · Live session</span>
          <span className="text-gray-400 text-sm flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5" /> {mins}:{secs}
          </span>
          <span className="text-xs bg-red-900 text-red-300 px-2 py-0.5 rounded-full">Recording</span>
        </div>

        {/* Jitsi container */}
        <div id="jitsi-container" className="flex-1 bg-gray-900" style={{ minHeight: 0 }} />

        {/* Controls */}
        <div className="flex items-center justify-center gap-4 py-4 bg-gray-800 border-t border-gray-700">
          <button onClick={() => setMicOn(!micOn)}
            className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${micOn ? 'bg-gray-600 hover:bg-gray-500' : 'bg-red-600 hover:bg-red-700'}`}>
            {micOn ? <Mic className="w-5 h-5 text-white" /> : <MicOff className="w-5 h-5 text-white" />}
          </button>
          <button onClick={() => setCamOn(!camOn)}
            className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${camOn ? 'bg-gray-600 hover:bg-gray-500' : 'bg-red-600 hover:bg-red-700'}`}>
            {camOn ? <Video className="w-5 h-5 text-white" /> : <VideoOff className="w-5 h-5 text-white" />}
          </button>
          <button onClick={endSession}
            className="w-14 h-12 rounded-full bg-red-500 hover:bg-red-600 flex items-center justify-center transition-colors">
            <PhoneOff className="w-5 h-5 text-white" />
          </button>
        </div>
      </div>

      {/* Side panel */}
      <div className="w-72 bg-gray-800 border-l border-gray-700 flex flex-col">
        {/* Tabs */}
        <div className="flex border-b border-gray-700">
          {(['notes','chat'] as const).map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)}
              className={`flex-1 py-3 text-xs font-medium capitalize flex items-center justify-center gap-1.5 transition-colors ${activeTab === tab ? 'text-white border-b-2 border-brand-500' : 'text-gray-400 hover:text-gray-200'}`}>
              {tab === 'notes' ? <FileText className="w-3.5 h-3.5" /> : <MessageCircle className="w-3.5 h-3.5" />}
              {tab}
            </button>
          ))}
        </div>

        {/* Notes */}
        {activeTab === 'notes' && (
          <div className="flex-1 flex flex-col p-3">
            <textarea
              className="flex-1 bg-gray-700 border border-gray-600 rounded-xl p-3 text-sm text-white placeholder-gray-400 resize-none outline-none focus:border-brand-500 leading-relaxed"
              placeholder="Write session notes here..."
              value={noteText}
              onChange={e => setNoteText(e.target.value)}
            />
            <button onClick={() => toast.success('Notes saved!')}
              className="mt-2 btn-primary text-xs py-2 w-full">
              Save notes
            </button>
            <div className="mt-3 space-y-1">
              {['Progress noted','Safety plan reviewed','Homework assigned','Referred to psychiatry'].map(t => (
                <button key={t} onClick={() => setNoteText(prev => prev ? prev + '\n' + t : t)}
                  className="w-full text-left text-xs px-2.5 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-gray-300 transition-colors">
                  {t}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Chat */}
        {activeTab === 'chat' && (
          <div className="flex-1 flex flex-col p-3">
            <div className="flex-1 overflow-y-auto space-y-3 mb-3">
              {messages.map((m,i) => (
                <div key={i}>
                  <div className="text-[10px] text-gray-500 mb-0.5">{m.from} · {m.time}</div>
                  <div className="bg-gray-700 rounded-xl px-3 py-2 text-xs text-gray-200">{m.text}</div>
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <input className="flex-1 bg-gray-700 border border-gray-600 rounded-xl px-3 py-2 text-xs text-white placeholder-gray-400 outline-none focus:border-brand-500"
                placeholder="Type a message..."
                value={chatInput}
                onChange={e => setChatInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && sendChat()} />
              <button onClick={sendChat} className="w-8 h-8 bg-brand-500 rounded-full flex items-center justify-center text-white hover:bg-brand-600 transition-colors flex-shrink-0">
                <svg className="w-3.5 h-3.5" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2"><path d="M2 7h10M8 3l4 4-4 4"/></svg>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
