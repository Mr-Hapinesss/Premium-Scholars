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
} from '../controllers/admin.controller'
import { authenticate } from '../middleware/auth.middleware'
import { requireAdmin } from '../middleware/role.middleware'

const router = Router()

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