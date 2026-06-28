import React, { useState } from 'react'
import { useSignIn } from '@clerk/react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'

const Login = () => {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const redirectTo = searchParams.get('redirect') || '/'
  const registered = searchParams.get('registered') === 'true'
  const initialEmail = searchParams.get('email') || ''
  const { signIn, errors, fetchStatus } = useSignIn()
  const [email, setEmail] = useState(initialEmail)
  const [password, setPassword] = useState('')
  const [serverError, setServerError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const fieldErrors = [
    errors.fields.identifier?.message,
    errors.fields.password?.message,
    errors.global?.map((error) => error.longMessage ?? error.message).join(' '),
  ]
    .filter(Boolean)
    .join(' ')

  const handleSubmit = async (event) => {
    event.preventDefault()
    setServerError('')
    setIsSubmitting(true)

    try {
      const { error } = await signIn.create({
        strategy: 'password',
        identifier: email,
        password,
      })

      if (error) {
        setServerError(error.longMessage || error.message || 'Sign in failed.')
        return
      }

      if (signIn.status === 'complete') {
        const { error: finalizeError } = await signIn.finalize()
        if (finalizeError) {
          setServerError(finalizeError.longMessage || finalizeError.message || 'Sign in could not be completed.')
          return
        }
        navigate(redirectTo)
      } else {
        setServerError('Sign in is not complete. Please verify your email or try again.')
      }
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
          <div className="bg-[linear-gradient(165deg,#0b2040_0%,#153f7a_58%,#3b82f6_100%)] px-8 py-10 text-white md:px-12">
            <div className="mb-8 rounded-[24px] border border-white/10 bg-white/10 p-6 shadow-[inset_0_1px_0_rgba(255,255,255,0.16)] backdrop-blur-sm">
              <p className="text-sm font-semibold uppercase tracking-[0.22em] text-white/80">Member Access</p>
              <h1 className="mt-6 text-4xl font-semibold leading-tight md:text-5xl">Welcome back to Prince Cinema</h1>
              <p className="mt-4 max-w-xl text-sm leading-7 text-white/80 md:text-base">
                Sign in with your email and password to manage bookings, favorites, and tickets.
              </p>
            </div>

            <div className="space-y-4 rounded-[24px] border border-white/10 bg-white/10 p-6 text-white/90 shadow-[inset_0_1px_0_rgba(255,255,255,0.16)] backdrop-blur-sm">
              <p className="font-semibold text-white">Secure access</p>
              <p className="text-sm text-white/80">Use your Prince Cinema account to access your bookings the easy way.</p>
            </div>
          </div>

          <div className="bg-white p-8 md:p-10">
            <div className="mb-8 text-center">
              <p className="text-sm font-semibold tracking-[0.26em] text-[#1d5fd1] uppercase">Sign In</p>
              <h2 className="mt-3 text-3xl font-semibold text-slate-900 md:text-4xl">Access your account</h2>
            </div>

            <div className="mx-auto w-full max-w-xl rounded-[30px] border border-slate-200 bg-slate-50 p-6 shadow-sm">
              {registered ? (
                <div className="mb-4 rounded-lg bg-emerald-50 border border-emerald-200 p-4 text-sm text-emerald-700">
                  Sign up successful. Please sign in with your new account.
                </div>
              ) : null}
              {serverError || fieldErrors ? (
                <div className="mb-4 rounded-lg bg-red-50 border border-red-200 p-4 text-sm text-red-700">
                  {serverError || fieldErrors}
                </div>
              ) : null}

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Email address</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="you@example.com"
                    className="w-full rounded-3xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Password</label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    placeholder="••••••••"
                    className="w-full rounded-3xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting || fetchStatus === 'fetching'}
                  className="w-full rounded-3xl bg-[#1d5fd1] px-5 py-3 text-base font-semibold text-white transition hover:bg-[#1552b4] disabled:cursor-not-allowed disabled:bg-slate-400"
                >
                  {isSubmitting || fetchStatus === 'fetching' ? 'Signing in...' : 'Sign In'}
                </button>
              </form>

              <p className="mt-6 text-center text-sm text-slate-600">
                Don't have an account?{' '}
                <Link to={`/signup?redirect=${encodeURIComponent(redirectTo)}`} className="font-semibold text-[#1d5fd1] hover:text-[#154b99]">
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
