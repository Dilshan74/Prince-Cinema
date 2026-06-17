import React, { useEffect, useState } from 'react'
import AdminPageHeader from '../../components/admin/AdminPageHeader'
import BookingsTable from '../../components/admin/BookingsTable'
import { getBookingRows } from '../../lib/adminData'

const ListBookings = () => {
  const [bookings, setBookings] = useState(() => getBookingRows())

  useEffect(() => {
    const refreshBookings = () => setBookings(getBookingRows())
    refreshBookings()
    window.addEventListener('bookings-updated', refreshBookings)

    return () => window.removeEventListener('bookings-updated', refreshBookings)
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
