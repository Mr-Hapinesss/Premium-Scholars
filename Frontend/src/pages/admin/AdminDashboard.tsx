import { useState, useEffect, useCallback } from 'react'
import Navbar from '../../components/shared/Navbar'
import LoadingSpinner from '../../components/shared/LoadingSpinner'
import AdminProductForm from '../../components/admin/AdminProductForm'
import AdminUserList from '../../components/admin/AdminUserList'
import AdminMentorList from '../../components/admin/AdminMentorList'
import { adminService } from '../../services/admin.service'
import { newsService } from '../../services/news.service'
import { beautyService } from '../../services/beauty.service'
import { requirementsService } from '../../services/requirements.service'
import { useToast } from '../../components/shared/Toast'
import { api } from '../../services/api'

type Tab = 'overview' | 'beauty' | 'requirements' | 'mentors' | 'users' | 'news' | 'codes'

const TABS: { key: Tab; label: string; emoji: string }[] = [
  { key: 'overview',      label: 'Overview',         emoji: '📊' },
  { key: 'beauty',        label: 'Beauty Products',  emoji: '💄' },
  { key: 'requirements',  label: 'Requirements',     emoji: '📦' },
  { key: 'news',          label: 'News',             emoji: '📰' },
  { key: 'mentors',       label: 'Mentors',          emoji: '🎓' },
  { key: 'users',         label: 'Users',            emoji: '👥' },
  { key: 'codes',         label: 'Mentor Codes',     emoji: '🔑' },
]

export default function AdminDashboard() {
  const [tab,         setTab]         = useState<Tab>('overview')
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="min-h-screen bg-sky-50 font-body">
      <Navbar />

      <div className="pt-16 flex">
        {/* ── Mobile sidebar toggle ── */}
        <button
          onClick={() => setSidebarOpen(prev => !prev)}
          className="md:hidden fixed bottom-4 right-4 z-50 w-12 h-12 bg-sky-600 text-white rounded-full shadow-xl flex items-center justify-center text-lg"
          aria-label="Toggle sidebar"
        >
          ☰
        </button>

        {/* ── Sidebar ── */}
        <aside className={[
          'fixed left-0 top-16 bottom-0 w-56 bg-white border-r border-sky-100 z-30 transition-transform duration-300 overflow-y-auto',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0',
        ].join(' ')}>
          <div className="px-4 pt-6 pb-4">
            <p className="text-[10px] font-bold text-sky-400 uppercase tracking-widest mb-3 px-2">
              Admin Panel
            </p>
            <nav className="space-y-1">
              {TABS.map(t => (
                <button
                  key={t.key}
                  onClick={() => { setTab(t.key); setSidebarOpen(false) }}
                  className={[
                    'w-full text-left px-3 py-2.5 rounded-xl text-sm font-medium flex items-center gap-2.5 transition-colors',
                    tab === t.key
                      ? 'bg-sky-100 text-sky-700 font-semibold'
                      : 'text-sky-500 hover:bg-sky-50 hover:text-sky-700',
                  ].join(' ')}
                >
                  <span className="text-base">{t.emoji}</span>
                  {t.label}
                </button>
              ))}
            </nav>
          </div>
        </aside>

        {/* Backdrop on mobile */}
        {sidebarOpen && (
          <div
            className="md:hidden fixed inset-0 bg-sky-900/20 z-20"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* ── Main content ── */}
        <main className="w-full md:ml-56 min-h-screen px-4 sm:px-8 py-8">
          {tab === 'overview'     && <OverviewTab />}
          {tab === 'beauty'       && <ProductTab section="beauty" />}
          {tab === 'requirements' && <ProductTab section="requirements" />}
          {tab === 'news'         && <NewsTab />}
          {tab === 'mentors'      && <MentorsTab />}
          {tab === 'users'        && <UsersTab />}
          {tab === 'codes'        && <CodesTab />}
        </main>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// SUB-PANELS
// ─────────────────────────────────────────────────────────────────────────────

function OverviewTab() {
  const [summary, setSummary] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    adminService.getDashboard().then(setSummary).finally(() => setLoading(false))
  }, [])

  if (loading) return <LoadingSpinner />

  const cards = [
    { label: 'Total Users',    value: summary?.totalUsers    ?? 0, color: 'bg-sky-100  text-sky-800',  emoji: '👥' },
    { label: 'Total Mentors',  value: summary?.totalMentors  ?? 0, color: 'bg-gold-100 text-gold-800', emoji: '🎓' },
    { label: 'Total Mentees',  value: summary?.totalMentees  ?? 0, color: 'bg-sky-100  text-sky-800',  emoji: '🎒' },
    { label: 'Total Orders',   value: summary?.totalOrders   ?? 0, color: 'bg-emerald-100 text-emerald-800', emoji: '📦' },
    { label: 'Pending Orders', value: summary?.pendingOrders ?? 0, color: 'bg-orange-100 text-orange-800', emoji: '⏳' },
  ]

  return (
    <div>
      <h2 className="font-display text-3xl text-sky-900 mb-2">Overview</h2>
      <p className="text-sky-500 text-sm mb-8">Welcome to the Premium Scholars admin panel.</p>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {cards.map(c => (
          <div key={c.label} className={`${c.color} rounded-2xl p-6 border border-white/50`}>
            <div className="text-3xl mb-2">{c.emoji}</div>
            <div className="font-display text-4xl font-bold mb-1">{c.value}</div>
            <div className="text-sm font-medium opacity-70">{c.label}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

// ── Products (beauty / requirements) ─────────────────────────────────────────

function ProductTab({ section }: { section: 'beauty' | 'requirements' }) {
  const [products, setProducts] = useState<any[]>([])
  const [loading,  setLoading]  = useState(true)
  const [editItem, setEditItem] = useState<any | null>(null)
  const { toast } = useToast()

  const load = useCallback(() => {
    setLoading(true)
    const svc = section === 'beauty' ? beautyService : requirementsService
    svc.getAll({})
      .then((data: any) => setProducts(data.products ?? data.items ?? []))
      .catch(() => toast('Failed to load products', 'error'))
      .finally(() => setLoading(false))
  }, [section, toast])

  useEffect(() => { load() }, [load])

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Delete "${name}"? This cannot be undone.`)) return
    try {
      const svc = section === 'beauty' ? beautyService : requirementsService
      await svc.delete(id)
      setProducts(prev => prev.filter(p => p._id !== id))
      toast(`${name} deleted`, 'success')
    } catch {
      toast('Failed to delete product', 'error')
    }
  }

  const sectionLabel = section === 'beauty' ? 'Beauty Products' : 'Requirement Items'

  return (
    <div>
      <h2 className="font-display text-3xl text-sky-900 mb-6">{sectionLabel}</h2>

      {editItem ? (
        <AdminProductForm
          section={section}
          existing={editItem}
          onAdded={() => {}}
          onUpdated={updated => {
            setProducts(prev => prev.map(p => p._id === updated._id ? updated : p))
            setEditItem(null)
            toast('Product updated', 'success')
          }}
          onCancel={() => setEditItem(null)}
        />
      ) : (
        <AdminProductForm
          section={section}
          onAdded={product => {
            setProducts(prev => [product, ...prev])
            toast('Product created', 'success')
          }}
        />
      )}

      {loading ? (
        <LoadingSpinner />
      ) : products.length === 0 ? (
        <div className="text-center py-12 text-sky-300 text-sm">No products yet.</div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
          {products.map(p => {
            const img = section === 'beauty' ? p.images?.[0] : p.image
            return (
              <div key={p._id} className="bg-white rounded-2xl border border-sky-100 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                {img && (
                  <div className="aspect-video bg-sky-50 overflow-hidden">
                    <img src={img} alt={p.name} className="w-full h-full object-cover" />
                  </div>
                )}
                <div className="p-4">
                  <div className="font-semibold text-sky-800 text-sm mb-0.5 truncate">{p.name}</div>
                  <div className="text-sky-500 text-xs mb-1">{p.category}</div>
                  <div className="text-sky-900 font-bold text-sm mb-3">
                    KES {p.price?.toLocaleString()}
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setEditItem(p)}
                      className="flex-1 py-1.5 bg-sky-50 hover:bg-sky-100 text-sky-600 rounded-lg text-xs font-semibold transition-colors"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(p._id, p.name)}
                      className="flex-1 py-1.5 bg-red-50 hover:bg-red-100 text-red-500 rounded-lg text-xs font-semibold transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

// ── News ──────────────────────────────────────────────────────────────────────

function NewsTab() {
  const [posts,   setPosts]   = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [form,    setForm]    = useState({ title: '', body: '' })
  const [file,    setFile]    = useState<File | null>(null)
  const [saving,  setSaving]  = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    newsService.getAll().then(data => setPosts(data.posts)).finally(() => setLoading(false))
  }, [])

  const handlePublish = async () => {
    if (!form.title.trim() || !form.body.trim()) {
      toast('Title and body are required', 'error')
      return
    }
    setSaving(true)
    try {
      const data = new FormData()
      data.append('title', form.title.trim())
      data.append('body',  form.body.trim())
      if (file) data.append('image', file)
      const post = await newsService.create(data)
      setPosts(prev => [post, ...prev])
      setForm({ title: '', body: '' })
      setFile(null)
      toast('Post published ✓', 'success')
    } catch (err: any) {
      toast(err.response?.data?.message ?? 'Failed to publish', 'error')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Delete "${title}"?`)) return
    try {
      await newsService.delete(id)
      setPosts(prev => prev.filter(p => p._id !== id))
      toast('Post deleted', 'success')
    } catch {
      toast('Failed to delete post', 'error')
    }
  }

  return (
    <div>
      <h2 className="font-display text-3xl text-sky-900 mb-6">News Posts</h2>

      {/* Create form */}
      <div className="bg-white rounded-2xl border border-sky-100 p-6 mb-6 shadow-sm">
        <h3 className="font-semibold text-sky-700 mb-4">Publish New Post</h3>
        <div className="space-y-3">
          <input
            value={form.title}
            onChange={e => setForm(p => ({ ...p, title: e.target.value }))}
            placeholder="Post title..."
            className="w-full px-4 py-2.5 rounded-xl border border-sky-200 text-sm focus:outline-none focus:border-sky-400 transition-colors"
          />
          <textarea
            value={form.body}
            onChange={e => setForm(p => ({ ...p, body: e.target.value }))}
            placeholder="Post content..."
            rows={5}
            className="w-full px-4 py-2.5 rounded-xl border border-sky-200 text-sm focus:outline-none focus:border-sky-400 resize-none transition-colors"
          />
          <div className="flex items-center gap-4">
            <label className="cursor-pointer">
              <span className="text-xs text-sky-500 font-medium">
                {file ? `📎 ${file.name}` : '+ Attach image (optional)'}
              </span>
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp"
                className="hidden"
                onChange={e => setFile(e.target.files?.[0] ?? null)}
              />
            </label>
            {file && (
              <button onClick={() => setFile(null)} className="text-xs text-red-400 hover:text-red-600">
                Remove
              </button>
            )}
          </div>
          <button
            onClick={handlePublish}
            disabled={saving}
            className="px-6 py-2.5 bg-sky-600 text-white rounded-xl text-sm font-semibold hover:bg-sky-700 transition-colors disabled:opacity-50 flex items-center gap-2"
          >
            {saving && <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
            {saving ? 'Publishing...' : 'Publish Post'}
          </button>
        </div>
      </div>

      {/* Posts list */}
      {loading ? (
        <LoadingSpinner />
      ) : posts.length === 0 ? (
        <div className="text-center py-12 text-sky-300 text-sm">No posts yet.</div>
      ) : (
        <div className="space-y-3">
          {posts.map(p => (
            <div key={p._id} className="bg-white rounded-2xl border border-sky-100 p-4 flex gap-4 items-start shadow-sm">
              {p.imageUrl && (
                <div className="w-16 h-16 rounded-xl overflow-hidden bg-sky-100 flex-shrink-0">
                  <img
                    src={`${(import.meta.env.VITE_API_URL ?? '').replace('/api', '')}${p.imageUrl}`}
                    alt={p.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-sky-800 truncate">{p.title}</div>
                <div className="text-sky-500 text-xs mt-0.5 line-clamp-2">{p.body}</div>
                <div className="text-sky-400 text-xs mt-1">
                  {new Date(p.createdAt).toLocaleDateString('en-KE', { day: 'numeric', month: 'short', year: 'numeric' })}
                </div>
              </div>
              <button
                onClick={() => handleDelete(p._id, p.title)}
                className="text-xs text-red-400 hover:text-red-600 font-medium flex-shrink-0 transition-colors"
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// ── Mentors ───────────────────────────────────────────────────────────────────

function MentorsTab() {
  const [mentors,  setMentors]  = useState<any[]>([])
  const [loading,  setLoading]  = useState(true)

  useEffect(() => {
    adminService.getAllMentors().then(setMentors).finally(() => setLoading(false))
  }, [])

  return (
    <div>
      <h2 className="font-display text-3xl text-sky-900 mb-6">All Mentors</h2>
      {loading ? <LoadingSpinner /> : <AdminMentorList mentors={mentors} />}
    </div>
  )
}

// ── Users ─────────────────────────────────────────────────────────────────────

function UsersTab() {
  const [users,   setUsers]   = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [role,    setRole]    = useState('')
  const [search,  setSearch]  = useState('')

  const load = useCallback(() => {
    setLoading(true)
    const params: any = {}
    if (role)   params.role   = role
    if (search) params.search = search
    adminService.getAllUsers(params).then((data: any) => setUsers(data.users ?? data)).finally(() => setLoading(false))
  }, [role, search])

  useEffect(() => { load() }, [load])

  return (
    <div>
      <h2 className="font-display text-3xl text-sky-900 mb-6">All Users</h2>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-5">
        <select
          value={role}
          onChange={e => setRole(e.target.value)}
          className="px-4 py-2 rounded-xl border border-sky-200 text-sm bg-white focus:outline-none focus:border-sky-400 text-sky-700"
        >
          <option value="">All Roles</option>
          <option value="admin">Admin</option>
          <option value="mentor">Mentor</option>
          <option value="mentee">Mentee</option>
        </select>
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search by name or email..."
          className="px-4 py-2 rounded-xl border border-sky-200 text-sm focus:outline-none focus:border-sky-400 bg-sky-50 text-sky-800 flex-1 min-w-48"
        />
        <button
          onClick={load}
          className="px-5 py-2 bg-sky-600 text-white rounded-xl text-sm font-semibold hover:bg-sky-700 transition-colors"
        >
          Search
        </button>
      </div>

      {loading ? (
        <LoadingSpinner />
      ) : (
        <AdminUserList
          users={users}
          onDeleted={id => setUsers(prev => prev.filter(u => u._id !== id))}
        />
      )}
    </div>
  )
}

// ── Mentor Codes ──────────────────────────────────────────────────────────────

function CodesTab() {
  const [codes,      setCodes]      = useState<any[]>([])
  const [loading,    setLoading]    = useState(true)
  const [generating, setGenerating] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    adminService.getMentorCodes().then(setCodes).finally(() => setLoading(false))
  }, [])

  const handleGenerate = async () => {
    setGenerating(true)
    try {
      const code = await adminService.generateCode()
      setCodes(prev => [code, ...prev])
      toast(`Code generated: ${code.code}`, 'success')
    } catch {
      toast('Failed to generate code', 'error')
    } finally {
      setGenerating(false)
    }
  }

  const handleRevoke = async (id: string, code: string) => {
    if (!confirm(`Revoke code ${code}?`)) return
    try {
      await adminService.revokeCode(id)
      setCodes(prev => prev.filter(c => c._id !== id))
      toast('Code revoked', 'success')
    } catch {
      toast('Failed to revoke code', 'error')
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-display text-3xl text-sky-900">Mentor Codes</h2>
        <button
          onClick={handleGenerate}
          disabled={generating}
          className="px-5 py-2.5 bg-gold-400 text-sky-900 rounded-xl text-sm font-bold hover:bg-gold-500 transition-colors disabled:opacity-50 flex items-center gap-2"
        >
          {generating && <span className="w-3.5 h-3.5 border-2 border-sky-700/30 border-t-sky-800 rounded-full animate-spin" />}
          {generating ? 'Generating...' : '+ Generate Code'}
        </button>
      </div>

      <p className="text-sky-500 text-sm mb-5">
        Generate single-use codes and share them manually with prospective mentors.
      </p>

      {loading ? (
        <LoadingSpinner />
      ) : codes.length === 0 ? (
        <div className="text-center py-12 text-sky-300 text-sm">No codes generated yet.</div>
      ) : (
        <div className="space-y-3">
          {codes.map(c => (
            <div key={c._id} className="bg-white rounded-2xl border border-sky-100 px-5 py-4 flex items-center gap-4 shadow-sm">
              <code className="font-mono text-sky-800 font-bold tracking-wider text-base bg-sky-50 px-3 py-1.5 rounded-lg flex-shrink-0">
                {c.code}
              </code>
              <div className="flex-1 min-w-0">
                {c.isUsed ? (
                  <div className="text-xs text-emerald-600 font-medium">
                    Used by {c.usedBy?.name ?? c.usedBy ?? 'Unknown'}
                  </div>
                ) : (
                  <div className="text-xs text-sky-400">Available — not yet used</div>
                )}
                <div className="text-sky-300 text-xs mt-0.5">
                  Created {new Date(c.createdAt).toLocaleDateString('en-KE')}
                </div>
              </div>
              <span className={[
                'text-xs px-2.5 py-1 rounded-full font-semibold flex-shrink-0',
                c.isUsed
                  ? 'bg-emerald-100 text-emerald-600'
                  : 'bg-sky-100 text-sky-600',
              ].join(' ')}>
                {c.isUsed ? 'Used' : 'Available'}
              </span>
              {!c.isUsed && (
                <button
                  onClick={() => handleRevoke(c._id, c.code)}
                  className="text-xs text-red-400 hover:text-red-600 font-medium flex-shrink-0 transition-colors"
                >
                  Revoke
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}