import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="bg-sky-950 text-sky-300 font-body">
      <div className="max-w-6xl mx-auto px-6 pt-16 pb-12 grid md:grid-cols-4 gap-10">

        {/* Brand */}
        <div className="md:col-span-2">
          <div className="font-display text-3xl font-bold text-white mb-4 tracking-tight">
            Premium <span className="text-yellow-400">Scholars</span>
          </div>
          <p className="text-sky-400 text-sm leading-relaxed max-w-xs mb-6">
            Beauty. Mentorship. Essentials. Built for university students who refuse to settle.
          </p>
          <div className="flex gap-5">
            {['Instagram', 'Twitter', 'TikTok'].map(s => (
              <a key={s} href="#"
                className="text-xs font-semibold text-sky-500 hover:text-yellow-400 transition-colors tracking-wide">
                {s}
              </a>
            ))}
          </div>
        </div>

        {/* Navigation */}
        <div>
          <p className="text-xs font-bold text-sky-500 uppercase tracking-[0.2em] mb-5">Explore</p>
          <nav className="space-y-3">
            {[
              { label: 'Home',         path: '/' },
              { label: 'Beauty Shop',  path: '/beauty' },
              { label: 'Mentorship',   path: '/mentorship' },
              { label: 'Requirements', path: '/requirements' },
              { label: 'News',         path: '/news' },
            ].map(l => (
              <Link key={l.path} to={l.path}
                className="block text-sm text-sky-400 hover:text-white transition-colors duration-150">
                {l.label}
              </Link>
            ))}
          </nav>
        </div>

        {/* Contact */}
        <div>
          <p className="text-xs font-bold text-sky-500 uppercase tracking-[0.2em] mb-5">Contact</p>
          <div className="space-y-3 text-sm text-sky-400">
            <p className="hover:text-sky-200 transition-colors">hello@premiumscholars.co.ke</p>
            <p>+254 700 000 000</p>
            <p>Nairobi, Kenya 🇰🇪</p>
          </div>
        </div>
      </div>

      {/* Divider + bottom bar */}
      <div className="border-t border-sky-800/60 px-6 py-5">
        <div className="max-w-6xl mx-auto flex flex-wrap items-center justify-between gap-3 text-xs text-sky-600">
          <span>© {new Date().getFullYear()} Premium Scholars. All rights reserved.</span>
          <div className="flex gap-6">
            <a href="#" className="hover:text-sky-300 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-sky-300 transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  )
}