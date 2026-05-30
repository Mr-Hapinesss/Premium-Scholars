import { Request, Response, NextFunction } from 'express'
import { Error as MongooseError } from 'mongoose'

export const globalErrorHandler = (
  err: any,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  console.error('[GLOBAL ERROR]', err?.message || err)

  // Mongoose validation error
  if (err instanceof MongooseError.ValidationError) {
    const messages = Object.values(err.errors).map((e: any) => e.message)
    res.status(400).json({ success: false, message: messages.join('. ') })
    return
  }

  // Mongoose duplicate key (unique constraint violation)
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue || {})[0] || 'field'
    res.status(409).json({ success: false, message: `${field} already exists` })
    return
  }

  // Mongoose bad ObjectId
  if (err instanceof MongooseError.CastError) {
    res.status(400).json({ success: false, message: `Invalid ${err.path}: ${err.value}` })
    return
  }

  // JWT errors (caught in middleware too, but belt-and-suspenders)
  if (err.name === 'JsonWebTokenError') {
    res.status(401).json({ success: false, message: 'Invalid token' })
    return
  }
  if (err.name === 'TokenExpiredError') {
    res.status(401).json({ success: false, message: 'Token expired' })
    return
  }

  // Multer file size error
  if (err.code === 'LIMIT_FILE_SIZE') {
    res.status(400).json({ success: false, message: 'File too large. Maximum size is 5MB.' })
    return
  }

  // Multer file type error (thrown manually in fileFilter)
  if (err.message?.startsWith('Invalid file type')) {
    res.status(400).json({ success: false, message: err.message })
    return
  }

  // Generic fallback
  const status  = err.status || err.statusCode || 500
  const message = err.message || 'Internal server error'
  res.status(status).json({ success: false, message })
}