import { useState, useEffect } from 'react'
import Navbar from '../../components/shared/Navbar'
import Footer from '../../components/shared/Footer'
import ProductGrid from '../../components/beauty/ProductGrid'
import { beautyService } from '../../services/beauty.service'
import { BeautyProduct } from '../../types/product.types'
import { useDebounce } from '../../hooks/useDebounce'

const CATEGORIES = ['All', 'Skincare', 'Makeup', 'Haircare', 'Fragrance', 'Nails', 'Other']

export default function BeautyHome() {
  const [products,  setProducts]  = useState<BeautyProduct[]>([])
  const [loading,   setLoading]   = useState(true)
  const [error,     setError]     = useState('')
  const [category,  setCategory]  = useState('All')
  const [search,    setSearch]    = useState('')
  const [total,     setTotal]     = useState(0)
  const [page,      setPage]      = useState(1)

  const debouncedSearch = useDebounce(search, 400)

  useEffect(() => {
    setPage(1)
  }, [debouncedSearch, category])

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setError('')

    const params: Record<string, any> = { page, limit: 20 }
    if (category !== 'All')        params.category = category
    if (debouncedSearch.trim())    params.search   = debouncedSearch.trim()

    beautyService
      .getAll(params)
      .then(data => {
        if (cancelled) return
        setProducts(data.products)
        setTotal(data.total)
      })
      .catch(err => {
        if (cancelled) return
        setError(err.message ?? 'Failed to load products')
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => { cancelled = true }
  }, [category, debouncedSearch, page])

  return (
    <div className="min-h-screen bg-blush font-body">
      <Navbar />

      {/* Offset for fixed navbar */}
      <div className="pt-16">
        {/* Hero banner */}
        <div
          className="py-16 px-6 text-center"
          style={{
            background: 'linear-gradient(135deg, rgba(253,242,248,1) 0%, rgba(254,243,199,0.6) 100%)',
          }}
        >
          <p className="text-pink-400 text-xs font-bold tracking-widest uppercase mb-3">✦ Beauty ✦</p>
          <h1 className="font-display text-5xl text-sky-900 mb-3">Glow, Scholar, Glow</h1>
          <p className="text-sky-600 max-w-md mx-auto text-sm leading-relaxed">
            Quality beauty products curated for the university lifestyle.
          </p>
          <p className="text-sky-400 text-xs mt-2">{total > 0 ? `${total} products available` : ''}</p>
        </div>

        {/* Sticky filter bar */}
        <div className="sticky top-16 z-30 bg-white/95 backdrop-blur border-b border-sky-100 shadow-sm">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 flex flex-wrap gap-3 items-center">
            {/* Category pills */}
            <div className="flex gap-2 flex-wrap flex-1">
              {CATEGORIES.map(cat => (
                <button
                  key={cat}
                  onClick={() => setCategory(cat)}
                  className={[
                    'px-4 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 border',
                    category === cat
                      ? 'bg-pink-400 text-white border-pink-400 shadow-sm'
                      : 'bg-white text-sky-600 border-sky-200 hover:border-sky-300 hover:bg-sky-50',
                  ].join(' ')}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Search */}
            <div className="relative">
              <input
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search products..."
                className="pl-8 pr-4 py-2 rounded-xl border border-sky-200 text-sm focus:outline-none focus:border-sky-400 bg-sky-50 text-sky-800 w-48 sm:w-56 transition-all"
              />
              <svg
                className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-sky-400"
                fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
        </div>

        {/* Product grid */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
          {error ? (
            <div className="text-center py-20">
              <p className="text-red-400 text-sm mb-4">{error}</p>
              <button
                onClick={() => setPage(p => p)}  // re-trigger effect
                className="px-5 py-2 bg-sky-600 text-white rounded-xl text-sm font-semibold"
              >
                Try Again
              </button>
            </div>
          ) : (
            <ProductGrid products={products} loading={loading} />
          )}

          {/* Pagination */}
          {!loading && total > 20 && (
            <div className="flex justify-center gap-3 mt-10">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-5 py-2 bg-white border border-sky-200 text-sky-600 rounded-xl text-sm font-semibold disabled:opacity-40 hover:bg-sky-50 transition-colors"
              >
                ← Prev
              </button>
              <span className="flex items-center text-sm text-sky-500 px-3">
                Page {page} of {Math.ceil(total / 20)}
              </span>
              <button
                onClick={() => setPage(p => p + 1)}
                disabled={page >= Math.ceil(total / 20)}
                className="px-5 py-2 bg-white border border-sky-200 text-sky-600 rounded-xl text-sm font-semibold disabled:opacity-40 hover:bg-sky-50 transition-colors"
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