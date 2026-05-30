import { Request, Response, NextFunction } from 'express'
import { UserRole } from '../models/User.model'

/**
 * Factory that returns a middleware allowing only the specified roles.
 * Usage: router.get('/admin-only', authenticate, requireRole('admin'), handler)
 */
export const requireRole = (...roles: UserRole[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Not authenticated' })
      return
    }
    if (!roles.includes(req.user.role)) {
      res.status(403).json({
        success: false,
        message: `Access denied. Required role: ${roles.join(' or ')}`,
      })
      return
    }
    next()
  }
}

// Convenience shorthands
export const requireAdmin  = requireRole('admin')
export const requireMentor = requireRole('mentor', 'admin')
export const requireAny    = requireRole('admin', 'mentor', 'mentee')