import React, { useState } from 'react'
import { CircleDot, Trash2, X, AlertTriangle } from 'lucide-react'

const statusClassNames = {
  Open: 'bg-emerald-500/15 text-emerald-300',
  Filling: 'bg-amber-500/15 text-amber-300',
  'Almost Full': 'bg-rose-500/15 text-rose-300',
  Confirmed: 'bg-emerald-500/15 text-emerald-300',
}

const formatDateTime = (dt) => {
  if (!dt) return '—'
  const d = new Date(dt)
  const date = d.toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' })
  const time = d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
  return { date, time }
}

// Confirmation modal
const DeleteConfirmModal = ({ show, onConfirm, onCancel }) => {
  if (!show) return null
  const dt = formatDateTime(show.showDateTime)
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
      <div className="w-full max-w-sm rounded-2xl border border-white/10 bg-[#0e0f17] p-6 shadow-2xl">
        <div className="flex items-center gap-3 mb-4">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-red-500/10">
            <AlertTriangle className="h-5 w-5 text-red-400" />
          </div>
          <div>
            <p className="font-semibold text-white">Delete Show</p>
            <p className="text-xs text-white/45 mt-0.5">This action cannot be undone</p>
          </div>
        </div>

        <div className="rounded-xl border border-white/8 bg-white/[0.03] px-4 py-3 mb-5">
          <p className="text-sm font-medium text-white">
            {show.movie?.title || show.movie || 'Unknown Movie'}
          </p>
          {dt && typeof dt === 'object' && (
            <p className="text-xs text-white/45 mt-1">{dt.date} · {dt.time}</p>
          )}
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

const ShowsTable = ({ shows, loading, onDelete }) => {
  const [confirmShow, setConfirmShow] = useState(null)

  const handleDeleteClick = (show) => {
    setConfirmShow(show)
  }

  const handleConfirm = () => {
    if (confirmShow) {
      onDelete(confirmShow._id)
      setConfirmShow(null)
    }
  }

  return (
    <>
      <DeleteConfirmModal
        show={confirmShow}
        onConfirm={handleConfirm}
        onCancel={() => setConfirmShow(null)}
      />

      <div className="overflow-hidden rounded-lg border border-white/8 bg-white/[0.03]">
        <div className="flex items-center justify-between border-b border-white/8 px-5 py-4">
          <div>
            <p className="text-sm font-medium text-slate-400">Shows</p>
            <h2 className="mt-1 text-lg font-semibold text-white">Show list</h2>
          </div>
          <div className="rounded-md bg-black/20 px-3 py-1 text-xs text-white/50">
            {loading ? 'Loading...' : `${shows.length} rows`}
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-16">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-white/10 border-t-[#ff4b6a]" />
          </div>
        ) : shows.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-white/30">
            <CircleDot className="h-10 w-10 mb-3 opacity-40" />
            <p className="text-sm">No shows scheduled yet</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="bg-white/[0.02] text-xs text-white/35 uppercase">
                <tr>
                  <th className="px-5 py-4 font-medium">Movie</th>
                  <th className="px-5 py-4 font-medium">Date</th>
                  <th className="px-5 py-4 font-medium">Time</th>
                  <th className="px-5 py-4 font-medium">Price</th>
                  <th className="px-5 py-4 font-medium">Seats Taken</th>
                  <th className="px-5 py-4 font-medium text-right">Action</th>
                </tr>
              </thead>
              <tbody>
                {shows.map((show) => {
                  const dt = formatDateTime(show.showDateTime)
                  const movieTitle = show.movie?.title || show.movie || '—'
                  const seatsTaken = Array.isArray(show.occupiedSeats) ? show.occupiedSeats.length : 0

                  return (
                    <tr
                      key={show._id}
                      className="border-t border-white/8 text-white/70 hover:bg-white/[0.02] transition"
                    >
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          {show.movie?.poster_path && (
                            <img
                              src={`https://image.tmdb.org/t/p/w92${show.movie.poster_path}`}
                              alt={movieTitle}
                              className="h-10 w-7 rounded object-cover flex-shrink-0"
                            />
                          )}
                          <span className="font-medium text-white">{movieTitle}</span>
                        </div>
                      </td>
                      <td className="px-5 py-4">{dt?.date || '—'}</td>
                      <td className="px-5 py-4">{dt?.time || '—'}</td>
                      <td className="px-5 py-4">
                        {show.showPrice ? `LKR ${Number(show.showPrice).toLocaleString()}` : '—'}
                      </td>
                      <td className="px-5 py-4">
                        <span className={`inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs ${seatsTaken > 0 ? 'bg-amber-500/15 text-amber-300' : 'bg-emerald-500/15 text-emerald-300'}`}>
                          <CircleDot className="h-3 w-3" />
                          {seatsTaken} taken
                        </span>
                      </td>
                      <td className="px-5 py-4 text-right">
                        <button
                          onClick={() => handleDeleteClick(show)}
                          className="inline-flex items-center gap-1.5 rounded-lg border border-red-500/20 bg-red-500/5 px-3 py-1.5 text-xs font-medium text-red-400 hover:bg-red-500/15 hover:border-red-500/40 transition"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                          Delete
                        </button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  )
}

export default ShowsTable
