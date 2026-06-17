import React from 'react'
import Footer from '../components/Footer'
import MovieCard from '../components/MovieCard'
import { getFavoriteMovies } from '../lib/favorites'

const Favourite = () => {
  const [favoriteMovies, setFavoriteMovies] = React.useState([])

  React.useEffect(() => {
    setFavoriteMovies(getFavoriteMovies())
  }, [])

  return (
    <main className="min-h-screen bg-[#05070d] px-6 pb-20 pt-28 md:px-10 lg:px-16">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8">
          <p className="text-sm font-semibold tracking-wide text-white/90">Favorite Movies</p>
          <h1 className="mt-2 text-3xl font-semibold text-white md:text-4xl">Your Favorites</h1>
        </div>

        {favoriteMovies.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
            {favoriteMovies.map((movie) => (
              <MovieCard key={movie._id} movie={movie} showActions={false} />
            ))}
          </div>
        ) : (
          <div className="rounded-3xl border border-white/10 bg-[#111827] px-6 py-12 text-center text-white/65">
            No favorite movies yet. Tap the heart button on a movie to add it here.
          </div>
        )}
      </div>

      <Footer />
    </main>
  )
}

export default Favourite
