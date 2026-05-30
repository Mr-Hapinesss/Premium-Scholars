import { useEffect, useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import { mentorshipService } from '../../services/mentorship.service'
import LoadingSpinner from '../shared/LoadingSpinner'
import { Link } from 'react-router-dom'

interface MentorInfo {
  _id: string
  name: string
  email: string
  university: string
}

export default function MenteeDashboard() {
  const { user } = useAuth()
  const [mentor,  setMentor]  = useState<MentorInfo | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    mentorshipService.getMyMentor()
      .then((res: any) => setMentor(res.data))
      .catch(() => setMentor(null))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <LoadingSpinner />

  return (
    <div className="space-y-6">
      {/* Welcome banner */}
      <div className="bg-gradient-to-r from-sky-600 to-sky-700 rounded-3xl p-7 text-white">
        <div className="text-sky-200 text-sm mb-1">Welcome back 👋</div>
        <h1 className="font-display text-3xl mb-1">{user?.name}</h1>
        <p className="text-sky-200 text-sm">{user?.university}</p>
      </div>

      {/* Mentor card */}
      <div className="bg-white rounded-2xl border border-sky-100 p-6">
        <h2 className="font-display text-xl text-sky-800 mb-4">Your Mentor</h2>
        {mentor ? (
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-gold-400 to-sky-500 flex items-center justify-center text-white font-bold text-xl flex-shrink-0">
              {mentor.name[0]}
            </div>
            <div>
              <div className="font-semibold text-sky-800">{mentor.name}</div>
              <div className="text-sky-500 text-sm">{mentor.email}</div>
              <div className="text-sky-400 text-xs mt-0.5">🏫 {mentor.university}</div>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-3 text-sky-400 text-sm">
            <div className="w-12 h-12 rounded-full bg-sky-100 flex items-center justify-center text-2xl">⏳</div>
            <div>
              <div className="font-medium text-sky-600">Mentor not yet assigned</div>
              <div className="text-xs">Our admin team will assign your mentor shortly.</div>
            </div>
          </div>
        )}
      </div>

      {/* Quick links */}
      <div className="grid grid-cols-2 gap-4">
        {[
          { path: '/requirements', emoji: '📦', label: 'Shop Requirements', color: 'from-gold-50 to-ivory border-gold-100' },
          { path: '/beauty',       emoji: '💄', label: 'Beauty Shop',        color: 'from-blush to-white border-rose/10' },
          { path: '/news',         emoji: '📰', label: 'Latest News',        color: 'from-sky-50 to-white border-sky-100' },
          { path: '/mentorship',   emoji: '🤝', label: 'Mentorship Home',    color: 'from-sky-100 to-sky-50 border-sky-200' },
        ].map(link => (
          <Link key={link.path} to={link.path}
            className={`bg-gradient-to-br ${link.color} border rounded-2xl p-5 hover:shadow-md transition-all hover:-translate-y-0.5 group`}>
            <div className="text-3xl mb-2">{link.emoji}</div>
            <div className="font-semibold text-sky-700 text-sm group-hover:text-sky-900 transition-colors">{link.label}</div>
          </Link>
        ))}
      </div>

      {/* Tips */}
      <div className="bg-gold-50 border border-gold-100 rounded-2xl p-6">
        <h3 className="font-display text-lg text-sky-800 mb-3">Getting Started</h3>
        <ul className="space-y-2 text-sky-600 text-sm">
          <li className="flex gap-2"><span className="text-gold-500 flex-shrink-0">✦</span> Check your requirements list and place your orders early — stock is limited.</li>
          <li className="flex gap-2"><span className="text-gold-500 flex-shrink-0">✦</span> Once your mentor is assigned, reach out and introduce yourself.</li>
          <li className="flex gap-2"><span className="text-gold-500 flex-shrink-0">✦</span> Visit the news board regularly for scholarship and event updates.</li>
        </ul>
      </div>
    </div>
  )
}