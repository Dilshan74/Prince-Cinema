import React from 'react'
import { Star } from 'lucide-react'
import BlurCircle from './BlurCircle'
import MovieCard from './MovieCard'
import { useAppContext } from '../context/AppContext'
import { extractMoviesFromShows } from '../lib/movieUtils'

const FeatureSection = () => {
  const { shows } = useAppContext()
  const [showAllMovies, setShowAllMovies] = React.useState(false)

  const movies = React.useMemo(() => extractMoviesFromShows(shows), [shows])

  const primaryMovies = movies.slice(0, 4)
  const extraMovies = movies.slice(4)

  if (movies.length === 0) {
    return (
      <section className="relative overflow-hidden bg-[#05070d] px-6 pb-20 pt-12 md:px-10 lg:px-16">
        <div className="relative mx-auto max-w-7xl rounded-[32px] border border-white/8 bg-[#05070d] px-5 py-8 text-center text-white/70 shadow-[0_0_0_1px_rgba(255,255,255,0.03),0_20px_80px_rgba(0,0,0,0.45)] md:px-8 md:py-10">
          No shows are currently scheduled. Check back later!
        </div>
      </section>
    )
  }

  return (
    <section className="relative overflow-hidden bg-[#05070d] px-6 pb-20 pt-12 md:px-10 lg:px-16">
      <BlurCircle
        color="bg-blue-500/10"
        size="h-48 w-48 md:h-60 md:w-60"
        top="-top-10"
        left="-left-6"
      />
      <BlurCircle
        color="bg-red-500/18"
        size="h-56 w-56 md:h-72 md:w-72"
        top="top-2"
        left="right-0"
      />

      <div className="relative mx-auto max-w-7xl rounded-[32px] border border-white/8 bg-[#05070d] px-5 py-8 shadow-[0_0_0_1px_rgba(255,255,255,0.03),0_20px_80px_rgba(0,0,0,0.45)] md:px-8 md:py-10">
        <div className="mb-8">
          <p className="text-sm font-semibold tracking-wide text-white/90">Now Showing</p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
          {primaryMovies.map((movie) => (
            <MovieCard key={movie._id} movie={movie} />
          ))}
        </div>

        <div
          className={`overflow-hidden transition-all duration-500 ease-in-out ${
            showAllMovies ? 'max-h-[900px] opacity-100 mt-6' : 'max-h-0 opacity-0 mt-0'
          }`}
        >
          <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
            {extraMovies.map((movie) => (
              <MovieCard key={movie._id} movie={movie} />
            ))}
          </div>
        </div>

        {extraMovies.length > 0 && (
          <div className="mt-10 flex justify-center">
            <button
              type="button"
              onClick={() => setShowAllMovies((current) => !current)}
              className="inline-flex items-center gap-2 rounded-md bg-[#ff5c73] px-8 py-3 text-sm font-semibold text-white transition hover:bg-[#ff4c67]"
            >
              {showAllMovies ? 'Show less' : 'Show more'}
              <Star className="h-3.5 w-3.5 fill-white text-white/90" />
            </button>
          </div>
        )}
      </div>
    </section>
  )
}

export default FeatureSection
