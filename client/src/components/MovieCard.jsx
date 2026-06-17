import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Heart, Star } from 'lucide-react'
import timeFormat from '../lib/timeFormat'

const MovieCard = ({
  movie,
  showMoreInfo = false,
  onMoreInfo,
  showActions = true,
  showFavoriteButton = true,
  isFavorite = false,
  onToggleFavorite,
}) => {
  const navigate = useNavigate()
  const previewShows = Array.isArray(movie.shows) ? movie.shows.slice(0, 2) : []
  const showSummary = Array.isArray(movie.shows) && movie.shows.length > 0
    ? `${movie.shows.length} show${movie.shows.length === 1 ? '' : 's'} • ${previewShows.join(', ')}${movie.shows.length > 2 ? ' + more' : ''}`
    : 'Shows coming soon'

  const handleCardClick = () => {
    if (onMoreInfo) {
      onMoreInfo(movie)
    } else {
      navigate(`/movies?movie=${movie._id}`)
    }
  }

  return (
    <article
      className="group rounded-2xl border border-[#24324a] bg-[#182235] p-2.5 text-white shadow-[0_14px_34px_rgba(0,0,0,0.24)] transition duration-300 hover:-translate-y-1 hover:border-[#314465] cursor-pointer"
      onClick={handleCardClick}
    >
      <div className="overflow-hidden rounded-[10px]">
        <img
          src={movie.image}
          alt={movie.title}
          className="h-48 w-full rounded-[10px] object-cover transition duration-500 group-hover:scale-105"
        />
      </div>

      <div className="pt-3">
        <h3 className="line-clamp-1 text-sm font-semibold text-white">{movie.title}</h3>
        <p className="mt-1 text-xs text-white/50">
          {movie.year} - {movie.genres.join(' | ')} - {timeFormat(movie.duration)}
        </p>
        <p className="mt-2 text-[11px] font-medium text-[#ff7b91]">{showSummary}</p>

        <div className="mt-3 flex items-center justify-between gap-3">
          {showActions ? (
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={(event) => {
                  event.stopPropagation()
                  navigate(`/seat-layout?movie=${encodeURIComponent(movie.title)}`)
                }}
                className="rounded-full bg-[#ff5c73] px-3.5 py-1.5 text-[11px] font-semibold text-white transition hover:bg-[#ff4c67]"
              >
                Buy Tickets
              </button>

              {showMoreInfo ? (
                <button
                  type="button"
                  onClick={(event) => {
                    event.stopPropagation()
                    onMoreInfo?.(movie)
                  }}
                  className="rounded-full border border-white/15 bg-white/8 px-3.5 py-1.5 text-[11px] font-semibold text-white transition hover:bg-white/14"
                >
                  More Info
                </button>
              ) : null}

              {showFavoriteButton ? (
                <button
                  type="button"
                  onClick={(event) => {
                    event.stopPropagation()
                    onToggleFavorite?.(movie)
                  }}
                  className={`inline-flex h-7 w-7 items-center justify-center rounded-full border transition ${
                    isFavorite
                      ? 'border-[#ff5c73] bg-[#ff5c73] text-white'
                      : 'border-white/15 bg-white/8 text-white/70 hover:bg-white/14 hover:text-white'
                  }`}
                >
                  <Heart className={`h-3.5 w-3.5 ${isFavorite ? 'fill-white' : ''}`} />
                </button>
              ) : null}
            </div>
          ) : (
            <div />
          )}

          <div className="flex items-center gap-1 text-xs font-medium text-white/60">
            <Star className="h-3.5 w-3.5 fill-[#ff5c73] text-[#ff5c73]" />
            <span>{movie.rating}</span>
          </div>
        </div>
      </div>
    </article>
  )
}

export default MovieCard
