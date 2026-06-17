import React from 'react'
import { useNavigate } from 'react-router-dom'
import {
  ArrowRight,
  BadgeCheck,
  Lock,
  Mail,
  ShieldCheck,
  User,
} from 'lucide-react'
import { signupUser } from '../lib/auth'

const Signup = () => {
  const navigate = useNavigate()
  const [formData, setFormData] = React.useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    acceptedTerms: false,
  })
  const [error, setError] = React.useState('')
  const [isLoading, setIsLoading] = React.useState(false)

  const handleChange = (event) => {
    const { name, value, checked, type } = event.target

    setFormData((current) => ({
      ...current,
      [name]: type === 'checkbox' ? checked : value,
    }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match.')
      return
    }

    if (!formData.acceptedTerms) {
      setError('Please agree to the terms first.')
      return
    }

    setIsLoading(true)

    try {
      await signupUser({
        username: formData.username,
        email: formData.email,
        password: formData.password,
      })
      navigate('/login')
    } catch (err) {
      setError(err.message || 'Unable to create account.')
    } finally {
      setIsLoading(false)
    }
  }

  const highlights = [
    'Save your favorite movies',
    'Track your bookings anytime',
    'Use the same account across devices',
  ]

  const inputClass =
    'w-full rounded-[18px] border border-slate-300/65 bg-white/75 py-4 pl-13 pr-4 text-[15px] font-medium text-slate-900 outline-none backdrop-blur-sm transition placeholder:text-slate-400 focus:border-[#1d5fd1] focus:bg-white'

  return (
    <main className="relative min-h-screen overflow-hidden bg-[linear-gradient(180deg,#06111f_0%,#0b1b31_45%,#f4f7fb_45%,#edf3f9_100%)] px-4 pt-24">
      <div className="pointer-events-none absolute left-[10%] top-28 h-40 w-40 rounded-full bg-[#7dd3fc]/25 blur-3xl" />
      <div className="pointer-events-none absolute right-[10%] top-24 h-48 w-48 rounded-full bg-[#2563eb]/20 blur-3xl" />
      <div className="pointer-events-none absolute bottom-10 left-1/2 h-56 w-56 -translate-x-1/2 rounded-full bg-white/35 blur-3xl" />

      <div className="mx-auto flex min-h-[calc(100vh-96px)] max-w-6xl items-center justify-center py-10">
        <div className="grid w-full max-w-5xl overflow-hidden rounded-[32px] border border-white/55 bg-white/70 shadow-[0_30px_120px_rgba(15,23,42,0.22)] backdrop-blur-xl lg:grid-cols-[1.02fr_0.98fr]">
          <section className="bg-[linear-gradient(180deg,rgba(255,255,255,0.82),rgba(241,245,249,0.98))] px-6 py-8 sm:px-8 md:px-10 lg:px-12">
            <div className="mx-auto max-w-md">
              <p className="text-sm font-semibold tracking-[0.26em] text-[#1d5fd1] uppercase">
                Create Account
              </p>
              <h1 className="mt-3 text-3xl font-semibold tracking-tight text-slate-900 md:text-4xl">
                Join Prince Cinema
              </h1>
              <p className="mt-3 text-sm leading-7 text-slate-500 md:text-[15px]">
                Build your account with a cleaner auth layout that matches the new login screen.
              </p>

              {error && (
                <div className="mt-6 rounded-2xl border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-700">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="mt-8 space-y-5">
                <div>
                  <label className="mb-2.5 block text-sm font-semibold text-slate-700">
                    Username
                  </label>
                  <div className="relative">
                    <User className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      name="username"
                      placeholder="Enter your username"
                      value={formData.username}
                      onChange={handleChange}
                      required
                      className={inputClass}
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-2.5 block text-sm font-semibold text-slate-700">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                    <input
                      type="email"
                      name="email"
                      placeholder="you@example.com"
                      value={formData.email}
                      onChange={handleChange}
                      autoComplete="email"
                      required
                      className={inputClass}
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-2.5 block text-sm font-semibold text-slate-700">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                    <input
                      type="password"
                      name="password"
                      placeholder="Create password"
                      value={formData.password}
                      onChange={handleChange}
                      autoComplete="new-password"
                      required
                      className={inputClass}
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-2.5 block text-sm font-semibold text-slate-700">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <Lock className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                    <input
                      type="password"
                      name="confirmPassword"
                      placeholder="Confirm your password"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      autoComplete="new-password"
                      required
                      className={inputClass}
                    />
                  </div>
                </div>

                <label className="flex items-start gap-3 rounded-[20px] border border-slate-200 bg-white/70 px-4 py-4 text-sm text-slate-600">
                  <input
                    type="checkbox"
                    name="acceptedTerms"
                    checked={formData.acceptedTerms}
                    onChange={handleChange}
                    className="mt-0.5 h-4.5 w-4.5 rounded border-slate-300 text-[#1d5fd1] focus:ring-[#1d5fd1]"
                  />
                  <span className="leading-6">
                    I agree to the <span className="font-semibold text-[#1d5fd1]">Terms</span> and{' '}
                    <span className="font-semibold text-[#1d5fd1]">Privacy Policy</span>.
                  </span>
                </label>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-[18px] bg-[linear-gradient(135deg,#1d5fd1_0%,#2563eb_55%,#60a5fa_100%)] px-6 py-4 text-[16px] font-semibold text-white shadow-[0_18px_40px_rgba(37,99,235,0.28)] transition hover:translate-y-[-1px] hover:shadow-[0_22px_48px_rgba(37,99,235,0.32)] disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {isLoading ? 'Creating Account...' : 'Create Account'}
                  {!isLoading && <ArrowRight className="h-4.5 w-4.5" />}
                </button>
              </form>

              <div className="mt-8 rounded-[22px] border border-slate-200 bg-white/75 px-5 py-4">
                <p className="text-sm text-slate-600">
                  Already registered?{' '}
                  <button
                    type="button"
                    onClick={() => navigate('/login')}
                    className="font-semibold text-[#1d5fd1] transition hover:text-[#1548a7]"
                  >
                    Log in here
                  </button>
                </p>
              </div>
            </div>
          </section>

          <section className="relative overflow-hidden bg-[linear-gradient(165deg,#0b2040_0%,#153f7a_58%,#3b82f6_100%)] p-8 text-white md:p-10 lg:p-12">
            <div className="absolute right-0 top-0 h-40 w-40 translate-x-10 -translate-y-10 rounded-full border border-white/15 bg-white/10" />
            <div className="absolute bottom-0 left-0 h-36 w-36 -translate-x-12 translate-y-12 rounded-full border border-white/10 bg-white/10" />

            <div className="relative">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-semibold tracking-[0.22em] text-white/85 uppercase">
                <BadgeCheck className="h-4 w-4 text-sky-200" />
                Quick Setup
              </div>

              <h2 className="mt-8 max-w-xs text-4xl font-semibold leading-tight md:text-5xl">
                Your movie account starts here
              </h2>

              <p className="mt-5 max-w-md text-sm leading-7 text-white/78 md:text-base">
                Create your profile once and use it to book seats, keep watchlists, and return to
                checkout faster.
              </p>

              <div className="mt-8 rounded-[24px] border border-white/16 bg-white/10 p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.16)] backdrop-blur-sm">
                <div className="flex items-center gap-3">
                  <div className="rounded-2xl bg-white/14 p-3">
                    <ShieldCheck className="h-5 w-5 text-sky-100" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold">Simple and secure registration</p>
                    <p className="mt-1 text-sm text-white/70">
                      Your account data is stored locally for this project demo.
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-8 space-y-3">
                {highlights.map((item) => (
                  <div
                    key={item}
                    className="flex items-center gap-3 rounded-2xl border border-white/14 bg-white/8 px-4 py-3 text-sm text-white/82"
                  >
                    <BadgeCheck className="h-4.5 w-4.5 text-sky-200" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </div>
      </div>
    </main>
  )
}

export default Signup
