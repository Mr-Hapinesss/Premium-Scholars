import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { User, RegisterPayload } from '../types/user.types'
import { api } from '../services/api'
import { signToken } from '../utils/jwt.utils' // not needed — backend signs it

interface AuthContextType {
  user: User | null
  token: string | null
  login:    (email: string, password: string) => Promise<void>
  register: (data: RegisterPayload) => Promise<void>
  logout:   () => void
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user,      setUser]      = useState<User | null>(null)
  const [token,     setToken]     = useState<string | null>(localStorage.getItem('ps_token'))
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!token) { setIsLoading(false); return }
    api.get('/auth/me')
      .then(res => setUser(res.data.data))
      .catch(() => {
        localStorage.removeItem('ps_token')
        setToken(null)
      })
      .finally(() => setIsLoading(false))
  }, [token])

  const persist = (u: User, t: string) => {
    setUser(u)
    setToken(t)
    localStorage.setItem('ps_token', t)
    // Pre-set token on axios instance immediately so subsequent calls in the same tick work
    api.defaults.headers.common['Authorization'] = `Bearer ${t}`
  }

  const login = async (email: string, password: string) => {
    const res = await api.post('/auth/login', { email, password })
    persist(res.data.data.user, res.data.data.token)
  }

  const register = async (data: RegisterPayload) => {
    const res = await api.post('/auth/register', data)
    persist(res.data.data.user, res.data.data.token)
  }

  const logout = () => {
    setUser(null)
    setToken(null)
    localStorage.removeItem('ps_token')
    delete api.defaults.headers.common['Authorization']
  }

  return (
    <AuthContext.Provider value={{ user, token, login, register, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be inside AuthProvider')
  return ctx
}