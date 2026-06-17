import React from 'react'

const AdminMetricCards = ({ stats }) => {
  return (
    <div className="grid grid-cols-2 gap-3 sm:flex">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="min-w-32 rounded-lg border border-white/8 bg-white/[0.03] px-4 py-4"
        >
          <p className="text-xs text-slate-400 uppercase">{stat.label}</p>
          <p className="mt-2 text-2xl font-semibold text-white">{stat.value}</p>
          <p className="mt-1 text-xs text-slate-400">{stat.detail}</p>
        </div>
      ))}
    </div>
  )
}

export default AdminMetricCards
