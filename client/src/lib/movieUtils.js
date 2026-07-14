import { getPublicMovies } from './adminData'

export const TMDB_IMAGE_BASE = 'https://image.tmdb.org/t/p/original'

export const buildMovieFromBackendShow = (show) => {
  const m = show.movie
  if (!m || typeof m !== 'object') return null
  const posterPath = m.poster_path
  const isValidPoster = posterPath && posterPath !== '/images/placeholder.png'
  
  let image = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='800' height='1200' viewBox='0 0 800 1200'%3E%3Crect width='800' height='1200' fill='%231a2235'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='sans-serif' font-size='40' fill='%234a5d85'%3ENo Image%3C/text%3E%3C/svg%3E"
  if (isValidPoster) {
    if (posterPath.startsWith('http')) {
      if (posterPath.includes('localhost')) {
        try {
          const url = new URL(posterPath);
          image = `${window.location.protocol}//${window.location.hostname}:${url.port}${url.pathname}`;
        } catch (e) {
          image = posterPath;
        }
      } else {
        image = posterPath;
      }
    } else {
      image = `${TMDB_IMAGE_BASE}${posterPath.startsWith('/') ? '' : '/'}${posterPath}`;
    }
  } else {
    const localMovies = getPublicMovies()
    const local = localMovies.find(lm => lm.title?.trim().toLowerCase() === m.title?.trim().toLowerCase())
    if (local && local.image) {
      image = local.image
    }
  }
  const releaseYear = m.release_date ? new Date(m.release_date).getFullYear() : new Date().getFullYear()
  return {
    _id: String(m._id),
    title: m.title,
    year: releaseYear,
    genres: Array.isArray(m.genres) ? m.genres : ['Drama'],
    duration: m.runtime || 0,
    rating: m.vote_average ? String(m.vote_average) : 'TBA',
    image,
    language: m.original_language?.toUpperCase() || 'ENGLISH',
    overview: m.overview || '',
    casts: m.casts || [],
    dateOptions: [],
    timeOptions: [],
    shows: [],
  }
}

export const extractMoviesFromShows = (backendShows) => {
  if (!Array.isArray(backendShows)) return []

  const movieMap = new Map()

  backendShows.forEach(show => {
    const m = show.movie
    if (!m || typeof m !== 'object') return
    const id = String(m._id)
    const dt = new Date(show.showDateTime)
    
    const day = dt.getDate().toString()
    const month = dt.toLocaleString('en-US', { month: 'short' })
    const timeStr = dt.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false })

    let existing = movieMap.get(id)
    if (!existing) {
      existing = buildMovieFromBackendShow(show)
      if (!existing) return
      movieMap.set(id, existing)
    }

    // Add to dateOptions
    const hasDate = existing.dateOptions.some(d => d.day === day && d.month === month)
    if (!hasDate) {
      existing.dateOptions.push({ day, month })
    }

    // Add to timeOptions
    if (!existing.timeOptions.includes(timeStr)) {
      existing.timeOptions.push(timeStr)
      existing.timeOptions.sort()
    }

    // Add to shows
    if (!existing.shows.includes(timeStr)) existing.shows.push(timeStr)
  })

  return Array.from(movieMap.values())
}
