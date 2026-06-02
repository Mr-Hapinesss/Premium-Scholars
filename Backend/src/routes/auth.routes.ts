import { Router } from 'express'
import { register, login, getMe, validateMentorCode, updateProfile } from '../controllers/auth.controller.js'
import { authenticate } from '../middleware/auth.middleware.js'
import { validate } from '../middleware/validate.middleware.js'


const router = Router()

router.post(
  '/register',
  validate([
    { field: 'name',     required: true, type: 'string', min: 2, max: 100 },
    { field: 'email',    required: true, type: 'email' },
    { field: 'password', required: true, type: 'string', min: 6 },
  ]),
  register
)

router.post(
  '/login',
  validate([
    { field: 'email',    required: true, type: 'email' },
    { field: 'password', required: true },
  ]),
  login
)

router.get('/me', authenticate, getMe)

router.patch('/profile', authenticate, updateProfile)

// Lightweight endpoint to check if a mentor code is valid before form submit
router.post('/validate-mentor-code', validateMentorCode)

export default router