import React, { useState } from 'react'
import { CalendarDays, Clock3, Film, MapPin, Plus } from 'lucide-react'
import { addScheduledShow } from '../../../lib/adminData'
import toast from 'react-hot-toast'
import AddShowField from './AddShowField'

const inputShellClassName =
  'flex items-center gap-3 rounded-lg border border-white/10 bg-black/25 px-4 py-3'

const movieOptions = [
  'Deadpool & Wolverine',
  'Avatar: The Way of Water',
  'Kung Fu Panda 4',
  'Mission: Impossible - Dead Reckoning Part One',
  'Thunderbolts*',
  'Ballerina',
  'How to Train Your Dragon',
  'Karate Kid: Legends',
  'Guardians of the Galaxy'
]

const AddShowForm = ({ onShowAdded }) => {
  const [formData, setFormData] = useState({
    movie: '',
    date: '',
    showTime: '',
    hall: 'Hall 01',
    price: '1200',
    notes: ''
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!formData.movie?.trim()) {
      toast.error('Please enter a movie title.')
      return
    }

    if (!formData.date || !formData.showTime) {
      toast.error('Please fill in both show date and time.')
      return
    }

    try {
      addScheduledShow(formData)
      toast.success(`Show scheduled successfully for ${formData.movie}!`)
      
      // Reset form
      setFormData({
        movie: '',
        date: '',
        showTime: '',
        hall: 'Hall 01',
        price: '1200',
        notes: ''
      })

      if (onShowAdded) {
        onShowAdded()
      }
    } catch (error) {
      toast.error('Failed to schedule the show.')
    }
  }

  return (
    <div className="rounded-lg border border-white/8 bg-white/[0.03] p-5">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-slate-400">Add Show</p>
          <h2 className="mt-1 text-lg font-semibold text-white">Show details</h2>
        </div>
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#ff4b6a]/10 text-[#ff92a7]">
          <Plus className="h-5 w-5" />
        </div>
      </div>

      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <AddShowField label="Movie title">
          <div className={inputShellClassName}>
            <Film className="h-4 w-4 text-[#ff8098]" />
            <input
              type="text"
              name="movie"
              value={formData.movie}
              onChange={handleChange}
              list="movie-title-options"
              placeholder="Enter or select a movie title"
              className="w-full bg-transparent text-sm text-white outline-none placeholder:text-slate-500"
              required
            />
            <datalist id="movie-title-options">
              {movieOptions.map((title) => (
                <option key={title} value={title} />
              ))}
            </datalist>
          </div>
        </AddShowField>

        <AddShowField label="Show date">
          <div className={inputShellClassName}>
            <CalendarDays className="h-4 w-4 text-[#ff8098]" />
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              className="w-full bg-transparent text-sm text-white outline-none [color-scheme:dark]"
              required
            />
          </div>
        </AddShowField>

        <AddShowField label="Show time">
          <div className={inputShellClassName}>
            <Clock3 className="h-4 w-4 text-[#ff8098]" />
            <input
              type="time"
              name="showTime"
              value={formData.showTime}
              onChange={handleChange}
              className="w-full bg-transparent text-sm text-white outline-none [color-scheme:dark]"
              required
            />
          </div>
        </AddShowField>

        <AddShowField label="Screen / hall">
          <div className={inputShellClassName}>
            <MapPin className="h-4 w-4 text-[#ff8098]" />
            <select
              name="hall"
              value={formData.hall}
              onChange={handleChange}
              className="w-full bg-transparent text-sm text-white outline-none"
            >
              <option className="bg-[#08090f]" value="Hall 01">Hall 01</option>
              <option className="bg-[#08090f]" value="Hall 02">Hall 02</option>
              <option className="bg-[#08090f]" value="Hall 03">Hall 03</option>
            </select>
          </div>
        </AddShowField>

        <AddShowField label="Ticket price">
          <input
            type="text"
            name="price"
            placeholder="1200"
            value={formData.price}
            onChange={handleChange}
            className="w-full rounded-lg border border-white/10 bg-black/25 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-500"
          />
        </AddShowField>

        <AddShowField label="Notes">
          <textarea
            name="notes"
            rows="4"
            placeholder="Special instructions for this screening..."
            value={formData.notes}
            onChange={handleChange}
            className="w-full resize-none rounded-lg border border-white/10 bg-black/25 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-500"
          />
        </AddShowField>

        <button
          type="submit"
          className="inline-flex w-full items-center justify-center rounded-lg bg-[#ff4b6a] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#ff5d79] cursor-pointer"
        >
          Publish show
        </button>
      </form>
    </div>
  )
}

export default AddShowForm
