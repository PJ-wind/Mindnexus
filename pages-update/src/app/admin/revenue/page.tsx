import { Card, Badge } from '@/components/ui'

export default function AdminRevenuePage() {
  const months = ['Oct','Nov','Dec','Jan','Feb','Mar']
  const values = [2.8,3.1,3.4,3.6,3.9,4.2]
  const max = Math.max(...values)
  return (
    <div className="p-6 max-w-4xl">
      <div className="mb-6"><h1 className="text-2xl font-semibold">Revenue</h1><p className="text-gray-500 text-sm mt-0.5">Platform financial overview and subscription metrics.</p></div>
      <div className="grid grid-cols-3 gap-3 mb-6">
        {[['Monthly revenue','₦4.2M','+18%'],['Annual run rate','₦50.4M','+22%'],['Avg revenue per user','₦8,750','+5%']].map(([l,v,c]) => (
          <div key={l} className="stat-card"><div className="text-xs text-gray-500 mb-1">{l}</div><div className="text-xl font-semibold">{v}</div><div className="text-xs text-green-600">{c} vs last month</div></div>
        ))}
      </div>
      <Card>
        <h3 className="font-medium text-sm mb-4">Revenue trend (₦M)</h3>
        <div className="flex items-end gap-3 h-28">
          {values.map((val, i) => (
            <div key={i} className="flex-1 flex flex-col items-center gap-1">
              <div className="text-[10px] text-brand-600 font-medium">₦{val}M</div>
              <div className="w-full bg-brand-400 rounded-t-sm" style={{ height: `${(val/max)*80}%` }} />
              <span className="text-[10px] text-gray-400">{months[i]}</span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}
