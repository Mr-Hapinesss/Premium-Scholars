import { Request, Response, NextFunction } from 'express'

export const notFoundHandler = (req: Request, _res: Response, next: NextFunction): void => {
  const err: any = new Error(`Cannot ${req.method} ${req.originalUrl}`)
  err.status = 404
  next(err)
}