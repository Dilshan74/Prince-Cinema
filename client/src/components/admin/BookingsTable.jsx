import React from 'react'
import { TicketCheck } from 'lucide-react'

const bookingStatusClassNames = {
  Confirmed: 'bg-emerald-500/15 text-emerald-300',
  Pending: 'bg-amber-500/15 text-amber-300',
  Refunded: 'bg-white/10 text-slate-200',
}

const BookingsTable = ({ bookings }) => {
  return (
    <div className="overflow-hidden rounded-lg border border-white/8 bg-white/[0.03]">
      <div className="flex items-center justify-between border-b border-white/8 px-5 py-4">
        <div>
          <p className="text-sm font-medium text-slate-400">Bookings</p>
          <h2 className="mt-1 text-lg font-semibold text-white">Booking list</h2>
        </div>
        <div className="inline-flex items-center gap-2 rounded-md bg-black/20 px-3 py-1 text-xs text-white/50">
          <TicketCheck className="h-3.5 w-3.5" />
          {bookings.length} entries
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-white/[0.02] text-xs text-white/35 uppercase">
            <tr>
              <th className="px-5 py-4 font-medium">Booking ID</th>
              <th className="px-5 py-4 font-medium">Customer</th>
              <th className="px-5 py-4 font-medium">Movie</th>
              <th className="px-5 py-4 font-medium">Seats</th>
              <th className="px-5 py-4 font-medium">Total</th>
              <th className="px-5 py-4 font-medium">Booked At</th>
              <th className="px-5 py-4 font-medium">Status</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((booking) => (
              <tr
                key={booking.id}
                className="border-t border-white/8 text-white/70"
              >
                <td className="px-5 py-4 font-medium text-white">{booking.id}</td>
                <td className="px-5 py-4">{booking.customer}</td>
                <td className="px-5 py-4">{booking.movie}</td>
                <td className="px-5 py-4">{booking.seats}</td>
                <td className="px-5 py-4">{booking.total}</td>
                <td className="px-5 py-4">{booking.bookedAt}</td>
                <td className="px-5 py-4">
                  <span
                    className={`inline-flex rounded-md px-3 py-1 text-xs ${
                      bookingStatusClassNames[booking.status]
                    }`}
                  >
                    {booking.status}
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

export default BookingsTable
