import { useEffect, useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import { mentorshipService } from '../../services/mentorship.service'
import MenteeCard from './MenteeCard'
import LoadingSpinner from '../shared/LoadingSpinner'
import EmptyState from '../shared/EmptyState'
import { Link } from 'react-router-dom'

interface Mentee {
  _id: string
  name: string
  email: string
  university: string
  createdAt: string
}

export default function MentorDashboard() {
  const { user }          = useAuth()
  const [mentees, setMentees] = useState<Mentee[]>([])
  const [count,   setCount]   = useState(0)
  const [loading, setLoading] = useState(true)
  const [view,    setView]    = useState<'home' | 'mentees'>('home')

  useEffect(() => {
    Promise.all([
      mentorshipService.getMyMentees(),
      mentorshipService.getMentorStats(),
    ])
      .then(([menteesRes, statsRes]: any) => {
        setMentees(menteesRes.data || [])
        setCount(statsRes.data?.menteeCount || 0)
      })
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <LoadingSpinner />

  return (
    <div className="space-y-6">
      {/* Welcome banner */}
      <div className="bg-gradient-to-r from-sky-700 to-sky-800 rounded-3xl p-7 text-white">
        <div className="text-sky-200 text-sm mb-1">Mentor Dashboard</div>
        <h1 className="font-display text-3xl mb-1">{user?.name}</h1>
        <p className="text-sky-300 text-sm">{user?.university}</p>
      </div>

      {/* Tab toggle */}
      <div className="flex bg-sky-50 border border-sky-100 rounded-2xl p-1">
        {[
          { key: 'home',    label: '🏠 Home' },
          { key: 'mentees', label: `🎓 My Mentees (${count})` },
        ].map(tab => (
          <button key={tab.key} onClick={() => setView(tab.key as any)}
            className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all
              ${view === tab.key ? 'bg-white text-sky-700 shadow-sm' : 'text-sky-400 hover:text-sky-600'}`}>
            {tab.label}
          </button>
        ))}
      </div>

      {view === 'home' && (
        <>
          {/* Stats row */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white rounded-2xl border border-sky-100 p-5 text-center">
              <div className="font-display text-4xl font-bold text-sky-800">{count}</div>
              <div className="text-sky-400 text-sm mt-1">Assigned Mentees</div>
            </div>
            <div className="bg-gold-50 border border-gold-100 rounded-2xl p-5 text-center">
              <div className="font-display text-4xl font-bold text-gold-600">✦</div>
              <div className="text-sky-500 text-sm mt-1">Verified Mentor</div>
            </div>
          </div>

          {/* Quick actions */}
          <div className="bg-white border border-sky-100 rounded-2xl p-6">
            <h2 className="font-display text-xl text-sky-800 mb-4">Quick Actions</h2>
            <div className="space-y-2">
              <button onClick={() => setView('mentees')}
                className="w-full text-left px-4 py-3 bg-sky-50 hover:bg-sky-100 rounded-xl text-sm font-medium text-sky-700 transition-colors flex items-center justify-between">
                <span>👥 View My Mentees</span>
                <span className="text-sky-400">→</span>
              </button>
              <Link to="/news"
                className="block w-full text-left px-4 py-3 bg-sky-50 hover:bg-sky-100 rounded-xl text-sm font-medium text-sky-700 transition-colors flex items-center justify-between">
                <span>📰 Read Latest News</span>
                <span className="text-sky-400">→</span>
              </Link>
            </div>
          </div>

          {/* Mentor tips */}
          <div className="bg-gradient-to-br from-gold-50 to-ivory border border-gold-100 rounded-2xl p-6">
            <h3 className="font-display text-lg text-sky-800 mb-3">Mentor Tips</h3>
            <ul className="space-y-2 text-sky-600 text-sm">
              <li className="flex gap-2"><span className="text-gold-500 flex-shrink-0">✦</span> Reach out to your mentees in their first week of campus.</li>
              <li className="flex gap-2"><span className="text-gold-500 flex-shrink-0">✦</span> Help them understand their unit registration and timetable.</li>
              <li className="flex gap-2"><span className="text-gold-500 flex-shrink-0">✦</span> Share resources and personal experiences — what helped you survive year one?</li>
              <li className="flex gap-2"><span className="text-gold-500 flex-shrink-0">✦</span> Be consistent. Even a quick weekly check-in makes a big difference.</li>
            </ul>
          </div>
        </>
      )}

      {view === 'mentees' && (
        <div>
          {mentees.length === 0 ? (
            <EmptyState
              icon="🎓"
              title="No mentees assigned yet"
              subtitle="Our admin team will assign mentees to you soon. Check back shortly."
            />
          ) : (
            <div className="space-y-3">
              {mentees.map(m => <MenteeCard key={m._id} mentee={m} />)}
            </div>
          )}
        </div>
      )}
    </div>
  )
}