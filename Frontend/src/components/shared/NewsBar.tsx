import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { newsService } from '../../services/news.service'

export default function NewsBar() {
  const [headlines, setHeadlines] = useState<{ _id: string; title: string }[]>([])

  useEffect(() => {
    newsService.getAll()
      .then((res: any) => setHeadlines(res.posts?.slice(0, 8) || []))
      .catch(() => {})
  }, [])

  if (!headlines.length) return null

  const doubled = [...headlines, ...headlines]

  return (
    <div className="bg-sky-800 text-sky-100 text-xs py-1.5 overflow-hidden relative">
      {/* Fade edges */}
      <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-sky-800 to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-sky-800 to-transparent z-10 pointer-events-none" />

      <div
        className="flex gap-8 whitespace-nowrap animate-scroll-left"
        style={{ width: 'max-content' }}
      >
        {doubled.map((h, i) => (
          <span key={i} className="flex items-center gap-2">
            <span className="text-gold-400 font-bold">✦</span>
            <Link to={`/news`} className="hover:text-gold-400 transition-colors">
              {h.title}
            </Link>
          </span>
        ))}
      </div>
    </div>
  )
}