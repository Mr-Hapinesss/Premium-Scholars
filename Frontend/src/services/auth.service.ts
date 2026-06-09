// services/auth.service.ts
import { api } from './api'
export const authService = {
  login: (email: string, password: string) => api.post('/auth/login', { email, password }).then(r => r.data),
  register: (data: any) => api.post('/auth/register', data).then(r => r.data),
  getMe: (token: string) => api.get('/auth/me', { headers: { Authorization: `Bearer ${token}` } }).then(r => r.data),
}


export const profileService = {
  updateProfile: (data: {
    name?:       string
    university?: string
    whatsapp?:   string | null
  }) => api.patch('/auth/profile', data).then(r => r.data.data),
}

export const passwordService = {
  forgotPassword: (email: string) =>
    api.post('/auth/forgot-password', { email }).then(r => r.data),

  validateResetToken: (token: string) =>
    api.get('/auth/validate-reset-token', { params: { token } }).then(r => r.data.data),

  resetPassword: (token: string, password: string) =>
    api.post('/auth/reset-password', { token, password }).then(r => r.data.data),
}