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
      
      {/* Main Dashboard Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        
        {/* Header Section */}
        <div className="mb-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6 pb-6 border-b border-sky-100">
          <div>
            <div className="text-gold-500 text-xs font-bold tracking-widest uppercase mb-1">
              Mentor Dashboard
            </div>
            <h1 className="font-display text-4xl font-bold text-sky-900">
              Welcome, {user?.name.split(' ')[0]} 👋
            </h1>
            
            {/* WhatsApp Display */}
            <div className="mt-2">
              {user?.whatsapp ? (
                <div className="flex items-center gap-2">
                  <span className="text-base">💬</span>
                  <span className="text-sky-700 text-sm font-medium">{user.whatsapp}</span>
                  <span className="text-sky-400 text-xs">(WhatsApp)</span>
                </div>
              ) : (
                <p className="text-sky-500 text-sm">
                  No WhatsApp number set —{' '}
                  <button
                    onClick={() => setProfileOpen(true)}
                    className="text-sky-600 font-semibold hover:underline"
                  >
                    add one
                  </button>
                </p>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center">
            <button
              onClick={() => setProfileOpen(true)}
              className="flex items-center gap-2 px-5 py-2.5 bg-white border border-sky-200 text-sky-600 rounded-xl text-sm font-semibold hover:bg-sky-100/50 transition-colors shadow-sm"
            >
              ✏️ Edit Profile
            </button>
          </div>
        </div>

        {/* Stats & Info Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          {/* Mentees Count Card */}
          <div className="bg-white rounded-2xl p-6 border border-sky-100 shadow-sm flex flex-col justify-between">
            <div>
              <div className="text-sky-500 text-sm font-medium mb-1">Your Mentees</div>
              <div className="font-display text-5xl font-bold text-sky-800">{stats.menteeCount}</div>
            </div>
          </div>

          {/* University Card */}
          <div className="bg-amber-50/60 rounded-2xl p-6 border border-amber-100 shadow-sm flex flex-col justify-between">
            <div>
              <div className="text-amber-700 text-sm font-medium mb-1">University</div>
              <div className="font-semibold text-xl text-sky-900 mt-2">{user?.university || '—'}</div>
            </div>
          </div>

          {/* Quick Access Card */}
          <div className="bg-sky-600 rounded-2xl p-6 text-white shadow-sm flex flex-col justify-between min-h-[140px]">
            <div>
              <div className="text-sky-100 text-sm font-medium mb-2">Quick Access</div>
              <p className="text-xs text-sky-200 mb-4">Manage your relationships and view details.</p>
            </div>
            <Link 
              to="/mentorship/mentor/mentees"
              className="block text-center bg-white text-sky-700 hover:bg-sky-50 transition-colors rounded-xl py-2.5 text-sm font-bold shadow-sm"
            >
              View My Mentees →
            </Link>
          </div>
        </div>

        {/* Resources / Onboarding Section */}
        <div className="bg-white rounded-2xl border border-sky-100 p-8 shadow-sm max-w-3xl">
          <h2 className="font-display text-xl font-bold text-sky-950 mb-4">Getting Started as a Mentor</h2>
          <ul className="space-y-3 text-sky-700 text-sm leading-relaxed">
            <li className="flex items-start gap-3">
              <span className="text-amber-500 mt-0.5">✦</span> 
              <span>Reach out to your mentees within the first week.</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-amber-500 mt-0.5">✦</span> 
              <span>Help them understand their course requirements and timetable.</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-amber-500 mt-0.5">✦</span> 
              <span>Share resources and experiences — what helped you survive year one?</span>
            </li>
          </ul>
        </div>

      </main>

      <ProfileEditor open={profileOpen} onClose={() => setProfileOpen(false)} />
    </div>
  )
}