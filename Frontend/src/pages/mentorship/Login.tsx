import { useState, useEffect } from 'react'
import { useNavigate, Link, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

export default function Login() {
  const { login, user }       = useAuth()
  const navigate              = useNavigate()
  const location              = useLocation()
  const from                  = (location.state as any)?.from?.pathname
  const [form, setForm]       = useState({ email: '', password: '' })
  const [error, setError]     = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!user) return
    const dest =
      from ||
      (user.role === 'admin'  ? '/admin' :
       user.role === 'mentor' ? '/mentorship/mentor/home' :
                                '/mentorship/mentee/home')
    navigate(dest, { replace: true })
  }, [user, navigate, from])

  const handleSubmit = async () => {
    if (!form.email || !form.password) { setError('Both fields are required'); return }
    setLoading(true)
    setError('')
    try {
      await login(form.email, form.password)
    } catch (e: any) {
      setError(e.response?.data?.message || 'Invalid email or password')
    } finally {
      setLoading(false)
    }
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
          <h1 className="font-display text-3xl text-sky-900 mb-1">Welcome Back</h1>
          <p className="text-sky-500 text-sm">Sign in to access your dashboard.</p>
        </div>

        <div className="space-y-4">
          {[
            { key: 'email',    label: 'Email',    type: 'email',    placeholder: 'your@email.com' },
            { key: 'password', label: 'Password', type: 'password', placeholder: '••••••••' },
          ].map(f => (
            <div key={f.key}>
              <label className="text-sky-700 text-sm font-medium block mb-1">{f.label}</label>
              <input
                type={f.type}
                placeholder={f.placeholder}
                value={(form as any)[f.key]}
                onChange={e => setForm(prev => ({ ...prev, [f.key]: e.target.value }))}
                onKeyDown={e => e.key === 'Enter' && handleSubmit()}
                className="w-full px-4 py-3 rounded-xl border border-sky-200 focus:outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-100 bg-sky-50 text-sky-800 text-sm transition-all"
              />
            </div>
          ))}

          {/* Forgot password link */}
          <div className="flex justify-end">
            <Link
              to="/forgot-password"
              className="text-xs text-sky-500 hover:text-sky-700 font-medium transition-colors"
            >
              Forgot your password?
            </Link>
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
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </div>

        <p className="text-center text-sky-500 text-sm mt-5">
          No account?{' '}
          <Link to="/mentorship/register" className="text-sky-700 font-semibold hover:underline">
            Register
          </Link>
        </p>
      </div>
    </div>
  )
}