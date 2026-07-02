import React from 'react'
import { Calendar, Clock, Play, Star } from 'lucide-react'
import { assets } from '../assets/assets'

const HeroSection = () => {
  return (
    <section className="relative min-h-screen overflow-hidden bg-black pt-20">
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `linear-gradient(90deg, rgba(0, 0, 0, 0.96) 0%, rgba(0, 0, 0, 0.82) 26%, rgba(0, 0, 0, 0.45) 56%, rgba(0, 0, 0, 0.58) 100%), url(${assets.hero})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center center',
          backgroundRepeat: 'no-repeat',
        }}
      />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(59,130,246,0.18),transparent_28%),radial-gradient(circle_at_bottom_left,rgba(239,68,68,0.14),transparent_30%)]" />
      <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-black to-transparent" />

      <div className="relative mx-auto flex min-h-[calc(100dvh-80px)] max-w-7xl items-center px-4 md:px-6 lg:px-10">
        <div className="max-w-2xl py-16 md:py-20">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/8 px-4 py-2 text-xs font-medium tracking-[0.22em] text-white/80 uppercase backdrop-blur-sm md:text-sm">
            <Star className="h-4 w-4 fill-red-500 text-red-500" />
            Now Streaming
          </div>

          <img
            src={assets.marvelLogo}
            alt="Marvel Studios"
            className="mb-8 h-16 w-auto md:h-24"
          />

          <h1 className="mb-5 text-2xl font-semibold leading-[1.08] text-white md:text-4xl lg:text-[52px]">
            Guardians
            <br />
            of the Galaxy
          </h1>

          <p className="mb-7 max-w-xl text-sm leading-6 text-white/78 md:text-base">
            A cosmic misfit crew gets pulled into a galaxy-spanning fight, and the soundtrack is
            almost as iconic as the chaos.
          </p>

          <div className="mb-7 flex flex-wrap items-center gap-4 text-base text-white/90 md:text-lg">
            <span>Action |</span>
            <span>Adventure |</span>
            <span>Sci-Fi</span>

            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              <span>2014</span>
            </div>

            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              <span>2h 8m</span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <button
              type="button"
              onClick={() =>
                window.open(
                  'https://www.youtube.com/watch?v=d96cjJhvlMA',
                  '_blank',
                  'noopener,noreferrer'
                )
              }
              className="inline-flex items-center gap-3 rounded-full bg-red-500 px-6 py-3 text-sm font-semibold text-white transition hover:bg-red-600 md:text-base"
            >
              <Play className="h-4 w-4 fill-white text-white md:h-5 md:w-5" />
              Watch Trailer
            </button>
            <button className="rounded-full border border-white/20 bg-white/8 px-6 py-3 text-sm font-semibold text-white backdrop-blur-sm transition hover:bg-white/14 md:text-base">
              🎟 Buy Tickets
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}

export default HeroSection
