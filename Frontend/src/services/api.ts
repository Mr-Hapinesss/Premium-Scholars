import axios from 'axios'

export const api = axios.create({
  baseURL:        import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  headers:        { 'Content-Type': 'application/json' },
  timeout:        15000,  // 15 seconds — fail fast
  withCredentials: false,
})

api.interceptors.request.use(config => {
  const token = localStorage.getItem('ps_token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

api.interceptors.response.use(
  res => res,
  err => {
    // Only force-logout on 401 if the user actually had a token
    // (i.e. their session expired, not just an unauthenticated public request)
    const hadToken = !!localStorage.getItem('ps_token')
    if (err.response?.status === 401 && hadToken) {
      localStorage.removeItem('ps_token')
      // Use replace so the browser back button doesn't loop
      window.location.replace('/mentorship/login')
    }
    return Promise.reject(err)
  }
)