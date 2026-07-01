import React, { useEffect, useState } from 'react'
import { getBookingsForUser, getUserBookingsAPI, getGuestBookingsAPI } from '../lib/adminData'
import { useAppContext } from '../context/AppContext'
import Footer from '../components/Footer'

const MyBookings = () => {
  const { user } = useAppContext()
  const [bookings, setBookings] = useState([])

  useEffect(() => {
    const fetchBookings = async () => {
      // Try to fetch from backend API first
      if (user?._id) {
        const apiBookings = await getUserBookingsAPI(user._id)
        if (apiBookings && apiBookings.length > 0) {
          setBookings(apiBookings)
          return
        }
      } else {
        // For guests, try fetching guest bookings from API
        const guestBookings = await getGuestBookingsAPI()
        if (guestBookings && guestBookings.length > 0) {
          setBookings(guestBookings)
          return
        }
      }

      // Fallback to local storage if API is empty/fails
      setBookings(getBookingsForUser(user?._id || null))
    }

    fetchBookings()
    
    const refreshBookings = () => fetchBookings()
    window.addEventListener('bookings-updated', refreshBookings)
    window.addEventListener('storage', refreshBookings)

    return () => {
      window.removeEventListener('bookings-updated', refreshBookings)
      window.removeEventListener('storage', refreshBookings)
    }
  }, [user])

  return (
    <main className="min-h-screen bg-[#05070d] pt-24 text-white">
      <section className="mx-auto max-w-6xl px-6 py-12">
        <div className="mb-8">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[#ff7b91]">Your bookings</p>
          <h1 className="mt-2 text-3xl font-semibold">Tickets you have booked</h1>
        </div>

        {bookings.length === 0 ? (
          <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-8 text-center text-white/70">
            No bookings yet. Choose a movie and confirm your seats to create one.
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {bookings.map((booking) => (
              <article key={booking.id} className="rounded-2xl border border-white/10 bg-white/[0.04] p-5 shadow-[0_10px_30px_rgba(0,0,0,0.28)]">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-white">{booking.movie}</p>
                    <p className="mt-1 text-sm text-white/60">Seats: {booking.seats}</p>
                  </div>
                  <span className="rounded-full bg-[#ff5d7a]/20 px-3 py-1 text-xs font-medium text-[#ff9aad]">
                    {booking.status}
                  </span>
                </div>
                <div className="mt-4 flex items-center justify-between text-sm text-white/60">
                  <span>{booking.total}</span>
                  <span>{booking.bookedAt}</span>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
      <Footer />
    </main>
  )
}

export default MyBookings
