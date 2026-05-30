import { useEffect, useState } from 'react'
import Navbar from '../../components/shared/Navbar'
import { mentorshipService } from '../../services/mentorship.service'

interface Mentee { _id: string; name: string; email: string; university: string; createdAt: string }

export default function MentorMentees() {
  const [mentees, setMentees] = useState<Mentee[]>([])

  useEffect(() => {
    mentorshipService.getMyMentees().then(setMentees)
  }, [])

  return (
    <div className="min-h-screen bg-sky-50 font-body">
      <Navbar />
      <div className="pt-24 px-6 max-w-5xl mx-auto">
        <div className="mb-8">
          <div className="text-sky-500 text-sm font-semibold tracking-widest uppercase mb-2">My Mentees</div>
          <h1 className="font-display text-4xl text-sky-900">Your Assigned Mentees</h1>
        </div>
        <div className="grid gap-4">
          {mentees.map(m => (
            <div key={m._id} className="bg-white rounded-2xl border border-sky-100 p-6 flex items-center gap-4 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-sky-400 to-gold-400 flex items-center justify-center text-white font-bold text-lg">
                {m.name[0]}
              </div>
              <div className="flex-1">
                <div className="font-semibold text-sky-800">{m.name}</div>
                <div className="text-sky-500 text-sm">{m.email}</div>
                <div className="text-sky-400 text-xs mt-0.5">{m.university}</div>
              </div>
              <div className="text-sky-300 text-xs">Joined {new Date(m.createdAt).toLocaleDateString()}</div>
            </div>
          ))}
          {mentees.length === 0 && (
            <div className="text-center py-16 text-sky-300 font-display text-2xl">No mentees assigned yet.</div>
          )}
        </div>
      </div>
    </div>
  )
}