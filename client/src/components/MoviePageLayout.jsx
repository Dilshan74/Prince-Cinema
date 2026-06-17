import React from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { CalendarDays, Clock3, Heart, Star } from 'lucide-react'
import Footer from './Footer'
import MovieCard from './MovieCard'
import { assets } from '../assets/assets'
import { getFavoriteMovies, toggleFavoriteMovie } from '../lib/favorites'
import { getPublicMovies, getScheduledShows } from '../lib/adminData'

const defaultCastMembers = [
  { id: 'chris-pratt', name: 'Chris Pratt', role: 'Star-Lord', image: 'https://people.com/thmb/7gM4cQZ8gRxJ_u75YJioGjo0zRo=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc():focal(734x399:736x401)/Chris-Pratt-Guardians-01-050323-0a32195605b14891b0bf937cdaf5bf96.jpg' },
  { id: 'zoe-saldana', name: 'Zoe Saldana', role: 'Gamora', image: 'https://tse2.mm.bing.net/th/id/OIP.r_POWGfjfu47tUgADsxldgHaHa?rs=1&pid=ImgDetMain&o=7&rm=3' },
  { id: 'dave-bautista', name: 'Dave Bautista', role: 'Drax', image: 'https://www.hollywoodreporter.com/wp-content/uploads/2024/07/Dave-Bautista-getty-H-2024.jpg?w=1296&h=730&crop=1' },
  { id: 'bradley-cooper', name: 'Bradley Cooper', role: 'Rocket (voice)', image: 'https://akns-images.eonline.com/eol_images/Entire_Site/202439/rs_1200x1200-240409161639-1200-bradley-cooper.jpg?fit=around|1080:1080&output-quality=90&crop=1080:1080;center,top' },
  { id: 'vin-diesel', name: 'Vin Diesel', role: 'Groot (voice)', image: 'https://people.com/thmb/EGyaZe48ER9McpVFbzHHK0eY51I=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc():focal(1059x612:1061x614)/vin-diesel-fast-x-051223-98d83eb6f05d4881bc96b248a1cd0ceb.jpg' },
]

const movieCastMap = {
  'guardians of the galaxy': [
    { id: 'chris-pratt', name: 'Chris Pratt', role: 'Peter Quill', image: 'https://people.com/thmb/7gM4cQZ8gRxJ_u75YJioGjo0zRo=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc():focal(734x399:736x401)/Chris-Pratt-Guardians-01-050323-0a32195605b14891b0bf937cdaf5bf96.jpg' },
    { id: 'zoe-saldana', name: 'Zoe Saldaña', role: 'Gamora', image: 'https://tse2.mm.bing.net/th/id/OIP.r_POWGfjfu47tUgADsxldgHaHa?rs=1&pid=ImgDetMain&o=7&rm=3' },
    { id: 'dave-bautista', name: 'Dave Bautista', role: 'Drax', image: 'https://www.hollywoodreporter.com/wp-content/uploads/2024/07/Dave-Bautista-getty-H-2024.jpg?w=1296&h=730&crop=1' },
    { id: 'vin-diesel', name: 'Vin Diesel', role: 'Groot', image: 'https://people.com/thmb/EGyaZe48ER9McpVFbzHHK0eY51I=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc():focal(1059x612:1061x614)/vin-diesel-fast-x-051223-98d83eb6f05d4881bc96b248a1cd0ceb.jpg' },
  ],
  'deadpool & wolverine': [
    { id: 'ryan-reynolds', name: 'Ryan Reynolds', role: 'Deadpool', image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=300&q=80' },
    { id: 'hugh-jackman', name: 'Hugh Jackman', role: 'Wolverine', image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80' },
    { id: 'morena-baccarin', name: 'Morena Baccarin', role: 'Vanessa', image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=300&q=80' },
  ],
  'avatar: the way of water': [
    { id: 'sam-worthington', name: 'Sam Worthington', role: 'Jake Sully', image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=300&q=80' },
    { id: 'zoe-saldana', name: 'Zoe Saldaña', role: 'Neytiri', image: 'https://tse2.mm.bing.net/th/id/OIP.r_POWGfjfu47tUgADsxldgHaHa?rs=1&pid=ImgDetMain&o=7&rm=3' },
    { id: 'sigourney-weaver', name: 'Sigourney Weaver', role: 'Kiri', image: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=300&q=80' },
  ],
  'kung fu panda 4': [
    { id: 'jack-black', name: 'Jack Black', role: 'Po', image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=300&q=80' },
    { id: 'awkwafina', name: 'Awkwafina', role: 'Zhen', image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=300&q=80' },
    { id: 'bryan-cranston', name: 'Bryan Cranston', role: 'Li Shan', image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80' },
  ],
  'mission: impossible - dead reckoning part one': [
    { id: 'tom-cruise', name: 'Tom Cruise', role: 'Ethan Hunt', image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=300&q=80' },
    { id: 'hayley-atwell', name: 'Hayley Atwell', role: 'Grace', image: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=300&q=80' },
    { id: 'simon-pegg', name: 'Simon Pegg', role: 'Benji', image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=300&q=80' },
  ],
  'thunderbolts*': [
    { id: 'florence-pugh', name: 'Florence Pugh', role: 'Yelena Belova', image: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=300&q=80' },
    { id: 'sebastian-stan', name: 'Sebastian Stan', role: 'Bucky Barnes', image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80' },
    { id: 'david-harbour', name: 'David Harbour', role: 'Red Guardian', image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=300&q=80' },
  ],
  'ballerina': [
    { id: 'ana-de-armas', name: 'Ana de Armas', role: 'Eve Macarro', image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=300&q=80' },
    { id: 'keanu-reeves', name: 'Keanu Reeves', role: 'John Wick', image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=300&q=80' },
    { id: 'gabriel-byrne', name: 'Gabriel Byrne', role: 'The Director', image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80' },
  ],
  'how to train your dragon': [
    { id: 'jay-baruchel', name: 'Jay Baruchel', role: 'Hiccup', image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=300&q=80' },
    { id: 'gerard-butler', name: 'Gerard Butler', role: 'Stoick', image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80' },
    { id: 'america-ferrera', name: 'America Ferrera', role: 'Astrid', image: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=300&q=80' },
  ],
  'karate kid: legends': [
    { id: 'ben-wang', name: 'Ben Wang', role: 'Li Fong', image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=300&q=80' },
    { id: 'jackie-chan', name: 'Jackie Chan', role: 'Mr. Han', image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=300&q=80' },
    { id: 'ralph-macchio', name: 'Ralph Macchio', role: 'Daniel LaRusso', image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80' },
  ],
}

const getCastMembers = (movie) => {
  const title = (movie?.title || '').trim().toLowerCase()
  return movieCastMap[title] || defaultCastMembers
}

const featuredMovie = {
  _id: 'guardians-of-the-galaxy',
  title: 'Guardians of the Galaxy',
  year: 2014,
  genres: ['Sci-Fi', 'Action', 'Adventure'],
  duration: 128,
  rating: 8.0,
  image: assets.hero,
  language: 'ENGLISH',
  overview:
    'Peter Quill joins forces with Gamora, Drax, Rocket, and Groot to protect a powerful orb and become an unlikely team of heroes.',
  dateOptions: [
    { day: '15', month: 'Thu' },
    { day: '16', month: 'Fri' },
    { day: '18', month: 'Sun' },
    { day: '20', month: 'Tue' },
  ],
  timeOptions: ['11:30', '14:45', '18:10', '21:15'],
}

const recommendedMovies = [
  {
    _id: 'deadpool-wolverine',
    title: 'Deadpool & Wolverine',
    year: 2024,
    genres: ['Action', 'Comedy'],
    duration: 128,
    rating: 7.6,
    image: 'https://image.tmdb.org/t/p/w500/8cdWjvZQUExUUTzyp4t6EDMubfO.jpg',
    language: 'ENGLISH',
    overview: 'Deadpool teams up with Wolverine for a chaotic multiverse mission packed with sharp humor, brutal action, and Marvel-sized stakes.',
    dateOptions: [
      { day: '16', month: 'Fri' },
      { day: '17', month: 'Sat' },
      { day: '19', month: 'Mon' },
      { day: '21', month: 'Wed' },
    ],
    timeOptions: ['10:45', '13:20', '16:40', '22:00'],
  },
  {
    _id: 'avatar-way-of-water',
    title: 'Avatar: The Way of Water',
    year: 2022,
    genres: ['Sci-Fi', 'Adventure'],
    duration: 192,
    rating: 7.6,
    image: 'https://image.tmdb.org/t/p/w500/t6HIqrRAclMCA60NsSmeqe9RmNV.jpg',
    language: 'ENGLISH',
    overview: 'Jake Sully and Neytiri fight to protect their family as the oceans of Pandora reveal new allies, new dangers, and breathtaking worlds.',
    dateOptions: [
      { day: '15', month: 'Thu' },
      { day: '17', month: 'Sat' },
      { day: '18', month: 'Sun' },
      { day: '22', month: 'Thu' },
    ],
    timeOptions: ['09:30', '13:00', '17:30', '20:50'],
  },
  {
    _id: 'kung-fu-panda-4',
    title: 'Kung Fu Panda 4',
    year: 2024,
    genres: ['Animation', 'Comedy'],
    duration: 94,
    rating: 6.9,
    image: 'https://image.tmdb.org/t/p/w500/kDp1vUBnMpe8ak4rjgl3cLELqjU.jpg',
    language: 'ENGLISH',
    overview: 'Po faces a shape-shifting villain while searching for the next Dragon Warrior, balancing humor, heart, and fast martial-arts action.',
    dateOptions: [
      { day: '16', month: 'Fri' },
      { day: '18', month: 'Sun' },
      { day: '20', month: 'Tue' },
      { day: '23', month: 'Fri' },
    ],
    timeOptions: ['08:50', '12:15', '15:10', '19:25'],
  },
  {
    _id: 'mission-impossible-dead-reckoning',
    title: 'Mission: Impossible - Dead Reckoning Part One',
    year: 2023,
    genres: ['Action', 'Spy'],
    duration: 163,
    rating: 7.7,
    image: 'https://image.tmdb.org/t/p/w500/NNxYkU70HPurnNCSiCjYAmacwm.jpg',
    language: 'ENGLISH',
    overview: 'Ethan Hunt races across the globe to stop a dangerous intelligence threat before it falls into the wrong hands.',
    dateOptions: [
      { day: '17', month: 'Sat' },
      { day: '18', month: 'Sun' },
      { day: '21', month: 'Wed' },
      { day: '24', month: 'Sat' },
    ],
    timeOptions: ['11:00', '14:30', '18:45', '21:40'],
  },
  {
    _id: 'thunderbolts',
    title: 'Thunderbolts*',
    year: 2025,
    genres: ['Action', 'Adventure'],
    duration: 126,
    rating: 7.3,
    image: 'https://image.tmdb.org/t/p/w500/m9EtP1Yrzv6v7dMaC9mRaGhd1um.jpg',
    language: 'ENGLISH',
    overview: 'A dangerous team of antiheroes is pushed into a high-risk mission where survival depends on trust they do not really have.',
    dateOptions: [
      { day: '15', month: 'Thu' },
      { day: '19', month: 'Mon' },
      { day: '22', month: 'Thu' },
      { day: '25', month: 'Sun' },
    ],
    timeOptions: ['10:10', '13:50', '17:05', '20:35'],
  },
  {
    _id: 'ballerina',
    title: 'Ballerina',
    year: 2025,
    genres: ['Action', 'Thriller'],
    duration: 124,
    rating: 7.0,
    image: 'https://image.tmdb.org/t/p/w500/2VUmvqsHb6cEtdfscEA6fqqVzLg.jpg',
    language: 'ENGLISH',
    overview: 'An assassin trained in the Ruska Roma tradition hunts for revenge through a stylish, violent underworld.',
    dateOptions: [
      { day: '16', month: 'Fri' },
      { day: '20', month: 'Tue' },
      { day: '22', month: 'Thu' },
      { day: '26', month: 'Mon' },
    ],
    timeOptions: ['12:40', '16:00', '19:10', '22:20'],
  },
  {
    _id: 'how-to-train-your-dragon',
    title: 'How to Train Your Dragon',
    year: 2010,
    genres: ['Animation', 'Adventure'],
    duration: 98,
    rating: 8.1,
    image: 'https://image.tmdb.org/t/p/w500/ygGmAO60t8GyqUo9xYeYxSZAR3b.jpg',
    language: 'ENGLISH',
    overview: 'A young Viking forms an unexpected bond with a dragon and changes the future of his village forever.',
    dateOptions: [
      { day: '15', month: 'Thu' },
      { day: '17', month: 'Sat' },
      { day: '20', month: 'Tue' },
      { day: '21', month: 'Wed' },
    ],
    timeOptions: ['09:45', '12:30', '15:55', '18:25'],
  },
  {
    _id: 'karate-kid',
    title: 'Karate Kid: Legends',
    year: 2025,
    genres: ['Action', 'Drama'],
    duration: 118,
    rating: 6.8,
    image: 'https://image.tmdb.org/t/p/w500/AEgggzRr1vZCLY86MAp93li43z.jpg',
    language: 'ENGLISH',
    overview: 'A new generation steps into the dojo, where discipline, heart, and legacy collide in a fresh martial-arts story.',
    dateOptions: [
      { day: '18', month: 'Sun' },
      { day: '19', month: 'Mon' },
      { day: '23', month: 'Fri' },
      { day: '24', month: 'Sat' },
    ],
    timeOptions: ['10:30', '13:40', '17:20', '20:10'],
  },
]

const MoviePageLayout = () => {
  const [showAllMovies, setShowAllMovies] = React.useState(false)
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const initialPublicMovies = React.useMemo(() => getPublicMovies(), [])
  const fallbackFeaturedMovie = initialPublicMovies[0] || featuredMovie
  const fallbackRecommendedMovies = initialPublicMovies.slice(1).length > 0 ? initialPublicMovies.slice(1) : recommendedMovies
  const [dynamicFeaturedMovie, setDynamicFeaturedMovie] = React.useState(fallbackFeaturedMovie)
  const [dynamicRecommendedMovies, setDynamicRecommendedMovies] = React.useState(fallbackRecommendedMovies)
  const [selectedMovie, setSelectedMovie] = React.useState(fallbackFeaturedMovie)
  const [favoriteIds, setFavoriteIds] = React.useState([])
  const activeCastMembers = React.useMemo(() => getCastMembers(selectedMovie), [selectedMovie])
  const [selectedDate, setSelectedDate] = React.useState(fallbackFeaturedMovie.dateOptions[0].day)
  const [selectedTime, setSelectedTime] = React.useState(fallbackFeaturedMovie.timeOptions[0])
  const [isTransitioning, setIsTransitioning] = React.useState(false)
  const detailsRef = React.useRef(null)

  const availableMovies =
    selectedMovie._id === dynamicFeaturedMovie._id
      ? dynamicRecommendedMovies
      : [dynamicFeaturedMovie, ...dynamicRecommendedMovies.filter((movie) => movie._id !== selectedMovie._id)]
  const primaryMovies = availableMovies.slice(0, 4)
  const extraMovies = availableMovies.slice(4)

  const handleMoreInfo = (movie) => {
    setIsTransitioning(true)
    setTimeout(() => {
      setSelectedMovie(movie)
      setTimeout(() => {
        setIsTransitioning(false)
        detailsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }, 80)
    }, 220)
  }


  React.useEffect(() => {
    if (selectedMovie && selectedMovie.dateOptions && selectedMovie.dateOptions.length > 0) {
      setSelectedDate(selectedMovie.dateOptions[0].day)
    }
  }, [selectedMovie])

  const [activeTimeOptions, setActiveTimeOptions] = React.useState([])


  React.useEffect(() => {
    if (!selectedMovie) return

    let shows = []
    try {
      shows = getScheduledShows()
    } catch (e) {
      console.error(e)
    }

    const matchingShows = shows.filter(show => {
      if (show.movie !== selectedMovie.title) return false
      const parts = show.date.split(' ')
      if (parts.length >= 2) {
        const day = parts[1].replace(',', '')
        return day === selectedDate
      }
      return false
    })

    const dynamicTimes = matchingShows.map(show => {
      const timeStr = show.showTime
      const [timePart, ampm] = timeStr.split(' ')
      const [hourStr, minStr] = timePart.split(':')
      let hour = parseInt(hourStr, 10)
      if (ampm === 'PM' && hour < 12) hour += 12
      if (ampm === 'AM' && hour === 12) hour = 0
      const formattedHour = String(hour).padStart(2, '0')
      return `${formattedHour}:${minStr}`
    })

    const isActuallyBaseDate = selectedMovie._id === dynamicFeaturedMovie._id
      ? featuredMovie.dateOptions.some(d => d.day === selectedDate)
      : recommendedMovies.find(m => m._id === selectedMovie._id)?.dateOptions.some(d => d.day === selectedDate)

    const baseTimes = selectedMovie.timeOptions || []
    const timesToShow = isActuallyBaseDate ? [...baseTimes, ...dynamicTimes] : dynamicTimes
    const finalTimes = Array.from(new Set(timesToShow)).sort()

    setActiveTimeOptions(finalTimes)
    if (finalTimes.length > 0) {
      setSelectedTime(finalTimes[0])
    } else {
      setSelectedTime('')
    }
  }, [selectedMovie, selectedDate, dynamicFeaturedMovie, dynamicRecommendedMovies])

  React.useEffect(() => {
    const refreshMovies = () => {
      try {
        const publicMovies = getPublicMovies()
        const updatedFeatured = publicMovies[0] || featuredMovie
        const updatedRecommended = publicMovies.slice(1).length > 0 ? publicMovies.slice(1) : recommendedMovies

        setDynamicFeaturedMovie(updatedFeatured)
        setDynamicRecommendedMovies(updatedRecommended)

        const movieIdParam = searchParams.get('movie')
        if (movieIdParam) {
          if (updatedFeatured._id === movieIdParam) {
            setSelectedMovie(updatedFeatured)
          } else {
            const matchedMovie = updatedRecommended.find((m) => m._id === movieIdParam)
            if (matchedMovie) {
              setSelectedMovie(matchedMovie)
            } else {
              setSelectedMovie(updatedFeatured)
            }
          }
        } else {
          setSelectedMovie(updatedFeatured)
        }
      } catch (e) {
        console.error('Error loading dynamic shows:', e)
      }
    }

    setFavoriteIds(getFavoriteMovies().map((movie) => movie._id))
    refreshMovies()
    window.addEventListener('storage', refreshMovies)
    window.addEventListener('shows-updated', refreshMovies)

    return () => {
      window.removeEventListener('storage', refreshMovies)
      window.removeEventListener('shows-updated', refreshMovies)
    }
  }, [searchParams])

  const handleToggleFavorite = (movie) => {
    const result = toggleFavoriteMovie(movie)
    setFavoriteIds(result.favorites.map((item) => item._id))
  }

  const handleBookNow = () => {
    const params = new URLSearchParams({
      movie: selectedMovie.title,
      date: selectedDate,
      time: selectedTime,
    })

    navigate(`/seat-layout?${params.toString()}`)
  }

  return (
    <main className="bg-[#05070d] pt-24">
      <section className="relative overflow-hidden px-6 pb-18 pt-10 md:px-10 lg:px-16">
        <div className="absolute left-0 top-0 h-[320px] w-[320px] rounded-full bg-red-500/10 blur-[120px]" />
        <div className="absolute right-0 top-30 h-[320px] w-[320px] rounded-full bg-red-500/10 blur-[120px]" />

        <div className="relative mx-auto max-w-7xl">
          <div ref={detailsRef} className="mb-3">
            <p className="text-sm font-semibold tracking-wide text-white/90">Movie Details</p>
          </div>

          <div
            className={`grid items-start gap-10 transition-all duration-500 ease-out lg:grid-cols-[280px_minmax(0,1fr)] ${
              isTransitioning ? 'translate-y-2 opacity-40' : 'translate-y-0 opacity-100'
            }`}
          >
            <div className="mx-auto w-full max-w-[280px]">
              <div className="aspect-square overflow-hidden rounded-2xl border border-white/10 bg-[#131927] shadow-[0_18px_50px_rgba(0,0,0,0.35)]">
                <img
                  src={selectedMovie.image}
                  alt={selectedMovie.title}
                  className="h-full w-full object-cover"
                />
              </div>
            </div>

            <div className="max-w-3xl">
              <p className="text-sm font-medium text-[#ff7b91]">{selectedMovie.language}</p>
              <h1 className="mt-2 text-4xl font-semibold leading-tight text-white md:text-5xl">
                {selectedMovie.title}
              </h1>

              <p className="mt-4 max-w-2xl text-sm leading-7 text-white/60">
                {selectedMovie.overview}
              </p>

              <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-3 text-sm text-white/75">
                {selectedMovie.genres.map((genre) => (
                  <span key={genre}>{genre}</span>
                ))}
                <div className="flex items-center gap-2">
                  <CalendarDays className="h-4 w-4 text-[#ff7b91]" />
                  <span>{selectedMovie.year}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock3 className="h-4 w-4 text-[#ff7b91]" />
                  <span>{Math.floor(selectedMovie.duration / 60)}h {selectedMovie.duration % 60}m</span>
                </div>
              </div>

              <div className="mt-7 flex flex-wrap items-center gap-4">
                <button
                  type="button"
                  onClick={handleBookNow}
                  className="rounded-full bg-[#ff5c73] px-6 py-3 text-sm font-semibold text-white hover:bg-[#ff4b65]"
                >
                  Buy Tickets
                </button>
                <button
                  type="button"
                  onClick={() => handleToggleFavorite(selectedMovie)}
                  className={`inline-flex h-10 w-10 items-center justify-center rounded-full border backdrop-blur-sm ${
                    favoriteIds.includes(selectedMovie._id)
                      ? 'border-[#ff5c73] bg-[#ff5c73] text-white'
                      : 'border-white/10 bg-white/8 text-white/70 hover:text-white'
                  }`}
                >
                  <Heart
                    className={`h-4 w-4 ${favoriteIds.includes(selectedMovie._id) ? 'fill-white' : ''}`}
                  />
                </button>
              </div>
            </div>
          </div>

          <div className="mt-14">
            <p className="mb-5 text-sm font-medium text-white/80">Your Favorite Cast</p>
            <div className="flex flex-wrap gap-5">
              {activeCastMembers.map((member) => (
                <div key={member.id} className="w-[72px] text-center">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="mx-auto h-14 w-14 rounded-full border border-white/12 object-cover"
                  />
                  <p className="mt-2 text-[10px] font-medium text-white/90">{member.name}</p>
                  <p className="text-[9px] text-white/40">{member.role}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-14 rounded-[24px] border border-[#3d1f27] bg-[linear-gradient(90deg,rgba(63,21,32,0.72)_0%,rgba(48,18,27,0.62)_100%)] px-5 py-5 shadow-[0_18px_60px_rgba(0,0,0,0.28)] md:px-6">
            <div className="grid gap-6 lg:grid-cols-[1fr_auto] lg:items-center">
              <div>
                <p className="mb-4 text-sm font-medium text-white">Choose Date</p>
                <div className="flex flex-wrap items-center gap-3">
                  {selectedMovie.dateOptions.map((date) => {
                    const isActive = selectedDate === date.day

                    return (
                      <button
                        key={date.day}
                        type="button"
                        onClick={() => setSelectedDate(date.day)}
                        className={`rounded-lg border px-4 py-2 text-center transition ${
                          isActive
                            ? 'border-[#ff5c73] bg-[#ff5c73] text-white'
                            : 'border-white/10 bg-white/[0.03] text-white/70 hover:border-white/20'
                        }`}
                      >
                        <div className="text-[11px] font-medium">{date.day}</div>
                        <div className="text-[10px]">{date.month}</div>
                      </button>
                    )
                  })}
                </div>

                <p className="mb-3 mt-5 text-sm font-medium text-white">Choose Time</p>
                <div className="flex flex-wrap gap-2">
                  {activeTimeOptions.map((time) => {
                    const isActive = selectedTime === time

                    return (
                      <button
                        key={time}
                        type="button"
                        onClick={() => setSelectedTime(time)}
                        className={`rounded-lg border px-3 py-2 text-xs font-medium transition ${
                          isActive
                            ? 'border-[#ff5c73] bg-[#ff5c73] text-white'
                            : 'border-white/10 bg-white/[0.03] text-white/70 hover:border-white/20'
                        }`}
                      >
                        {time}
                      </button>
                    )
                  })}
                </div>
              </div>

              <button
                type="button"
                onClick={handleBookNow}
                className="rounded-full bg-[#ff5c73] px-12 py-3 text-sm font-semibold text-white hover:bg-[#ff4b65]"
              >
                Book Now
              </button>
            </div>
          </div>

          <div className="mt-18">
            <div className="mb-7 flex items-center justify-between">
              <p className="text-sm font-medium text-white/85">You May Also Like</p>
              <button className="text-xs font-medium text-white/50 hover:text-[#ff7b91]">
                View all
              </button>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
              {primaryMovies.map((movie) => (
                <MovieCard
                  key={movie._id}
                  movie={movie}
                  showMoreInfo
                  onMoreInfo={handleMoreInfo}
                  showFavoriteButton={false}
                />
              ))}
            </div>

            <div
              className={`overflow-hidden transition-all duration-500 ease-in-out ${
                showAllMovies ? 'mt-6 max-h-[900px] opacity-100' : 'mt-0 max-h-0 opacity-0'
              }`}
            >
              <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
                {extraMovies.map((movie) => (
                  <MovieCard
                    key={movie._id}
                    movie={movie}
                    showMoreInfo
                    onMoreInfo={handleMoreInfo}
                    showFavoriteButton={false}
                  />
                ))}
              </div>
            </div>

            <div className="mt-8 flex justify-center">
              <button
                type="button"
                onClick={() => setShowAllMovies((current) => !current)}
                className="inline-flex items-center gap-2 rounded-md bg-[#ff5c73] px-8 py-2.5 text-sm font-semibold text-white hover:bg-[#ff4b65]"
              >
                {showAllMovies ? 'Show less' : 'Show more'}
                <Star className="h-3.5 w-3.5 fill-white text-white/90" />
              </button>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}

export default MoviePageLayout
