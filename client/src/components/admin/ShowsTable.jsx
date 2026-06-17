import React from 'react'
import { CircleDot } from 'lucide-react'

const statusClassNames = {
  Open: 'bg-emerald-500/15 text-emerald-300',
  Filling: 'bg-amber-500/15 text-amber-300',
  'Almost Full': 'bg-rose-500/15 text-rose-300',
}

const ShowsTable = ({ shows }) => {
  return (
    <div className="overflow-hidden rounded-lg border border-white/8 bg-white/[0.03]">
      <div className="flex items-center justify-between border-b border-white/8 px-5 py-4">
        <div>
          <p className="text-sm font-medium text-slate-400">Shows</p>
          <h2 className="mt-1 text-lg font-semibold text-white">Show list</h2>
        </div>
        <div className="rounded-md bg-black/20 px-3 py-1 text-xs text-white/50">
          {shows.length} rows
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-white/[0.02] text-xs text-white/35 uppercase">
            <tr>
              <th className="px-5 py-4 font-medium">Show ID</th>
              <th className="px-5 py-4 font-medium">Movie</th>
              <th className="px-5 py-4 font-medium">Time</th>
              <th className="px-5 py-4 font-medium">Date</th>
              <th className="px-5 py-4 font-medium">Hall</th>
              <th className="px-5 py-4 font-medium">Price</th>
              <th className="px-5 py-4 font-medium">Status</th>
            </tr>
          </thead>
          <tbody>
            {shows.map((show) => (
              <tr
                key={show.id}
                className="border-t border-white/8 text-white/70"
              >
                <td className="px-5 py-4 font-medium text-white">{show.id}</td>
                <td className="px-5 py-4">{show.movie}</td>
                <td className="px-5 py-4">{show.showTime}</td>
                <td className="px-5 py-4">{show.date}</td>
                <td className="px-5 py-4">{show.hall}</td>
                <td className="px-5 py-4">{show.price}</td>
                <td className="px-5 py-4">
                  <span
                    className={`inline-flex items-center gap-2 rounded-md px-3 py-1 text-xs ${
                      statusClassNames[show.status]
                    }`}
                  >
                    <CircleDot className="h-3.5 w-3.5" />
                    {show.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default ShowsTable
