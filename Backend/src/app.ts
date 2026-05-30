import express from 'express'
import cors from 'cors'
import path from 'path'
import fs from 'fs'
import { authLimiter, apiLimiter } from './middleware/rateLimiter.middleware'
import { notFoundHandler }   from './middleware/notFound.middleware'
import { globalErrorHandler } from './middleware/errorHandler.middleware'


import authRoutes        from './routes/auth.routes'
import beautyRoutes      from './routes/beauty.routes'
import mentorshipRoutes  from './routes/mentorship.routes'
import requirementsRoutes from './routes/requirements.routes'
import newsRoutes        from './routes/news.routes'
import adminRoutes       from './routes/admin.routes'

const app = express()

// ── CORS ──
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
}))
app.use('/api', apiLimiter)
app.use('/api/auth/login',    authLimiter)
app.use('/api/auth/register', authLimiter)

// ── BODY PARSING ──
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true }))

// ── STATIC FILE SERVING (uploads) ──
// Ensure upload directories exist on startup
const uploadDirs = ['uploads/beauty', 'uploads/requirements', 'uploads/news']
uploadDirs.forEach(dir => {
  const full = path.join(__dirname, '..', dir)
  if (!fs.existsSync(full)) fs.mkdirSync(full, { recursive: true })
})
app.use('/uploads', express.static(path.join(__dirname, '../uploads')))

// ── API ROUTES ──
app.use('/api/auth',         authRoutes)
app.use('/api/beauty',       beautyRoutes)
app.use('/api/mentorship',   mentorshipRoutes)
app.use('/api/requirements', requirementsRoutes)
app.use('/api/news',         newsRoutes)
app.use('/api/admin',        adminRoutes)
app.use(notFoundHandler)
app.use(globalErrorHandler)

// ── HEALTH CHECK ──
app.get('/api/health', (_req, res) => res.json({ status: 'ok', timestamp: new Date().toISOString() }))

// ── GLOBAL ERROR HANDLER ──
// The global error handler is already registered above with `app.use(globalErrorHandler)`

export default app