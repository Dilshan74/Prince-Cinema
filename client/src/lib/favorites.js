const FAVORITES_STORAGE_KEY = 'prince-cinema-favorites'

export const getFavoriteMovies = () => {
  try {
    const storedFavorites = localStorage.getItem(FAVORITES_STORAGE_KEY)
    return storedFavorites ? JSON.parse(storedFavorites) : []
  } catch {
    return []
  }
}

export const saveFavoriteMovies = (movies) => {
  localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(movies))
}

export const isMovieFavorite = (movieId) =>
  getFavoriteMovies().some((movie) => movie._id === movieId)

export const toggleFavoriteMovie = (movie) => {
  const favorites = getFavoriteMovies()
  const exists = favorites.some((item) => item._id === movie._id)

  if (exists) {
    const updatedFavorites = favorites.filter((item) => item._id !== movie._id)
    saveFavoriteMovies(updatedFavorites)
    return { favorites: updatedFavorites, isFavorite: false }
  }

  const updatedFavorites = [movie, ...favorites]
  saveFavoriteMovies(updatedFavorites)
  return { favorites: updatedFavorites, isFavorite: true }
}
