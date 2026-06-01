import type { Request, Response } from 'express'
import crypto from 'crypto'
import { AdminInvite } from '../models/AdminInvite.model.js'
import { User } from '../models/User.model.js'
import { hashPassword } from '../utils/password.utils.js'
import { signToken } from '../utils/jwt.utils.js'
import { sendSuccess, sendError } from '../utils/apiResponse.utils.js'

// ─── GENERATE ADMIN INVITE (existing admin only) ────────────────────────────
// POST /api/admin-auth/invite
// Body: { email?: string, expiresInHours?: number }
export const generateAdminInvite = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, expiresInHours = 24 } = req.body

    // Generate a cryptographically secure token
    const token = crypto.randomBytes(32).toString('hex')

    // Calculate expiry
    const expiresAt = new Date()
    expiresAt.setHours(expiresAt.getHours() + Number(expiresInHours))

    const invite = await AdminInvite.create({
      token,
      email:     email?.toLowerCase().trim() || null,
      expiresAt,
      createdBy: req.user!._id,
    })

    // The invite URL the admin shares
    const inviteUrl = `${process.env.FRONTEND_URL}/admin/register?token=${token}`

    sendSuccess(res, {
      inviteUrl,
      token,
      expiresAt,
      lockedToEmail: invite.email || null,
    }, 201, 'Admin invite generated')
  } catch (err: any) {
    sendError(res, err.message || 'Failed to generate invite', 500)
  }
}

// ─── VALIDATE TOKEN (frontend checks before showing the form) ───────────────
// GET /api/admin-auth/validate-invite?token=xxx
export const validateAdminInvite = async (req: Request, res: Response): Promise<void> => {
  try {
    const { token } = req.query as { token: string }

    if (!token) {
      sendError(res, 'Token is required')
      return
    }

    const invite = await AdminInvite.findOne({ token })

    if (!invite) {
      sendError(res, 'Invalid invite token', 404)
      return
    }

    if (invite.isUsed) {
      sendError(res, 'This invite has already been used', 409)
      return
    }

    if (new Date() > invite.expiresAt) {
      sendError(res, 'This invite has expired', 410)
      return
    }

    sendSuccess(res, {
      valid:         true,
      lockedEmail:   invite.email || null,
      expiresAt:     invite.expiresAt,
    }, 200, 'Token is valid')
  } catch (err: any) {
    sendError(res, err.message || 'Validation failed', 500)
  }
}

// ─── ADMIN REGISTER (consume invite + create admin user) ───────────────────
// POST /api/admin-auth/register
// Body: { token, name, email, password, university? }
export const adminRegister = async (req: Request, res: Response): Promise<void> => {
  try {
    const { token, name, email, password, university } = req.body

    if (!token || !name || !email || !password) {
      sendError(res, 'Token, name, email and password are all required')
      return
    }

    if (password.length < 8) {
      sendError(res, 'Admin password must be at least 8 characters')
      return
    }

    // Find and validate the invite
    const invite = await AdminInvite.findOne({ token })

    if (!invite) {
      sendError(res, 'Invalid invite token', 404)
      return
    }

    if (invite.isUsed) {
      sendError(res, 'This invite has already been used', 409)
      return
    }

    if (new Date() > invite.expiresAt) {
      sendError(res, 'This invite has expired. Request a new one.', 410)
      return
    }

    // If the invite was locked to a specific email, enforce it
    if (invite.email && invite.email !== email.toLowerCase().trim()) {
      sendError(res, `This invite was issued for ${invite.email}`, 403)
      return
    }

    // Check email is not already taken
    const existingUser = await User.findOne({ email: email.toLowerCase().trim() })
    if (existingUser) {
      sendError(res, 'An account with this email already exists', 409)
      return
    }

    // Hash password and create admin user
    const hashed = await hashPassword(password)
    const admin  = await User.create({
      name:       name.trim(),
      email:      email.toLowerCase().trim(),
      password:   hashed,
      role:       'admin',
      university: university?.trim() || undefined,
    })

    // Mark invite as used
    invite.isUsed = true
    invite.usedBy = admin._id
    await invite.save()

    // Sign token and return
    const authToken = signToken(admin._id, admin.role)

    sendSuccess(res, {
      user:  admin.toJSON(),
      token: authToken,
    }, 201, 'Admin account created successfully')
  } catch (err: any) {
    sendError(res, err.message || 'Registration failed', 500)
  }
}

// ─── LIST ALL INVITES (admin overview) ─────────────────────────────────────
// GET /api/admin-auth/invites
export const listAdminInvites = async (req: Request, res: Response): Promise<void> => {
  try {
    const invites = await AdminInvite.find()
      .populate('createdBy', 'name email')
      .populate('usedBy',    'name email')
      .sort({ createdAt: -1 })
      .lean()

    sendSuccess(res, invites)
  } catch (err: any) {
    sendError(res, err.message || 'Failed to fetch invites', 500)
  }
}

// ─── REVOKE INVITE ──────────────────────────────────────────────────────────
// DELETE /api/admin-auth/invites/:id
export const revokeAdminInvite = async (req: Request, res: Response): Promise<void> => {
  try {
    const invite = await AdminInvite.findById(req.params.id)

    if (!invite) {
      sendError(res, 'Invite not found', 404)
      return
    }

    if (invite.isUsed) {
      sendError(res, 'Cannot revoke an already-used invite', 400)
      return
    }

    await invite.deleteOne()
    sendSuccess(res, null, 200, 'Invite revoked')
  } catch (err: any) {
    sendError(res, err.message || 'Failed to revoke invite', 500)
  }
}