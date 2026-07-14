import React, { useEffect, useState } from 'react'
import AdminPageHeader from '../../components/admin/AdminPageHeader'
import BookingsTable from '../../components/admin/BookingsTable'
import { getBookingRows, getAllBookingsAPI, deleteBookingAPI } from '../../lib/adminData'
import toast from 'react-hot-toast'

const BOOKINGS_STORAGE_KEY = 'prince-cinema-bookings'

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

  const handleDelete = async (bookingId) => {
    // Delete from backend if it's a valid ID format (not just local placeholder)
    if (bookingId) {
      await deleteBookingAPI(bookingId);
    }
    
    // Remove from local state immediately
    setBookings(prev => {
      const updated = prev.filter(b => (b.id || b._id) !== bookingId)
      // Persist to localStorage
      try {
        localStorage.setItem(BOOKINGS_STORAGE_KEY, JSON.stringify(updated))
        window.dispatchEvent(new Event('bookings-updated'))
      } catch (e) {
        console.error('Failed to persist booking deletion', e)
      }
      return updated
    })
    toast.success('Booking deleted successfully')
  }

  return (
    <section className="space-y-6">
      <AdminPageHeader
        badge="Booking operations"
        title="List all customer bookings"
        description="Monitor confirmed, pending, and refunded reservations as they come in."
      />

      <BookingsTable bookings={bookings} onDelete={handleDelete} />
    </section>
  )
}

export default ListBookings
