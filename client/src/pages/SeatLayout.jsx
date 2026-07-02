import React from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { Armchair, CalendarDays, Clock3, MapPin, Ticket } from 'lucide-react'
import toast from 'react-hot-toast'
import Footer from '../components/Footer'
import { addBooking, createBookingAPI } from '../lib/adminData'
import { getCurrentSession } from '../lib/auth'
import { useAppContext } from '../context/AppContext'

const leftBlock = [
  ['A1', 'A2', 'A3', 'A4'],
  ['B1', 'B2', 'B3', 'B4'],
  ['C1', 'C2', 'C3', 'C4'],
  ['D1', 'D2', 'D3', 'D4'],
  ['E1', 'E2', 'E3', 'E4'],
  ['F1', 'F2', 'F3', 'F4'],
  ['G1', 'G2', 'G3', 'G4'],
]

const centerBlock = [
  ['A5', 'A6', 'A7', 'A8', 'A9', 'A10'],
  ['B5', 'B6', 'B7', 'B8', 'B9', 'B10'],
  ['C5', 'C6', 'C7', 'C8', 'C9', 'C10'],
  ['D5', 'D6', 'D7', 'D8', 'D9', 'D10'],
  ['E5', 'E6', 'E7', 'E8', 'E9', 'E10'],
  ['F5', 'F6', 'F7', 'F8', 'F9', 'F10'],
  ['G5', 'G6', 'G7', 'G8', 'G9', 'G10'],
]

const rightBlock = [
  ['A11', 'A12', 'A13', 'A14'],
  ['B11', 'B12', 'B13', 'B14'],
  ['C11', 'C12', 'C13', 'C14'],
  ['D11', 'D12', 'D13', 'D14'],
  ['E11', 'E12', 'E13', 'E14'],
  ['F11', 'F12', 'F13', 'F14'],
  ['G11', 'G12', 'G13', 'G14'],
]

const halls = {
  hall1: {
    id: 'hall1',
    label: 'Hall 1',
    title: 'Hall 01',
    showtime: '6:30 PM',
    date: 'Fri, Apr 02',
    availableTickets: '05',
    reservedSeats: new Set(['A3', 'A4', 'B5', 'B6', 'C7', 'D8', 'E6']),
    defaultSelectedSeats: ['E8'],
  },
  hall2: {
    id: 'hall2',
    label: 'Hall 2',
    title: 'Hall 02',
    showtime: '7:30 PM',
    date: 'Fri, Apr 02',
    availableTickets: '03',
    reservedSeats: new Set(['A6', 'A7', 'B7', 'B8', 'C6', 'C7', 'C8', 'D7', 'F8']),
    defaultSelectedSeats: ['E8'],
  },
}

const getSeatClassName = (seatId, selectedSeats, reservedSeats) => {
  if (selectedSeats.includes(seatId)) {
    return 'border-[#ff5d7a] bg-[#ff5d7a] shadow-[0_0_22px_rgba(255,93,122,0.45)]'
  }

  if (reservedSeats.has(seatId)) {
    return 'border-[#7d2234] bg-[#3f121d]/80 text-white/25'
  }

  return 'border-[#8a2a3e]/70 bg-transparent hover:border-[#ff7f96] hover:bg-[#ff5d7a]/12'
}

const SeatBlock = ({ rows, reservedSeats, selectedSeats, onSeatClick }) => {
  return (
    <div className="grid gap-2.5">
      {rows.map((row, rowIndex) => (
        <div key={`row-${rowIndex}`} className="flex gap-2.5">
          {row.map((seatId) => (
            <button
              key={seatId}
              type="button"
              aria-label={`Seat ${seatId}`}
              disabled={reservedSeats.has(seatId)}
              onClick={() => onSeatClick(seatId)}
              className={`h-5 w-5 rounded-[5px] border transition sm:h-6 sm:w-6 ${
                reservedSeats.has(seatId) ? 'cursor-not-allowed' : 'cursor-pointer'
              } ${getSeatClassName(seatId, selectedSeats, reservedSeats)}`}
            />
          ))}
        </div>
      ))}
    </div>
  )
}

const SeatLayout = () => {
  const { user } = useAppContext()
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const selectedMovieTitle = searchParams.get('movie') || 'Selected Movie'
  const selectedDate = searchParams.get('date') || 'Today'
  const selectedTime = searchParams.get('time') || '7:30 PM'
  const showId = searchParams.get('showId') || null
  const [selectedHallId, setSelectedHallId] = React.useState('hall1')
  const [selectedSeatsByHall, setSelectedSeatsByHall] = React.useState(() => ({
    hall1: halls.hall1.defaultSelectedSeats,
    hall2: halls.hall2.defaultSelectedSeats,
  }))
  const [fetchedReservedSeats, setFetchedReservedSeats] = React.useState(new Set())

  React.useEffect(() => {
    if (showId) {
      const fetchOccupied = async () => {
        try {
          const API_URL = import.meta.env.VITE_API_URL || '';
          const res = await fetch(`${API_URL}/api/booking/occupied-seats/${showId}`);
          const data = await res.json();
          if (data.success && data.occupiedSeats) {
            setFetchedReservedSeats(new Set(data.occupiedSeats));
          }
        } catch (err) {
          console.error(err);
        }
      }
      fetchOccupied();
    }
  }, [showId])

  const activeHall = halls[selectedHallId]
  const selectedSeats = selectedSeatsByHall[selectedHallId]
  const reservedSeats = showId ? fetchedReservedSeats : activeHall.reservedSeats

  const handleSeatClick = (seatId) => {
    if (reservedSeats.has(seatId)) {
      return
    }

    setSelectedSeatsByHall((currentState) => {
      const currentSeats = currentState[selectedHallId]
      const maxTickets = parseInt(activeHall.availableTickets, 10)
      const isSelecting = !currentSeats.includes(seatId)

      if (isSelecting && currentSeats.length >= maxTickets) {
        toast.error(`You can only select up to ${maxTickets} seats`)
        return currentState
      }

      return {
        ...currentState,
        [selectedHallId]: currentSeats.includes(seatId)
          ? currentSeats.filter((currentSeat) => currentSeat !== seatId)
          : [...currentSeats, seatId],
      }
    })
  }

  const handleSubmitBooking = async () => {
    if (selectedSeats.length === 0) {
      toast.error('Please select at least one seat before submitting.')
      return
    }

    const ticketPrice = Number(searchParams.get('price')) || 1200
    const total = `LKR ${selectedSeats.length * ticketPrice}`
    
    // Create the booking data matching backend schema
    const bookingData = {
      userId: user?._id || null,
      customer: user?.name || user?.username || 'Guest User',
      movie: selectedMovieTitle,
      showId: showId,
      selectedSeats: selectedSeats, // Backend expects an array
      seats: selectedSeats.join(', '), // Frontend fallback/list expects a string
      total,
      bookedAt: new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }),
      status: 'Confirmed',
    }

    // Try to save to backend first
    const apiBooking = await createBookingAPI(bookingData)
    if (!apiBooking) {
      // Fall back to localStorage if API fails
      addBooking(bookingData)
    }

    toast.success('Your booking was submitted successfully!')
    setSelectedSeatsByHall((currentState) => ({
      ...currentState,
      [selectedHallId]: [],
    }))
    navigate('/my-bookings')
  }

  return (
    <main className="overflow-hidden bg-[#040408] pt-24 text-white">
      <section className="relative px-4 pb-20 pt-8 sm:px-6 md:px-10 lg:px-16">
        <div className="absolute left-1/2 top-28 h-64 w-64 -translate-x-1/2 rounded-full bg-[#ff335f]/10 blur-[120px]" />
        <div className="absolute left-[22%] top-72 h-40 w-40 rounded-full bg-[#ff335f]/8 blur-[90px]" />
        <div className="absolute right-[20%] top-80 h-44 w-44 rounded-full bg-[#ff335f]/8 blur-[90px]" />

        <div className="relative mx-auto max-w-6xl">
          <div className="mb-8 flex flex-wrap items-center justify-center gap-3">
            {Object.values(halls).map((hall) => {
              const isActive = hall.id === selectedHallId

              return (
                <button
                  key={hall.id}
                  type="button"
                  onClick={() => setSelectedHallId(hall.id)}
                  className={`rounded-full border px-6 py-3 text-sm font-semibold transition ${
                    isActive
                      ? 'border-[#ff5d7a] bg-[#ff5d7a] text-white shadow-[0_8px_30px_rgba(255,93,122,0.28)]'
                      : 'border-white/10 bg-white/[0.04] text-white/70 hover:border-[#ff5d7a]/60 hover:text-white'
                  }`}
                >
                  {hall.label}
                </button>
              )
            })}
          </div>

          <div className="grid gap-8 xl:grid-cols-[220px_minmax(0,1fr)]">
            <aside className="h-fit rounded-[20px] border border-white/10 bg-white/[0.04] p-4 shadow-[0_14px_40px_rgba(0,0,0,0.35)] backdrop-blur-xl">
              <p className="text-[10px] uppercase tracking-[0.28em] text-white/45">Auditorium</p>
              <h2 className="mt-2 text-lg font-semibold">{activeHall.title}</h2>

              <div className="mt-5 rounded-2xl border border-[#5d1d2d] bg-[#2b0f18]/70 p-3">
                <div className="flex items-center gap-3">
                  <div className="rounded-xl bg-[#ff5d7a]/20 p-2 text-[#ff6f89]">
                    <Ticket className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-xs text-white/55">Available Tickets (Max per booking)</p>
                    <p className="text-xl font-semibold">{activeHall.availableTickets}</p>
                  </div>
                </div>
              </div>

              <div className="mt-6 space-y-3 rounded-2xl border border-white/8 bg-black/20 p-3 text-xs text-white/55">
                <div className="flex items-center gap-2">
                  <Ticket className="h-3.5 w-3.5 text-[#ff6f89]" />
                  <span>{selectedMovieTitle}</span>
                </div>
                <div className="flex items-center gap-2">
                  <CalendarDays className="h-3.5 w-3.5 text-[#ff6f89]" />
                  <span>{selectedDate}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock3 className="h-3.5 w-3.5 text-[#ff6f89]" />
                  <span>{selectedTime}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="h-3.5 w-3.5 text-[#ff6f89]" />
                  <span>Prince Cinema</span>
                </div>
              </div>
            </aside>

            <div className="rounded-[28px] border border-white/8 bg-[radial-gradient(circle_at_center,rgba(255,72,111,0.14),rgba(6,6,10,0)_44%),linear-gradient(180deg,rgba(255,255,255,0.03),rgba(255,255,255,0.01))] px-4 py-8 shadow-[0_18px_60px_rgba(0,0,0,0.42)] backdrop-blur-sm sm:px-6 lg:px-10">
              <div className="mx-auto max-w-3xl text-center">
                <p className="text-xl font-medium tracking-wide text-white/90">Select Your Seat</p>

                <div className="mx-auto mt-5 flex max-w-xl items-center justify-center">
                  <div className="h-px flex-1 bg-gradient-to-r from-transparent via-[#ff5d7a]/60 to-[#ff5d7a]/90" />
                  <div className="mx-3 rounded-full border border-[#6d2233] bg-[#170b10] px-4 py-1.5 text-[11px] uppercase tracking-[0.32em] text-white/45">
                    Screen
                  </div>
                  <div className="h-px flex-1 bg-gradient-to-l from-transparent via-[#ff5d7a]/60 to-[#ff5d7a]/90" />
                </div>
              </div>

                <div className="mt-10 overflow-x-auto pb-2">
                <div className="mx-auto flex min-w-max items-start justify-center gap-4 sm:gap-6">
                  <div className="mr-1 grid gap-2.5 pt-0.5 text-[11px] font-medium text-white/28">
                    {['A', 'B', 'C', 'D', 'E', 'F', 'G'].map((label) => (
                      <span key={label} className="flex h-5 items-center sm:h-6">
                        {label}
                      </span>
                    ))}
                  </div>

                  <SeatBlock
                    rows={leftBlock}
                    reservedSeats={reservedSeats}
                    selectedSeats={selectedSeats}
                    onSeatClick={handleSeatClick}
                  />
                  <div className="w-4 sm:w-6" />
                  <SeatBlock
                    rows={centerBlock}
                    reservedSeats={reservedSeats}
                    selectedSeats={selectedSeats}
                    onSeatClick={handleSeatClick}
                  />
                  <div className="w-4 sm:w-6" />
                  <SeatBlock
                    rows={rightBlock}
                    reservedSeats={reservedSeats}
                    selectedSeats={selectedSeats}
                    onSeatClick={handleSeatClick}
                  />
                </div>
              </div>

              <div className="mt-8 flex flex-wrap items-center justify-center gap-4 text-xs text-white/55">
                <div className="flex items-center gap-2">
                  <span className="h-3.5 w-3.5 rounded border border-[#8a2a3e]/70" />
                  <span>Available</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="h-3.5 w-3.5 rounded border border-[#7d2234] bg-[#3f121d]/80" />
                  <span>Reserved</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="h-3.5 w-3.5 rounded border border-[#ff5d7a] bg-[#ff5d7a]" />
                  <span>Selected</span>
                </div>
              </div>

              <div className="mt-10 flex flex-col items-center justify-center gap-4">
                <div className="flex items-center gap-3 rounded-full border border-white/10 bg-white/[0.03] px-4 py-2 text-sm text-white/70">
                  <Armchair className="h-4 w-4 text-[#ff6f89]" />
                  <span>
                    {selectedSeats.length > 0 ? `Selected: ${selectedSeats.join(', ')}` : 'No seats selected'}
                  </span>
                  <span className="text-white/30">|</span>
                  <span>{selectedSeats.length} seat{selectedSeats.length === 1 ? '' : 's'}</span>
                </div>

                <button
                  type="button"
                  onClick={handleSubmitBooking}
                  className="rounded-full bg-[#ff5d7a] px-8 py-3 text-sm font-semibold text-white transition hover:bg-[#ff4f6d] disabled:cursor-not-allowed disabled:bg-white/10"
                  disabled={selectedSeats.length === 0}
                >
                  Submit Booking
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}

export default SeatLayout
