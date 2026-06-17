import React from 'react'
import { Clock3 } from 'lucide-react'

const UpcomingReleasesPanel = ({ releases }) => {
  return (
    <div className="rounded-lg border border-white/8 bg-gradient-to-br from-[#ff4b6a]/12 to-transparent p-5">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-slate-400">Operations</p>
          <h2 className="mt-1 text-lg font-semibold text-white">Upcoming releases</h2>
        </div>
        <Clock3 className="h-5 w-5 text-slate-300" />
      </div>

      <div className="mt-5 space-y-3">
        {releases.map((release) => (
          <div
            key={release.title}
            className="rounded-lg border border-white/8 bg-black/24 px-4 py-3"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="font-medium text-white">{release.title}</p>
                <p className="mt-1 text-sm text-slate-400">
                  {release.hall} | {release.seats} seats
                </p>
              </div>
              <span className="rounded-md bg-white/8 px-3 py-1 text-xs text-slate-200">
                {release.releaseDate}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default UpcomingReleasesPanel
