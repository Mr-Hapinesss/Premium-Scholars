import jwt from 'jsonwebtoken'
import { env } from '../config/env'
import { Types } from 'mongoose'
import { UserRole } from '../models/User.model'

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