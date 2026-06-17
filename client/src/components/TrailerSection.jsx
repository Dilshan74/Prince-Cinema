import React from 'react'
import { Play, Sparkles } from 'lucide-react'

const trailers = [
  {
    id: 'trailer-1',
    title: 'Guardians of the Galaxy',
    category: 'Featured Premiere',
    duration: '2m 12s',
    image:
      'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=1400&q=80',
  },
  {
    id: 'trailer-2',
    title: 'The Batman',
    category: 'Dark Action',
    duration: '1m 48s',
    image:
      'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'trailer-3',
    title: 'Dune: Part Two',
    category: 'Epic Sci-Fi',
    duration: '2m 03s',
    image:
      'https://images.unsplash.com/photo-1518929458119-e5bf444c30f4?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'trailer-4',
    title: 'Doctor Strange',
    category: 'Multiverse',
    duration: '1m 55s',
    image:
      'https://images.unsplash.com/photo-1440404653325-ab127d49abc1?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'trailer-5',
    title: 'Black Widow',
    category: 'Spy Thriller',
    duration: '2m 09s',
    image:
      'https://images.unsplash.com/photo-1478720568477-152d9b164e26?auto=format&fit=crop&w=800&q=80',
  },
]

const TrailerSection = () => {
  const [currentTrailer, setCurrentTrailer] = React.useState(trailers[0])

  return (
    <section className="relative overflow-hidden bg-[#05070d] px-6 py-20 md:px-10 lg:px-16">
      <div className="absolute left-0 top-8 h-[340px] w-[340px] rounded-full bg-blue-500/10 blur-[130px]" />
      <div className="absolute right-0 top-0 h-[420px] w-[420px] rounded-full bg-red-500/10 blur-[140px]" />
      <div className="relative mx-auto max-w-7xl">
        <div className="mb-8 flex items-center justify-between gap-4">
          <div>
            <p className="text-xl font-semibold text-white">Trailers</p>
            <p className="mt-2 max-w-xl text-sm text-white/55">
              Step into the biggest stories playing this week.
            </p>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[minmax(0,1.45fr)_minmax(280px,0.75fr)]">
          <button
            type="button"
            onClick={() => setCurrentTrailer(currentTrailer)}
            className="group relative block w-full overflow-hidden rounded-[26px] border border-white/10 bg-[#111827] text-left shadow-[0_24px_80px_rgba(0,0,0,0.36)]"
          >
            <img
              src={currentTrailer.image}
              alt={currentTrailer.title}
              className="aspect-[16/8.8] w-full object-cover transition duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(5,7,13,0.08)_0%,rgba(5,7,13,0.34)_48%,rgba(5,7,13,0.88)_100%)]" />
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="flex h-18 w-18 items-center justify-center rounded-full border border-white/80 bg-black/30 text-white backdrop-blur-sm">
                <Play className="ml-1 h-9 w-9 fill-white text-white" />
              </span>
            </div>
            <div className="absolute inset-x-0 bottom-0 p-6 md:p-8">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-medium text-white/80 backdrop-blur-sm">
                <Sparkles className="h-3.5 w-3.5 text-[#ff5c73]" />
                {currentTrailer.category}
              </div>
              <div className="mt-4 flex items-end justify-between gap-4">
                <div>
                  <h3 className="text-2xl font-semibold text-white md:text-3xl">
                    {currentTrailer.title}
                  </h3>
                  <p className="mt-2 text-sm text-white/65">{currentTrailer.duration}</p>
                </div>
              </div>
            </div>
          </button>

          <div className="rounded-[26px] border border-white/10 bg-white/[0.03] p-4 shadow-[0_20px_60px_rgba(0,0,0,0.28)] backdrop-blur-sm">
            <div className="space-y-3">
              {trailers.map((trailer) => {
                const isActive = trailer.id === currentTrailer.id

                return (
                  <button
                    key={trailer.id}
                    type="button"
                    onClick={() => setCurrentTrailer(trailer)}
                    className={`flex w-full items-center gap-4 rounded-2xl border p-3 text-left transition ${
                      isActive
                        ? 'border-[#ff5c73]/50 bg-[#ff5c73]/10'
                        : 'border-white/8 bg-white/[0.02] hover:border-white/18 hover:bg-white/[0.04]'
                    }`}
                  >
                    <div className="relative w-28 shrink-0 overflow-hidden rounded-xl">
                      <img
                        src={trailer.image}
                        alt={trailer.title}
                        className="aspect-video w-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black/18" />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="flex h-8 w-8 items-center justify-center rounded-full border border-white/75 bg-black/30 text-white backdrop-blur-sm">
                          <Play className="ml-0.5 h-4 w-4 fill-white text-white" />
                        </span>
                      </div>
                    </div>

                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-white">{trailer.title}</p>
                      <p className="mt-1 text-xs text-white/50">{trailer.category}</p>
                      <p className="mt-2 text-xs text-white/35">{trailer.duration}</p>
                    </div>
                  </button>
                )
              })}
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}

export default TrailerSection
