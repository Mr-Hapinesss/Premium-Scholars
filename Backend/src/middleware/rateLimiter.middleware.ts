import { Request, Response, NextFunction } from 'express'

interface RateLimitEntry {
  count:     number
  resetTime: number
}

const store = new Map<string, RateLimitEntry>()

interface RateLimitOptions {
  windowMs:    number   // time window in ms
  maxRequests: number   // max hits in that window
  message:     string
}

const createLimiter = ({ windowMs, maxRequests, message }: RateLimitOptions) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    // Key by IP — behind a proxy, trust X-Forwarded-For
    const ip  = (req.headers['x-forwarded-for'] as string)?.split(',')[0]?.trim() || req.ip || 'unknown'
    const key = `${req.path}:${ip}`
    const now = Date.now()

    const entry = store.get(key)

    if (!entry || now > entry.resetTime) {
      store.set(key, { count: 1, resetTime: now + windowMs })
      next()
      return
    }

    if (entry.count >= maxRequests) {
      const retryAfter = Math.ceil((entry.resetTime - now) / 1000)
      res.setHeader('Retry-After', retryAfter)
      res.status(429).json({ success: false, message: `${message} Try again in ${retryAfter}s.` })
      return
    }

    entry.count++
    next()
  }
}

// Pre-configured limiters
export const authLimiter = createLimiter({
  windowMs:    15 * 60 * 1000,  // 15 minutes
  maxRequests: 10,               // 10 login/register attempts
  message:     'Too many authentication attempts.',
})

export const apiLimiter = createLimiter({
  windowMs:    60 * 1000,        // 1 minute
  maxRequests: 100,              // general API calls
  message:     'Too many requests.',
})

// Clean up expired entries every 10 minutes to prevent memory leak
setInterval(() => {
  const now = Date.now()
  store.forEach((entry, key) => {
    if (now > entry.resetTime) store.delete(key)
  })
}, 10 * 60 * 1000)