import React, { useState, useEffect, useCallback } from 'react'
import AdminPageHeader from '../../components/admin/AdminPageHeader'
import ShowsTable from '../../components/admin/ShowsTable'
import { useAppContext } from '../../context/AppContext'
import axios from 'axios'
import toast from 'react-hot-toast'

const ListShows = () => {
  const { adminToken, fetchshows } = useAppContext()
  const [shows, setShows] = useState([])
  const [loading, setLoading] = useState(true)

  const loadShows = useCallback(async () => {
    try {
      setLoading(true)
      const { data } = await axios.get('/api/show/all')
      if (data.success) {
        setShows(data.shows)
      } else {
        toast.error('Failed to load shows')
      }
    } catch (error) {
      toast.error('Failed to load shows')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadShows()
  }, [loadShows])

  const handleDelete = async (showId) => {
    try {
      const { data } = await axios.delete(`/api/show/${showId}`, {
        headers: { Authorization: `Bearer ${adminToken}` }
      })
      if (data.success) {
        toast.success('Show deleted successfully')
        setShows(prev => prev.filter(s => s._id !== showId))
        // Also refresh global shows context so Movies page updates
        if (typeof fetchshows === 'function') fetchshows()
      } else {
        toast.error(data.message || 'Failed to delete show')
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete show')
    }
  }

  return (
    <section className="space-y-6">
      <AdminPageHeader
        badge="Show management"
        title="List all scheduled shows"
        description="Review every screening, its hall assignment, pricing, and availability status in one table."
      />

      <ShowsTable shows={shows} loading={loading} onDelete={handleDelete} />
    </section>
  )
}

export default ListShows
