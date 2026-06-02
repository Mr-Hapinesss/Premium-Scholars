import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Navbar from '../../components/shared/Navbar'
import Footer from '../../components/shared/Footer'
import LoadingSpinner from '../../components/shared/LoadingSpinner'
import { useAuth } from '../../context/AuthContext'
import { mentorshipService } from '../../services/mentorship.service'
import { requirementsService } from '../../services/requirements.service'
import { AuthUser } from '../../context/AuthContext'
import { Order } from '../../types/product.types'
import ProfileEditor from '../../components/shared/ProfileEditor'

interface ChecklistItem {
  id: string
  label: string
  done: boolean
}

const DEFAULT_CHECKLIST: ChecklistItem[] = [
  { id: 'register',     label: 'Complete unit registration',         done: false },
  { id: 'requirements', label: 'Order your first-year requirements', done: false },
  { id: 'mentor',       label: 'Introduce yourself to your mentor',  done: false },
  { id: 'beauty',       label: 'Explore the beauty shop',            done: false },
  { id: 'news',         label: 'Read the latest campus news',        done: false },
]

export default function MenteeHome() {
  const { user } = useAuth()

  const [mentor,    setMentor]    = useState<AuthUser | null>(null)
  const [orders,    setOrders]    = useState<Order[]>([])
  const [checklist, setChecklist] = useState<ChecklistItem[]>(() => {
    try {
      const saved = localStorage.getItem(`ps_checklist_${user?._id}`)
      return saved ? JSON.parse(saved) : DEFAULT_CHECKLIST
    } catch {
      return DEFAULT_CHECKLIST
    }
  })
  const [loadingMentor, setLoadingMentor] = useState(true)
  const [loadingOrders, setLoadingOrders] = useState(true)
  const [profileOpen, setProfileOpen] = useState(false)

  useEffect(() => {
    mentorshipService
      .getMyMentor()
      .then(data => setMentor(data))
      .catch(() => setMentor(null))
      .finally(() => setLoadingMentor(false))

    requirementsService
      .getMyOrders()
      .then(data => setOrders(data.slice(0, 3)))
      .catch(() => setOrders([]))
      .finally(() => setLoadingOrders(false))
  }, [])

  const toggleCheck = (id: string) => {
    const updated = checklist.map(item =>
      item.id === id ? { ...item, done: !item.done } : item
    )
    setChecklist(updated)
    localStorage.setItem(`ps_checklist_${user?._id}`, JSON.stringify(updated))
  }

  const completedCount = checklist.filter(c => c.done).length
  const progressPct    = Math.round((completedCount / checklist.length) * 100)
  const firstName      = user?.name.split(' ')[0] ?? 'Scholar'

  const statusColor = (status: string) => {
    const map: Record<string, string> = {
      pending:   'bg-amber-100 text-amber-700',
      confirmed: 'bg-sky-100 text-sky-700',
      shipped:   'bg-violet-100 text-violet-700',
      delivered: 'bg-emerald-100 text-emerald-700',
      cancelled: 'bg-red-100 text-red-500',
    }
    return map[status] ?? 'bg-sky-100 text-sky-600'
  }

  return (
    <div className="min-h-screen bg-sky-50 font-body">
      <Navbar />

      <div className="pt-24 pb-16 px-4 sm:px-6 max-w-5xl mx-auto">

        {/* ── Welcome banner ── */}
        <div className="relative bg-gradient-to-br from-sky-600 via-sky-700 to-sky-800 rounded-3xl p-7 mb-8 overflow-hidden shadow-lg">
          <button
              onClick={() => setProfileOpen(true)}
              className="mt-4 flex items-center gap-2 px-4 py-2 bg-white/15 text-white rounded-xl text-sm font-semibold hover:bg-white/25 transition-colors border border-white/20 w-fit"
              >
              ✏ Edit Profile
            </button>
          {/* Background decorations */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/3" />
          <div className="absolute bottom-0 left-1/3 w-40 h-40 bg-gold-400/10 rounded-full translate-y-1/2" />

          <div className="relative z-10">
            <p className="text-sky-300 text-xs font-bold tracking-widest uppercase mb-2">
              Mentee Dashboard
            </p>
            <h1 className="font-display text-3xl sm:text-4xl text-white mb-1">
              Hello, {firstName} 🎓
            </h1>
            {user?.university && (
              <p className="text-sky-300 text-sm">{user.university}</p>
            )}
            <div className="flex flex-wrap gap-3 mt-5">
              <Link
                to="/requirements"
                className="px-5 py-2.5 bg-gold-400 text-sky-900 rounded-xl text-sm font-bold hover:bg-gold-500 transition-colors shadow-sm"
              >
                Shop Requirements →
              </Link>
              <Link
                to="/beauty"
                className="px-5 py-2.5 bg-white/15 text-white rounded-xl text-sm font-semibold hover:bg-white/25 transition-colors border border-white/20"
              >
                Beauty Shop →
              </Link>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6">

          {/* ── Left column (wide) ── */}
          <div className="md:col-span-2 space-y-6">

            {/* Assigned mentor card */}
            <div className="bg-white rounded-2xl border border-sky-100 p-6 shadow-sm">
              <h2 className="font-display text-xl text-sky-800 mb-4 flex items-center gap-2">
                <span className="w-7 h-7 bg-sky-100 rounded-lg flex items-center justify-center text-sm">🎓</span>
                Your Mentor
              </h2>

              {loadingMentor ? (
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-sky-100 animate-pulse" />
                  <div className="space-y-2 flex-1">
                    <div className="h-3 bg-sky-100 rounded animate-pulse w-1/2" />
                    <div className="h-3 bg-sky-100 rounded animate-pulse w-1/3" />
                  </div>
                </div>
              ) : mentor ? (
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-full bg-gradient-to-br from-gold-400 to-sky-500 flex items-center justify-center text-white font-display font-bold text-2xl flex-shrink-0 shadow-sm">
                    {mentor.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-bold text-sky-800 text-base">{mentor.name}</div>
                    <div className="text-sky-500 text-sm truncate">{mentor.email}</div>
                    {mentor.university && (
                      <div className="text-sky-400 text-xs mt-0.5 flex items-center gap-1">
                        <span>🏛</span>
                        {mentor.university}
                      </div>
                    )}
                  </div>
                  <div className="flex-shrink-0">
                    <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-600 text-xs font-semibold px-3 py-1.5 rounded-full">
                      <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full" />
                      Active
                    </span>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-4 p-4 bg-sky-50 rounded-2xl border border-sky-100 border-dashed">
                  <div className="w-12 h-12 rounded-full bg-sky-100 flex items-center justify-center text-2xl flex-shrink-0">
                    ⏳
                  </div>
                  <div>
                    <div className="font-semibold text-sky-700 text-sm">No mentor assigned yet</div>
                    <div className="text-sky-400 text-xs mt-0.5">
                      Our admin team will assign your mentor shortly after reviewing your profile.
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Recent orders */}
            <div className="bg-white rounded-2xl border border-sky-100 p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-display text-xl text-sky-800 flex items-center gap-2">
                  <span className="w-7 h-7 bg-gold-100 rounded-lg flex items-center justify-center text-sm">📦</span>
                  Recent Orders
                </h2>
                <Link to="/requirements" className="text-sky-500 text-xs font-semibold hover:text-sky-700 transition-colors">
                  Browse items →
                </Link>
              </div>

              {loadingOrders ? (
                <LoadingSpinner />
              ) : orders.length === 0 ? (
                <div className="text-center py-8">
                  <div className="text-4xl mb-3">🛒</div>
                  <p className="text-sky-400 text-sm">No orders yet.</p>
                  <Link
                    to="/requirements"
                    className="inline-block mt-3 px-5 py-2 bg-gold-400 text-sky-900 rounded-xl text-xs font-bold hover:bg-gold-500 transition-colors"
                  >
                    Shop Requirements
                  </Link>
                </div>
              ) : (
                <div className="space-y-3">
                  {orders.map(order => (
                    <div key={order._id} className="flex items-center gap-3 p-3 bg-sky-50 rounded-xl border border-sky-100">
                      <div className="w-9 h-9 rounded-lg bg-white border border-sky-100 flex items-center justify-center text-lg flex-shrink-0">
                        📦
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sky-800 text-sm font-medium">
                          {order.items.length} item{order.items.length !== 1 ? 's' : ''}
                        </div>
                        <div className="text-sky-400 text-xs">
                          KES {order.total.toLocaleString()} •{' '}
                          {new Date(order.createdAt).toLocaleDateString('en-KE', {
                            day: 'numeric', month: 'short',
                          })}
                        </div>
                      </div>
                      <span className={`text-xs px-2.5 py-1 rounded-full font-semibold capitalize flex-shrink-0 ${statusColor(order.status)}`}>
                        {order.status}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* First-year checklist */}
            <div className="bg-white rounded-2xl border border-sky-100 p-6 shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <h2 className="font-display text-xl text-sky-800 flex items-center gap-2">
                  <span className="w-7 h-7 bg-emerald-100 rounded-lg flex items-center justify-center text-sm">✅</span>
                  First Year Checklist
                </h2>
                <span className="text-xs text-sky-400 font-medium">
                  {completedCount}/{checklist.length} done
                </span>
              </div>

              {/* Progress bar */}
              <div className="w-full h-1.5 bg-sky-100 rounded-full mb-5 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-sky-400 to-gold-400 rounded-full transition-all duration-500"
                  style={{ width: `${progressPct}%` }}
                />
              </div>

              <ul className="space-y-2">
                {checklist.map(item => (
                  <li key={item.id}>
                    <button
                      onClick={() => toggleCheck(item.id)}
                      className={[
                        'w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all duration-200',
                        item.done
                          ? 'bg-emerald-50 border border-emerald-100'
                          : 'bg-sky-50 border border-sky-100 hover:border-sky-200',
                      ].join(' ')}
                    >
                      <div className={[
                        'w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all',
                        item.done
                          ? 'bg-emerald-400 border-emerald-400'
                          : 'border-sky-300',
                      ].join(' ')}>
                        {item.done && (
                          <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                      </div>
                      <span className={[
                        'text-sm font-medium transition-colors',
                        item.done ? 'line-through text-sky-400' : 'text-sky-700',
                      ].join(' ')}>
                        {item.label}
                      </span>
                    </button>
                  </li>
                ))}
              </ul>

              {completedCount === checklist.length && (
                <div className="mt-4 p-4 bg-gradient-to-r from-gold-50 to-sky-50 rounded-xl border border-gold-100 text-center">
                  <p className="font-display text-sky-800 text-lg">🎉 You're all set, {firstName}!</p>
                  <p className="text-sky-500 text-xs mt-1">Your first year is off to a great start.</p>
                </div>
              )}
            </div>
          </div>

          {/* ── Right column (narrow) ── */}
          <div className="space-y-5">

            {/* Profile card */}
            <div className="bg-white rounded-2xl border border-sky-100 p-5 shadow-sm text-center">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-sky-400 to-gold-400 flex items-center justify-center text-white font-display font-bold text-3xl mx-auto mb-3 shadow-sm">
                {user?.name.charAt(0).toUpperCase()}
              </div>
              <div className="font-bold text-sky-800">{user?.name}</div>
              <div className="text-sky-400 text-xs mt-0.5 truncate">{user?.email}</div>
              {user?.university && (
                <div className="mt-2 inline-block bg-sky-50 text-sky-600 text-xs px-3 py-1 rounded-full border border-sky-100">
                  {user.university}
                </div>
              )}
              <div className="mt-3 pt-3 border-t border-sky-50">
                <span className="text-xs bg-gold-100 text-gold-700 font-semibold px-3 py-1 rounded-full">
                  🎓 Mentee
                </span>
              </div>
            </div>

            {/* Quick links */}
            <div className="bg-white rounded-2xl border border-sky-100 p-5 shadow-sm">
              <h3 className="font-display text-base text-sky-800 mb-3">Quick Links</h3>
              <div className="space-y-2">
                {[
                  { path: '/requirements', emoji: '📦', label: 'Requirements Shop',  sub: 'Order your essentials' },
                  { path: '/beauty',       emoji: '💄', label: 'Beauty Shop',         sub: 'Curated products' },
                  { path: '/news',         emoji: '📰', label: 'Campus News',         sub: 'Latest updates' },
                  { path: '/mentorship',   emoji: '🤝', label: 'Mentorship',          sub: 'Your program' },
                ].map(link => (
                  <Link
                    key={link.path}
                    to={link.path}
                    className="flex items-center gap-3 p-3 rounded-xl hover:bg-sky-50 transition-colors group border border-transparent hover:border-sky-100"
                  >
                    <span className="text-xl">{link.emoji}</span>
                    <div className="flex-1 min-w-0">
                      <div className="text-sky-700 text-sm font-medium group-hover:text-sky-900 transition-colors">
                        {link.label}
                      </div>
                      <div className="text-sky-400 text-xs">{link.sub}</div>
                    </div>
                    <span className="text-sky-300 group-hover:translate-x-0.5 transition-transform text-xs">→</span>
                  </Link>
                ))}
              </div>
            </div>

            {/* Tips card */}
            <div className="bg-gradient-to-br from-gold-50 to-sky-50 rounded-2xl border border-gold-100 p-5 shadow-sm">
              <h3 className="font-display text-base text-sky-800 mb-3">Scholar Tips</h3>
              <ul className="space-y-2">
                {[
                  'Check your requirements list early — stock runs out.',
                  'Introduce yourself to your mentor as soon as they are assigned.',
                  'Visit the news board for scholarship announcements.',
                ].map((tip, i) => (
                  <li key={i} className="flex gap-2 text-xs text-sky-600 leading-relaxed">
                    <span className="text-gold-500 flex-shrink-0 font-bold mt-0.5">✦</span>
                    {tip}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
        <ProfileEditor open={profileOpen} onClose={() => setProfileOpen(false)} />
      </div>

      <Footer />
    </div>
  )
}