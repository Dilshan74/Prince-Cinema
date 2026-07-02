import React, { useState } from 'react'
import { CalendarDays, Clock3, Film, MapPin, Plus, Trash2 } from 'lucide-react'
import toast from 'react-hot-toast'
import AddShowField from './AddShowField'
import { useAppContext } from '../../../context/AppContext'
import axios from 'axios'

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
  'Guardians of the Galaxy',
]

const AddShowForm = ({ onShowAdded }) => {
  const { adminToken, fetchshows } = useAppContext()
  const [formData, setFormData] = useState({
    movie: '',
    hall: 'Hall 01',
    price: '1200',
    notes: ''
  })
  
  const [showSlots, setShowSlots] = useState([{ date: '', showTime: '' }])
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSlotChange = (index, field, value) => {
    const newSlots = [...showSlots]
    newSlots[index][field] = value
    setShowSlots(newSlots)
  }

  const addSlot = () => {
    setShowSlots([...showSlots, { date: '', showTime: '' }])
  }

  const removeSlot = (index) => {
    if (showSlots.length > 1) {
      setShowSlots(showSlots.filter((_, i) => i !== index))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!formData.movie?.trim()) {
      toast.error('Please enter a movie title.')
      return
    }
    
    // Validate slots
    const validSlots = showSlots.filter(s => s.date && s.showTime)
    if (validSlots.length === 0) {
      toast.error('Please fill in at least one complete show date and time.')
      return
    }

    setIsSubmitting(true)
    try {
      const showInput = validSlots.map(slot => ({
        date: slot.date,
        time: slot.showTime
      }))

      // Call the backend API
      const response = await axios.post(
        '/api/show/add',
        {
          movieTitle: formData.movie.trim(),
          hall: formData.hall,
          showInput,
          showPrice: Number(formData.price) || 1200,
        },
        {
          headers: { Authorization: `Bearer ${adminToken}` }
        }
      )

      if (response.data.success) {
        toast.success(`"${formData.movie}" shows added successfully!`)
        setFormData({
          movie: '',
          hall: 'Hall 01',
          price: '1200',
          notes: ''
        })
        setShowSlots([{ date: '', showTime: '' }])
        // Refresh shows in AppContext so Movies page updates immediately
        if (typeof fetchshows === 'function') fetchshows()
        if (onShowAdded) onShowAdded()
      } else {
        toast.error(response.data.message || 'Failed to add shows.')
      }
    } catch (error) {
      console.error('Add show error:', error)
      toast.error(error.response?.data?.message || 'Failed to add shows. Please try again.')
    } finally {
      setIsSubmitting(false)
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

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-slate-300">Show Date & Time Slots</label>
            <button
              type="button"
              onClick={addSlot}
              className="inline-flex items-center gap-1.5 rounded-lg bg-white/[0.05] px-3 py-1.5 text-xs font-medium text-white hover:bg-white/[0.1] transition"
            >
              <Plus className="h-3.5 w-3.5" />
              Add another slot
            </button>
          </div>
          
          {showSlots.map((slot, index) => (
            <div key={index} className="flex flex-col sm:flex-row gap-3 items-start sm:items-center bg-white/[0.02] p-3 rounded-lg border border-white/5">
              <div className="flex-1 w-full">
                <div className={inputShellClassName}>
                  <CalendarDays className="h-4 w-4 text-[#ff8098]" />
                  <input
                    type="date"
                    value={slot.date}
                    onChange={(e) => handleSlotChange(index, 'date', e.target.value)}
                    className="w-full bg-transparent text-sm text-white outline-none [color-scheme:dark]"
                    required
                  />
                </div>
              </div>
              <div className="flex-1 w-full">
                <div className={inputShellClassName}>
                  <Clock3 className="h-4 w-4 text-[#ff8098]" />
                  <input
                    type="time"
                    value={slot.showTime}
                    onChange={(e) => handleSlotChange(index, 'showTime', e.target.value)}
                    className="w-full bg-transparent text-sm text-white outline-none [color-scheme:dark]"
                    required
                  />
                </div>
              </div>
              {showSlots.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeSlot(index)}
                  className="flex-shrink-0 flex h-11 w-11 items-center justify-center rounded-lg border border-red-500/20 bg-red-500/5 text-red-400 hover:bg-red-500/15 transition"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              )}
            </div>
          ))}
        </div>

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
            </select>
          </div>
        </AddShowField>

        <AddShowField label="Ticket price (LKR)">
          <input
            type="number"
            name="price"
            placeholder="1200"
            value={formData.price}
            onChange={handleChange}
            onWheel={(e) => e.target.blur()}
            min="0"
            className="w-full rounded-lg border border-white/10 bg-black/25 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-500"
          />
        </AddShowField>

        <AddShowField label="Notes">
          <textarea
            name="notes"
            rows="3"
            placeholder="Special instructions for this screening..."
            value={formData.notes}
            onChange={handleChange}
            className="w-full resize-none rounded-lg border border-white/10 bg-black/25 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-500"
          />
        </AddShowField>

        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex w-full items-center justify-center rounded-lg bg-[#ff4b6a] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#ff5d79] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
        >
          {isSubmitting ? 'Publishing...' : 'Publish shows'}
        </button>
      </form>
    </div>
  )
}

export default AddShowForm
