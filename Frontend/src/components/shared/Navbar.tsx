import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useCart } from '../../hooks/useCart'
import { useState } from 'react'
import CartDrawer from '../beauty/CartDrawer'

export default function Navbar() {
  const { user, logout }   = useAuth()
  const { itemCount }      = useCart()
  const navigate           = useNavigate()
  const location           = useLocation()
  const [menuOpen, setMenuOpen]   = useState(false)
  const [cartOpen, setCartOpen]   = useState(false)

  const sections = [
    { label: 'Beauty',       path: '/beauty' },
    { label: 'Mentorship',   path: '/mentorship' },
    { label: 'Requirements', path: '/requirements' },
    { label: 'News',         path: '/news' },
  ]

  const isActive = (path: string) => location.pathname.startsWith(path)

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-40 bg-white/85 backdrop-blur-md border-b border-sky-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between gap-4">

          {/* Logo */}
          <Link to="/" className="font-display text-2xl font-bold text-sky-800 flex-shrink-0">
            Premium <span className="text-gold-500">Scholars</span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-1 flex-1 justify-center">
            {sections.map(s => (
              <Link key={s.path} to={s.path}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors
                  ${isActive(s.path) ? 'bg-sky-100 text-sky-700' : 'text-sky-600 hover:bg-sky-50 hover:text-sky-800'}`}>
                {s.label}
              </Link>
            ))}
          </div>

          {/* Right side */}
          <div className="hidden md:flex items-center gap-3 flex-shrink-0">
            {/* Cart */}
            <button
              onClick={() => setCartOpen(true)}
              className="relative p-2 rounded-xl hover:bg-sky-50 transition-colors text-sky-600"
              aria-label="Open cart"
            >
              🛒
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-rose text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                  {itemCount > 9 ? '9+' : itemCount}
                </span>
              )}
            </button>

            {user ? (
              <>
                {user.role === 'admin' && (
                  <Link to="/admin"
                    className="text-xs font-semibold text-gold-600 hover:text-gold-700 px-3 py-1.5 border border-gold-200 rounded-lg transition-colors">
                    ⚙ Admin
                  </Link>
                )}
                {user.role === 'mentor' && (
                  <Link to="/mentorship/mentor/home"
                    className="text-xs font-semibold text-sky-600 px-3 py-1.5 border border-sky-200 rounded-lg hover:bg-sky-50 transition-colors">
                    Dashboard
                  </Link>
                )}
                {user.role === 'mentee' && (
                  <Link to="/mentorship/mentee/home"
                    className="text-xs font-semibold text-sky-600 px-3 py-1.5 border border-sky-200 rounded-lg hover:bg-sky-50 transition-colors">
                    Dashboard
                  </Link>
                )}
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-sky-400 to-gold-400 flex items-center justify-center text-white text-xs font-bold">
                    {user.name[0]}
                  </div>
                  <span className="text-sm text-sky-600 hidden lg:block">{user.name.split(' ')[0]}</span>
                </div>
                <button
                  onClick={() => { logout(); navigate('/') }}
                  className="text-sm text-sky-400 hover:text-sky-700 font-medium transition-colors"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <button
                onClick={() => navigate('/mentorship/login')}
                className="px-5 py-2 bg-sky-600 text-white rounded-xl text-sm font-semibold hover:bg-sky-700 transition-colors"
              >
                Sign In
              </button>
            )}
          </div>

          {/* Mobile right — cart + hamburger */}
          <div className="md:hidden flex items-center gap-3">
            <button onClick={() => setCartOpen(true)} className="relative p-2 text-sky-600">
              🛒
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-rose text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                  {itemCount}
                </span>
              )}
            </button>
            <button className="p-2 flex flex-col gap-1.5" onClick={() => setMenuOpen(!menuOpen)} aria-label="Menu">
              <span className={`block w-5 h-0.5 bg-sky-700 transition-all ${menuOpen ? 'rotate-45 translate-y-2' : ''}`} />
              <span className={`block w-5 h-0.5 bg-sky-700 transition-all ${menuOpen ? 'opacity-0' : ''}`} />
              <span className={`block w-5 h-0.5 bg-sky-700 transition-all ${menuOpen ? '-rotate-45 -translate-y-2' : ''}`} />
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="md:hidden bg-white border-t border-sky-100 px-6 py-5 space-y-3">
            {sections.map(s => (
              <Link key={s.path} to={s.path} onClick={() => setMenuOpen(false)}
                className={`block py-2 font-medium transition-colors ${isActive(s.path) ? 'text-sky-700' : 'text-sky-600'}`}>
                {s.label}
              </Link>
            ))}
            <div className="border-t border-sky-50 pt-3">
              {user ? (
                <>
                  {user.role === 'admin'  && <Link to="/admin"  onClick={() => setMenuOpen(false)} className="block py-2 text-gold-600 font-semibold text-sm">⚙ Admin Panel</Link>}
                  {user.role === 'mentor' && <Link to="/mentorship/mentor/home"  onClick={() => setMenuOpen(false)} className="block py-2 text-sky-600 text-sm">Dashboard</Link>}
                  {user.role === 'mentee' && <Link to="/mentorship/mentee/home"  onClick={() => setMenuOpen(false)} className="block py-2 text-sky-600 text-sm">Dashboard</Link>}
                  <button onClick={() => { logout(); setMenuOpen(false); navigate('/') }}
                    className="block py-2 text-sky-500 text-sm">Sign Out</button>
                </>
              ) : (
                <button onClick={() => { navigate('/mentorship/login'); setMenuOpen(false) }}
                  className="w-full py-3 bg-sky-600 text-white rounded-xl text-sm font-semibold">
                  Sign In
                </button>
              )}
            </div>
          </div>
        )}
      </nav>

      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
    </>
  )
}