import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useCart } from '../../hooks/useCart'
import CartDrawer from '../beauty/CartDrawer'

const NAV_LINKS = [
  { label: 'Beauty',       path: '/beauty' },
  { label: 'Mentorship',   path: '/mentorship' },
  { label: 'Requirements', path: '/requirements' },
  { label: 'News',         path: '/news' },
]

export default function Navbar() {
  const { user, logout }              = useAuth()
  const { itemCount }                 = useCart()
  const navigate                      = useNavigate()
  const location                      = useLocation()
  const [menuOpen, setMenuOpen]       = useState(false)
  const [cartOpen, setCartOpen]       = useState(false)

  // Exact match for /, prefix match for everything else
  const isActive = (path: string): boolean => {
    if (path === '/') return location.pathname === '/'
    return location.pathname.startsWith(path)
  }

  const dashboardPath =
    user?.role === 'admin'  ? '/admin' :
    user?.role === 'mentor' ? '/mentorship/mentor/home' :
    user?.role === 'mentee' ? '/mentorship/mentee/home' : null

  const handleLogout = () => {
    logout()
    setMenuOpen(false)
    navigate('/')
  }

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-40 bg-white/90 backdrop-blur-md border-b border-sky-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">

          {/* ── Logo ── */}
          <Link
            to="/"
            className="font-display text-xl sm:text-2xl font-bold text-sky-800 flex-shrink-0 hover:text-sky-900 transition-colors"
          >
            Premium{' '}
            <span className="text-gold-500">Scholars</span>
          </Link>

          {/* ── Desktop nav links ── */}
          <div className="hidden md:flex items-center gap-1 flex-1 justify-center">
            {NAV_LINKS.map(link => (
              <Link
                key={link.path}
                to={link.path}
                className={[
                  'px-4 py-2 rounded-xl text-sm font-medium transition-colors duration-200',
                  isActive(link.path)
                    ? 'bg-sky-100 text-sky-700'
                    : 'text-sky-600 hover:bg-sky-50 hover:text-sky-800',
                ].join(' ')}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* ── Desktop right side ── */}
          <div className="hidden md:flex items-center gap-2 flex-shrink-0">
            {/* Cart button */}
            <button
              onClick={() => setCartOpen(true)}
              aria-label="Open cart"
              className="relative p-2 rounded-xl text-sky-600 hover:bg-sky-50 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 bg-red-400 text-white text-[10px] font-bold rounded-full flex items-center justify-center leading-none">
                  {itemCount > 9 ? '9+' : itemCount}
                </span>
              )}
            </button>

            {user ? (
              <>
                {/* Admin badge */}
                {user.role === 'admin' && (
                  <Link
                    to="/admin"
                    className="text-xs font-semibold text-gold-600 px-3 py-1.5 border border-gold-300 rounded-lg hover:bg-gold-50 transition-colors"
                  >
                    ⚙ Admin
                  </Link>
                )}

                {/* Dashboard link */}
                {dashboardPath && user.role !== 'admin' && (
                  <Link
                    to={dashboardPath}
                    className="text-xs font-semibold text-sky-600 px-3 py-1.5 border border-sky-200 rounded-lg hover:bg-sky-50 transition-colors"
                  >
                    Dashboard
                  </Link>
                )}

                {/* Avatar + name */}
                <div className="flex items-center gap-2 pl-1">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-sky-400 to-gold-400 flex items-center justify-center text-white text-xs font-bold flex-shrink-0 select-none">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-sm text-sky-700 font-medium hidden lg:block max-w-[100px] truncate">
                    {user.name.split(' ')[0]}
                  </span>
                </div>

                <button
                  onClick={handleLogout}
                  className="text-sm text-sky-400 hover:text-sky-700 font-medium transition-colors px-2 py-1"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <button
                onClick={() => navigate('/mentorship/login')}
                className="px-5 py-2 bg-sky-600 text-white rounded-xl text-sm font-semibold hover:bg-sky-700 transition-colors shadow-sm"
              >
                Sign In
              </button>
            )}
          </div>

          {/* ── Mobile right — cart + hamburger ── */}
          <div className="md:hidden flex items-center gap-2">
            <button
              onClick={() => setCartOpen(true)}
              aria-label="Open cart"
              className="relative p-2 text-sky-600"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 min-w-[16px] h-4 px-0.5 bg-red-400 text-white text-[9px] font-bold rounded-full flex items-center justify-center leading-none">
                  {itemCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setMenuOpen(prev => !prev)}
              aria-label="Toggle menu"
              className="p-2 flex flex-col justify-center gap-1.5"
            >
              <span className={`block w-5 h-0.5 bg-sky-700 transition-all duration-300 ${menuOpen ? 'rotate-45 translate-y-2' : ''}`} />
              <span className={`block w-5 h-0.5 bg-sky-700 transition-all duration-300 ${menuOpen ? 'opacity-0 scale-x-0' : ''}`} />
              <span className={`block w-5 h-0.5 bg-sky-700 transition-all duration-300 ${menuOpen ? '-rotate-45 -translate-y-2' : ''}`} />
            </button>
          </div>
        </div>

        {/* ── Mobile dropdown menu ── */}
        <div className={`md:hidden overflow-hidden transition-all duration-300 ${menuOpen ? 'max-h-96' : 'max-h-0'}`}>
          <div className="bg-white border-t border-sky-100 px-6 py-4 space-y-1">
            {NAV_LINKS.map(link => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setMenuOpen(false)}
                className={[
                  'block px-3 py-2.5 rounded-xl font-medium text-sm transition-colors',
                  isActive(link.path)
                    ? 'bg-sky-100 text-sky-700'
                    : 'text-sky-600 hover:bg-sky-50',
                ].join(' ')}
              >
                {link.label}
              </Link>
            ))}

            <div className="border-t border-sky-100 pt-3 mt-2 space-y-1">
              {user ? (
                <>
                  {user.role === 'admin' && (
                    <Link
                      to="/admin"
                      onClick={() => setMenuOpen(false)}
                      className="block px-3 py-2.5 rounded-xl text-sm font-semibold text-gold-600 hover:bg-gold-50 transition-colors"
                    >
                      ⚙ Admin Panel
                    </Link>
                  )}
                  {dashboardPath && user.role !== 'admin' && (
                    <Link
                      to={dashboardPath}
                      onClick={() => setMenuOpen(false)}
                      className="block px-3 py-2.5 rounded-xl text-sm font-medium text-sky-600 hover:bg-sky-50 transition-colors"
                    >
                      My Dashboard
                    </Link>
                  )}
                  <div className="flex items-center gap-3 px-3 py-2">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-sky-400 to-gold-400 flex items-center justify-center text-white text-xs font-bold">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                    <span className="text-sm text-sky-700 font-medium">{user.name}</span>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-3 py-2.5 rounded-xl text-sm text-sky-500 hover:bg-sky-50 hover:text-sky-700 transition-colors"
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <button
                  onClick={() => { navigate('/mentorship/login'); setMenuOpen(false) }}
                  className="w-full px-3 py-3 bg-sky-600 text-white rounded-xl text-sm font-semibold hover:bg-sky-700 transition-colors"
                >
                  Sign In
                </button>
              )}
            </div>
          </div>
        </div>
      </nav>

      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
    </>
  )
}