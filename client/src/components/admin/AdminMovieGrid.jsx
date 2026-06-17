import React from 'react'

const AdminMovieGrid = ({ movies, variant = 'library' }) => {
  return (
    <div className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {movies.map((movie) => (
        <article
          key={movie.id}
          className="overflow-hidden rounded-lg border border-white/8 bg-black/35"
        >
          <div className={`flex h-40 items-end ${movie.posterClassName} p-4`}>
            <div>
              {variant !== 'dashboard' && (
                <span className="inline-flex rounded bg-black/35 px-2 py-1 text-xs font-medium text-white">
                  {movie.rating}
                </span>
              )}
              <p className={`${variant !== 'dashboard' ? 'mt-3' : ''} text-lg font-semibold text-white`}>
                {movie.title}
              </p>
              <p className="mt-1 text-sm text-white/70">{movie.genre}</p>
            </div>
          </div>

          <div className="space-y-3 p-4">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>{movie.duration}</span>
              {variant === 'dashboard' ? <span>{movie.shows.length} shows today</span> : null}
            </div>
            <div className="flex flex-wrap gap-2">
              {movie.shows.map((show) => (
                <span
                  key={show}
                  className="rounded-md bg-white/[0.03] px-2.5 py-1 text-xs text-white/80"
                >
                  {show}
                </span>
              ))}
            </div>
          </div>
        </article>
      ))}
    </div>
  )
}

export default AdminMovieGrid
