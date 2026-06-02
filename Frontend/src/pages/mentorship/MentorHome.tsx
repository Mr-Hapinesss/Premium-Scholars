import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Navbar from '../../components/shared/Navbar'
import { useAuth } from '../../context/AuthContext'
import { mentorshipService } from '../../services/mentorship.service'
import { MentorStats } from '../../types/mentorship.types'
import ProfileEditor from '../../components/shared/ProfileEditor'


export default function MentorHome() {
  const { user } = useAuth()
  const [stats, setStats] = useState<MentorStats>({ menteeCount: 0, recentActivity: [] as any[] })
  const [profileOpen, setProfileOpen] = useState(false)


  useEffect(() => {
    mentorshipService.getMentorStats().then((data) => {
      setStats(data)
    })
  }, [])

  return (
    <div className="min-h-screen bg-sky-50 font-body">
      <Navbar />
      <div className="mb-8 flex items-start justify-between gap-4 flex-wrap">
        <div className="mb-10">
          <div className="text-gold-500 text-sm font-semibold tracking-widest uppercase mb-2">Mentor Dashboard</div>
          <h1 className="font-display text-4xl text-sky-900">Welcome, {user?.name.split(' ')[0]} 👋</h1>
          <div>
            {/* WhatsApp display */}
    {user?.whatsapp ? (
      <div className="flex items-center gap-2 mt-2">
        <span className="text-lg">💬</span>
        <span className="text-sky-600 text-sm font-medium">{user.whatsapp}</span>
        <span className="text-sky-400 text-xs">(WhatsApp)</span>
      </div>
    ) : (
      <p className="text-sky-400 text-xs mt-2">
        No WhatsApp number set —{' '}
        <button
          onClick={() => setProfileOpen(true)}
          className="text-sky-600 font-semibold hover:underline"
        >
          add one
        </button>
      </p>
    )}
      <button
    onClick={() => setProfileOpen(true)}
    className="flex items-center gap-2 px-4 py-2 bg-white border border-sky-200 text-sky-600 rounded-xl text-sm font-semibold hover:bg-sky-50 transition-colors shadow-sm"
  >
    ✏ Edit Profile
  </button>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-10">
          <div className="bg-white rounded-2xl p-6 border border-sky-100 shadow-sm">
            <div className="text-sky-400 text-sm mb-1">Your Mentees</div>
            <div className="font-display text-5xl text-sky-800">{stats.menteeCount}</div>
          </div>
          <div className="bg-gold-50 rounded-2xl p-6 border border-gold-100 shadow-sm">
            <div className="text-gold-500 text-sm mb-1">University</div>
            <div className="font-semibold text-sky-800">{user?.university || '—'}</div>
          </div>
          <div className="bg-sky-600 rounded-2xl p-6 text-white shadow-sm">
            <div className="text-sky-200 text-sm mb-2">Quick Access</div>
            <Link to="/mentorship/mentor/mentees"
              className="block text-center bg-white/20 hover:bg-white/30 transition-colors rounded-xl py-2.5 text-sm font-semibold">
              View My Mentees →
            </Link>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-sky-100 p-6">
          <h2 className="font-display text-xl text-sky-800 mb-4">Getting Started as a Mentor</h2>
          <ul className="space-y-2 text-sky-600 text-sm">
            <li className="flex gap-2"><span className="text-gold-400">✦</span> Reach out to your mentees within the first week.</li>
            <li className="flex gap-2"><span className="text-gold-400">✦</span> Help them understand their course requirements and timetable.</li>
            <li className="flex gap-2"><span className="text-gold-400">✦</span> Share resources and experiences — what helped you survive year one?</li>
          </ul>
        </div>
      </div>
      <ProfileEditor open={profileOpen} onClose={() => setProfileOpen(false)} />
    </div>
  )
}