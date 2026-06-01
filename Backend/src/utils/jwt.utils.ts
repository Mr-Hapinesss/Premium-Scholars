import jwt from 'jsonwebtoken'
import { env } from '../config/env.js'
import { Types } from 'mongoose'
import type { UserRole } from '../models/User.model.js'

export interface JwtPayload {
  id: string
  role: UserRole
}

export const signToken = (id: Types.ObjectId, role: UserRole): string => {
  return jwt.sign({ id: id.toString(), role }, env.JWT_SECRET, {
    expiresIn: env.JWT_EXPIRES as any,
  })
}

export const verifyToken = (token: string): JwtPayload => {
  return jwt.verify(token, env.JWT_SECRET) as JwtPayload
}