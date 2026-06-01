import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useCart } from '../../hooks/useCart'
import CartDrawer from '../Beauty/CartDrawer'

const NAV_LINKS = [
  { label: 'Beauty',       path: '/beauty' },
  { label: 'Mentorship',   path: '/mentorship' },
  { label: 'Requirements', path: '/requirements' },
  { label: 'News',         path: '/news' },
]

export default function Navbar() {
  const { user, logout }        = useAuth()
  const { itemCount }           = useCart()
  const navigate                = useNavigate()
  const location                = useLocation()
  const [menuOpen, setMenuOpen] = useState(false)
  const [cartOpen, setCartOpen] = useState(false)

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
      <nav className="fixed top-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-b border-sky-100/80 shadow-sm shadow-sky-100/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">

          {/* Logo */}
          <Link
            to="/"
            className="font-display text-xl sm:text-2xl font-bold text-sky-900 flex-shrink-0 hover:opacity-90 transition-opacity"
          >
            Premium{' '}
            <span className="text-yellow-500">Scholars</span>
          </Link>

          {/* Desktop nav links */}
          <div className="hidden md:flex items-center gap-1 flex-1 justify-center">
            {NAV_LINKS.map(link => (
              <Link
                key={link.path}
                to={link.path}
                className={[
                  'px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200',
                  isActive(link.path)
                    ? 'bg-sky-100 text-sky-700 font-semibold'
                    : 'text-sky-500 hover:bg-sky-50 hover:text-sky-800',
                ].join(' ')}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Desktop right */}
          <div className="hidden md:flex items-center gap-2 flex-shrink-0">
            <button
              onClick={() => setCartOpen(true)}
              aria-label="Open cart"
              className="relative p-2.5 rounded-xl text-sky-500 hover:bg-sky-50 hover:text-sky-700 transition-all duration-150"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              {itemCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 bg-red-400 text-white text-[10px] font-bold rounded-full flex items-center justify-center leading-none">
                  {itemCount > 9 ? '9+' : itemCount}
                </span>
              )}
            </button>

            {user ? (
              <>
                {user.role === 'admin' && (
                  <Link to="/admin"
                    className="text-xs font-bold text-yellow-600 px-3 py-1.5 border border-yellow-200 rounded-lg hover:bg-yellow-50 transition-colors">
                    ⚙ Admin
                  </Link>
                )}
                {dashboardPath && user.role !== 'admin' && (
                  <Link to={dashboardPath}
                    className="text-xs font-semibold text-sky-600 px-3 py-1.5 border border-sky-200 rounded-lg hover:bg-sky-50 transition-colors">
                    Dashboard
                  </Link>
                )}
                <div className="flex items-center gap-2 pl-1">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-sky-400 to-yellow-400 flex items-center justify-center text-white text-xs font-bold flex-shrink-0 select-none">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-sm text-sky-700 font-medium hidden lg:block max-w-[100px] truncate">
                    {user.name.split(' ')[0]}
                  </span>
                </div>
                <button
                  onClick={handleLogout}
                  className="text-sm text-sky-400 hover:text-red-400 font-medium transition-colors px-2 py-1"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <button
                onClick={() => navigate('/mentorship/login')}
                className="px-5 py-2 bg-sky-600 text-white rounded-xl text-sm font-semibold hover:bg-sky-700 transition-colors shadow-sm shadow-sky-200"
              >
                Sign In
              </button>
            )}
          </div>

          {/* Mobile: cart + hamburger */}
          <div className="md:hidden flex items-center gap-1">
            <button
              onClick={() => setCartOpen(true)}
              aria-label="Open cart"
              className="relative p-2.5 text-sky-600 hover:bg-sky-50 rounded-xl transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              {itemCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 min-w-[16px] h-4 px-0.5 bg-red-400 text-white text-[9px] font-bold rounded-full flex items-center justify-center leading-none">
                  {itemCount}
                </span>
              )}
            </button>
            <button
              onClick={() => setMenuOpen(prev => !prev)}
              aria-label="Toggle menu"
              className="p-2.5 flex flex-col justify-center gap-[5px] rounded-xl hover:bg-sky-50 transition-colors"
            >
              <span className={`block w-5 h-0.5 bg-sky-700 rounded-full transition-all duration-300 ${menuOpen ? 'rotate-45 translate-y-[7px]' : ''}`} />
              <span className={`block w-5 h-0.5 bg-sky-700 rounded-full transition-all duration-300 ${menuOpen ? 'opacity-0 scale-x-0' : ''}`} />
              <span className={`block w-5 h-0.5 bg-sky-700 rounded-full transition-all duration-300 ${menuOpen ? '-rotate-45 -translate-y-[7px]' : ''}`} />
            </button>
          </div>
        </div>

        {/* Mobile dropdown */}
        <div className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${menuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
          <div className="bg-white border-t border-sky-100 px-4 py-4 space-y-1">
            {NAV_LINKS.map(link => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setMenuOpen(false)}
                className={[
                  'block px-4 py-3 rounded-xl font-medium text-sm transition-colors',
                  isActive(link.path)
                    ? 'bg-sky-100 text-sky-700 font-semibold'
                    : 'text-sky-600 hover:bg-sky-50 hover:text-sky-800',
                ].join(' ')}
              >
                {link.label}
              </Link>
            ))}
            <div className="border-t border-sky-100 pt-3 mt-2 space-y-1">
              {user ? (
                <>
                  {user.role === 'admin' && (
                    <Link to="/admin" onClick={() => setMenuOpen(false)}
                      className="block px-4 py-3 rounded-xl text-sm font-bold text-yellow-600 hover:bg-yellow-50 transition-colors">
                      ⚙ Admin Panel
                    </Link>
                  )}
                  {dashboardPath && user.role !== 'admin' && (
                    <Link to={dashboardPath} onClick={() => setMenuOpen(false)}
                      className="block px-4 py-3 rounded-xl text-sm font-medium text-sky-600 hover:bg-sky-50 transition-colors">
                      My Dashboard
                    </Link>
                  )}
                  <div className="flex items-center gap-3 px-4 py-2.5">
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-sky-400 to-yellow-400 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                    <span className="text-sm text-sky-700 font-semibold">{user.name}</span>
                  </div>
                  <button onClick={handleLogout}
                    className="block w-full text-left px-4 py-3 rounded-xl text-sm text-sky-400 hover:bg-red-50 hover:text-red-400 transition-colors">
                    Sign Out
                  </button>
                </>
              ) : (
                <button
                  onClick={() => { navigate('/mentorship/login'); setMenuOpen(false) }}
                  className="w-full px-4 py-3 bg-sky-600 text-white rounded-xl text-sm font-semibold hover:bg-sky-700 transition-colors"
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