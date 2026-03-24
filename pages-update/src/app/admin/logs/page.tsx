import { Card } from '@/components/ui'
import { Activity } from 'lucide-react'

const LOGS = [
  { action:'User login', user:'dr.adeyemi@mindnexus.ng', time:'2 min ago', type:'auth' },
  { action:'New client registered', user:'amara@example.com', time:'15 min ago', type:'signup' },
  { action:'Session completed', user:'dr.adeyemi@mindnexus.ng', time:'1 hour ago', type:'session' },
  { action:'Crisis alert triggered', user:'amara@example.com', time:'2 hours ago', type:'crisis' },
  { action:'Settings updated', user:'admin@mindnexus.ng', time:'3 hours ago', type:'admin' },
  { action:'Password changed', user:'dr.adeyemi@mindnexus.ng', time:'1 day ago', type:'auth' },
]
const TYPE_COLORS: Record<string,string> = { auth:'badge-blue', signup:'badge-green', session:'badge-teal', crisis:'badge-red', admin:'badge-purple' }

export default function AdminLogsPage() {
  return (
    <div className="p-6 max-w-4xl">
      <div className="mb-6"><h1 className="text-2xl font-semibold">Activity logs</h1><p className="text-gray-500 text-sm mt-0.5">Complete audit trail of platform activity.</p></div>
      <Card>
        <div className="space-y-1">
          {LOGS.map((log, i) => (
            <div key={i} className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg transition-colors">
              <Activity className="w-4 h-4 text-gray-400 flex-shrink-0" />
              <div className="flex-1"><div className="text-sm font-medium">{log.action}</div><div className="text-xs text-gray-400">{log.user}</div></div>
              <span className={`badge ${TYPE_COLORS[log.type]} text-[10px]`}>{log.type}</span>
              <div className="text-xs text-gray-400 flex-shrink-0">{log.time}</div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}
