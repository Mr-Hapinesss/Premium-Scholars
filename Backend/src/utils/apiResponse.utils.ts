import type { Response } from 'express'

export const sendSuccess = (res: Response, data: any, statusCode = 200, message = 'Success') => {
  return res.status(statusCode).json({ success: true, message, data })
}

export const sendError = (res: Response, message: string, statusCode = 400) => {
  return res.status(statusCode).json({ success: false, message })
}