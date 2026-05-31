import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  useCallback,
} from 'react'
import { api } from '../services/api'

// ── Types ──────────────────────────────────────────────────────────────────

export type UserRole = 'admin' | 'mentor' | 'mentee'

export interface AuthUser {
  _id: string
  name: string
  email: string
  role: UserRole
  university?: string
  mentorId?: string | null
  isActive: boolean
  createdAt: string
}

export interface RegisterPayload {
  name: string
  email: string
  password: string
  university?: string
  role: 'mentor' | 'mentee'
  mentorCode?: string
}

interface AuthContextType {
  user: AuthUser | null
  token: string | null
  login:    (email: string, password: string) => Promise<void>
  register: (data: RegisterPayload) => Promise<void>
  logout:   () => void
  isLoading: boolean
}

// ── Context ────────────────────────────────────────────────────────────────

const AuthContext = createContext<AuthContextType | null>(null)

// ── Provider ───────────────────────────────────────────────────────────────

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user,      setUser]      = useState<AuthUser | null>(null)
  const [token,     setToken]     = useState<string | null>(
    () => localStorage.getItem('ps_token')
  )
  const [isLoading, setIsLoading] = useState<boolean>(true)

  // On mount, if a token exists, rehydrate the user
  useEffect(() => {
    const storedToken = localStorage.getItem('ps_token')
    if (!storedToken) {
      setIsLoading(false)
      return
    }

    // Pre-attach token so the /me request is authenticated
    api.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`

    api
      .get('/auth/me')
      .then(res => {
        // Our backend returns { success, message, data } — the user is in .data
        setUser(res.data.data as AuthUser)
      })
      .catch(() => {
        // Token is invalid/expired — clear everything
        localStorage.removeItem('ps_token')
        setToken(null)
        delete api.defaults.headers.common['Authorization']
      })
      .finally(() => setIsLoading(false))
  }, [])

  // Persist token + user and set axios default header
  const persist = useCallback((authUser: AuthUser, authToken: string) => {
    setUser(authUser)
    setToken(authToken)
    localStorage.setItem('ps_token', authToken)
    api.defaults.headers.common['Authorization'] = `Bearer ${authToken}`
  }, [])

  const login = useCallback(async (email: string, password: string): Promise<void> => {
    const res = await api.post('/auth/login', { email, password })
    // Shape: { success, message, data: { user, token } }
    const { user: authUser, token: authToken } = res.data.data as { user: AuthUser; token: string }
    persist(authUser, authToken)
  }, [persist])

  const register = useCallback(async (data: RegisterPayload): Promise<void> => {
    const res = await api.post('/auth/register', data)
    const { user: authUser, token: authToken } = res.data.data as { user: AuthUser; token: string }
    persist(authUser, authToken)
  }, [persist])

  const logout = useCallback((): void => {
    setUser(null)
    setToken(null)
    localStorage.removeItem('ps_token')
    delete api.defaults.headers.common['Authorization']
  }, [])

  return (
    <AuthContext.Provider value={{ user, token, login, register, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  )
}

// ── Hook ───────────────────────────────────────────────────────────────────

export function useAuth(): AuthContextType {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>')
  return ctx
}