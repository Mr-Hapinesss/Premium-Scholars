import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { api } from '../../services/api'
import { useDebounce } from '../../hooks/useDebounce'

type CodeStatus = 'idle' | 'checking' | 'valid' | 'invalid'

export default function Register() {
  const { register } = useAuth()
  const navigate     = useNavigate()

  const [role, setRole]     = useState<'mentee' | 'mentor'>('mentee')
  const [form, setForm]     = useState({ name: '', email: '', password: '', university: '', mentorCode: '' })
  const [error, setError]   = useState('')
  const [loading, setLoading] = useState(false)
  const [codeStatus, setCodeStatus] = useState<CodeStatus>('idle')

  const debouncedCode = useDebounce(form.mentorCode, 600)

  // Validate mentor code in real time
  useEffect(() => {
    if (role !== 'mentor' || !debouncedCode.trim()) {
      setCodeStatus('idle')
      return
    }
    setCodeStatus('checking')
    api.post('/auth/validate-mentor-code', { code: debouncedCode })
      .then(() => setCodeStatus('valid'))
      .catch(() => setCodeStatus('invalid'))
  }, [debouncedCode, role])

  const handleSubmit = async () => {
    setError('')
    if (!form.name || !form.email || !form.password) { setError('Name, email and password are required'); return }
    if (role === 'mentor' && codeStatus !== 'valid') { setError('Please enter a valid mentor code'); return }

    setLoading(true)
    try {
      await register({
        ...form,
        role,
        mentorCode: role === 'mentor' ? form.mentorCode : undefined,
      })
      navigate(role === 'mentor' ? '/mentorship/mentor/home' : '/mentorship/mentee/home')
    } catch (e: any) {
      setError(e.response?.data?.message || 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  const codeIndicator = {
    idle:     { text: '',                            color: '' },
    checking: { text: 'Checking code...',            color: 'text-sky-400' },
    valid:    { text: '✓ Valid mentor code',         color: 'text-emerald-500' },
    invalid:  { text: '✕ Invalid or already used',  color: 'text-rose' },
  }[codeStatus]

  return (
    <div className="min-h-screen bg-sky-50 flex items-center justify-center px-6 py-12 font-body">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl border border-sky-100 p-8">
        <div className="mb-6">
          <h1 className="font-display text-3xl text-sky-900 mb-1">Join Premium Scholars</h1>
          <p className="text-sky-500 text-sm">Create your account to get started.</p>
        </div>

        {/* Role toggle */}
        <div className="flex bg-sky-50 rounded-2xl p-1 mb-5">
          {(['mentee', 'mentor'] as const).map(r => (
            <button key={r} onClick={() => { setRole(r); setCodeStatus('idle') }}
              className={`flex-1 py-2.5 rounded-xl text-sm font-semibold capitalize transition-all
                ${role === r ? 'bg-white text-sky-700 shadow-sm' : 'text-sky-400 hover:text-sky-600'}`}>
              {r === 'mentee' ? '🎓 Mentee' : '⭐ Mentor'}
            </button>
          ))}
        </div>

        <div className="space-y-4">
          {[
            { key: 'name',       label: 'Full Name',   type: 'text',     placeholder: 'Your full name' },
            { key: 'email',      label: 'Email',       type: 'email',    placeholder: 'student@uni.ac.ke' },
            { key: 'university', label: 'University',  type: 'text',     placeholder: 'e.g. University of Nairobi' },
            { key: 'password',   label: 'Password',    type: 'password', placeholder: '6+ characters' },
          ].map(f => (
            <div key={f.key}>
              <label className="text-sky-700 text-sm font-medium block mb-1">{f.label}</label>
              <input
                type={f.type}
                placeholder={f.placeholder}
                value={(form as any)[f.key]}
                onChange={e => setForm(prev => ({ ...prev, [f.key]: e.target.value }))}
                className="w-full px-4 py-3 rounded-xl border border-sky-200 focus:outline-none focus:border-sky-400 bg-sky-50 text-sky-800 text-sm"
              />
            </div>
          ))}

          {role === 'mentor' && (
            <div>
              <label className="text-sky-700 text-sm font-medium block mb-1">Mentor Verification Code</label>
              <input
                type="text"
                placeholder="e.g. PS-3F9A2C"
                value={form.mentorCode}
                onChange={e => setForm(prev => ({ ...prev, mentorCode: e.target.value }))}
                className={`w-full px-4 py-3 rounded-xl border focus:outline-none text-sky-800 text-sm transition-colors
                  ${codeStatus === 'valid'   ? 'border-emerald-300 bg-emerald-50 focus:border-emerald-400' :
                    codeStatus === 'invalid' ? 'border-rose/40 bg-rose/5 focus:border-rose/60' :
                    'border-gold-200 bg-gold-50 focus:border-gold-400'}`}
              />
              {codeIndicator.text && (
                <p className={`text-xs mt-1 ${codeIndicator.color}`}>{codeIndicator.text}</p>
              )}
              <p className="text-xs text-sky-400 mt-1">Don't have a code? Contact our admin team.</p>
            </div>
          )}

          {error && (
            <div className="bg-rose/10 border border-rose/20 rounded-xl px-4 py-3 text-rose text-sm">
              {error}
            </div>
          )}

          <button
            onClick={handleSubmit}
            disabled={loading || (role === 'mentor' && codeStatus !== 'valid')}
            className="w-full py-3.5 bg-sky-600 text-white rounded-xl font-semibold hover:bg-sky-700 transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
          >
            {loading && <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
            {loading ? 'Creating account...' : 'Create Account'}
          </button>
        </div>

        <p className="text-center text-sky-500 text-sm mt-5">
          Already have an account?{' '}
          <Link to="/mentorship/login" className="text-sky-700 font-semibold hover:underline">Sign in</Link>
        </p>
      </div>
    </div>
  )
}