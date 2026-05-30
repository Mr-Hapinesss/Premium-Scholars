export type UserRole = 'admin' | 'mentor' | 'mentee'

export interface User {
  _id: string
  name: string
  email: string
  role: UserRole
  university?: string
  mentorId?: string | null
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface AuthResponse {
  user: User
  token: string
}

export interface RegisterPayload {
  name: string
  email: string
  password: string
  university?: string
  role: 'mentor' | 'mentee'
  mentorCode?: string
}