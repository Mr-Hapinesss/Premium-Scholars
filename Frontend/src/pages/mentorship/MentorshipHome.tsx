import { useNavigate } from 'react-router-dom'
import Navbar from '../../components/shared/Navbar'
import Footer from '../../components/shared/Footer'

export default function MentorshipHome() {
  const navigate = useNavigate()
  return (
    <div className="min-h-screen bg-sky-50 font-body">
      <Navbar />
      <div className="pt-24 px-6 max-w-4xl mx-auto text-center">
        <div className="text-sky-500 font-semibold tracking-widest uppercase text-sm mb-4">Mentorship Program</div>
        <h1 className="font-display text-6xl text-sky-900 mb-6">Don't Walk<br /><span className="text-gold-500">Alone</span></h1>
        <p className="text-sky-600 text-xl max-w-2xl mx-auto mb-12 leading-relaxed">
          Every first-year student is matched with a verified senior who's been through it. Sign in to access your personalized dashboard.
        </p>
        <div className="flex gap-4 justify-center flex-wrap">
          <button onClick={() => navigate('/mentorship/login')}
            className="px-8 py-4 bg-sky-600 text-white rounded-2xl font-semibold hover:bg-sky-700 transition-all hover:scale-105 shadow-lg">
            Sign In
          </button>
          <button onClick={() => navigate('/mentorship/register')}
            className="px-8 py-4 bg-gold-400 text-sky-900 rounded-2xl font-semibold hover:bg-gold-500 transition-all hover:scale-105">
            Create Account
          </button>
        </div>

        {/* How it works */}
        <div className="mt-24 grid md:grid-cols-3 gap-8 text-left">
          {[
            { step: '01', title: 'Register', desc: 'Create your account as a mentee. Mentors need a verification code.' },
            { step: '02', title: 'Get Matched', desc: 'Our admin matches you with a mentor who fits your faculty and university.' },
            { step: '03', title: 'Thrive', desc: 'Access your personalized dashboard, connect, and navigate campus life with confidence.' },
          ].map(s => (
            <div key={s.step} className="bg-white rounded-2xl p-6 border border-sky-100">
              <div className="text-5xl font-display font-bold text-sky-100 mb-3">{s.step}</div>
              <h3 className="text-sky-800 font-bold text-lg mb-2">{s.title}</h3>
              <p className="text-sky-500 text-sm">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
      <div className="mt-24"><Footer /></div>
    </div>
  )
}