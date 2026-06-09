import type { Request, Response } from 'express'
import { User } from '../models/User.model.js'
import { MentorCode } from '../models/MentorCode.model.js'
import { hashPassword, comparePassword } from '../utils/password.utils.js'
import { signToken } from '../utils/jwt.utils.js'
import { sendSuccess, sendError } from '../utils/apiResponse.utils.js'
import crypto from 'crypto'
import { PasswordReset } from '../models/passwordReset.model.js'
import { sendPasswordResetEmail } from '../utils/email.utils.js'

// ─── REGISTER ──────────────────────────────────────────────────────────────
export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, password, university, role, mentorCode } = req.body

    // Basic field check
    if (!name || !email || !password) {
      sendError(res, 'Name, email and password are required')
      return
    }

    // Reject invalid role escalation
    const allowedRoles = ['mentor', 'mentee']
    const targetRole   = role && allowedRoles.includes(role) ? role : 'mentee'

    // Check email uniqueness
    const existing = await User.findOne({ email: email.toLowerCase().trim() })
    if (existing) {
      sendError(res, 'An account with this email already exists', 409)
      return
    }

    // Mentor code validation
    if (targetRole === 'mentor') {
      if (!mentorCode) {
        sendError(res, 'A mentor verification code is required to register as a mentor')
        return
      }
      const code = await MentorCode.findOne({ code: mentorCode.toUpperCase().trim() })
      if (!code) {
        sendError(res, 'Invalid mentor code')
        return
      }
      if (code.isUsed) {
        sendError(res, 'This mentor code has already been used')
        return
      }
      // Mark code as used immediately — will also set usedBy after user creation below
      code.isUsed = true
      const hashed  = await hashPassword(password)
      const user    = await User.create({ name: name.trim(), email: email.toLowerCase().trim(), password: hashed, university, role: targetRole })
      code.usedBy   = user._id
      await code.save()

      const token = signToken(user._id, user.role)
      sendSuccess(res, { user, token }, 201, 'Mentor account created')
      return
    }

    // Regular mentee registration
    const hashed = await hashPassword(password)
    const user   = await User.create({ name: name.trim(), email: email.toLowerCase().trim(), password: hashed, university, role: targetRole })
    const token  = signToken(user._id, user.role)
    sendSuccess(res, { user, token }, 201, 'Account created')
  } catch (err: any) {
    sendError(res, err.message || 'Registration failed', 500)
  }
}

// ─── LOGIN ─────────────────────────────────────────────────────────────────
export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      sendError(res, 'Email and password are required')
      return
    }

    // Explicitly select password (it is select: false in schema)
    const user = await User.findOne({ email: email.toLowerCase().trim() }).select('+password')
    if (!user) {
      sendError(res, 'Invalid credentials', 401)
      return
    }

    const match = await comparePassword(password, user.password)
    if (!match) {
      sendError(res, 'Invalid credentials', 401)
      return
    }

    const token = signToken(user._id, user.role)

    // Strip password before sending
    const userObj = user.toJSON()
    sendSuccess(res, { user: userObj, token })
  } catch (err: any) {
    sendError(res, err.message || 'Login failed', 500)
  }
}

// ─── GET ME ────────────────────────────────────────────────────────────────
export const getMe = async (req: Request, res: Response): Promise<void> => {
  try {
    // req.user is set by authenticate middleware
    sendSuccess(res, req.user)
  } catch (err: any) {
    sendError(res, err.message, 500)
  }
}

// Validate mentor code (for frontend to check before showing mentor registration form)

export const validateMentorCode = async (req: Request, res: Response): Promise<void> => {
  try {
    const { code } = req.body
    if (!code) { sendError(res, 'Code is required'); return }

    const record = await MentorCode.findOne({ code: code.toUpperCase().trim() })
    if (!record)       { sendError(res, 'Invalid code', 404); return }
    if (record.isUsed) { sendError(res, 'This code has already been used', 409); return }

    sendSuccess(res, { valid: true }, 200, 'Code is valid')
  } catch (err: any) {
    sendError(res, err.message, 500)
  }
}

// ─── UPDATE PROFILE ───────────────────────────────────────────────────────
export const updateProfile = async (req: Request, res: Response): Promise<void> => {
  try {
    const { whatsapp, university, name } = req.body
    const user = await User.findById(req.user!._id)
    if (!user) { sendError(res, 'User not found', 404); return }

    if (name       !== undefined) user.name       = name.trim()
    if (university !== undefined) user.university = university.trim()

    if (whatsapp !== undefined) {
      if (whatsapp === '' || whatsapp === null) {
        user.whatsapp = null
      } else {
        // Normalise — strip spaces and dashes
        const cleaned = whatsapp.replace(/[\s\-]/g, '')
        // Basic E.164-ish validation
        if (!/^\+?[1-9]\d{6,14}$/.test(cleaned)) {
          sendError(res, 'Invalid phone number. Use international format e.g. +254712345678')
          return
        }
        user.whatsapp = cleaned
      }
    }

    await user.save()
    sendSuccess(res, user.toJSON(), 200, 'Profile updated')
  } catch (err: any) {
    sendError(res, err.message || 'Update failed', 500)
  }
}

// ─── FORGOT PASSWORD ────────────────────────────────────────────────────────
// POST /api/auth/forgot-password
export const forgotPassword = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email } = req.body

    if (!email) {
      sendError(res, 'Email is required')
      return
    }

    const user = await User.findOne({ email: email.toLowerCase().trim() })

    // Always return success even if email not found — prevents email enumeration
    // attacks where an attacker probes which emails are registered
    if (!user) {
      sendSuccess(
        res,
        null,
        200,
        'If an account with that email exists, a reset link has been sent.'
      )
      return
    }

    // Delete any existing unused tokens for this user
    await PasswordReset.deleteMany({ userId: user._id, used: false })

    // Generate a secure token
    const token     = crypto.randomBytes(32).toString('hex')
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000)  // 1 hour

    await PasswordReset.create({
      userId: user._id,
      token,
      expiresAt,
    })

    const resetUrl = `${process.env.CLIENT_URL}/reset-password?token=${token}`

    try {
      await sendPasswordResetEmail(user.email, user.name, resetUrl)
    } catch (emailErr) {
      // Email failed — delete the token so user can try again
      await PasswordReset.deleteMany({ userId: user._id })
      sendError(res, 'Failed to send reset email. Please try again later.', 500)
      return
    }

    sendSuccess(
      res,
      null,
      200,
      'If an account with that email exists, a reset link has been sent.'
    )
  } catch (err: any) {
    sendError(res, err.message || 'Something went wrong', 500)
  }
}

// ─── RESET PASSWORD ─────────────────────────────────────────────────────────
// POST /api/auth/reset-password
export const resetPassword = async (req: Request, res: Response): Promise<void> => {
  try {
    const { token, password } = req.body

    if (!token || !password) {
      sendError(res, 'Token and new password are required')
      return
    }

    if (password.length < 6) {
      sendError(res, 'Password must be at least 6 characters')
      return
    }

    // Find valid token
    const resetRecord = await PasswordReset.findOne({ token, used: false })

    if (!resetRecord) {
      sendError(res, 'Invalid or expired reset link. Please request a new one.', 400)
      return
    }

    if (new Date() > resetRecord.expiresAt) {
      await resetRecord.deleteOne()
      sendError(res, 'This reset link has expired. Please request a new one.', 410)
      return
    }

    // Find the user
    const user = await User.findById(resetRecord.userId)
    if (!user) {
      sendError(res, 'Account not found', 404)
      return
    }

    // Hash and save new password
    const hashed  = await hashPassword(password)
    user.password = hashed
    await user.save()

    // Mark token as used
    resetRecord.used = true
    await resetRecord.save()

    // Sign a new JWT so they are logged in immediately after reset
    const authToken = signToken(user._id, user.role)

    sendSuccess(
      res,
      { user: user.toJSON(), token: authToken },
      200,
      'Password reset successfully'
    )
  } catch (err: any) {
    sendError(res, err.message || 'Reset failed', 500)
  }
}

// ─── VALIDATE RESET TOKEN (frontend checks before showing form) ─────────────
// GET /api/auth/validate-reset-token?token=xxx
export const validateResetToken = async (req: Request, res: Response): Promise<void> => {
  try {
    const { token } = req.query as { token: string }

    if (!token) {
      sendError(res, 'Token is required')
      return
    }

    const record = await PasswordReset.findOne({ token, used: false })

    if (!record) {
      sendError(res, 'Invalid or expired reset link', 400)
      return
    }

    if (new Date() > record.expiresAt) {
      sendError(res, 'This reset link has expired', 410)
      return
    }

    sendSuccess(res, { valid: true, expiresAt: record.expiresAt }, 200, 'Token is valid')
  } catch (err: any) {
    sendError(res, err.message, 500)
  }
}