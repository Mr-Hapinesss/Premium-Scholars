// This file sets up the Express application, including middleware, routes, and error handling. It is imported by server.ts to start the server.

import express from 'express'
import cors from 'cors'
import path from 'path'
import { fileURLToPath } from 'url';
import fs from 'fs'
import { authLimiter, apiLimiter } from './middleware/rateLimiter.middleware.js'
import { notFoundHandler }   from './middleware/notFound.middleware.js'
import { globalErrorHandler } from './middleware/errorHandler.middleware.js'


import authRoutes        from './routes/auth.routes.js'
import beautyRoutes      from './routes/beauty.routes.js'
import mentorshipRoutes  from './routes/mentorship.routes.js'
import requirementsRoutes from './routes/requirements.routes.js'
import newsRoutes        from './routes/news.routes.js'
import adminRoutes       from './routes/admin.routes.js'
import adminAuthRoutes from './routes/adminAuth.routes.js'


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
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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
app.use('/api/admin-auth', adminAuthRoutes)



// ── HEALTH CHECK ──
app.get('/api/health', (_req: any, res: { json: (arg0: { status: string; timestamp: string }) => any }) => 
  res.json({ status: 'ok', timestamp: new Date().toISOString() }))

app.get('/', (req, res) => {
  res.status(200).json({
    message: "Premium Scholars API Backend is running perfectly!",
    status: "healthy",
    timestamp: new Date()
  });
});

// ── GLOBAL ERROR HANDLER ──
app.use(notFoundHandler)
app.use(globalErrorHandler)

export default app