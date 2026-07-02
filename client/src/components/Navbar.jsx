import React from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { Search, Menu, X, BadgeCheck, LogOut } from 'lucide-react'
import { assets } from '../assets/assets'
import { useAppContext } from '../context/AppContext'

const Navbar = () => {
  const navigate = useNavigate()
  const [isMenuOpen, setIsMenuOpen] = React.useState(false)
  const [isScrolled, setIsScrolled] = React.useState(false)
  const [isProfileOpen, setIsProfileOpen] = React.useState(false)
  const { user, setToken } = useAppContext()
  const [isSearchOpen, setIsSearchOpen] = React.useState(false)
  const [searchValue, setSearchValue] = React.useState('')
  const profileRef = React.useRef(null)

  React.useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  React.useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 16)
    }

    handleScroll()
    window.addEventListener('scroll', handleScroll)

    return () => window.removeEventListener('scroll', handleScroll)
  }, [])



  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Movies', path: '/movies' },
    { name: 'Theaters', path: '/theaters' },
    { name: 'Favorites', path: '/favorites' },
  ]

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('prince-cinema-favorites')
    window.location.href = '/'
  }

  return (
    <header
      className={`fixed top-0 left-0 z-50 w-full transition-all duration-300 ${
        isScrolled
          ? 'border-b border-white/10 bg-black/28 backdrop-blur-2xl supports-[backdrop-filter]:bg-black/18'
          : 'bg-transparent'
      }`}
    >
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 md:px-6 lg:px-10">
        <Link to="/" className="shrink-0">
          <img src={assets.logo} alt="Prince Cinema" className="h-10 w-auto md:h-12" />
        </Link>

        <nav
          className={`hidden items-center gap-8 rounded-full border px-8 py-3 shadow-[0_10px_40px_rgba(0,0,0,0.22)] backdrop-blur-xl transition-all duration-300 md:flex ${
            isScrolled
              ? 'border-white/12 bg-white/12 supports-[backdrop-filter]:bg-white/10'
              : 'border-white/10 bg-white/10 supports-[backdrop-filter]:bg-white/8'
          }`}
        >
          {navLinks.map((link) => (
            <NavLink
              key={link.name}
              to={link.path}
              end={link.path === '/'}
              className={({ isActive }) =>
                `inline-flex items-center text-sm font-semibold transition ${
                  isActive
                    ? 'text-red-300'
                    : 'text-white/90 hover:text-red-300'
                }`
              }
              style={({ isActive }) => ({
                color: isActive ? '#fda4af' : undefined,
              })}
            >
              {link.name}
            </NavLink>
          ))}
        </nav>

        <div className="hidden items-center gap-4 md:flex">
          <div className="flex items-center gap-3">
            <div
              className={`overflow-hidden transition-all duration-300 ease-in-out ${
                isSearchOpen ? 'w-64 opacity-100' : 'w-0 opacity-0'
              }`}
            >
              <div
                className={`relative ${
                  isSearchOpen ? 'pointer-events-auto' : 'pointer-events-none'
                }`}
              >
                <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-white/45" />
                <input
                  type="text"
                  value={searchValue}
                  onChange={(event) => setSearchValue(event.target.value)}
                  placeholder="Search movies..."
                  className={`w-full rounded-full border py-2.5 pl-10 pr-4 text-sm text-white outline-none backdrop-blur-xl transition ${
                    isScrolled
                      ? 'border-white/12 bg-white/12 supports-[backdrop-filter]:bg-white/10'
                      : 'border-white/10 bg-white/10 supports-[backdrop-filter]:bg-white/8'
                  }`}
                />
              </div>
            </div>

            <button
              aria-label="Search"
              onClick={() => setIsSearchOpen((current) => !current)}
              className={`rounded-full border p-2.5 text-white backdrop-blur-xl transition hover:border-red-400/50 hover:text-red-400 ${
                isScrolled
                  ? 'border-white/12 bg-white/12 supports-[backdrop-filter]:bg-white/10'
                  : 'border-white/10 bg-white/10 supports-[backdrop-filter]:bg-white/8'
              }`}
            >
              <Search className="h-5 w-5" />
            </button>
          </div>

          {user ? (
            <div className="relative" ref={profileRef}>
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className={`inline-flex items-center gap-2 rounded-full border px-4 py-2.5 text-sm font-semibold text-emerald-300 backdrop-blur-xl transition hover:border-emerald-400/50 ${
                  isScrolled
                    ? 'border-emerald-400/25 bg-emerald-500/10'
                    : 'border-emerald-400/20 bg-emerald-500/8'
                }`}
              >
                <BadgeCheck className="h-4.5 w-4.5 fill-emerald-400/20 text-emerald-400" />
                <span>{user.firstName || 'Profile'}</span>
              </button>

              {isProfileOpen && (
                <div className="absolute right-0 top-full mt-2 w-64 rounded-2xl border border-white/10 bg-[#131927] p-5 shadow-[0_10px_40px_rgba(0,0,0,0.5)] backdrop-blur-xl">
                  <div className="flex flex-col items-center border-b border-white/10 pb-4">
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/20 text-2xl font-bold text-emerald-400">
                      {(user.firstName?.[0] || 'U').toUpperCase()}
                    </div>
                    <p className="mt-3 font-semibold text-white">
                      {user.firstName} {user.lastName}
                    </p>
                    <p className="mt-1 text-xs text-white/60">{user.email}</p>
                  </div>
                  <div className="pt-4">
                    <button
                      onClick={handleLogout}
                      className="flex w-full items-center justify-center gap-2 rounded-xl bg-red-500/10 py-2.5 text-sm font-semibold text-red-400 transition hover:bg-red-500/20"
                    >
                      <LogOut className="h-4 w-4" />
                      Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={() => navigate('/login')}
              className={`rounded-full border px-6 py-2.5 text-sm font-semibold text-white backdrop-blur-xl transition hover:border-red-400/50 hover:text-red-300 ${
                isScrolled
                  ? 'border-white/12 bg-white/12 supports-[backdrop-filter]:bg-white/10'
                  : 'border-white/10 bg-white/10 supports-[backdrop-filter]:bg-white/8'
              }`}
            >
              Login
            </button>
          )}
        </div>

        <button
          onClick={() => setIsMenuOpen((prev) => !prev)}
          aria-label="Toggle menu"
          className="rounded-full border border-white/10 p-2 text-white md:hidden"
        >
          {isMenuOpen ? <X className="h-7 w-7" /> : <Menu className="h-7 w-7" />}
        </button>
      </div>

      {isMenuOpen && (
        <div className="mx-6 max-h-[85vh] overflow-y-auto rounded-3xl border border-white/10 bg-black/50 px-6 py-4 backdrop-blur-xl supports-[backdrop-filter]:bg-black/35 md:hidden">
          <div className="flex flex-col gap-4">
            <div className="relative md:hidden">
              <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-white/45" />
              <input
                type="text"
                value={searchValue}
                onChange={(event) => setSearchValue(event.target.value)}
                placeholder="Search movies..."
                className="w-full rounded-full border border-white/10 bg-white/5 py-3 pl-10 pr-4 text-sm text-white outline-none"
              />
            </div>

            {navLinks.map((link) => (
              <NavLink
                key={link.name}
                to={link.path}
                end={link.path === '/'}
                onClick={() => setIsMenuOpen(false)}
                className={({ isActive }) =>
                  `w-fit text-base font-medium transition ${
                    isActive
                      ? 'text-red-300'
                      : 'text-white/90 hover:text-red-300'
                  }`
                }
                style={({ isActive }) => ({
                  color: isActive ? '#fda4af' : undefined,
                })}
              >
                {link.name}
              </NavLink>
            ))}

            {user ? (
              <div className="mt-4 flex flex-col gap-4 border-t border-white/10 pt-4">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-emerald-500/20 text-xl font-bold text-emerald-400">
                    {(user.firstName?.[0] || 'U').toUpperCase()}
                  </div>
                  <div className="flex flex-col">
                    <span className="font-semibold text-white">
                      {user.firstName} {user.lastName}
                    </span>
                    <span className="text-xs text-white/60">{user.email}</span>
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-red-500/10 px-4 py-3 text-sm font-semibold text-red-400 transition hover:bg-red-500/20"
                >
                  <LogOut className="h-4 w-4" />
                  Logout
                </button>
              </div>
            ) : (
              <button
                onClick={() => {
                  setIsMenuOpen(false)
                  navigate('/login')
                }}
                className="mt-2 w-fit rounded-full bg-red-500 px-6 py-2 text-white"
              >
                Login
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  )
}

export default Navbar
