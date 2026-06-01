import { Router } from 'express'
import {
  generateAdminInvite,
  validateAdminInvite,
  adminRegister,
  listAdminInvites,
  revokeAdminInvite,
} from '../controllers/adminAuth.controller.js'
import { authenticate } from '../middleware/auth.middleware.js'
import { requireAdmin } from '../middleware/role.middleware.js'
import { authLimiter } from '../middleware/rateLimiter.middleware.js'

const router = Router()

// ── Public (no auth) ──
// Token validation — frontend calls this before rendering the form
router.get('/validate-invite', validateAdminInvite)

// Admin registration using a valid invite token
// Rate-limited to prevent brute-forcing tokens
router.post('/register', authLimiter, adminRegister)

// ── Protected (existing admin only) ──
router.post('/invite',         authenticate, requireAdmin, generateAdminInvite)
router.get('/invites',         authenticate, requireAdmin, listAdminInvites)
router.delete('/invites/:id',  authenticate, requireAdmin, revokeAdminInvite)

export default router