import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import LoadingSpinner from './LoadingSpinner'

interface Props {
  children: React.ReactNode
  allowedRoles: string[]
}

export default function ProtectedRoute({ children, allowedRoles }: Props) {
  const { user, isLoading } = useAuth()
  const location = useLocation()

  if (isLoading) return <LoadingSpinner fullPage />

  if (!user) {
    // Preserve intended destination so login can redirect back
    return <Navigate to="/mentorship/login" state={{ from: location }} replace />
  }

  if (!allowedRoles.includes(user.role)) {
    // User is logged in but wrong role — send to their correct home
    const home =
      user.role === 'admin'  ? '/admin' :
      user.role === 'mentor' ? '/mentorship/mentor/home' :
                               '/mentorship/mentee/home'
    return <Navigate to={home} replace />
  }

  return <>{children}</>
}