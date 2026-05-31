import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../../components/shared/Navbar'
import Footer from '../../components/shared/Footer'
import ItemCard from '../../components/requirements/ItemCard'
import LoadingSpinner from '../../components/shared/LoadingSpinner'
import EmptyState from '../../components/shared/EmptyState'
import { requirementsService } from '../../services/requirements.service'
import { RequirementItem } from '../../types/product.types'
import { useDebounce } from '../../hooks/useDebounce'

const REQ_CATEGORIES = ['All', 'Stationery', 'Bedding', 'Kitchen', 'Electronics', 'Clothing', 'Toiletries', 'General']

export default function RequirementsHome() {
  const [items,    setItems]    = useState<RequirementItem[]>([])
  const [loading,  setLoading]  = useState(true)
  const [error,    setError]    = useState('')
  const [search,   setSearch]   = useState('')
  const [category, setCategory] = useState('All')
  const [total,    setTotal]    = useState(0)
  const [page,     setPage]     = useState(1)

  const navigate         = useNavigate()
  const debouncedSearch  = useDebounce(search, 400)

  useEffect(() => { setPage(1) }, [debouncedSearch, category])

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setError('')

    const params: Record<string, any> = { page, limit: 18 }
    if (debouncedSearch.trim())   params.search   = debouncedSearch.trim()
    if (category !== 'All')       params.category = category

    requirementsService
      .getAll(params)
      .then(data => {
        if (cancelled) return
        setItems(data.items)
        setTotal(data.total)
      })
      .catch(err => {
        if (cancelled) return
        setError(err.message ?? 'Failed to load items')
      })
      .finally(() => { if (!cancelled) setLoading(false) })

    return () => { cancelled = true }
  }, [debouncedSearch, category, page])

  return (
    <div className="min-h-screen font-body" style={{ backgroundColor: '#fefce8' }}>
      <Navbar />

      <div className="pt-16">
        {/* Hero */}
        <div
          className="py-16 px-6 text-center"
          style={{
            background: 'linear-gradient(135deg, rgba(254,243,199,0.8) 0%, rgba(240,249,255,0.7) 100%)',
          }}
        >
          <p className="text-gold-600 text-xs font-bold tracking-widest uppercase mb-3">📦 First Year Requirements</p>
          <h1 className="font-display text-5xl text-sky-900 mb-3">Everything on Your List</h1>
          <p className="text-sky-600 max-w-xl mx-auto text-sm leading-relaxed">
            Browse freely. Sign in when you're ready to place an order.
          </p>
          {total > 0 && (
            <p className="text-sky-400 text-xs mt-2">{total} items available</p>
          )}
        </div>

        {/* Sticky filters */}
        <div className="sticky top-16 z-30 bg-white/95 backdrop-blur border-b border-gold-100 shadow-sm">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 flex flex-wrap gap-3 items-center">
            <div className="flex gap-2 flex-wrap flex-1">
              {REQ_CATEGORIES.map(cat => (
                <button
                  key={cat}
                  onClick={() => setCategory(cat)}
                  className={[
                    'px-3 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 border',
                    category === cat
                      ? 'bg-gold-400 text-sky-900 border-gold-400 shadow-sm'
                      : 'bg-white text-sky-600 border-sky-200 hover:border-gold-300 hover:bg-gold-50',
                  ].join(' ')}
                >
                  {cat}
                </button>
              ))}
            </div>
            <div className="relative">
              <input
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Filter items..."
                className="pl-8 pr-4 py-2 rounded-xl border border-gold-200 text-sm focus:outline-none focus:border-gold-400 bg-gold-50 text-sky-800 w-44 sm:w-52 transition-all"
              />
              <svg
                className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gold-400"
                fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
        </div>

        {/* Items */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
          {loading ? (
            <LoadingSpinner />
          ) : error ? (
            <div className="text-center py-20">
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          ) : items.length === 0 ? (
            <EmptyState
              icon="📦"
              title="No items found"
              subtitle="Try a different search or category filter."
              action={{ label: 'Clear filters', onClick: () => { setSearch(''); setCategory('All') } }}
            />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {items.map(item => <ItemCard key={item._id} item={item} />)}
            </div>
          )}

          {/* Pagination */}
          {!loading && total > 18 && (
            <div className="flex justify-center gap-3 mt-10">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-5 py-2 bg-white border border-gold-200 text-sky-600 rounded-xl text-sm font-semibold disabled:opacity-40 hover:bg-gold-50 transition-colors"
              >
                ← Prev
              </button>
              <span className="flex items-center text-sm text-sky-500 px-3">
                Page {page} of {Math.ceil(total / 18)}
              </span>
              <button
                onClick={() => setPage(p => p + 1)}
                disabled={page >= Math.ceil(total / 18)}
                className="px-5 py-2 bg-white border border-gold-200 text-sky-600 rounded-xl text-sm font-semibold disabled:opacity-40 hover:bg-gold-50 transition-colors"
              >
                Next →
              </button>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  )
}