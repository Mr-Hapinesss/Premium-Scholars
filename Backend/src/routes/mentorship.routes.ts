import { Router } from 'express'
import { getMyMentees, getMentorStats, getMyMentor } from '../controllers/mentorship.controller.js'
import { authenticate } from '../middleware/auth.middleware.js'
import { requireMentor, requireAny } from '../middleware/role.middleware.js'

const router = Router()

// Mentor and admin can see their mentees
router.get('/my-mentees',   authenticate, requireMentor, getMyMentees)
router.get('/mentor-stats', authenticate, requireMentor, getMentorStats)

// Mentee (or any authenticated user) sees their assigned mentor
router.get('/my-mentor', authenticate, requireAny, getMyMentor)

export default router