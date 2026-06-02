import type { Request, Response } from 'express'
import { User } from '../models/User.model.js'
import { sendSuccess, sendError } from '../utils/apiResponse.utils.js'

// ─── GET MY MENTEES (mentor sees own mentees only) ─────────────────────────
export const getMyMentees = async (req: Request, res: Response): Promise<void> => {
  try {
    // In mentorship.controller.ts, getMyMentees:
    const mentees = await User.find({ mentorId: req.user!._id, role: 'mentee' })
     .select('name email university whatsapp createdAt')
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

// ─── ASSIGN OR UNASSIGN MENTEE ─────────────────────────────────────────────
// PATCH /api/admin/assign-mentee
// Body: { menteeId, mentorId } — pass mentorId as null to unassign
export const assignMentee = async (req: Request, res: Response): Promise<void> => {
  try {
    const { menteeId, mentorId } = req.body

    if (!menteeId) {
      sendError(res, 'menteeId is required')
      return
    }

    const mentee = await User.findById(menteeId)
    if (!mentee || mentee.role !== 'mentee') {
      sendError(res, 'Mentee not found', 404)
      return
    }

    // mentorId === null means unassign
    if (mentorId === null || mentorId === '') {
      mentee.mentorId = null
      await mentee.save()
      sendSuccess(res, { menteeId, mentorId: null }, 200, 'Mentee unassigned successfully')
      return
    }

    const mentor = await User.findById(mentorId)
    if (!mentor || mentor.role !== 'mentor') {
      sendError(res, 'Mentor not found', 404)
      return
    }

    mentee.mentorId = mentor._id
    await mentee.save()

    sendSuccess(res, {
      menteeId:   mentee._id,
      menteeName: mentee.name,
      mentorId:   mentor._id,
      mentorName: mentor.name,
    }, 200, `${mentee.name} assigned to ${mentor.name}`)
  } catch (err: any) {
    sendError(res, err.message || 'Assignment failed', 500)
  }
}