import { useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import { profileService } from '../../services/auth.service'
import { useToast } from './Toast'

interface Props {
  open:    boolean
  onClose: () => void
}

export default function ProfileEditor({ open, onClose }: Props) {
  const { user, login } = useAuth()
  const { toast }       = useToast()

  const [form, setForm] = useState({
    name:       user?.name        ?? '',
    university: user?.university  ?? '',
    whatsapp:   user?.whatsapp    ?? '',
  })
  const [loading, setLoading] = useState(false)
  const [error,   setError]   = useState('')

  const update = (key: keyof typeof form) =>
    (e: React.ChangeEvent<HTMLInputElement>) =>
      setForm(prev => ({ ...prev, [key]: e.target.value }))

  const handleSave = async () => {
    setError('')
    setLoading(true)
    try {
      await profileService.updateProfile({
        name:       form.name.trim()       || undefined,
        university: form.university.trim() || undefined,
        whatsapp:   form.whatsapp.trim()   || null,
      })
      toast('Profile updated ✓', 'success')
      onClose()
      // Reload the page so AuthContext re-fetches the updated user
      window.location.reload()
    } catch (err: any) {
      setError(err.response?.data?.message ?? 'Failed to save changes')
    } finally {
      setLoading(false)
    }
  }

  if (!open) return null

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-sky-900/30 backdrop-blur-sm z-40"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="fixed right-0 top-0 bottom-0 w-full max-w-sm bg-white z-50 shadow-2xl flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-sky-100">
          <h2 className="font-display text-xl text-sky-900">Edit Profile</h2>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-sky-50 hover:bg-sky-100 text-sky-500 flex items-center justify-center transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-6 py-6 space-y-5">

          {/* Avatar preview */}
          <div className="flex items-center gap-4 p-4 bg-sky-50 rounded-2xl border border-sky-100">
            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-sky-400 to-gold-400 flex items-center justify-center text-white font-display font-bold text-2xl flex-shrink-0">
              {(form.name || user?.name || '?').charAt(0).toUpperCase()}
            </div>
            <div>
              <div className="font-semibold text-sky-800">{form.name || user?.name}</div>
              <div className="text-sky-400 text-xs">{user?.email}</div>
              <div className="text-gold-500 text-xs capitalize font-semibold mt-0.5">
                {user?.role}
              </div>
            </div>
          </div>

          {/* Name */}
          <div>
            <label className="block text-sky-700 text-xs font-bold mb-1.5 uppercase tracking-wide">
              Full Name
            </label>
            <input
              type="text"
              value={form.name}
              onChange={update('name')}
              placeholder="Your full name"
              className="w-full px-4 py-3 rounded-xl border border-sky-200 focus:outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-100 bg-sky-50 text-sky-800 text-sm transition-all"
            />
          </div>

          {/* University */}
          <div>
            <label className="block text-sky-700 text-xs font-bold mb-1.5 uppercase tracking-wide">
              University
            </label>
            <input
              type="text"
              value={form.university}
              onChange={update('university')}
              placeholder="e.g. University of Nairobi"
              className="w-full px-4 py-3 rounded-xl border border-sky-200 focus:outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-100 bg-sky-50 text-sky-800 text-sm transition-all"
            />
          </div>

          {/* WhatsApp */}
          <div>
            <label className="block text-sky-700 text-xs font-bold mb-1.5 uppercase tracking-wide">
              WhatsApp Number
            </label>
            <div className="relative">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 flex items-center gap-1 pointer-events-none">
                <span className="text-lg">💬</span>
              </div>
              <input
                type="tel"
                value={form.whatsapp}
                onChange={update('whatsapp')}
                placeholder="+254712345678"
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-sky-200 focus:outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 bg-sky-50 text-sky-800 text-sm transition-all"
              />
            </div>
            <p className="text-sky-400 text-xs mt-1.5 leading-relaxed">
              Include your country code (e.g. +254 for Kenya). Admins use this to reach out to you directly.
              Only admins and your assigned mentor/mentee can see this number.
            </p>
          </div>

          {/* Privacy notice */}
          <div className="flex gap-2 bg-gold-50 border border-gold-100 rounded-xl px-4 py-3">
            <span className="text-gold-500 flex-shrink-0">ℹ</span>
            <p className="text-sky-600 text-xs leading-relaxed">
              Your WhatsApp number is private. It is only visible to admins and the mentor or mentee you are paired with — never to the public or other users.
            </p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-red-600 text-sm">
              {error}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-5 border-t border-sky-100 space-y-2">
          <button
            onClick={handleSave}
            disabled={loading}
            className="w-full py-3.5 bg-sky-600 text-white rounded-xl font-bold hover:bg-sky-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading && (
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            )}
            {loading ? 'Saving...' : 'Save Changes'}
          </button>
          <button
            onClick={onClose}
            className="w-full py-2.5 text-sky-500 text-sm hover:text-sky-700 transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </>
  )
}