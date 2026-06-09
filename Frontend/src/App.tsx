import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import { AuthProvider } from './context/AuthContext'
import { CartProvider } from './context/CartContext'
import ProtectedRoute from './components/shared/ProtectedRoute'
import NewsBar from './components/shared/NewsBar'

// Pages
import LandingPage from './pages/LandingPage'
import BeautyHome from './pages/beauty/BeautyHome'
import BeautyProduct from './pages/beauty/BeautyProduct'
import MentorshipHome from './pages/mentorship/MentorshipHome'
import Login from './pages/mentorship/Login'
import Register from './pages/mentorship/Register'
import MentorHome from './pages/mentorship/MentorHome'
import MentorMentees from './pages/mentorship/MentorMentees'
import MenteeHome from './pages/mentorship/MenteeHome'
import RequirementsHome from './pages/requirements/RequirementsHome'
import Checkout from './pages/requirements/Checkout'
import NewsPage from './pages/news/NewsPage'
import AdminDashboard from './pages/admin/AdminDashboard'
import AdminRegister from './pages/admin/AdminRegister'
import ForgotPassword from './pages/ForgotPassword'
import ResetPassword  from './pages/ResetPassword'


// Scrolls to top on every route change
function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => { window.scrollTo({ top: 0, behavior: 'instant' as any }) }, [pathname])
  return null
}

// NewsBar appears on all pages except auth pages
function ConditionalNewsBar() {
  const { pathname } = useLocation()
  const authPaths = ['/mentorship/login', '/mentorship/register']
  if (authPaths.includes(pathname)) return null
  return <NewsBar />
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <ScrollToTop />
          <ConditionalNewsBar />
          <Routes>
            {/* ── PUBLIC ── */}
            <Route path="/"    element={<LandingPage />} />
            <Route path="/news" element={<NewsPage />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password"  element={<ResetPassword />} />

            {/* ── BEAUTY ── */}
            <Route path="/beauty"             element={<BeautyHome />} />
            <Route path="/beauty/product/:id" element={<BeautyProduct />} />

            {/* ── MENTORSHIP ── */}
            <Route path="/mentorship"          element={<MentorshipHome />} />
            <Route path="/mentorship/login"    element={<Login />} />
            <Route path="/mentorship/register" element={<Register />} />
            <Route path="/mentorship/mentor/home" element={
              <ProtectedRoute allowedRoles={['mentor', 'admin']}>
                <MentorHome />
              </ProtectedRoute>
            } />
            <Route path="/mentorship/mentor/mentees" element={
              <ProtectedRoute allowedRoles={['mentor', 'admin']}>
                <MentorMentees />
              </ProtectedRoute>
            } />
            <Route path="/mentorship/mentee/home" element={
              <ProtectedRoute allowedRoles={['mentee', 'admin']}>
                <MenteeHome />
              </ProtectedRoute>
            } />

            {/* ── REQUIREMENTS ── */}
            <Route path="/requirements" element={<RequirementsHome />} />
            <Route path="/requirements/checkout" element={
              <ProtectedRoute allowedRoles={['mentee', 'mentor', 'admin']}>
                <Checkout />
              </ProtectedRoute>
            } />

            {/* ── ADMIN ── */}
            <Route path="/admin" element={
              <ProtectedRoute allowedRoles={['admin']}>                
                <AdminDashboard />
              </ProtectedRoute>
            } />
            <Route path="/admin/register" element={<AdminRegister />} />

            {/* ── 404 ── */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}

function NotFound() {
  return (
    <div className="min-h-screen bg-sky-50 flex flex-col items-center justify-center font-body text-center px-6">
      <div className="font-display text-9xl font-bold text-sky-100 mb-4">404</div>
      <h1 className="font-display text-3xl text-sky-800 mb-3">Page Not Found</h1>
      <p className="text-sky-500 mb-8 max-w-xs">The page you're looking for doesn't exist or was moved.</p>
      <a href="/" className="inline-block p-4 bg-sky-600 text-white rounded-xl font-semibold hover:bg-sky-700 transition-colors">
        Go Home
      </a>
    </div>
  )
}