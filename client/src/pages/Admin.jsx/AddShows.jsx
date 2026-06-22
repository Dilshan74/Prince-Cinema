import React, { useState, useEffect } from 'react'
import { fetchNowPlayingMovies } from '../../lib/adminData'
import AdminPageHeader from '../../components/admin/AdminPageHeader'
import AddShowForm from '../../components/admin/add-shows/AddShowForm'
import MovieLibraryPanel from '../../components/admin/add-shows/MovieLibraryPanel'

const AddShows = () => {
  const [movies, setMovies] = useState([])

  const refreshMovies = async () => {
    const m = await fetchNowPlayingMovies()
    setMovies(m)
  }

  useEffect(() => {
    refreshMovies()
  }, [])

  return (
    <section className="space-y-8">
      <AdminPageHeader
        badge="Add Shows"
        title="Schedule a new show"
        description="Pick a title, set the time slot, and publish the screening. The right side previews the available movies already in rotation."
      />

      <div className="grid gap-6 xl:grid-cols-[0.95fr_1.2fr]">
        <AddShowForm onShowAdded={refreshMovies} />
        <MovieLibraryPanel movies={movies} />
      </div>
    </section>
  )
}

export default AddShows
