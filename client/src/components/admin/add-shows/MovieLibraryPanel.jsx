import React from 'react'
import AdminMovieGrid from '../AdminMovieGrid'

const MovieLibraryPanel = ({ movies }) => {
  return (
    <div className="rounded-lg border border-white/8 bg-gradient-to-br from-white/[0.05] to-transparent p-5">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-slate-400">Movie Library</p>
          <h2 className="mt-1 text-lg font-semibold text-white">Available titles</h2>
        </div>
        <div className="rounded-md bg-white/[0.03] px-3 py-1 text-xs text-white/55">
          {movies.length} titles
        </div>
      </div>

      <AdminMovieGrid movies={movies} />
    </div>
  )
}

export default MovieLibraryPanel
