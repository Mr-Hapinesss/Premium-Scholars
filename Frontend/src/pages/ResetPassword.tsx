import { useState, useEffect } from 'react'
import { useSearchParams, useNavigate, Link } from 'react-router-dom'
import { passwordService } from '../services/auth.service'
import { useAuth } from '../context/AuthContext'

type TokenState = 'checking' | 'valid' | 'invalid' | 'expired'

export default function ResetPassword() {
  const [searchParams]          = useSearchParams()
  const token                   = searchParams.get('token') ?? ''
  const navigate                = useNavigate()
  const { login }               = useAuth()

  const [tokenState, setTokenState]   = useState<TokenState>('checking')
  const [password,   setPassword]     = useState('')
  const [confirm,    setConfirm]      = useState('')
  const [showPass,   setShowPass]     = useState(false)
  const [loading,    setLoading]      = useState(false)
  const [error,      setError]        = useState('')
  const [success,    setSuccess]      = useState(false)
  const [userEmail,  setUserEmail]    = useState('')

  useEffect(() => {
    if (!token) { setTokenState('invalid'); return }

    passwordService
      .validateResetToken(token)
      .then(() => setTokenState('valid'))
      .catch((err: any) => {
        const msg = err.response?.data?.message ?? ''
        setTokenState(msg.includes('expired') ? 'expired' : 'invalid')
      })
  }, [token])

  const getStrengthLevel = (p: string): number => {
    let score = 0
    if (p.length >= 6)  score++
    if (p.length >= 10) score++
    if (/[A-Z]/.test(p) && /[a-z]/.test(p)) score++
    if (/[0-9]/.test(p) || /[^A-Za-z0-9]/.test(p)) score++
    return score
  }

  const strengthLabel = ['', 'Weak', 'Fair', 'Good', 'Strong'][getStrengthLevel(password)] ?? ''
  const strengthColor = ['', 'bg-red-400', 'bg-amber-400', 'bg-sky-400', 'bg-emerald-400'][getStrengthLevel(password)] ?? ''

  const handleSubmit = async () => {
    setError('')
    if (password.length < 6)        { setError('Password must be at least 6 characters'); return }
    if (password !== confirm)       { setError('Passwords do not match'); return }

    setLoading(true)
    try {
      const data = await passwordService.resetPassword(token, password)
      setSuccess(true)
      setUserEmail(data.user?.email ?? '')

      // Auto-login then redirect
      setTimeout(async () => {
        try {
          await login(data.user.email, password)
          navigate(
            data.user.role === 'admin'  ? '/admin' :
            data.user.role === 'mentor' ? '/mentorship/mentor/home' :
                                         '/mentorship/mentee/home',
            { replace: true }
          )
        } catch {
          navigate('/mentorship/login', { replace: true })
        }
      }, 2500)
    } catch (err: any) {
      setError(err.response?.data?.message ?? 'Failed to reset password. The link may have expired.')
    } finally {
      setLoading(false)
    }
  }

  // ── Token checking ──
  if (tokenState === 'checking') {
    return (
      <div className="min-h-screen bg-sky-50 flex items-center justify-center font-body">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-sky-200 border-t-gold-400 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-sky-500 text-sm">Validating your reset link...</p>
        </div>
      </div>
    )
  }

  // ── Invalid / expired ──
  if (tokenState === 'invalid' || tokenState === 'expired') {
    return (
      <div className="min-h-screen bg-sky-50 flex items-center justify-center px-6 font-body">
        <div className="w-full max-w-md bg-white rounded-3xl shadow-xl border border-sky-100 p-8 text-center">
          <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center text-4xl mx-auto mb-5">
            {tokenState === 'expired' ? '⏰' : '❌'}
          </div>
          <h1 className="font-display text-3xl text-sky-900 mb-3">
            {tokenState === 'expired' ? 'Link Expired' : 'Invalid Link'}
          </h1>
          <p className="text-sky-500 text-sm leading-relaxed mb-6">
            {tokenState === 'expired'
              ? 'This password reset link has expired. Reset links are valid for 1 hour.'
              : 'This reset link is invalid or has already been used.'}
          </p>
          <div className="flex flex-col gap-3">
            <Link
              to="/forgot-password"
              className="w-full py-3 bg-sky-600 text-white rounded-xl font-semibold text-sm hover:bg-sky-700 transition-colors text-center"
            >
              Request a New Link
            </Link>
            <Link
              to="/mentorship/login"
              className="w-full py-2.5 text-sky-500 text-sm hover:text-sky-700 transition-colors text-center"
            >
              Back to Sign In
            </Link>
          </div>
        </div>
      </div>
    )
  }

  // ── Success ──
  if (success) {
    return (
      <div className="min-h-screen bg-sky-50 flex items-center justify-center px-6 font-body">
        <div className="w-full max-w-md bg-white rounded-3xl shadow-xl border border-sky-100 p-8 text-center">
          <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center text-4xl mx-auto mb-5">
            ✅
          </div>
          <h1 className="font-display text-3xl text-sky-900 mb-2">Password Reset!</h1>
          <p className="text-sky-500 text-sm mb-6">
            Your password has been updated. Signing you in...
          </p>
          <div className="w-8 h-8 border-4 border-sky-200 border-t-gold-400 rounded-full animate-spin mx-auto" />
        </div>
      </div>
    )
  }

  // ── Reset form ──
  return (
    <div className="min-h-screen bg-sky-50 flex items-center justify-center px-6 py-16 font-body">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl border border-sky-100 p-8">
        <div className="text-center mb-6">
          <Link to="/" className="font-display text-2xl font-bold text-sky-800">
            Premium <span className="text-gold-500">Scholars</span>
          </Link>
        </div>

        <div className="mb-6">
          <h1 className="font-display text-3xl text-sky-900 mb-2">Set New Password</h1>
          <p className="text-sky-500 text-sm">Choose a strong password for your account.</p>
        </div>

        <div className="space-y-4">
          {/* New password */}
          <div>
            <label className="text-sky-700 text-sm font-medium block mb-1">
              New Password
            </label>
            <div className="relative">
              <input
                type={showPass ? 'text' : 'password'}
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Minimum 6 characters"
                autoComplete="new-password"
                className="w-full px-4 py-3 pr-16 rounded-xl border border-sky-200 focus:outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-100 bg-sky-50 text-sky-800 text-sm transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPass(p => !p)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-sky-400 hover:text-sky-600 text-xs font-semibold transition-colors"
              >
                {showPass ? 'Hide' : 'Show'}
              </button>
            </div>

            {/* Strength bar */}
            {password && (
              <div className="mt-2 space-y-1">
                <div className="flex gap-1">
                  {[1, 2, 3, 4].map(level => (
                    <div
                      key={level}
                      className={[
                        'h-1 flex-1 rounded-full transition-all duration-300',
                        getStrengthLevel(password) >= level ? strengthColor : 'bg-sky-100',
                      ].join(' ')}
                    />
                  ))}
                </div>
                <p className="text-xs text-sky-400">{strengthLabel}</p>
              </div>
            )}
          </div>

          {/* Confirm password */}
          <div>
            <label className="text-sky-700 text-sm font-medium block mb-1">
              Confirm Password
            </label>
            <input
              type={showPass ? 'text' : 'password'}
              value={confirm}
              onChange={e => setConfirm(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSubmit()}
              placeholder="Repeat your new password"
              autoComplete="new-password"
              className={[
                'w-full px-4 py-3 rounded-xl border focus:outline-none text-sky-800 text-sm transition-all',
                confirm && confirm !== password
                  ? 'border-red-300 bg-red-50 focus:border-red-400 focus:ring-2 focus:ring-red-100'
                  : confirm && confirm === password
                  ? 'border-emerald-300 bg-emerald-50 focus:border-emerald-400'
                  : 'border-sky-200 bg-sky-50 focus:border-sky-400 focus:ring-2 focus:ring-sky-100',
              ].join(' ')}
            />
            {confirm && confirm !== password && (
              <p className="text-xs text-red-400 mt-1">Passwords do not match</p>
            )}
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-red-600 text-sm flex items-center gap-2">
              <span>⚠</span> {error}
            </div>
          )}

          <button
            onClick={handleSubmit}
            disabled={loading || !password || password !== confirm}
            className="w-full py-3.5 bg-sky-600 text-white rounded-xl font-semibold hover:bg-sky-700 transition-colors disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading && (
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            )}
            {loading ? 'Resetting...' : 'Reset Password'}
          </button>
        </div>

        <p className="text-center text-sky-500 text-sm mt-5">
          <Link to="/mentorship/login" className="text-sky-700 font-semibold hover:underline">
            Back to Sign In
          </Link>
        </p>
      </div>
    </div>
  )
}