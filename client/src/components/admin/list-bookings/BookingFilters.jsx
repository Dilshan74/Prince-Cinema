import React from 'react'
import { CreditCard, Search } from 'lucide-react'

const BookingFilters = () => {
  return (
    <>
      <div className="flex items-center gap-3 rounded-lg border border-white/10 bg-white/[0.03] px-4 py-3">
        <Search className="h-4 w-4 text-slate-400" />
        <input
          type="text"
          placeholder="Search booking"
          className="w-full bg-transparent text-sm text-white outline-none placeholder:text-slate-500 sm:w-44"
        />
      </div>
      <button className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#ff4b6a]/10 px-4 py-3 text-sm font-medium text-white transition hover:bg-[#ff4b6a]/16">
        <CreditCard className="h-4 w-4" />
        Export report
      </button>
    </>
  )
}

export default BookingFilters
