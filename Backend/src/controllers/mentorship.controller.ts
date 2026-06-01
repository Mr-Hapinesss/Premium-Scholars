import type { Request, Response } from 'express'
import { User } from '../models/User.model.js'
import { sendSuccess, sendError } from '../utils/apiResponse.utils.js'

// ─── GET MY MENTEES (mentor sees own mentees only) ─────────────────────────
export const getMyMentees = async (req: Request, res: Response): Promise<void> => {
  try {
    const mentees = await User.find({ mentorId: req.user!._id, role: 'mentee' })
      .select('name email university createdAt')
      .sort({ createdAt: -1 })
      .lean()

    sendSuccess(res, mentees)
  } catch (err: any) {
    sendError(res, err.message, 500)
  }
}

// ─── GET MENTOR STATS (for mentor dashboard home) ──────────────────────────
export const getMentorStats = async (req: Request, res: Response): Promise<void> => {
  try {
    const menteeCount = await User.countDocuments({ mentorId: req.user!._id, role: 'mentee' })
    sendSuccess(res, { menteeCount })
  } catch (err: any) {
    sendError(res, err.message, 500)
  }
}

// ─── GET MY MENTOR (mentee sees their assigned mentor) ─────────────────────
export const getMyMentor = async (req: Request, res: Response): Promise<void> => {
  try {
    const mentee = req.user!
    if (!mentee.mentorId) {
      sendSuccess(res, null, 200)
      return
    }
    const mentor = await User.findById(mentee.mentorId)
      .select('name email university createdAt')
      .lean()

    sendSuccess(res, mentor)
  } catch (err: any) {
    sendError(res, err.message, 500)
  }
}

// ─── ASSIGN MENTEE TO MENTOR (admin only, called from admin controller) ────
// This is intentionally left here as a utility; the route is wired in admin.routes.ts
export const assignMentee = async (req: Request, res: Response): Promise<void> => {
  try {
    const { menteeId, mentorId } = req.body
    if (!menteeId || !mentorId) {
      sendError(res, 'menteeId and mentorId are required')
      return
    }

    const [mentee, mentor] = await Promise.all([
      User.findById(menteeId),
      User.findById(mentorId),
    ])

    if (!mentee || mentee.role !== 'mentee') { sendError(res, 'Mentee not found', 404); return }
    if (!mentor || mentor.role !== 'mentor')  { sendError(res, 'Mentor not found', 404); return }

    mentee.mentorId = mentor._id
    await mentee.save()

    sendSuccess(res, { menteeId, mentorId }, 200, 'Mentee assigned to mentor')
  } catch (err: any) {
    sendError(res, err.message, 500)
  }
}