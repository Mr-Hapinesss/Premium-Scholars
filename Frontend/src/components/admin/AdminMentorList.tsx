import { useState } from 'react'
import { adminService } from '../../services/admin.service'
import { useToast } from '../shared/Toast'

interface Mentor {
  _id: string
  name: string
  email: string
  university: string
  menteeCount: number
  createdAt: string
}

interface Props {
  mentors: Mentor[]
}

export default function AdminMentorList({ mentors }: Props) {
  const { toast }              = useToast()
  const [search, setSearch]    = useState('')
  const [result, setResult]    = useState<any | null>(null)
  const [searching, setSearching] = useState(false)

  const handleSearch = async () => {
    if (!search.trim()) return
    setSearching(true)
    try {
      const res = await adminService.getMenteeById(search.trim())
      setResult(res.data)
    } catch {
      toast('Mentee not found', 'error')
      setResult(null)
    } finally {
      setSearching(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Mentee lookup */}
      <div className="bg-gold-50 border border-gold-100 rounded-2xl p-5">
        <h3 className="font-semibold text-sky-700 mb-3 text-sm">🔍 Search Mentee by ID</h3>
        <div className="flex gap-3">
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSearch()}
            placeholder="Paste MongoDB ObjectId..."
            className="flex-1 px-4 py-2.5 rounded-xl border border-gold-200 text-sm focus:outline-none focus:border-gold-400 bg-white"
          />
          <button
            onClick={handleSearch}
            disabled={searching}
            className="px-5 py-2.5 bg-sky-600 text-white rounded-xl text-sm font-semibold hover:bg-sky-700 disabled:opacity-50 transition-colors"
          >
            {searching ? '...' : 'Search'}
          </button>
        </div>
        {result && (
          <div className="mt-4 bg-white rounded-xl border border-sky-100 p-4 text-sm space-y-1">
            <div className="flex justify-between"><span className="text-sky-500">Name</span><span className="font-semibold text-sky-800">{result.name}</span></div>
            <div className="flex justify-between"><span className="text-sky-500">Email</span><span className="text-sky-700">{result.email}</span></div>
            <div className="flex justify-between"><span className="text-sky-500">University</span><span className="text-sky-700">{result.university || '—'}</span></div>
            <div className="flex justify-between"><span className="text-sky-500">Mentor</span><span className="text-sky-700">{result.mentorName || 'Unassigned'}</span></div>
            <div className="flex justify-between"><span className="text-sky-500">Joined</span><span className="text-sky-700">{new Date(result.createdAt).toLocaleDateString()}</span></div>
          </div>
        )}
      </div>

      {/* Mentor table */}
      <div className="space-y-3">
        {mentors.length === 0 ? (
          <p className="text-sky-400 text-sm text-center py-8">No mentors yet.</p>
        ) : (
          mentors.map(m => (
            <div key={m._id} className="bg-white rounded-2xl border border-sky-100 px-5 py-4 flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-sky-500 to-gold-400 flex items-center justify-center text-white font-bold flex-shrink-0">
                {m.name[0]}
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-sky-800 truncate">{m.name}</div>
                <div className="text-sky-400 text-xs truncate">{m.email}</div>
                <div className="text-sky-300 text-xs">{m.university || '—'}</div>
              </div>
              <div className="text-right flex-shrink-0">
                <div className="text-2xl font-display font-bold text-sky-700">{m.menteeCount}</div>
                <div className="text-sky-400 text-xs">mentee{m.menteeCount !== 1 ? 's' : ''}</div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}