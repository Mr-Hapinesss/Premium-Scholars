import { Router } from 'express'
import {
  getAllUsers,
  deleteUser,
  getAllMentors,
  getMenteeById,
  createMentorCode,
  getMentorCodes,
  revokeMentorCode,
  assignMentee,
  getDashboardSummary,
  getAllOrders,
  updateOrderStatus,
  getUnassignedMentees
} from '../controllers/admin.controller.js'
import { authenticate } from '../middleware/auth.middleware.js'
import { requireAdmin } from '../middleware/role.middleware.js'
import { IMAGE_SPECS } from '../middleware/upload.middleware.js'
import { listAdminInvites, revokeAdminInvite, generateAdminInvite } from '../controllers/adminAuth.controller.js'


const router = Router()

router.post('/admin-invites',        generateAdminInvite)
router.get('/admin-invites',         listAdminInvites)
router.delete('/admin-invites/:id',  revokeAdminInvite)
router.get('/image-specs', (_req, res) => {
  res.json({ success: true, data: IMAGE_SPECS })
})

// All admin routes require authentication + admin role
router.use(authenticate, requireAdmin)

// Dashboard
router.get('/summary', getDashboardSummary)

// Users
router.get('/users',        getAllUsers)
router.delete('/users/:id', deleteUser)

// Mentors
router.get('/mentors', getAllMentors)

// Mentees — no GET ALL; only search by ID
router.get('/mentees/:id', getMenteeById)
router.get('/unassigned-mentees',   getUnassignedMentees)

// Assign mentee to mentor
router.patch('/assign-mentee', assignMentee)

// Mentor codes
router.get('/mentor-codes',         getMentorCodes)
router.post('/mentor-codes',        createMentorCode)
router.delete('/mentor-codes/:id',  revokeMentorCode)

// Orders
router.get('/orders',              getAllOrders)
router.patch('/orders/:id/status', updateOrderStatus)

export default router