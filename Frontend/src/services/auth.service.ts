// services/auth.service.ts
import { api } from './api'
export const authService = {
  login: (email: string, password: string) => api.post('/auth/login', { email, password }).then(r => r.data),
  register: (data: any) => api.post('/auth/register', data).then(r => r.data),
  getMe: (token: string) => api.get('/auth/me', { headers: { Authorization: `Bearer ${token}` } }).then(r => r.data),
}