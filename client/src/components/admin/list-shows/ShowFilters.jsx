import React from 'react'
import { CalendarRange, Search } from 'lucide-react'

const ShowFilters = () => {
  return (
    <>
      <div className="flex items-center gap-3 rounded-lg border border-white/10 bg-white/[0.03] px-4 py-3">
        <Search className="h-4 w-4 text-slate-400" />
        <input
          type="text"
          placeholder="Search movie"
          className="w-full bg-transparent text-sm text-white outline-none placeholder:text-slate-500 sm:w-44"
        />
      </div>
      <div className="flex items-center gap-3 rounded-lg border border-white/10 bg-white/[0.03] px-4 py-3">
        <CalendarRange className="h-4 w-4 text-slate-400" />
        <input
          type="date"
          className="bg-transparent text-sm text-white outline-none [color-scheme:dark]"
        />
      </div>
    </>
  )
}

export default ShowFilters
