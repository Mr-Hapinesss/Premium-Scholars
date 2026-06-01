import type { Request, Response, NextFunction } from 'express'
import { verifyToken } from '../utils/jwt.utils.js'
import { User } from '../models/User.model.js'
import type { IUser } from '../models/User.model.js'

declare global {
  namespace Express {
    interface Request {
      user?: IUser
    }
  }
}

export const authenticate = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const authHeader = req.headers.authorization
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({ success: false, message: 'No token provided' })
      return
    }

    const token   = authHeader.split(' ')[1]
    if (!token) {
      res.status(401).json({ success: false, message: 'Invalid token format' })
      return
    }
    const decoded = verifyToken(token)

    // No +password select here — controllers that need password call it explicitly
    const user = await User.findById(decoded.id)
    if (!user) {
      res.status(401).json({ success: false, message: 'User no longer exists' })
      return
    }

    req.user = user
    next()
  } catch (err: any) {
    if (err.name === 'TokenExpiredError') {
      res.status(401).json({ success: false, message: 'Session expired, please log in again' })
      return
    }
    res.status(401).json({ success: false, message: 'Invalid token' })
  }
}