import React, { useState, useEffect, useCallback } from 'react'

import { fetchNowPlayingMovies } from '../../lib/adminData'
import AdminPageHeader from '../../components/admin/AdminPageHeader'
import AddShowForm from '../../components/admin/add-shows/AddShowForm'
import MovieLibraryPanel from '../../components/admin/add-shows/MovieLibraryPanel'

const AddShows = () => {
  const [movies, setMovies] = useState([])
  const [loading, setLoading] = useState(false)

  const refreshMovies = useCallback(async () => {
    setLoading(true)

    try {
      const res = await fetchNowPlayingMovies()

      // FIX: correctly extract shows array
      if (res?.success) {
        setMovies(res.shows || [])
      } else {
        setMovies([])
      }

    } catch (error) {
      console.error("Failed to fetch movies:", error)
      setMovies([])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    refreshMovies()
  }, [refreshMovies])

  return (
    <section className="space-y-8">
      <AdminPageHeader
        badge="Add Shows"
        title="Schedule a new show"
        description="Pick a title, set the time slot, and publish the screening. The right side previews the available movies already in rotation."
      />

      <div className="grid gap-6 xl:grid-cols-[0.95fr_1.2fr]">
        <AddShowForm onShowAdded={refreshMovies} />

        <MovieLibraryPanel
          movies={movies}
          loading={loading}
        />
      </div>
    </section>
  )
}

export default AddShows