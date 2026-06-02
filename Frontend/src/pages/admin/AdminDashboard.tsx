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
import { adminAuthService } from '../../services/adminAuth.service'


type Tab = 'overview' | 'beauty' | 'requirements' | 'mentors' | 'users' | 'news' | 'codes' | 'invites' | 'assignments' | 'orders'


const TABS: { key: Tab; label: string; emoji: string }[] = [
  { key: 'overview',      label: 'Overview',         emoji: '📊' },
  { key: 'beauty',        label: 'Beauty Products',  emoji: '💄' },
  { key: 'requirements',  label: 'Requirements',     emoji: '📦' },
  { key: 'news',          label: 'News',             emoji: '📰' },
  { key: 'mentors',       label: 'Mentors',          emoji: '🎓' },
  { key: 'users',         label: 'Users',            emoji: '👥' },
  { key: 'codes',         label: 'Mentor Codes',     emoji: '🔑' },
  { key: 'invites',       label: 'Admin Invites',    emoji: '🔗' },
  { key: 'assignments',   label: 'Assign Mentees',   emoji: '🔗' },
  { key: 'orders',        label: 'Orders',           emoji: '🛒' },
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
          {tab === 'invites'      && <AdminInvitesTab />}
          {tab === 'assignments'  && <AssignmentTab />}
          {tab === 'orders'       && <OrdersTab />}
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

<div className="bg-sky-50 border border-sky-100 rounded-xl px-4 py-3 flex gap-3 items-start">
  <span className="text-sky-400 flex-shrink-0">📐</span>
  <div>
    <p className="text-sky-700 text-xs font-semibold">Image spec: 1.91:1 Banner — 1200 × 630 px</p>
    <p className="text-sky-400 text-xs mt-0.5">
      Standard news card ratio. Landscape images work best. Auto-resized on upload.
    </p>
  </div>
</div>

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

// ── Admin Invites ─────────────────────────────────────────────────────────────

function AdminInvitesTab() {
  const [invites,    setInvites]    = useState<any[]>([])
  const [loading,    setLoading]    = useState(true)
  const [email,      setEmail]      = useState('')
  const [hours,      setHours]      = useState('24')
  const [generating, setGenerating] = useState(false)
  const [generated,  setGenerated]  = useState<{ inviteUrl: string; token: string; expiresAt: string } | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    adminAuthService.listInvites()
      .then(setInvites)
      .catch(() => toast('Failed to load invites', 'error'))
      .finally(() => setLoading(false))
  }, [])

  const handleGenerate = async () => {
    setGenerating(true)
    setGenerated(null)
    try {
      const result = await adminAuthService.generateInvite(
        email.trim() || undefined,
        parseInt(hours) || 24
      )
      setGenerated(result)
      setInvites(prev => [result, ...prev])
      setEmail('')
      toast('Admin invite generated', 'success')
    } catch (err: any) {
      toast(err.response?.data?.message ?? 'Failed to generate invite', 'error')
    } finally {
      setGenerating(false)
    }
  }

  const handleRevoke = async (id: string) => {
    if (!confirm('Revoke this admin invite?')) return
    try {
      await adminAuthService.revokeInvite(id)
      setInvites(prev => prev.filter(i => i._id !== id))
      toast('Invite revoked', 'success')
    } catch {
      toast('Failed to revoke invite', 'error')
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => toast('Copied to clipboard', 'success'))
  }

  return (
    <div>
      <h2 className="font-display text-3xl text-sky-900 mb-2">Admin Invites</h2>
      <p className="text-sky-500 text-sm mb-6">
        Generate secure single-use invite links to onboard new admins. Each link expires after the set duration.
      </p>

      {/* Generate form */}
      <div className="bg-white rounded-2xl border border-sky-100 p-6 mb-6 shadow-sm">
        <h3 className="font-semibold text-sky-700 mb-4 text-sm">Generate New Invite</h3>
        <div className="grid sm:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sky-600 text-xs font-semibold mb-1.5 uppercase tracking-wide">
              Lock to Email (optional)
            </label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="Leave blank for open invite"
              className="w-full px-3 py-2.5 rounded-xl border border-sky-200 text-sm focus:outline-none focus:border-sky-400 bg-sky-50 text-sky-800 transition-all"
            />
          </div>
          <div>
            <label className="block text-sky-600 text-xs font-semibold mb-1.5 uppercase tracking-wide">
              Expires In
            </label>
            <select
              value={hours}
              onChange={e => setHours(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl border border-sky-200 text-sm bg-white focus:outline-none focus:border-sky-400 text-sky-700 transition-all"
            >
              <option value="6">6 hours</option>
              <option value="12">12 hours</option>
              <option value="24">24 hours</option>
              <option value="48">48 hours</option>
              <option value="72">72 hours</option>
            </select>
          </div>
        </div>
        <button
          onClick={handleGenerate}
          disabled={generating}
          className="px-6 py-2.5 bg-sky-600 text-white rounded-xl text-sm font-semibold hover:bg-sky-700 transition-colors disabled:opacity-50 flex items-center gap-2"
        >
          {generating && <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
          {generating ? 'Generating...' : '🔗 Generate Invite Link'}
        </button>

        {/* Generated link display */}
        {generated && (
          <div className="mt-4 p-4 bg-emerald-50 border border-emerald-200 rounded-xl">
            <p className="text-emerald-700 text-xs font-semibold mb-2">✓ Invite generated — share this link:</p>
            <div className="flex gap-2">
              <code className="flex-1 text-xs text-emerald-800 bg-white border border-emerald-200 px-3 py-2 rounded-lg overflow-x-auto whitespace-nowrap">
                {generated.inviteUrl}
              </code>
              <button
                onClick={() => copyToClipboard(generated.inviteUrl)}
                className="px-3 py-2 bg-emerald-600 text-white rounded-lg text-xs font-semibold hover:bg-emerald-700 transition-colors flex-shrink-0"
              >
                Copy
              </button>
            </div>
            <p className="text-emerald-500 text-xs mt-2">
              Expires: {new Date(generated.expiresAt).toLocaleString('en-KE')}
            </p>
          </div>
        )}
      </div>

      {/* Invites list */}
      {loading ? (
        <LoadingSpinner />
      ) : invites.length === 0 ? (
        <div className="text-center py-12 text-sky-300 text-sm">No invites generated yet.</div>
      ) : (
        <div className="space-y-3">
          {invites.map((inv: any) => {
            const expired = new Date() > new Date(inv.expiresAt)
            return (
              <div key={inv._id} className="bg-white rounded-2xl border border-sky-100 px-5 py-4 shadow-sm">
                <div className="flex items-start gap-4">
                  <div className={[
                    'w-10 h-10 rounded-xl flex items-center justify-center text-lg flex-shrink-0',
                    inv.isUsed   ? 'bg-emerald-100' :
                    expired      ? 'bg-red-100'     : 'bg-sky-100',
                  ].join(' ')}>
                    {inv.isUsed ? '✅' : expired ? '⏰' : '🔗'}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <code className="text-xs font-mono text-sky-700 bg-sky-50 px-2 py-0.5 rounded">
                        {inv.token?.slice(0, 16)}...
                      </code>
                      <span className={[
                        'text-xs px-2.5 py-0.5 rounded-full font-semibold',
                        inv.isUsed   ? 'bg-emerald-100 text-emerald-600' :
                        expired      ? 'bg-red-100 text-red-500'         : 'bg-sky-100 text-sky-600',
                      ].join(' ')}>
                        {inv.isUsed ? 'Used' : expired ? 'Expired' : 'Available'}
                      </span>
                    </div>

                    {inv.email && (
                      <p className="text-sky-500 text-xs">Locked to: {inv.email}</p>
                    )}
                    {inv.isUsed && inv.usedBy && (
                      <p className="text-emerald-600 text-xs">
                        Used by: {inv.usedBy.name} ({inv.usedBy.email})
                      </p>
                    )}
                    <p className="text-sky-400 text-xs mt-0.5">
                      Created by {inv.createdBy?.name} •{' '}
                      Expires {new Date(inv.expiresAt).toLocaleString('en-KE', {
                        day: 'numeric', month: 'short', year: 'numeric',
                        hour: '2-digit', minute: '2-digit',
                      })}
                    </p>
                  </div>

                  <div className="flex gap-2 flex-shrink-0">
                    {!inv.isUsed && !expired && (
                      <button
                        onClick={() => copyToClipboard(
                          `${import.meta.env.VITE_API_URL?.replace('/api', '') ?? 'http://localhost:5173'}/admin/register?token=${inv.token}`
                        )}
                        className="text-xs text-sky-500 hover:text-sky-700 font-medium transition-colors"
                      >
                        Copy link
                      </button>
                    )}
                    {!inv.isUsed && (
                      <button
                        onClick={() => handleRevoke(inv._id)}
                        className="text-xs text-red-400 hover:text-red-600 font-medium transition-colors"
                      >
                        Revoke
                      </button>
                    )}
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

// assignments/ unassignments Tab

function AssignmentTab() {
  const { toast } = useToast()

  // ── State ──
  const [mentees,          setMentees]          = useState<any[]>([])
  const [mentors,          setMentors]           = useState<any[]>([])
  const [assignments,      setAssignments]       = useState<any[]>([])
  const [loadingMentees,   setLoadingMentees]    = useState(true)
  const [loadingMentors,   setLoadingMentors]    = useState(true)
  const [loadingAssigned,  setLoadingAssigned]   = useState(true)
  const [selectedMentee,   setSelectedMentee]    = useState<any | null>(null)
  const [selectedMentor,   setSelectedMentor]    = useState<any | null>(null)
  const [assigning,        setAssigning]         = useState(false)
  const [menteeSearch,     setMenteeSearch]      = useState('')
  const [mentorSearch,     setMentorSearch]      = useState('')
  const [view,             setView]              = useState<'assign' | 'manage'>('assign')
  const [unassigning,      setUnassigning]       = useState<string | null>(null)

  // ── Fetch unassigned mentees ──
  const loadUnassigned = () => {
    setLoadingMentees(true)
    adminService
      .getUnassignedMentees({ search: menteeSearch, limit: 50 })
      .then((data: any) => setMentees(data.mentees ?? []))
      .catch(() => toast('Failed to load unassigned mentees', 'error'))
      .finally(() => setLoadingMentees(false))
  }

  // ── Fetch all mentors ──
  const loadMentors = () => {
    setLoadingMentors(true)
    adminService
      .getAllMentors()
      .then((data: any) => setMentors(Array.isArray(data) ? data : data.mentors ?? []))
      .catch(() => toast('Failed to load mentors', 'error'))
      .finally(() => setLoadingMentors(false))
  }

  // ── Fetch currently assigned mentees (for manage view) ──
  const loadAssigned = () => {
    setLoadingAssigned(true)
    adminService
      .getAllUsers({ role: 'mentee', limit: 100 })
      .then((data: any) => {
        const all = data.users ?? data ?? []
        // Only those with a mentorId set
        setAssignments(all.filter((u: any) => u.mentorId))
      })
      .catch(() => toast('Failed to load assignments', 'error'))
      .finally(() => setLoadingAssigned(false))
  }

  useEffect(() => {
    loadUnassigned()
    loadMentors()
    loadAssigned()
  }, [])

  // Re-run mentee search when search term changes
  useEffect(() => {
    const t = setTimeout(loadUnassigned, 400)
    return () => clearTimeout(t)
  }, [menteeSearch])

  // ── Filter mentors by search ──
  const filteredMentors = mentors.filter(m =>
    !mentorSearch.trim() ||
    m.name.toLowerCase().includes(mentorSearch.toLowerCase()) ||
    m.email.toLowerCase().includes(mentorSearch.toLowerCase()) ||
    (m.university ?? '').toLowerCase().includes(mentorSearch.toLowerCase())
  )

  // ── Perform assignment ──
  const handleAssign = async () => {
    if (!selectedMentee || !selectedMentor) return
    setAssigning(true)
    try {
      await adminService.assignMentee(selectedMentee._id, selectedMentor._id)

      toast(`${selectedMentee.name} assigned to ${selectedMentor.name} ✓`, 'success')

      // Remove from unassigned list
      setMentees(prev => prev.filter(m => m._id !== selectedMentee._id))

      // Update mentor mentee count
      setMentors(prev => prev.map(m =>
        m._id === selectedMentor._id
          ? { ...m, menteeCount: (m.menteeCount ?? 0) + 1 }
          : m
      ))

      // Add to assignments list
      setAssignments(prev => [...prev, {
        ...selectedMentee,
        mentorId:   selectedMentor._id,
        mentorName: selectedMentor.name,
      }])

      setSelectedMentee(null)
      setSelectedMentor(null)
    } catch (err: any) {
      toast(err.response?.data?.message ?? 'Assignment failed', 'error')
    } finally {
      setAssigning(false)
    }
  }

  // ── Unassign ──
  const handleUnassign = async (mentee: any) => {
    if (!confirm(`Remove ${mentee.name} from their mentor?`)) return
    setUnassigning(mentee._id)
    try {
      await adminService.assignMentee(mentee._id, null)
      toast(`${mentee.name} unassigned`, 'success')

      // Move back to unassigned
      setAssignments(prev => prev.filter(m => m._id !== mentee._id))
      setMentees(prev => [{ ...mentee, mentorId: null }, ...prev])

      // Decrement mentor count
      setMentors(prev => prev.map(m =>
        m._id === mentee.mentorId
          ? { ...m, menteeCount: Math.max(0, (m.menteeCount ?? 1) - 1) }
          : m
      ))
    } catch (err: any) {
      toast(err.response?.data?.message ?? 'Failed to unassign', 'error')
    } finally {
      setUnassigning(null)
    }
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <div>
          <h2 className="font-display text-3xl text-sky-900">Mentee Assignment</h2>
          <p className="text-sky-500 text-sm mt-1">
            {mentees.length} unassigned mentee{mentees.length !== 1 ? 's' : ''} •{' '}
            {assignments.length} active assignment{assignments.length !== 1 ? 's' : ''}
          </p>
        </div>
        <div className="flex bg-sky-100 rounded-xl p-1 gap-1">
          <button
            onClick={() => setView('assign')}
            className={[
              'px-4 py-2 rounded-lg text-sm font-semibold transition-all',
              view === 'assign'
                ? 'bg-white text-sky-700 shadow-sm'
                : 'text-sky-500 hover:text-sky-700',
            ].join(' ')}
          >
            🔗 Assign
          </button>
          <button
            onClick={() => setView('manage')}
            className={[
              'px-4 py-2 rounded-lg text-sm font-semibold transition-all',
              view === 'manage'
                ? 'bg-white text-sky-700 shadow-sm'
                : 'text-sky-500 hover:text-sky-700',
            ].join(' ')}
          >
            📋 Manage ({assignments.length})
          </button>
        </div>
      </div>

      {/* ── ASSIGN VIEW ── */}
      {view === 'assign' && (
        <div className="space-y-6">

          {/* Confirmation banner — shows when both are selected */}
          {selectedMentee && selectedMentor && (
            <div className="bg-gradient-to-r from-sky-600 to-sky-700 rounded-2xl p-5 flex flex-wrap items-center gap-4 shadow-lg">
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-white font-bold text-lg">
                    {selectedMentee.name.charAt(0)}
                  </div>
                </div>
                <div className="text-white min-w-0">
                  <div className="font-bold truncate">{selectedMentee.name}</div>
                  <div className="text-sky-200 text-xs truncate">{selectedMentee.email}</div>
                </div>
              </div>

              <div className="flex-shrink-0 text-white/60 text-xl font-light">→</div>

              <div className="flex items-center gap-3 flex-1 min-w-0">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 rounded-full bg-gold-400/30 border border-gold-400/50 flex items-center justify-center text-gold-200 font-bold text-lg">
                    {selectedMentor.name.charAt(0)}
                  </div>
                </div>
                <div className="text-white min-w-0">
                  <div className="font-bold truncate">{selectedMentor.name}</div>
                  <div className="text-sky-200 text-xs">
                    Currently {selectedMentor.menteeCount ?? 0} mentee{selectedMentor.menteeCount !== 1 ? 's' : ''}
                  </div>
                </div>
              </div>

              <div className="flex gap-2 flex-shrink-0">
                <button
                  onClick={() => { setSelectedMentee(null); setSelectedMentor(null) }}
                  disabled={assigning}
                  className="px-4 py-2 bg-white/15 text-white rounded-xl text-sm font-semibold hover:bg-white/25 transition-colors border border-white/20"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAssign}
                  disabled={assigning}
                  className="px-5 py-2 bg-gold-400 text-sky-900 rounded-xl text-sm font-bold hover:bg-gold-500 transition-colors disabled:opacity-60 flex items-center gap-2"
                >
                  {assigning && (
                    <span className="w-3.5 h-3.5 border-2 border-sky-900/30 border-t-sky-900 rounded-full animate-spin" />
                  )}
                  {assigning ? 'Assigning...' : 'Confirm Assignment'}
                </button>
              </div>
            </div>
          )}

          {/* Two column layout */}
          <div className="grid lg:grid-cols-2 gap-6">

            {/* ── Left: Unassigned mentees ── */}
            <div className="bg-white rounded-2xl border border-sky-100 shadow-sm overflow-hidden">
              <div className="px-5 py-4 border-b border-sky-100 bg-sky-50">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-display text-lg text-sky-800">
                    Unassigned Mentees
                    {mentees.length > 0 && (
                      <span className="ml-2 text-sm font-sans font-normal text-sky-400">
                        ({mentees.length})
                      </span>
                    )}
                  </h3>
                  {selectedMentee && (
                    <button
                      onClick={() => setSelectedMentee(null)}
                      className="text-xs text-sky-400 hover:text-sky-600 transition-colors"
                    >
                      Clear selection
                    </button>
                  )}
                </div>
                <input
                  type="text"
                  value={menteeSearch}
                  onChange={e => setMenteeSearch(e.target.value)}
                  placeholder="Search by name, email or university..."
                  className="w-full px-3 py-2 rounded-xl border border-sky-200 text-sm focus:outline-none focus:border-sky-400 bg-white text-sky-800 transition-all"
                />
              </div>

              <div className="overflow-y-auto max-h-[480px]">
                {loadingMentees ? (
                  <div className="flex items-center justify-center py-16">
                    <div className="w-8 h-8 border-4 border-sky-200 border-t-sky-500 rounded-full animate-spin" />
                  </div>
                ) : mentees.length === 0 ? (
                  <div className="text-center py-16 px-6">
                    <div className="text-4xl mb-3">🎉</div>
                    <p className="font-display text-lg text-sky-600 mb-1">All caught up!</p>
                    <p className="text-sky-400 text-sm">
                      {menteeSearch ? 'No mentees match that search.' : 'Every mentee has been assigned a mentor.'}
                    </p>
                  </div>
                ) : (
                  <div className="divide-y divide-sky-50">
                    {mentees.map(mentee => {
                      const isSelected = selectedMentee?._id === mentee._id
                      return (
                        <button
                          key={mentee._id}
                          onClick={() => setSelectedMentee(isSelected ? null : mentee)}
                          className={[
                            'w-full text-left px-5 py-4 flex items-center gap-3 transition-all',
                            isSelected
                              ? 'bg-sky-600 text-white'
                              : 'hover:bg-sky-50 text-sky-800',
                          ].join(' ')}
                        >
                          <div className={[
                            'w-10 h-10 rounded-full flex items-center justify-center font-bold text-base flex-shrink-0 transition-all',
                            isSelected
                              ? 'bg-white/20 text-white'
                              : 'bg-gradient-to-br from-sky-100 to-sky-200 text-sky-600',
                          ].join(' ')}>
                            {mentee.name.charAt(0).toUpperCase()}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className={[
                              'font-semibold text-sm truncate',
                              isSelected ? 'text-white' : 'text-sky-800',
                            ].join(' ')}>
                              {mentee.name}
                            </div>
                            <div className={[
                              'text-xs truncate',
                              isSelected ? 'text-sky-200' : 'text-sky-400',
                            ].join(' ')}>
                              {mentee.email}
                            </div>
                            {mentee.university && (
                              <div className={[
                                'text-xs truncate mt-0.5',
                                isSelected ? 'text-sky-300' : 'text-sky-300',
                              ].join(' ')}>
                                🏛 {mentee.university}
                              </div>
                            )}
                          </div>
                          <div className="flex-shrink-0">
                            {isSelected ? (
                              <div className="w-5 h-5 rounded-full bg-white flex items-center justify-center">
                                <svg className="w-3 h-3 text-sky-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                </svg>
                              </div>
                            ) : (
                              <div className="w-5 h-5 rounded-full border-2 border-sky-200" />
                            )}
                          </div>
                        </button>
                      )
                    })}
                  </div>
                )}
              </div>
            </div>

            {/* ── Right: Mentors ── */}
            <div className="bg-white rounded-2xl border border-sky-100 shadow-sm overflow-hidden">
              <div className="px-5 py-4 border-b border-sky-100 bg-gold-50">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-display text-lg text-sky-800">
                    Mentors
                    {mentors.length > 0 && (
                      <span className="ml-2 text-sm font-sans font-normal text-sky-400">
                        ({mentors.length})
                      </span>
                    )}
                  </h3>
                  {selectedMentor && (
                    <button
                      onClick={() => setSelectedMentor(null)}
                      className="text-xs text-sky-400 hover:text-sky-600 transition-colors"
                    >
                      Clear selection
                    </button>
                  )}
                </div>
                <input
                  type="text"
                  value={mentorSearch}
                  onChange={e => setMentorSearch(e.target.value)}
                  placeholder="Search mentors..."
                  className="w-full px-3 py-2 rounded-xl border border-gold-200 text-sm focus:outline-none focus:border-gold-400 bg-white text-sky-800 transition-all"
                />
              </div>

              <div className="overflow-y-auto max-h-[480px]">
                {loadingMentors ? (
                  <div className="flex items-center justify-center py-16">
                    <div className="w-8 h-8 border-4 border-gold-200 border-t-gold-500 rounded-full animate-spin" />
                  </div>
                ) : filteredMentors.length === 0 ? (
                  <div className="text-center py-16 px-6">
                    <div className="text-4xl mb-3">🎓</div>
                    <p className="font-display text-lg text-sky-600 mb-1">No mentors found</p>
                    <p className="text-sky-400 text-sm">
                      {mentorSearch ? 'Try a different search.' : 'No mentors have registered yet.'}
                    </p>
                  </div>
                ) : (
                  <div className="divide-y divide-sky-50">
                    {filteredMentors.map(mentor => {
                      const isSelected = selectedMentor?._id === mentor._id
                      const count      = mentor.menteeCount ?? 0
                      const loadLevel  =
                        count === 0  ? 'text-emerald-500 bg-emerald-50' :
                        count <= 3   ? 'text-sky-500    bg-sky-50'      :
                        count <= 6   ? 'text-amber-500  bg-amber-50'    :
                                       'text-red-500    bg-red-50'

                      return (
                        <button
                          key={mentor._id}
                          onClick={() => setSelectedMentor(isSelected ? null : mentor)}
                          className={[
                            'w-full text-left px-5 py-4 flex items-center gap-3 transition-all',
                            isSelected
                              ? 'bg-gold-400 text-sky-900'
                              : 'hover:bg-gold-50 text-sky-800',
                          ].join(' ')}
                        >
                          <div className={[
                            'w-10 h-10 rounded-full flex items-center justify-center font-bold text-base flex-shrink-0 transition-all',
                            isSelected
                              ? 'bg-sky-900/15 text-sky-900'
                              : 'bg-gradient-to-br from-gold-100 to-gold-200 text-gold-700',
                          ].join(' ')}>
                            {mentor.name.charAt(0).toUpperCase()}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className={[
                              'font-semibold text-sm truncate',
                              isSelected ? 'text-sky-900' : 'text-sky-800',
                            ].join(' ')}>
                              {mentor.name}
                            </div>
                            <div className={[
                              'text-xs truncate',
                              isSelected ? 'text-sky-700' : 'text-sky-400',
                            ].join(' ')}>
                              {mentor.email}
                            </div>
                            {mentor.university && (
                              <div className={[
                                'text-xs truncate mt-0.5',
                                isSelected ? 'text-sky-600' : 'text-sky-300',
                              ].join(' ')}>
                                🏛 {mentor.university}
                              </div>
                            )}
                          </div>
                          <div className="flex-shrink-0 flex flex-col items-end gap-1">
                            <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${isSelected ? 'bg-sky-900/10 text-sky-900' : loadLevel}`}>
                              {count} mentee{count !== 1 ? 's' : ''}
                            </span>
                            {isSelected ? (
                              <div className="w-5 h-5 rounded-full bg-sky-900/20 flex items-center justify-center">
                                <svg className="w-3 h-3 text-sky-900" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                </svg>
                              </div>
                            ) : (
                              <div className="w-5 h-5 rounded-full border-2 border-gold-200" />
                            )}
                          </div>
                        </button>
                      )
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Instructions when nothing is selected */}
          {!selectedMentee && !selectedMentor && (
            <div className="bg-sky-50 border border-sky-100 rounded-2xl p-5 text-center">
              <p className="text-sky-500 text-sm">
                Select a <span className="font-semibold text-sky-700">mentee</span> from the left panel
                and a <span className="font-semibold text-sky-700">mentor</span> from the right panel,
                then confirm the assignment.
              </p>
            </div>
          )}
          {selectedMentee && !selectedMentor && (
            <div className="bg-sky-50 border border-sky-100 rounded-2xl p-4 text-center">
              <p className="text-sky-500 text-sm">
                ✓ <span className="font-semibold text-sky-700">{selectedMentee.name}</span> selected —
                now pick a mentor from the right panel.
              </p>
            </div>
          )}
          {!selectedMentee && selectedMentor && (
            <div className="bg-gold-50 border border-gold-100 rounded-2xl p-4 text-center">
              <p className="text-sky-500 text-sm">
                ✓ <span className="font-semibold text-sky-700">{selectedMentor.name}</span> selected —
                now pick a mentee from the left panel.
              </p>
            </div>
          )}
        </div>
      )}

      {/* ── MANAGE VIEW ── */}
      {view === 'manage' && (
        <div>
          <div className="bg-white rounded-2xl border border-sky-100 shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-sky-100 bg-sky-50 flex items-center justify-between">
              <h3 className="font-display text-lg text-sky-800">
                Current Assignments
                <span className="ml-2 text-sm font-sans font-normal text-sky-400">
                  ({assignments.length})
                </span>
              </h3>
              <button
                onClick={loadAssigned}
                disabled={loadingAssigned}
                className="text-xs text-sky-500 hover:text-sky-700 font-semibold transition-colors flex items-center gap-1"
              >
                {loadingAssigned
                  ? <span className="w-3 h-3 border-2 border-sky-300 border-t-sky-500 rounded-full animate-spin" />
                  : '↻'
                }
                Refresh
              </button>
            </div>

            {loadingAssigned ? (
              <div className="flex items-center justify-center py-16">
                <div className="w-8 h-8 border-4 border-sky-200 border-t-sky-500 rounded-full animate-spin" />
              </div>
            ) : assignments.length === 0 ? (
              <div className="text-center py-16 px-6">
                <div className="text-4xl mb-3">📭</div>
                <p className="font-display text-xl text-sky-600 mb-1">No assignments yet</p>
                <p className="text-sky-400 text-sm">Switch to the Assign tab to pair mentees with mentors.</p>
              </div>
            ) : (
              <div className="divide-y divide-sky-50">
                {assignments.map(mentee => {
                  // Find the mentor name from the mentors list
                  const mentor = mentors.find(m => m._id === mentee.mentorId)
                  const mentorName = mentee.mentorName ?? mentor?.name ?? 'Unknown Mentor'

                  return (
                    <div
                      key={mentee._id}
                      className="px-5 py-4 flex items-center gap-4 hover:bg-sky-50/50 transition-colors"
                    >
                      {/* Mentee */}
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-sky-100 to-sky-200 flex items-center justify-center text-sky-600 font-bold text-sm flex-shrink-0">
                          {mentee.name.charAt(0).toUpperCase()}
                        </div>
                        <div className="min-w-0">
                          <div className="font-semibold text-sky-800 text-sm truncate">{mentee.name}</div>
                          <div className="text-sky-400 text-xs truncate">{mentee.email}</div>
                        </div>
                      </div>

                      {/* Arrow */}
                      <div className="text-sky-300 text-sm flex-shrink-0 hidden sm:block">→</div>

                      {/* Mentor */}
                      <div className="flex items-center gap-3 flex-1 min-w-0 hidden sm:flex">
                        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-gold-100 to-gold-200 flex items-center justify-center text-gold-700 font-bold text-sm flex-shrink-0">
                          {mentorName.charAt(0).toUpperCase()}
                        </div>
                        <div className="min-w-0">
                          <div className="font-semibold text-sky-800 text-sm truncate">{mentorName}</div>
                          <div className="text-gold-500 text-xs">Mentor</div>
                        </div>
                      </div>

                      {/* Unassign button */}
                      <button
                        onClick={() => handleUnassign(mentee)}
                        disabled={unassigning === mentee._id}
                        className="flex-shrink-0 px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-400 hover:text-red-600 rounded-lg text-xs font-semibold transition-all disabled:opacity-50 flex items-center gap-1"
                      >
                        {unassigning === mentee._id
                          ? <span className="w-3 h-3 border-2 border-red-300 border-t-red-500 rounded-full animate-spin" />
                          : '✕'
                        }
                        Unassign
                      </button>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

const ORDER_STATUSES = ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled']

const STATUS_STYLES: Record<string, string> = {
  pending:   'bg-amber-100  text-amber-700  border-amber-200',
  confirmed: 'bg-sky-100    text-sky-700    border-sky-200',
  shipped:   'bg-violet-100 text-violet-700 border-violet-200',
  delivered: 'bg-emerald-100 text-emerald-700 border-emerald-200',
  cancelled: 'bg-red-100    text-red-500    border-red-200',
}

const STATUS_EMOJI: Record<string, string> = {
  pending:   '⏳',
  confirmed: '✅',
  shipped:   '🚚',
  delivered: '📦',
  cancelled: '❌',
}

function OrdersTab() {
  const { toast } = useToast()

  const [orders,       setOrders]       = useState<any[]>([])
  const [loading,      setLoading]      = useState(true)
  const [total,        setTotal]        = useState(0)
  const [page,         setPage]         = useState(1)
  const [statusFilter, setStatusFilter] = useState('')
  const [sectionFilter,setSectionFilter]= useState('')
  const [expandedId,   setExpandedId]   = useState<string | null>(null)
  const [updating,     setUpdating]     = useState<string | null>(null)

  const limit = 15

  const loadOrders = () => {
    setLoading(true)
    const params: Record<string, any> = { page, limit }
    if (statusFilter)  params.status  = statusFilter
    if (sectionFilter) params.section = sectionFilter

    adminService
      .getAllOrders(params)
      .then((data: any) => {
        setOrders(data.orders ?? [])
        setTotal(data.total  ?? 0)
      })
      .catch(() => toast('Failed to load orders', 'error'))
      .finally(() => setLoading(false))
  }

  useEffect(() => { loadOrders() }, [page, statusFilter, sectionFilter])

  const handleStatusUpdate = async (orderId: string, newStatus: string) => {
    setUpdating(orderId)
    try {
      const updated = await adminService.updateOrderStatus(orderId, newStatus)
      setOrders(prev => prev.map(o => o._id === orderId ? { ...o, status: newStatus } : o))
      toast(`Order status updated to ${newStatus}`, 'success')
    } catch (err: any) {
      toast(err.response?.data?.message ?? 'Update failed', 'error')
    } finally {
      setUpdating(null)
    }
  }

  const totalPages = Math.ceil(total / limit)

  // Summary counts from current loaded orders (rough — full counts need a summary endpoint)
  const summaryCounts = ORDER_STATUSES.reduce((acc, s) => {
    acc[s] = orders.filter(o => o.status === s).length
    return acc
  }, {} as Record<string, number>)

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <div>
          <h2 className="font-display text-3xl text-sky-900">Orders</h2>
          <p className="text-sky-500 text-sm mt-1">{total} total order{total !== 1 ? 's' : ''}</p>
        </div>
        <button
          onClick={loadOrders}
          className="text-sm text-sky-500 hover:text-sky-700 font-semibold flex items-center gap-1 transition-colors"
        >
          ↻ Refresh
        </button>
      </div>

      {/* Status summary pills */}
      <div className="flex flex-wrap gap-2 mb-6">
        <button
          onClick={() => { setStatusFilter(''); setPage(1) }}
          className={[
            'px-4 py-2 rounded-xl text-xs font-bold border transition-all',
            !statusFilter
              ? 'bg-sky-600 text-white border-sky-600'
              : 'bg-white text-sky-600 border-sky-200 hover:border-sky-400',
          ].join(' ')}
        >
          All ({total})
        </button>
        {ORDER_STATUSES.map(s => (
          <button
            key={s}
            onClick={() => { setStatusFilter(s); setPage(1) }}
            className={[
              'px-4 py-2 rounded-xl text-xs font-bold border transition-all capitalize flex items-center gap-1.5',
              statusFilter === s
                ? `${STATUS_STYLES[s]} ring-1 ring-current`
                : `bg-white border-sky-100 text-sky-500 hover:border-sky-300`,
            ].join(' ')}
          >
            <span>{STATUS_EMOJI[s]}</span>
            {s}
          </button>
        ))}
      </div>

      {/* Section filter */}
      <div className="flex gap-3 mb-5">
        {['', 'beauty', 'requirements'].map(s => (
          <button
            key={s}
            onClick={() => { setSectionFilter(s); setPage(1) }}
            className={[
              'px-4 py-2 rounded-xl text-xs font-semibold border transition-all capitalize',
              sectionFilter === s
                ? 'bg-sky-100 text-sky-700 border-sky-300'
                : 'bg-white text-sky-500 border-sky-100 hover:border-sky-200',
            ].join(' ')}
          >
            {s === '' ? 'All Sections' : s === 'beauty' ? '💄 Beauty' : '📦 Requirements'}
          </button>
        ))}
      </div>

      {/* Orders table */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-10 h-10 border-4 border-sky-200 border-t-sky-500 rounded-full animate-spin" />
        </div>
      ) : orders.length === 0 ? (
        <div className="bg-white rounded-2xl border border-sky-100 py-20 text-center">
          <div className="text-5xl mb-4">📭</div>
          <p className="font-display text-2xl text-sky-300">No orders found</p>
          <p className="text-sky-400 text-sm mt-2">
            {statusFilter || sectionFilter ? 'Try clearing your filters.' : 'No orders have been placed yet.'}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {orders.map(order => {
            const isExpanded = expandedId === order._id
            const isUpdating = updating === order._id
            const customer   = order.userId as any

            return (
              <div
                key={order._id}
                className="bg-white rounded-2xl border border-sky-100 shadow-sm overflow-hidden transition-all"
              >
                {/* Order row */}
                <div className="px-5 py-4 flex items-center gap-4 flex-wrap">

                  {/* Section icon */}
                  <div className={[
                    'w-10 h-10 rounded-xl flex items-center justify-center text-xl flex-shrink-0',
                    order.section === 'beauty' ? 'bg-pink-50' : 'bg-gold-50',
                  ].join(' ')}>
                    {order.section === 'beauty' ? '💄' : '📦'}
                  </div>

                  {/* Customer */}
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-sky-800 text-sm">
                      {customer?.name ?? 'Unknown customer'}
                    </div>
                    <div className="text-sky-400 text-xs truncate">
                      {customer?.email ?? '—'}
                    </div>
                    {customer?.university && (
                      <div className="text-sky-300 text-xs">{customer.university}</div>
                    )}
                  </div>

                  {/* Items count + total */}
                  <div className="text-right flex-shrink-0 hidden sm:block">
                    <div className="font-bold text-sky-800 text-sm">
                      KES {order.total?.toLocaleString()}
                    </div>
                    <div className="text-sky-400 text-xs">
                      {order.items?.length} item{order.items?.length !== 1 ? 's' : ''}
                    </div>
                  </div>

                  {/* Date */}
                  <div className="text-sky-300 text-xs flex-shrink-0 hidden md:block">
                    {new Date(order.createdAt).toLocaleDateString('en-KE', {
                      day: 'numeric', month: 'short', year: 'numeric',
                    })}
                  </div>

                  {/* Status badge */}
                  <div className="flex-shrink-0">
                    <span className={`inline-flex items-center gap-1 text-xs px-2.5 py-1.5 rounded-full font-bold border capitalize ${STATUS_STYLES[order.status]}`}>
                      {STATUS_EMOJI[order.status]} {order.status}
                    </span>
                  </div>

                  {/* Expand toggle */}
                  <button
                    onClick={() => setExpandedId(isExpanded ? null : order._id)}
                    className="flex-shrink-0 w-8 h-8 rounded-lg bg-sky-50 hover:bg-sky-100 text-sky-500 flex items-center justify-center transition-all"
                  >
                    <svg
                      className={`w-4 h-4 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}
                      fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                </div>

                {/* Expanded details */}
                {isExpanded && (
                  <div className="border-t border-sky-100 bg-sky-50/50 px-5 py-5">
                    <div className="grid sm:grid-cols-2 gap-6">

                      {/* Order items */}
                      <div>
                        <h4 className="text-xs font-bold text-sky-600 uppercase tracking-wide mb-3">
                          Items Ordered
                        </h4>
                        <div className="space-y-2">
                          {order.items?.map((item: any, idx: number) => (
                            <div key={idx} className="flex items-center gap-3 bg-white rounded-xl p-3 border border-sky-100">
                              {item.image && (
                                <div className="w-10 h-10 rounded-lg overflow-hidden bg-sky-100 flex-shrink-0">
                                  <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                </div>
                              )}
                              <div className="flex-1 min-w-0">
                                <div className="text-sky-800 text-sm font-medium truncate">{item.name}</div>
                                <div className="text-sky-400 text-xs">×{item.qty}</div>
                              </div>
                              <div className="text-sky-700 text-sm font-bold flex-shrink-0">
                                KES {(item.price * item.qty).toLocaleString()}
                              </div>
                            </div>
                          ))}
                          <div className="flex justify-between px-3 py-2 bg-sky-100 rounded-xl">
                            <span className="text-sky-600 text-sm font-semibold">Total</span>
                            <span className="text-sky-800 text-sm font-bold">
                              KES {order.total?.toLocaleString()}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Order info + status update */}
                      <div>
                        <h4 className="text-xs font-bold text-sky-600 uppercase tracking-wide mb-3">
                          Delivery & Status
                        </h4>

                        {order.deliveryAddress && (
                          <div className="bg-white rounded-xl p-3 border border-sky-100 mb-3">
                            <div className="text-xs text-sky-400 mb-1">Delivery Address</div>
                            <div className="text-sky-700 text-sm">{order.deliveryAddress}</div>
                          </div>
                        )}

                        {order.notes && (
                          <div className="bg-white rounded-xl p-3 border border-sky-100 mb-3">
                            <div className="text-xs text-sky-400 mb-1">Customer Notes</div>
                            <div className="text-sky-700 text-sm">{order.notes}</div>
                          </div>
                        )}

                        <div className="bg-white rounded-xl p-3 border border-sky-100 mb-3">
                          <div className="text-xs text-sky-400 mb-1">Order ID</div>
                          <code className="text-sky-600 text-xs font-mono break-all">{order._id}</code>
                        </div>

                        {/* Status updater */}
                        <div>
                          <div className="text-xs font-bold text-sky-600 uppercase tracking-wide mb-2">
                            Update Status
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {ORDER_STATUSES.map(s => (
                              <button
                                key={s}
                                disabled={order.status === s || isUpdating}
                                onClick={() => handleStatusUpdate(order._id, s)}
                                className={[
                                  'px-3 py-1.5 rounded-lg text-xs font-bold border transition-all capitalize flex items-center gap-1',
                                  order.status === s
                                    ? `${STATUS_STYLES[s]} ring-1 ring-current cursor-default`
                                    : 'bg-white text-sky-500 border-sky-200 hover:border-sky-400 disabled:opacity-40',
                                ].join(' ')}
                              >
                                {isUpdating && order.status !== s ? (
                                  <span className="w-3 h-3 border-2 border-current/30 border-t-current rounded-full animate-spin" />
                                ) : (
                                  <span>{STATUS_EMOJI[s]}</span>
                                )}
                                {s}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-3 mt-8">
          <button
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1 || loading}
            className="px-5 py-2 bg-white border border-sky-200 text-sky-600 rounded-xl text-sm font-semibold disabled:opacity-40 hover:bg-sky-50 transition-colors"
          >
            ← Prev
          </button>
          <span className="text-sky-500 text-sm">
            Page {page} of {totalPages}
          </span>
          <button
            onClick={() => setPage(p => p + 1)}
            disabled={page >= totalPages || loading}
            className="px-5 py-2 bg-white border border-sky-200 text-sky-600 rounded-xl text-sm font-semibold disabled:opacity-40 hover:bg-sky-50 transition-colors"
          >
            Next →
          </button>
        </div>
      )}
    </div>
  )
}