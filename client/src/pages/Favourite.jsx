import React from 'react'
import toast from 'react-hot-toast'
import Footer from '../components/Footer'
import MovieCard from '../components/MovieCard'
import { getFavoriteMovies, toggleFavoriteMovie } from '../lib/favorites'
import { useAppContext } from '../context/AppContext'
import { extractMoviesFromShows } from '../lib/movieUtils'

const Favourite = () => {
  const { shows } = useAppContext()
  const [favoriteIds, setFavoriteIds] = React.useState([])

  React.useEffect(() => {
    setFavoriteIds(getFavoriteMovies().map(m => m._id))
  }, [])

  const handleToggleFavorite = (movie) => {
    const { isFavorite, favorites } = toggleFavoriteMovie(movie)
    setFavoriteIds(favorites.map(m => m._id))
    if (isFavorite) {
      toast.success('Added to favorites')
    } else {
      toast.success('Removed from favorites')
    }
  }

  // Get all active playing movies from the backend shows
  const allActiveMovies = React.useMemo(() => extractMoviesFromShows(shows), [shows])

  // Filter them to only include those in favorites
  const favoriteMovies = allActiveMovies.filter((movie) => favoriteIds.includes(movie._id))

  return (
    <main className="min-h-screen flex flex-col bg-[#05070d]">
      <div className="flex-1 px-6 pb-20 pt-28 md:px-10 lg:px-16">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8">
            <p className="text-sm font-semibold tracking-wide text-white/90">Favorite Movies</p>
            <h1 className="mt-2 text-3xl font-semibold text-white md:text-4xl">Your Favorites</h1>
          </div>

          {favoriteMovies.length > 0 ? (
            <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
              {favoriteMovies.map((movie) => (
                <MovieCard 
                  key={movie._id} 
                  movie={movie} 
                  showActions={true}
                  isFavorite={true}
                  onToggleFavorite={handleToggleFavorite}
                />
              ))}
            </div>
          ) : (
            <div className="rounded-3xl border border-white/10 bg-[#111827] px-6 py-12 text-center text-white/65">
              No favorite movies are currently playing. Tap the heart button on a playing movie to add it here.
            </div>
          )}
        </div>
      </div>
      <Footer />
    </main>
  )
}

export default Favourite
