import { useState, useEffect } from 'react'
import Navbar from '../../components/shared/Navbar'
import { adminService } from '../../services/admin.service'

type Tab = 'overview' | 'beauty' | 'requirements' | 'mentors' | 'users' | 'news'

export default function AdminDashboard() {
  const [tab, setTab] = useState<Tab>('overview')
  const [mentors, setMentors] = useState<any[]>([])
  const [users, setUsers] = useState<any[]>([])
  const [menteeSearch, setMenteeSearch] = useState('')
  const [menteeResult, setMenteeResult] = useState<any>(null)

  useEffect(() => {
    if (tab === 'mentors') adminService.getAllMentors().then(setMentors)
    if (tab === 'users') adminService.getAllUsers().then(setUsers)
  }, [tab])

  const searchMentee = async () => {
    if (!menteeSearch.trim()) return
    const result = await adminService.getMenteeById(menteeSearch.trim())
    setMenteeResult(result)
  }

  const tabs: { key: Tab; label: string; emoji: string }[] = [
    { key: 'overview', label: 'Overview', emoji: '📊' },
    { key: 'beauty', label: 'Beauty Posts', emoji: '💄' },
    { key: 'requirements', label: 'Requirements', emoji: '📦' },
    { key: 'news', label: 'News', emoji: '📰' },
    { key: 'mentors', label: 'Mentors', emoji: '🎓' },
    { key: 'users', label: 'Users', emoji: '👥' },
  ]

  return (
    <div className="min-h-screen bg-sky-50 font-body">
      <Navbar />
      <div className="pt-16 flex">
        {/* Sidebar */}
        <aside className="w-56 min-h-screen bg-white border-r border-sky-100 pt-8 px-4 fixed left-0 top-16">
          <div className="text-xs text-sky-400 font-semibold uppercase tracking-widest mb-4 px-2">Admin Panel</div>
          <nav className="space-y-1">
            {tabs.map(t => (
              <button key={t.key} onClick={() => setTab(t.key)}
                className={`w-full text-left px-3 py-2.5 rounded-xl text-sm font-medium flex items-center gap-2 transition-colors
                  ${tab === t.key ? 'bg-sky-100 text-sky-700' : 'text-sky-500 hover:bg-sky-50'}`}>
                <span>{t.emoji}</span> {t.label}
              </button>
            ))}
          </nav>
        </aside>

        {/* Main content */}
        <main className="ml-56 flex-1 p-8">

          {/* ── MENTORS TAB ── */}
          {tab === 'mentors' && (
            <div>
              <h2 className="font-display text-3xl text-sky-900 mb-6">All Mentors</h2>
              {/* Mentee search by ID */}
              <div className="bg-white rounded-2xl border border-sky-100 p-5 mb-6">
                <h3 className="font-semibold text-sky-700 mb-3">Search Mentee by ID</h3>
                <div className="flex gap-3">
                  <input value={menteeSearch} onChange={e => setMenteeSearch(e.target.value)}
                    placeholder="Enter mentee ID..."
                    className="flex-1 px-4 py-2 rounded-xl border border-sky-200 text-sm focus:outline-none focus:border-sky-400" />
                  <button onClick={searchMentee}
                    className="px-5 py-2 bg-sky-600 text-white rounded-xl text-sm font-semibold hover:bg-sky-700">
                    Search
                  </button>
                </div>
                {menteeResult && (
                  <div className="mt-4 p-4 bg-sky-50 rounded-xl text-sm text-sky-700">
                    <div><strong>Name:</strong> {menteeResult.name}</div>
                    <div><strong>Email:</strong> {menteeResult.email}</div>
                    <div><strong>University:</strong> {menteeResult.university}</div>
                    <div><strong>Mentor:</strong> {menteeResult.mentorName || 'Unassigned'}</div>
                  </div>
                )}
              </div>

              <div className="space-y-4">
                {mentors.map(m => (
                  <div key={m._id} className="bg-white rounded-2xl border border-sky-100 p-5 flex items-center gap-4">
                    <div className="w-11 h-11 rounded-full bg-gradient-to-br from-sky-400 to-gold-400 flex items-center justify-center text-white font-bold">
                      {m.name[0]}
                    </div>
                    <div className="flex-1">
                      <div className="font-semibold text-sky-800">{m.name}</div>
                      <div className="text-sky-500 text-sm">{m.email} — {m.university}</div>
                    </div>
                    <div className="text-sky-400 text-sm">{m.menteeCount} mentee{m.menteeCount !== 1 ? 's' : ''}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── USERS TAB ── */}
          {tab === 'users' && (
            <div>
              <h2 className="font-display text-3xl text-sky-900 mb-6">All Users</h2>
              <div className="space-y-3">
                {users.map(u => (
                  <div key={u._id} className="bg-white rounded-2xl border border-sky-100 p-4 flex items-center gap-4">
                    <div className={`w-9 h-9 rounded-full flex items-center justify-center text-white font-bold text-sm
                      ${u.role === 'admin' ? 'bg-gold-400' : u.role === 'mentor' ? 'bg-sky-600' : 'bg-sky-300'}`}>
                      {u.name[0]}
                    </div>
                    <div className="flex-1">
                      <div className="font-semibold text-sky-800 text-sm">{u.name}</div>
                      <div className="text-sky-400 text-xs">{u.email}</div>
                    </div>
                    <span className={`text-xs px-2.5 py-1 rounded-full font-medium capitalize
                      ${u.role === 'admin' ? 'bg-gold-100 text-gold-600' : u.role === 'mentor' ? 'bg-sky-100 text-sky-600' : 'bg-gray-100 text-gray-500'}`}>
                      {u.role}
                    </span>
                    <button onClick={() => adminService.deleteUser(u._id).then(() => setUsers(prev => prev.filter(x => x._id !== u._id)))}
                      className="text-xs text-rose hover:underline">Delete</button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── BEAUTY TAB ── (form to add/edit beauty products) */}
          {tab === 'beauty' && <AdminProductPanel section="beauty" />}
          {tab === 'requirements' && <AdminProductPanel section="requirements" />}
          {tab === 'news' && <AdminNewsPanel />}
          {tab === 'overview' && <AdminOverview />}
        </main>
      </div>
    </div>
  )
}

// Placeholder sub-components (implement with full CRUD forms)
function AdminProductPanel({ section }: { section: string }) {
  const [products, setProducts] = useState<any[]>([])
  const service = section === 'beauty' ? beautyService : requirementsService

  useEffect(() => { service.getAll({}).then(setProducts) }, [])

  return (
    <div>
      <h2 className="font-display text-3xl text-sky-900 mb-6 capitalize">{section} Products</h2>
      {/* Add product form */}
      <AddProductForm section={section} onAdded={p => setProducts(prev => [p, ...prev])} />
      <div className="mt-8 grid md:grid-cols-2 gap-4">
        {products.map(p => (
          <div key={p._id} className="bg-white rounded-2xl border border-sky-100 p-4 flex gap-3 items-start">
            {p.images?.[0] && <img src={p.images[0]} alt={p.name} className="w-16 h-16 object-cover rounded-xl" />}
            <div className="flex-1">
              <div className="font-semibold text-sky-800 text-sm">{p.name}</div>
              <div className="text-sky-500 text-xs">KES {p.price?.toLocaleString()}</div>
            </div>
            <div className="flex gap-2">
              <button className="text-xs text-sky-500 hover:text-sky-700">Edit</button>
              <button onClick={() => service.delete(p._id).then(() => setProducts(prev => prev.filter(x => x._id !== p._id)))}
                className="text-xs text-rose hover:underline">Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function AdminNewsPanel() {
  const [posts, setPosts] = useState<any[]>([])
  const [form, setForm] = useState({ title: '', body: '' })
  const [file, setFile] = useState<File | null>(null)

  useEffect(() => { newsService.getAll().then(setPosts) }, [])

  const submit = async () => {
    const data = new FormData()
    data.append('title', form.title)
    data.append('body', form.body)
    if (file) data.append('image', file)
    const post = await newsService.create(data)
    setPosts(prev => [post, ...prev])
    setForm({ title: '', body: '' })
    setFile(null)
  }

  return (
    <div>
      <h2 className="font-display text-3xl text-sky-900 mb-6">News Posts</h2>
      <div className="bg-white rounded-2xl border border-sky-100 p-6 mb-6">
        <h3 className="font-semibold text-sky-700 mb-4">New Post</h3>
        <div className="space-y-3">
          <input value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))}
            placeholder="Post title..." className="w-full px-4 py-2 rounded-xl border border-sky-200 text-sm focus:outline-none focus:border-sky-400" />
          <textarea value={form.body} onChange={e => setForm(p => ({ ...p, body: e.target.value }))}
            placeholder="Post content..." rows={4}
            className="w-full px-4 py-2 rounded-xl border border-sky-200 text-sm focus:outline-none focus:border-sky-400 resize-none" />
          <input type="file" accept="image/*" onChange={e => setFile(e.target.files?.[0] || null)}
            className="text-sm text-sky-500" />
          <button onClick={submit}
            className="px-6 py-2.5 bg-sky-600 text-white rounded-xl text-sm font-semibold hover:bg-sky-700">
            Publish Post
          </button>
        </div>
      </div>
      <div className="space-y-3">
        {posts.map(p => (
          <div key={p._id} className="bg-white rounded-2xl border border-sky-100 p-4 flex items-start gap-4">
            <div className="flex-1">
              <div className="font-semibold text-sky-800">{p.title}</div>
              <div className="text-sky-400 text-xs">{new Date(p.createdAt).toLocaleDateString()}</div>
            </div>
            <button onClick={() => newsService.delete(p._id).then(() => setPosts(prev => prev.filter(x => x._id !== p._id)))}
              className="text-xs text-rose hover:underline">Delete</button>
          </div>
        ))}
      </div>
    </div>
  )
}

function AdminOverview() {
  return (
    <div>
      <h2 className="font-display text-3xl text-sky-900 mb-2">Admin Overview</h2>
      <p className="text-sky-500 mb-8">Welcome to the Premium Scholars admin panel. Use the sidebar to manage sections.</p>
      <div className="grid md:grid-cols-3 gap-4">
        {[
          { label: 'Total Users', icon: '👥', color: 'bg-sky-50' },
          { label: 'Total Mentors', icon: '🎓', color: 'bg-gold-50' },
          { label: 'Orders', icon: '📦', color: 'bg-blush' },
        ].map(s => (
          <div key={s.label} className={`${s.color} rounded-2xl p-6 border border-sky-100`}>
            <div className="text-3xl mb-2">{s.icon}</div>
            <div className="font-semibold text-sky-700">{s.label}</div>
          </div>
        ))}
      </div>
    </div>
  )
}