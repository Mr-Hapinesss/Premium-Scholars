import { useState, useEffect } from 'react'
import { useNavigate, useSearchParams, Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { adminAuthService } from '../../services/adminAuth.service'

type TokenState = 'checking' | 'valid' | 'invalid' | 'expired' | 'used'

interface InviteInfo {
  valid:       boolean
  lockedEmail: string | null
  expiresAt:   string
}

export default function AdminRegister() {
  const [searchParams]   = useSearchParams()
  const token            = searchParams.get('token') ?? ''
  const navigate         = useNavigate()
  const { login }        = useAuth()

  const [tokenState, setTokenState] = useState<TokenState>('checking')
  const [inviteInfo, setInviteInfo] = useState<InviteInfo | null>(null)

  const [form, setForm] = useState({
    name:        '',
    email:       '',
    password:    '',
    confirmPass: '',
    university:  '',
  })
  const [showPass,  setShowPass]  = useState(false)
  const [loading,   setLoading]   = useState(false)
  const [error,     setError]     = useState('')
  const [success,   setSuccess]   = useState(false)

  // Validate the invite token on mount
  useEffect(() => {
    if (!token) {
      setTokenState('invalid')
      return
    }

    adminAuthService
      .validateInvite(token)
      .then((data: InviteInfo) => {
        setInviteInfo(data)
        setTokenState('valid')
        // Pre-fill email if the invite was locked to one
        if (data.lockedEmail) {
          setForm(prev => ({ ...prev, email: data.lockedEmail! }))
        }
      })
      .catch((err: any) => {
        const msg: string = err.response?.data?.message ?? ''
        if (msg.includes('expired'))    setTokenState('expired')
        else if (msg.includes('used'))  setTokenState('used')
        else                             setTokenState('invalid')
      })
  }, [token])

  const updateField = (key: keyof typeof form) =>
    (e: React.ChangeEvent<HTMLInputElement>) =>
      setForm(prev => ({ ...prev, [key]: e.target.value }))

  const handleSubmit = async () => {
    setError('')

    if (!form.name.trim())           { setError('Full name is required'); return }
    if (!form.email.trim())          { setError('Email is required'); return }
    if (form.password.length < 8)    { setError('Password must be at least 8 characters'); return }
    if (form.password !== form.confirmPass) { setError('Passwords do not match'); return }

    setLoading(true)
    try {
      await adminAuthService.register({
        token,
        name:        form.name.trim(),
        email:       form.email.trim(),
        password:    form.password,
        university:  form.university.trim() || undefined,
      })

      setSuccess(true)

      // Auto-login after a short delay then redirect to admin panel
      setTimeout(async () => {
        try {
          await login(form.email.trim(), form.password)
          navigate('/admin', { replace: true })
        } catch {
          navigate('/mentorship/login', { replace: true })
        }
      }, 2000)
    } catch (err: any) {
      setError(err.response?.data?.message ?? 'Registration failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  // ── Token state screens ──────────────────────────────────────────────────

  if (tokenState === 'checking') {
    return (
      <div className="min-h-screen bg-sky-50 flex items-center justify-center font-body">
        <div className="text-center">
          <div className="w-12 h-12 rounded-full border-4 border-sky-200 border-t-gold-400 animate-spin mx-auto mb-4" />
          <p className="text-sky-500 text-sm">Validating your invite...</p>
        </div>
      </div>
    )
  }

  if (tokenState === 'expired') {
    return <TokenErrorScreen
      icon="⏰"
      title="Invite Expired"
      message="This admin invite link has passed its expiry time. Ask an existing admin to generate a new one."
    />
  }

  if (tokenState === 'used') {
    return <TokenErrorScreen
      icon="🔒"
      title="Already Used"
      message="This invite link has already been used to create an account. Each invite is single-use only."
    />
  }

  if (tokenState === 'invalid') {
    return <TokenErrorScreen
      icon="❌"
      title="Invalid Invite"
      message="This invite link is not valid. It may have been revoked or the URL is incorrect."
    />
  }

  // ── Success screen ───────────────────────────────────────────────────────

  if (success) {
    return (
      <div className="min-h-screen bg-sky-50 flex items-center justify-center px-6 font-body">
        <div className="text-center max-w-sm">
          <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center text-4xl mx-auto mb-5 shadow-sm">
            ✅
          </div>
          <h1 className="font-display text-3xl text-sky-900 mb-2">Welcome, Admin!</h1>
          <p className="text-sky-500 text-sm mb-6">
            Your admin account has been created. Redirecting you to the dashboard...
          </p>
          <div className="w-8 h-8 rounded-full border-4 border-sky-200 border-t-gold-400 animate-spin mx-auto" />
        </div>
      </div>
    )
  }

  // ── Main registration form ───────────────────────────────────────────────

  const isEmailLocked = Boolean(inviteInfo?.lockedEmail)

  return (
    <div className="min-h-screen bg-sky-50 flex items-center justify-center px-4 py-16 font-body">
      <div className="w-full max-w-lg">

        {/* Header */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-block font-display text-2xl font-bold text-sky-800 mb-6">
            Premium <span className="text-gold-500">Scholars</span>
          </Link>
          <div className="inline-flex items-center gap-2 bg-gold-100 border border-gold-200 rounded-full px-4 py-1.5 text-gold-700 text-xs font-bold uppercase tracking-widest mb-4">
            <span className="w-1.5 h-1.5 bg-gold-500 rounded-full" />
            Admin Registration
          </div>
          <h1 className="font-display text-4xl text-sky-900 mb-2">Create Admin Account</h1>
          <p className="text-sky-500 text-sm">
            You have been invited to join Premium Scholars as an administrator.
          </p>
          {inviteInfo?.expiresAt && (
            <p className="text-sky-400 text-xs mt-1">
              Invite valid until{' '}
              {new Date(inviteInfo.expiresAt).toLocaleDateString('en-KE', {
                day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit',
              })}
            </p>
          )}
        </div>

        {/* Card */}
        <div className="bg-white rounded-3xl border border-sky-100 shadow-lg p-8">

          {/* Security badge */}
          <div className="flex items-center gap-2 bg-sky-50 border border-sky-100 rounded-xl px-4 py-3 mb-6">
            <span className="text-sky-400 text-lg">🔐</span>
            <div>
              <p className="text-sky-700 text-xs font-semibold">Invite-only access</p>
              <p className="text-sky-400 text-xs">This page is only accessible via a secure invite link.</p>
            </div>
          </div>

          <div className="space-y-4">

            {/* Name */}
            <div>
              <label className="block text-sky-700 text-xs font-semibold mb-1.5 uppercase tracking-wide">
                Full Name <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                value={form.name}
                onChange={updateField('name')}
                placeholder="Your full name"
                autoComplete="name"
                className="w-full px-4 py-3 rounded-xl border border-sky-200 focus:outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-100 bg-sky-50 text-sky-800 text-sm transition-all"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sky-700 text-xs font-semibold mb-1.5 uppercase tracking-wide">
                Email Address <span className="text-red-400">*</span>
              </label>
              <div className="relative">
                <input
                  type="email"
                  value={form.email}
                  onChange={updateField('email')}
                  placeholder="admin@premiumscholars.co.ke"
                  autoComplete="email"
                  disabled={isEmailLocked}
                  className={[
                    'w-full px-4 py-3 rounded-xl border focus:outline-none text-sky-800 text-sm transition-all',
                    isEmailLocked
                      ? 'border-gold-200 bg-gold-50 text-sky-600 cursor-not-allowed'
                      : 'border-sky-200 focus:border-sky-400 focus:ring-2 focus:ring-sky-100 bg-sky-50',
                  ].join(' ')}
                />
                {isEmailLocked && (
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gold-600 font-semibold bg-gold-100 px-2 py-0.5 rounded-full">
                    Locked
                  </span>
                )}
              </div>
              {isEmailLocked && (
                <p className="text-xs text-gold-600 mt-1">
                  This invite was issued specifically for this email address.
                </p>
              )}
            </div>

            {/* University */}
            <div>
              <label className="block text-sky-700 text-xs font-semibold mb-1.5 uppercase tracking-wide">
                University / Organisation
              </label>
              <input
                type="text"
                value={form.university}
                onChange={updateField('university')}
                placeholder="e.g. Premium Scholars HQ"
                className="w-full px-4 py-3 rounded-xl border border-sky-200 focus:outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-100 bg-sky-50 text-sky-800 text-sm transition-all"
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-sky-700 text-xs font-semibold mb-1.5 uppercase tracking-wide">
                Password <span className="text-red-400">*</span>
              </label>
              <div className="relative">
                <input
                  type={showPass ? 'text' : 'password'}
                  value={form.password}
                  onChange={updateField('password')}
                  placeholder="Minimum 8 characters"
                  autoComplete="new-password"
                  className="w-full px-4 py-3 pr-12 rounded-xl border border-sky-200 focus:outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-100 bg-sky-50 text-sky-800 text-sm transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(prev => !prev)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-sky-400 hover:text-sky-600 transition-colors text-xs font-semibold"
                >
                  {showPass ? 'Hide' : 'Show'}
                </button>
              </div>
              {/* Password strength indicator */}
              {form.password && (
                <div className="mt-2">
                  <div className="flex gap-1 mb-1">
                    {[1, 2, 3, 4].map(level => (
                      <div
                        key={level}
                        className={[
                          'h-1 flex-1 rounded-full transition-all duration-300',
                          getStrengthLevel(form.password) >= level
                            ? level <= 1 ? 'bg-red-400'
                            : level <= 2 ? 'bg-amber-400'
                            : level <= 3 ? 'bg-sky-400'
                            : 'bg-emerald-400'
                            : 'bg-sky-100',
                        ].join(' ')}
                      />
                    ))}
                  </div>
                  <p className="text-xs text-sky-400">
                    {getStrengthLabel(form.password)}
                  </p>
                </div>
              )}
            </div>

            {/* Confirm password */}
            <div>
              <label className="block text-sky-700 text-xs font-semibold mb-1.5 uppercase tracking-wide">
                Confirm Password <span className="text-red-400">*</span>
              </label>
              <div className="relative">
                <input
                  type={showPass ? 'text' : 'password'}
                  value={form.confirmPass}
                  onChange={updateField('confirmPass')}
                  placeholder="Repeat your password"
                  autoComplete="new-password"
                  className={[
                    'w-full px-4 py-3 rounded-xl border focus:outline-none text-sky-800 text-sm transition-all',
                    form.confirmPass && form.confirmPass !== form.password
                      ? 'border-red-300 bg-red-50 focus:border-red-400 focus:ring-2 focus:ring-red-100'
                      : form.confirmPass && form.confirmPass === form.password
                      ? 'border-emerald-300 bg-emerald-50 focus:border-emerald-400'
                      : 'border-sky-200 bg-sky-50 focus:border-sky-400 focus:ring-2 focus:ring-sky-100',
                  ].join(' ')}
                />
                {form.confirmPass && (
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-base">
                    {form.confirmPass === form.password ? '✓' : '✕'}
                  </span>
                )}
              </div>
              {form.confirmPass && form.confirmPass !== form.password && (
                <p className="text-xs text-red-400 mt-1">Passwords do not match</p>
              )}
            </div>

            {/* Error */}
            {error && (
              <div className="flex items-start gap-2 bg-red-50 border border-red-200 rounded-xl px-4 py-3">
                <span className="text-red-400 flex-shrink-0 mt-0.5">⚠</span>
                <p className="text-red-600 text-sm">{error}</p>
              </div>
            )}

            {/* Submit */}
            <button
              onClick={handleSubmit}
              disabled={loading || form.password !== form.confirmPass}
              className="w-full py-4 bg-sky-600 text-white rounded-xl font-bold text-base hover:bg-sky-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 shadow-sm mt-2"
            >
              {loading && (
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              )}
              {loading ? 'Creating your account...' : 'Create Admin Account'}
            </button>
          </div>

          {/* Footer note */}
          <div className="mt-6 pt-5 border-t border-sky-100 text-center">
            <p className="text-sky-400 text-xs">
              Already have an account?{' '}
              <Link to="/mentorship/login" className="text-sky-600 font-semibold hover:underline">
                Sign in here
              </Link>
            </p>
            <p className="text-sky-300 text-xs mt-2">
              This invite link is single-use and expires after 24 hours.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

// ── Helpers ──────────────────────────────────────────────────────────────────

function getStrengthLevel(password: string): number {
  let score = 0
  if (password.length >= 8)                   score++
  if (password.length >= 12)                  score++
  if (/[A-Z]/.test(password) && /[a-z]/.test(password)) score++
  if (/[0-9]/.test(password) || /[^A-Za-z0-9]/.test(password)) score++
  return score
}

function getStrengthLabel(password: string): string {
  const level = getStrengthLevel(password)
  return ['', 'Weak — add length', 'Fair — add uppercase', 'Good — add numbers', 'Strong password ✓'][level] ?? ''
}

// ── Error screen sub-component ───────────────────────────────────────────────

function TokenErrorScreen({ icon, title, message }: { icon: string; title: string; message: string }) {
  return (
    <div className="min-h-screen bg-sky-50 flex items-center justify-center px-6 font-body">
      <div className="text-center max-w-sm">
        <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center text-4xl mx-auto mb-5 shadow-sm">
          {icon}
        </div>
        <h1 className="font-display text-3xl text-sky-900 mb-3">{title}</h1>
        <p className="text-sky-500 text-sm leading-relaxed mb-6">{message}</p>
        <Link
          to="/"
          className="inline-block px-6 py-3 bg-sky-600 text-white rounded-xl font-semibold text-sm hover:bg-sky-700 transition-colors"
        >
          Back to Home
        </Link>
      </div>
    </div>
  )
}