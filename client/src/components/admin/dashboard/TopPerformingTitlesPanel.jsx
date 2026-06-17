import React from 'react'
import { ChartNoAxesCombined } from 'lucide-react'
import AdminMovieGrid from '../AdminMovieGrid'

const TopPerformingTitlesPanel = ({ movies }) => {
  return (
    <div className="rounded-lg border border-white/8 bg-gradient-to-br from-white/[0.05] to-white/[0.02] p-5">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-slate-400">Now showing</p>
          <h2 className="mt-1 text-lg font-semibold text-white">Top performing titles</h2>
        </div>
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#ff4b6a]/10 text-[#ff93a8]">
          <ChartNoAxesCombined className="h-5 w-5" />
        </div>
      </div>

      <AdminMovieGrid movies={movies} variant="dashboard" />
    </div>
  )
}

export default TopPerformingTitlesPanel
