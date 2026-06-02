import { useState, useEffect } from 'react'
import Navbar from '../../components/shared/Navbar'
import Footer from '../../components/shared/Footer'
import LoadingSpinner from '../../components/shared/LoadingSpinner'
import { newsService } from '../../services/news.service'
import { NewsPost } from '../../types/news.types'

// Uploads are served at /uploads/... from the backend root, not from /api
const UPLOADS_BASE = (import.meta.env.VITE_API_URL ?? 'http://localhost:5000/api')
  .replace('/api', '')

function buildImageUrl(imageUrl: string | null | undefined): string | null {
  if (!imageUrl) return null
  // If it's already absolute (starts with http), return as-is
  if (imageUrl.startsWith('http')) return imageUrl
  return `${UPLOADS_BASE}${imageUrl.startsWith('/') ? '' : '/'}${imageUrl}`
}

export default function NewsPage() {
  const [posts,   setPosts]   = useState<NewsPost[]>([])
  const [loading, setLoading] = useState(true)
  const [error,   setError]   = useState('')
  const [page,    setPage]    = useState(1)
  const [total,   setTotal]   = useState(0)
  const limit = 10

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setError('')

    newsService
      .getAll({ page, limit })
      .then(data => {
        if (cancelled) return
        setPosts(data.posts)
        setTotal(data.total)
      })
      .catch(err => {
        if (cancelled) return
        setError(err.message ?? 'Failed to load news')
      })
      .finally(() => { if (!cancelled) setLoading(false) })

    return () => { cancelled = true }
  }, [page])

  return (
    <div className="min-h-screen bg-sky-50 font-body">
      <Navbar />

      <div className="pt-24 px-4 sm:px-6 max-w-3xl mx-auto pb-20">
        {/* Header */}
        <div className="mb-12 text-center">
          <p className="text-gold-500 text-xs font-bold tracking-widest uppercase mb-3">Latest Updates</p>
          <h1 className="font-display text-5xl text-sky-900">Scholar News</h1>
          {total > 0 && (
            <p className="text-sky-400 text-sm mt-2">{total} {total === 1 ? 'post' : 'posts'}</p>
          )}
        </div>

        {/* Content */}
        {loading ? (
          <LoadingSpinner />
        ) : error ? (
          <div className="text-center py-16">
            <p className="text-red-400 text-sm mb-4">{error}</p>
            <button
              onClick={() => setPage(p => p)}
              className="px-5 py-2 bg-sky-600 text-white rounded-xl text-sm font-semibold hover:bg-sky-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-24">
            <div className="text-6xl mb-4">📰</div>
            <p className="font-display text-2xl text-sky-300 mb-2">No news yet</p>
            <p className="text-sky-400 text-sm">Check back soon for updates.</p>
          </div>
        ) : (
          <>
            <div className="space-y-6">
              {posts.map((post, i) => (
                <NewsCard key={post._id} post={post} isLatest={i === 0 && page === 1} />
              ))}
            </div>

            {/* Pagination */}
            {total > limit && (
              <div className="flex justify-center items-center gap-4 mt-10">
                <button
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="px-5 py-2 bg-white border border-sky-200 text-sky-600 rounded-xl text-sm font-semibold disabled:opacity-40 hover:bg-sky-50 transition-colors"
                >
                  ← Newer
                </button>
                <span className="text-sm text-sky-500">
                  {page} / {Math.ceil(total / limit)}
                </span>
                <button
                  onClick={() => setPage(p => p + 1)}
                  disabled={page >= Math.ceil(total / limit)}
                  className="px-5 py-2 bg-white border border-sky-200 text-sky-600 rounded-xl text-sm font-semibold disabled:opacity-40 hover:bg-sky-50 transition-colors"
                >
                  Older →
                </button>
              </div>
            )}
          </>
        )}
      </div>

      <Footer />
    </div>
  )
}

// ── Sub-component ──────────────────────────────────────────────────────────

function NewsCard({ post, isLatest }: { post: NewsPost; isLatest: boolean }) {
  const imageUrl = buildImageUrl(post.imageUrl)

  return (
    <article className={[
      'bg-white rounded-3xl border overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200',
      isLatest ? 'border-gold-300 ring-1 ring-gold-100' : 'border-sky-100',
    ].join(' ')}>
{imageUrl && (
  <div
    className="w-full overflow-hidden bg-sky-100"
    style={{ aspectRatio: '1.91 / 1' }}
  >
    <img
      src={imageUrl}
      alt={post.title}
      className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
    />
  </div>
)}

      <div className="p-6">
        {isLatest && (
          <span className="inline-block bg-gold-100 text-gold-700 text-[10px] font-bold px-3 py-1 rounded-full mb-3 uppercase tracking-wider">
            Latest
          </span>
        )}

        <h2 className="font-display text-2xl text-sky-900 mb-3 leading-snug">{post.title}</h2>

        <p className="text-sky-600 text-sm leading-relaxed whitespace-pre-wrap mb-5">{post.body}</p>

        <div className="flex items-center gap-2 text-sky-400 text-xs border-t border-sky-50 pt-4">
          <div className="w-6 h-6 rounded-full bg-gradient-to-br from-sky-400 to-gold-400 flex items-center justify-center text-white text-[10px] font-bold flex-shrink-0">
            {post.author.charAt(0).toUpperCase()}
          </div>
          <span className="font-medium text-sky-500">{post.author}</span>
          <span className="text-sky-200">•</span>
          <time dateTime={post.createdAt}>
            {new Date(post.createdAt).toLocaleDateString('en-KE', {
              day: 'numeric',
              month: 'long',
              year: 'numeric',
            })}
          </time>
        </div>
      </div>
    </article>
  )
}