import { useState } from 'react'
import { Link } from 'react-router-dom'
import { passwordService } from '../services/auth.service'

export default function ForgotPassword() {
  const [email,     setEmail]     = useState('')
  const [loading,   setLoading]   = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error,     setError]     = useState('')

  const handleSubmit = async () => {
    setError('')
    if (!email.trim()) { setError('Please enter your email address'); return }
    if (!/^\S+@\S+\.\S+$/.test(email)) { setError('Please enter a valid email address'); return }

    setLoading(true)
    try {
      await passwordService.forgotPassword(email.trim().toLowerCase())
      setSubmitted(true)
    } catch (err: any) {
      // Even on error show success — prevents email enumeration
      setSubmitted(true)
    } finally {
      setLoading(false)
    }
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-sky-50 flex items-center justify-center px-6 font-body">
        <div className="w-full max-w-md bg-white rounded-3xl shadow-xl border border-sky-100 p-8 text-center">
          <div className="w-20 h-20 bg-sky-100 rounded-full flex items-center justify-center text-4xl mx-auto mb-5">
            📧
          </div>
          <h1 className="font-display text-3xl text-sky-900 mb-3">Check your inbox</h1>
          <p className="text-sky-500 text-sm leading-relaxed mb-2">
            If an account exists for{' '}
            <span className="font-semibold text-sky-700">{email}</span>,
            you will receive a password reset link shortly.
          </p>
          <p className="text-sky-400 text-xs mb-6">
            The link expires in 1 hour. Check your spam folder if you don't see it.
          </p>
          <Link
            to="/mentorship/login"
            className="inline-block px-6 py-3 bg-sky-600 text-white rounded-xl font-semibold text-sm hover:bg-sky-700 transition-colors"
          >
            Back to Sign In
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-sky-50 flex items-center justify-center px-6 font-body">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl border border-sky-100 p-8">
        <div className="text-center mb-6">
          <Link to="/" className="font-display text-2xl font-bold text-sky-800">
            Premium <span className="text-gold-500">Scholars</span>
          </Link>
        </div>

        <div className="mb-6">
          <h1 className="font-display text-3xl text-sky-900 mb-2">Forgot Password?</h1>
          <p className="text-sky-500 text-sm leading-relaxed">
            No worries. Enter your email address and we will send you a link to reset your password.
          </p>
        </div>

        <div className="space-y-4">
          <div>
            <label className="text-sky-700 text-sm font-medium block mb-1">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSubmit()}
              placeholder="your@email.com"
              autoFocus
              className="w-full px-4 py-3 rounded-xl border border-sky-200 focus:outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-100 bg-sky-50 text-sky-800 text-sm transition-all"
            />
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-red-600 text-sm flex items-center gap-2">
              <span>⚠</span> {error}
            </div>
          )}

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full py-3.5 bg-sky-600 text-white rounded-xl font-semibold hover:bg-sky-700 transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
          >
            {loading && (
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            )}
            {loading ? 'Sending...' : 'Send Reset Link'}
          </button>
        </div>

        <p className="text-center text-sky-500 text-sm mt-5">
          Remembered it?{' '}
          <Link to="/mentorship/login" className="text-sky-700 font-semibold hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  )
}