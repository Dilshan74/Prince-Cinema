import React, { useState } from 'react'
import { TicketCheck, Trash2, AlertTriangle } from 'lucide-react'

const bookingStatusClassNames = {
  Confirmed: 'bg-emerald-500/15 text-emerald-300',
  Pending: 'bg-amber-500/15 text-amber-300',
  Refunded: 'bg-white/10 text-slate-200',
}

// Confirmation modal
const DeleteConfirmModal = ({ booking, onConfirm, onCancel }) => {
  if (!booking) return null
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
      <div className="w-full max-w-sm rounded-2xl border border-white/10 bg-[#0e0f17] p-6 shadow-2xl">
        <div className="flex items-center gap-3 mb-4">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-red-500/10">
            <AlertTriangle className="h-5 w-5 text-red-400" />
          </div>
          <div>
            <p className="font-semibold text-white">Delete Booking</p>
            <p className="text-xs text-white/45 mt-0.5">This action cannot be undone</p>
          </div>
        </div>

        <div className="rounded-xl border border-white/8 bg-white/[0.03] px-4 py-3 mb-5 space-y-1">
          <p className="text-sm font-medium text-white">{booking.customer}</p>
          <p className="text-xs text-white/45">{booking.movie} · {booking.seats}</p>
          <p className="text-xs text-white/45">Booking ID: {booking.id || booking._id}</p>
        </div>

        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 rounded-xl border border-white/10 bg-white/[0.04] py-2.5 text-sm font-medium text-white/70 hover:bg-white/[0.08] transition"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 rounded-xl bg-red-500 py-2.5 text-sm font-semibold text-white hover:bg-red-600 transition"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  )
}

const BookingsTable = ({ bookings, onDelete }) => {
  const [confirmBooking, setConfirmBooking] = useState(null)

  const handleConfirm = () => {
    if (confirmBooking) {
      onDelete?.(confirmBooking.id || confirmBooking._id)
      setConfirmBooking(null)
    }
  }

  return (
    <>
      <DeleteConfirmModal
        booking={confirmBooking}
        onConfirm={handleConfirm}
        onCancel={() => setConfirmBooking(null)}
      />

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
                <th className="px-5 py-4 font-medium text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((booking) => (
                <tr
                  key={booking.id || booking._id}
                  className="border-t border-white/8 text-white/70 hover:bg-white/[0.02] transition"
                >
                  <td className="px-5 py-4 font-medium text-white">{booking.id || booking._id}</td>
                  <td className="px-5 py-4">{booking.customer}</td>
                  <td className="px-5 py-4">{booking.movie}</td>
                  <td className="px-5 py-4">{booking.seats}</td>
                  <td className="px-5 py-4">{booking.total}</td>
                  <td className="px-5 py-4">{booking.bookedAt}</td>
                  <td className="px-5 py-4">
                    <span
                      className={`inline-flex rounded-md px-3 py-1 text-xs ${
                        bookingStatusClassNames[booking.status] || 'bg-white/10 text-white/50'
                      }`}
                    >
                      {booking.status}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-right">
                    <button
                      onClick={() => setConfirmBooking(booking)}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-red-500/20 bg-red-500/5 px-3 py-1.5 text-xs font-medium text-red-400 hover:bg-red-500/15 hover:border-red-500/40 transition"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  )
}

export default BookingsTable
