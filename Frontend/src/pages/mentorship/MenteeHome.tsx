import Navbar from '../../components/shared/Navbar'
import { useAuth } from '../../context/AuthContext'
import { Link } from 'react-router-dom'

export default function MenteeHome() {
  const { user } = useAuth()

  return (
    <div className="min-h-screen bg-sky-50 font-body">
      <Navbar />
      <div className="pt-24 px-6 max-w-4xl mx-auto">
        <div className="mb-8">
          <div className="text-gold-500 text-sm font-semibold tracking-widest uppercase mb-2">Mentee Dashboard</div>
          <h1 className="font-display text-4xl text-sky-900">Hello, {user?.name.split(' ')[0]} 🎓</h1>
          <p className="text-sky-500 mt-2">{user?.university}</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl border border-sky-100 p-6 shadow-sm">
            <h2 className="font-display text-xl text-sky-800 mb-4">Your Mentor</h2>
            <MentorCard />
          </div>
          <div className="bg-gradient-to-br from-sky-600 to-sky-700 rounded-2xl p-6 text-white shadow-sm">
            <h2 className="font-display text-xl mb-4">Quick Links</h2>
            <div className="space-y-2">
              <Link to="/requirements" className="block bg-white/20 hover:bg-white/30 transition-colors rounded-xl py-2.5 px-4 text-sm font-semibold">
                📦 Shop Requirements →
              </Link>
              <Link to="/beauty" className="block bg-white/20 hover:bg-white/30 transition-colors rounded-xl py-2.5 px-4 text-sm font-semibold">
                💄 Beauty Shop →
              </Link>
              <Link to="/news" className="block bg-white/20 hover:bg-white/30 transition-colors rounded-xl py-2.5 px-4 text-sm font-semibold">
                📰 Latest News →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function MentorCard() {
  // Fetch assigned mentor in a real app
  return (
    <div className="flex items-center gap-4">
      <div className="w-14 h-14 rounded-full bg-gradient-to-br from-gold-400 to-sky-400 flex items-center justify-center text-white font-bold text-xl">M</div>
      <div>
        <div className="font-semibold text-sky-800">Your mentor will be displayed here</div>
        <div className="text-sky-400 text-sm">Assigned by admin</div>
      </div>
    </div>
  )
}