import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="bg-sky-900 text-sky-200 font-body">
      <div className="max-w-6xl mx-auto px-6 py-16 grid md:grid-cols-4 gap-10">
        {/* Brand */}
        <div className="md:col-span-2">
          <div className="font-display text-2xl font-bold text-white mb-3">
            Premium <span className="text-gold-400">Scholars</span>
          </div>
          <p className="text-sky-400 text-sm leading-relaxed max-w-xs">
            Beauty. Mentorship. Essentials. Built for university students who refuse to settle.
          </p>
          <div className="flex gap-4 mt-5">
            {['Instagram', 'Twitter', 'TikTok'].map(s => (
              <a key={s} href="#" className="text-xs text-sky-400 hover:text-gold-400 transition-colors">
                {s}
              </a>
            ))}
          </div>
        </div>

        {/* Navigation */}
        <div>
          <div className="text-xs font-semibold text-sky-500 uppercase tracking-widest mb-4">Explore</div>
          <nav className="space-y-2">
            {[
              { label: 'Home',         path: '/' },
              { label: 'Beauty Shop',  path: '/beauty' },
              { label: 'Mentorship',   path: '/mentorship' },
              { label: 'Requirements', path: '/requirements' },
              { label: 'News',         path: '/news' },
            ].map(l => (
              <Link key={l.path} to={l.path}
                className="block text-sm text-sky-300 hover:text-white transition-colors">
                {l.label}
              </Link>
            ))}
          </nav>
        </div>

        {/* Contact */}
        <div>
          <div className="text-xs font-semibold text-sky-500 uppercase tracking-widest mb-4">Contact</div>
          <div className="space-y-2 text-sm text-sky-300">
            <p>hello@premiumscholars.co.ke</p>
            <p>+254 700 000 000</p>
            <p>Nairobi, Kenya</p>
          </div>
        </div>
      </div>

      <div className="border-t border-sky-800 px-6 py-5">
        <div className="max-w-6xl mx-auto flex flex-wrap items-center justify-between gap-3 text-xs text-sky-600">
          <span>© {new Date().getFullYear()} Premium Scholars. All rights reserved.</span>
          <div className="flex gap-5">
            <a href="#" className="hover:text-sky-400 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-sky-400 transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  )
}