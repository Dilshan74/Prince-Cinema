import React, { useState, useEffect } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { Eye, EyeOff } from 'lucide-react'

const Login = () => {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const redirectTo = searchParams.get('redirect') || '/'
  const initialEmail = searchParams.get('email') || ''

  const [email, setEmail] = useState(initialEmail)
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [serverError, setServerError] = useState('')
  const [successMessage, setSuccessMessage] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    const registered = searchParams.get('registered') === 'true'
    if (registered) {
      setSuccessMessage('Sign up successful. Please sign in with your new account.')
    }
  }, [searchParams])

  const handleSubmit = async (event) => {
    event.preventDefault()
    setServerError('')

    // Validation
    if (!email.trim()) {
      setServerError('Email is required')
      return
    }
    if (!password.trim()) {
      setServerError('Password is required')
      return
    }

    setIsSubmitting(true)

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/auth/signin`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email,
            password,
          }),
        }
      )

      const data = await response.json()

      if (!response.ok) {
        setServerError(data.message || 'Sign in failed')
        return
      }

      // Store token
      localStorage.setItem('token', data.token)
      setSuccessMessage('Sign in successful! Redirecting...')

      setTimeout(() => {
        navigate(redirectTo)
      }, 1500)
    } catch (error) {
      setServerError(error?.message || 'An unexpected error occurred.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-[linear-gradient(180deg,#06111f_0%,#0b1b31_45%,#f4f7fb_45%,#edf3f9_100%)] px-4 pt-24">
      <div className="pointer-events-none absolute left-[10%] top-28 h-40 w-40 rounded-full bg-[#7dd3fc]/25 blur-3xl" />
      <div className="pointer-events-none absolute right-[10%] top-24 h-48 w-48 rounded-full bg-[#2563eb]/20 blur-3xl" />
      <div className="pointer-events-none absolute bottom-10 left-1/2 h-56 w-56 -translate-x-1/2 rounded-full bg-white/35 blur-3xl" />

      <div className="mx-auto flex min-h-[calc(100vh-96px)] max-w-7xl items-center justify-center py-10">
        <div className="grid w-full gap-8 overflow-hidden rounded-[32px] border border-white/20 bg-white/90 shadow-[0_30px_120px_rgba(15,23,42,0.18)] backdrop-blur-xl lg:grid-cols-[1.1fr_0.9fr]">

          {/* LEFT PANEL */}
          <div className="bg-[linear-gradient(165deg,#0b2040_0%,#153f7a_58%,#3b82f6_100%)] px-8 py-10 text-white md:px-12">
            <div className="mb-8 rounded-[24px] border border-white/10 bg-white/10 p-6 backdrop-blur-sm">
              <p className="text-sm font-semibold uppercase tracking-[0.22em] text-white/80">
                Member Access
              </p>
              <h1 className="mt-6 text-4xl font-semibold leading-tight md:text-5xl">
                Welcome back to Prince Cinema
              </h1>
              <p className="mt-4 max-w-xl text-sm leading-7 text-white/80 md:text-base">
                Sign in with your email and password to manage bookings, favorites, and tickets.
              </p>
            </div>

            <div className="space-y-4 rounded-[24px] border border-white/10 bg-white/10 p-6">
              <p className="font-semibold">Secure access</p>
              <p className="text-sm text-white/80">
                Use your Prince Cinema account to access your bookings easily.
              </p>
            </div>
          </div>

          {/* RIGHT PANEL */}
          <div className="bg-white p-8 md:p-10">
            <div className="mb-8 text-center">
              <p className="text-sm font-semibold uppercase tracking-[0.26em] text-[#1d5fd1]">
                Sign In
              </p>
              <h2 className="mt-3 text-3xl font-semibold text-slate-900 md:text-4xl">
                Access your account
              </h2>
            </div>

            <div className="mx-auto w-full max-w-xl rounded-[30px] border border-slate-200 bg-slate-50 p-6">
              {successMessage && (
                <div className="mb-4 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
                  {successMessage}
                </div>
              )}

              {serverError && (
                <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                  {serverError}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Email address *
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full rounded-3xl border border-slate-300 bg-white px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Password *
                  </label>

                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full rounded-3xl border border-slate-300 bg-white px-4 py-3 pr-12 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                    />

                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500"
                    >
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full rounded-3xl bg-[#1d5fd1] py-3 font-semibold text-white hover:bg-[#1552b4] disabled:cursor-not-allowed disabled:bg-slate-400"
                >
                  {isSubmitting ? 'Signing in...' : 'Sign In'}
                </button>
              </form>

              <p className="mt-6 text-center text-sm text-slate-600">
                Don't have an account?{' '}
                <Link
                  to={`/signup?redirect=${encodeURIComponent(redirectTo)}`}
                  className="font-semibold text-[#1d5fd1]"
                >
                  Sign up
                </Link>
              </p>
            </div>
          </div>

        </div>
      </div>
    </main>
  )
}

export default Login