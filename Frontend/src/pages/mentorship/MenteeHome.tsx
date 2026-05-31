import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Navbar from '../../components/shared/Navbar'
import Footer from '../../components/shared/Footer'
import LoadingSpinner from '../../components/shared/LoadingSpinner'
import { useAuth } from '../../context/AuthContext'
import { mentorshipService } from '../../services/mentorship.service'
import { MentorStats } from '../../types/mentorship.types'

export default function MentorHome() {
  const { user }                = useAuth()
  const [stats,   setStats]     = useState<MentorStats>({ menteeCount: 0 })
  const [loading, setLoading]   = useState(true)

  useEffect(() => {
    mentorshipService
      .getMentorStats()
      .then(data => setStats(data))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <LoadingSpinner fullPage />

  const firstName = user?.name.split(' ')[0] ?? 'Mentor'

  return (
    <div className="min-h-screen bg-sky-50 font-body">
      <Navbar />

      <div className="pt-24 pb-16 px-4 sm:px-6 max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <p className="text-gold-500 text-xs font-bold tracking-widest uppercase mb-2">Mentor Dashboard</p>
          <h1 className="font-display text-4xl text-sky-900">
            Welcome back, {firstName} 👋
          </h1>
          {user?.university && (
            <p className="text-sky-500 mt-1">{user.university}</p>
          )}
        </div>

        {/* Stats cards */}
        <div className="grid sm:grid-cols-3 gap-5 mb-8">
          <div className="bg-white rounded-2xl border border-sky-100 p-6 text-center shadow-sm">
            <div className="font-display text-5xl font-bold text-sky-800 mb-1">
              {stats.menteeCount}
            </div>
            <div className="text-sky-400 text-sm">Assigned Mentees</div>
          </div>

          <div className="bg-gradient-to-br from-gold-50 to-yellow-50 rounded-2xl border border-gold-100 p-6 text-center shadow-sm">
            <div className="font-display text-4xl text-gold-500 mb-1">✦</div>
            <div className="text-sky-600 text-sm font-medium">Verified Mentor</div>
            <div className="text-sky-400 text-xs mt-1">Premium Scholars</div>
          </div>

          <div className="bg-sky-600 rounded-2xl p-6 shadow-sm">
            <p className="text-sky-200 text-xs mb-3 font-semibold uppercase tracking-wide">Quick Access</p>
            <Link
              to="/mentorship/mentor/mentees"
              className="block text-center bg-white/20 hover:bg-white/30 transition-colors rounded-xl py-2.5 text-white text-sm font-semibold"
            >
              View My Mentees →
            </Link>
          </div>
        </div>

        {/* Getting started guide */}
        <div className="bg-white rounded-2xl border border-sky-100 p-6 mb-6 shadow-sm">
          <h2 className="font-display text-xl text-sky-800 mb-4">Getting Started as a Mentor</h2>
          <ul className="space-y-3">
            {[
              'Reach out to your mentees within their first week on campus.',
              'Help them understand unit registration, timetables, and faculty requirements.',
              'Share personal experiences — what helped you survive your first year?',
              'Be consistent. Even a quick weekly check-in makes a huge difference.',
            ].map((tip, i) => (
              <li key={i} className="flex gap-3 text-sky-600 text-sm leading-relaxed">
                <span className="text-gold-400 font-bold flex-shrink-0 mt-0.5">✦</span>
                {tip}
              </li>
            ))}
          </ul>
        </div>

        {/* Quick links */}
        <div className="grid sm:grid-cols-2 gap-4">
          <Link
            to="/mentorship/mentor/mentees"
            className="flex items-center gap-4 bg-white border border-sky-100 rounded-2xl p-5 hover:shadow-md transition-all hover:-translate-y-0.5 group"
          >
            <div className="w-11 h-11 rounded-xl bg-sky-100 flex items-center justify-center text-2xl flex-shrink-0">
              👥
            </div>
            <div>
              <div className="font-semibold text-sky-800 group-hover:text-sky-900 text-sm">My Mentees</div>
              <div className="text-sky-400 text-xs mt-0.5">{stats.menteeCount} assigned</div>
            </div>
            <span className="ml-auto text-sky-300 group-hover:translate-x-1 transition-transform">→</span>
          </Link>

          <Link
            to="/news"
            className="flex items-center gap-4 bg-white border border-sky-100 rounded-2xl p-5 hover:shadow-md transition-all hover:-translate-y-0.5 group"
          >
            <div className="w-11 h-11 rounded-xl bg-gold-50 flex items-center justify-center text-2xl flex-shrink-0">
              📰
            </div>
            <div>
              <div className="font-semibold text-sky-800 group-hover:text-sky-900 text-sm">Latest News</div>
              <div className="text-sky-400 text-xs mt-0.5">Campus updates</div>
            </div>
            <span className="ml-auto text-sky-300 group-hover:translate-x-1 transition-transform">→</span>
          </Link>
        </div>
      </div>

      <Footer />
    </div>
  )
}