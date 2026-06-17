import React from 'react'
import { ArrowRight, Ticket } from 'lucide-react'

const demandItems = [
  { label: 'Prime-time reservations', value: '78%' },
  { label: 'Average seats per booking', value: '3.4' },
  { label: 'Late-night availability', value: '26%' },
]

const DemandSnapshotPanel = () => {
  return (
    <div className="rounded-lg border border-white/8 bg-white/[0.03] p-5">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-slate-400">Snapshot</p>
          <h2 className="mt-1 text-lg font-semibold text-white">Tonight&apos;s demand</h2>
        </div>
        <Ticket className="h-5 w-5 text-slate-300" />
      </div>

      <div className="mt-6 space-y-4">
        {demandItems.map((item) => (
          <div key={item.label}>
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-400">{item.label}</span>
              <span className="font-medium text-white">{item.value}</span>
            </div>
            <div className="mt-2 h-2 rounded-full bg-white/6">
              <div
                className="h-full rounded-full bg-red-500"
                style={{ width: item.value === '3.4' ? '68%' : item.value }}
              />
            </div>
          </div>
        ))}
      </div>

      <button className="mt-6 inline-flex items-center gap-2 rounded-lg bg-[#ff4b6a]/10 px-4 py-2 text-sm font-medium text-white transition hover:bg-[#ff4b6a]/16">
        View performance report
        <ArrowRight className="h-4 w-4" />
      </button>
    </div>
  )
}

export default DemandSnapshotPanel
