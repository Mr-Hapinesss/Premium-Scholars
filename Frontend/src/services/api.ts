import axios, { AxiosError } from 'axios'

const BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:5000/api'

export const api = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 15000,
})

// Attach token to every request if present
api.interceptors.request.use(
  config => {
    const token = localStorage.getItem('ps_token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  error => Promise.reject(error)
)

// Handle responses globally
api.interceptors.response.use(
  response => response,
  (error: AxiosError) => {
    const hadToken = Boolean(localStorage.getItem('ps_token'))

    if (error.response?.status === 401 && hadToken) {
      localStorage.removeItem('ps_token')
      delete api.defaults.headers.common['Authorization']
      window.location.replace('/mentorship/login')
    }

    if (error.code === 'ECONNABORTED') {
      return Promise.reject(new Error('Request timed out. Please check your connection.'))
    }

    return Promise.reject(error)
  }
)

export default api