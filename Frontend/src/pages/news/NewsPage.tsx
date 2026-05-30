import { useEffect, useState } from 'react'
import Navbar from '../../components/shared/Navbar'
import Footer from '../../components/shared/Footer'
import { newsService } from '../../services/news.service'

interface NewsPost { _id: string; title: string; body: string; imageUrl?: string; createdAt: string; author: string }

export default function NewsPage() {
  const [posts, setPosts] = useState<NewsPost[]>([])

  useEffect(() => {
    newsService.getAll().then(setPosts)
  }, [])

  return (
    <div className="min-h-screen bg-sky-50 font-body">
      <Navbar />
      <div className="pt-24 px-6 max-w-4xl mx-auto">
        <div className="mb-12 text-center">
          <div className="text-sky-500 text-sm font-semibold tracking-widest uppercase mb-3">Latest Updates</div>
          <h1 className="font-display text-5xl text-sky-900">Scholar News</h1>
        </div>
        <div className="space-y-8">
          {posts.map((post, i) => (
            <article key={post._id}
              className={`bg-white rounded-3xl border border-sky-100 overflow-hidden shadow-sm hover:shadow-md transition-shadow
                ${i === 0 ? 'border-l-4 border-l-gold-400' : ''}`}>
              {post.imageUrl && (
                <div className="aspect-video overflow-hidden">
                  <img src={`${import.meta.env.VITE_API_URL}${post.imageUrl}`} alt={post.title}
                    className="w-full h-full object-cover" />
                </div>
              )}
              <div className="p-6">
                {i === 0 && (
                  <span className="inline-block bg-gold-100 text-gold-600 text-xs font-semibold px-3 py-1 rounded-full mb-3">Latest</span>
                )}
                <h2 className="font-display text-2xl text-sky-900 mb-2">{post.title}</h2>
                <p className="text-sky-600 leading-relaxed mb-4 whitespace-pre-wrap">{post.body}</p>
                <div className="flex items-center gap-2 text-sky-400 text-xs">
                  <span>By {post.author}</span>
                  <span>•</span>
                  <span>{new Date(post.createdAt).toLocaleDateString('en-KE', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                </div>
              </div>
            </article>
          ))}
          {posts.length === 0 && (
            <div className="text-center py-24 text-sky-300 font-display text-3xl">No news yet. Check back soon.</div>
          )}
        </div>
      </div>
      <div className="mt-24"><Footer /></div>
    </div>
  )
}