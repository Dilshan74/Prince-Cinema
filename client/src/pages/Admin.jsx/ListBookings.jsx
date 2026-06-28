import React, { useEffect, useState } from 'react'
import AdminPageHeader from '../../components/admin/AdminPageHeader'
import BookingsTable from '../../components/admin/BookingsTable'
import { getBookingRows, getAllBookingsAPI } from '../../lib/adminData'

const ListBookings = () => {
  const [bookings, setBookings] = useState(() => getBookingRows())

  useEffect(() => {
    const fetchBookings = async () => {
      // Try to fetch from backend API first
      const apiBookings = await getAllBookingsAPI()
      if (apiBookings && apiBookings.length > 0) {
        setBookings(apiBookings)
      } else {
        // Fall back to localStorage
        setBookings(getBookingRows())
      }
    }

    fetchBookings()
    
    const refreshBookings = () => fetchBookings()
    window.addEventListener('bookings-updated', refreshBookings)
    window.addEventListener('storage', refreshBookings)

    return () => {
      window.removeEventListener('bookings-updated', refreshBookings)
      window.removeEventListener('storage', refreshBookings)
    }
  }, [])

  return (
    <section className="space-y-6">
      <AdminPageHeader
        badge="Booking operations"
        title="List all customer bookings"
        description="Monitor confirmed, pending, and refunded reservations as they come in."
      />

      <BookingsTable bookings={bookings} />
    </section>
  )
}

export default ListBookings
