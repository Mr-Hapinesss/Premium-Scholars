// Re-export from AuthContext so components can import from either place.
// This hook also exposes a convenience helper for role-checking.
export { useAuth } from '../context/AuthContext'

import { useAuth } from '../context/AuthContext'

export const useIsAdmin  = () => useAuth().user?.role === 'admin'
export const useIsMentor = () => ['mentor', 'admin'].includes(useAuth().user?.role ?? '')
export const useIsMentee = () => useAuth().user?.role === 'mentee'