import type { Request, Response } from 'express'
import { User } from '../models/User.model.js'
import { MentorCode } from '../models/MentorCode.model.js'
import { Order } from '../models/Order.model.js'
import { generateMentorCode } from '../utils/mentorCode.utils.js'
import { sendSuccess, sendError } from '../utils/apiResponse.utils.js'
import { assignMentee } from './mentorship.controller.js'


// ─── DELETE USER ──────────────────────────────────────────────────────────
export const deleteUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = await User.findById(req.params.id)
    if (!user) { sendError(res, 'User not found', 404); return }

    // Prevent admin from deleting themselves
    if (user._id.toString() === req.user!._id.toString()) {
      sendError(res, 'You cannot delete your own admin account')
      return
    }

    // If deleting a mentor: unassign all their mentees
    if (user.role === 'mentor') {
      await User.updateMany({ mentorId: user._id }, { $set: { mentorId: null } })
    }

    await user.deleteOne()
    sendSuccess(res, null, 200, 'User deleted')
  } catch (err: any) {
    sendError(res, err.message, 500)
  }
}

// ─── GET ALL MENTORS with mentee counts ───────────────────────────────────
export const getAllMentors = async (req: Request, res: Response): Promise<void> => {
  try {
    const mentors = await User.find({ role: 'mentor' })
      .select('name email university whatsapp createdAt')
      .sort({ createdAt: -1 })
      .lean()

    // Attach mentee count for each mentor
    const mentorIds = mentors.map(m => m._id)
    const counts    = await User.aggregate([
      { $match: { role: 'mentee', mentorId: { $in: mentorIds } } },
      { $group: { _id: '$mentorId', count: { $sum: 1 } } },
    ])
    const countMap = new Map(counts.map(c => [c._id.toString(), c.count]))

    const result = mentors.map(m => ({
      ...m,
      menteeCount: countMap.get(m._id.toString()) || 0,
    }))

    sendSuccess(res, result)
  } catch (err: any) {
    sendError(res, err.message, 500)
  }
}

// ─── GET MENTEE BY ID (admin search — no "get all mentees" endpoint) ───────
export const getMenteeById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    if (!id || typeof id !== 'string') {
      sendError(res, 'Invalid mentee ID', 400);
      return;
    }

    const mentee = await User.findOne({ _id: id, role: 'mentee' })
      .select('name email university mentorId whatsapp createdAt')
      .lean()

    if (!mentee) { sendError(res, 'Mentee not found', 404); return }

    // Resolve mentor name if assigned
    let mentorName: string | null = null
    if (mentee.mentorId) {
      const mentor = await User.findById(mentee.mentorId).select('name').lean()
      mentorName   = mentor?.name || null
    }

    sendSuccess(res, { ...mentee, mentorName })
  } catch (err: any) {
    sendError(res, err.message, 500)
  }
}

// ─── GENERATE MENTOR CODE ─────────────────────────────────────────────────
export const createMentorCode = async (req: Request, res: Response): Promise<void> => {
  try {
    // Generate a unique code (retry up to 5 times on collision)
    let code = ''
    let attempts = 0
    while (attempts < 5) {
      const candidate = generateMentorCode()
      const exists    = await MentorCode.findOne({ code: candidate })
      if (!exists) { code = candidate; break }
      attempts++
    }
    if (!code) { sendError(res, 'Failed to generate unique code, try again', 500); return }

    const record = await MentorCode.create({ code, createdBy: req.user!._id })
    sendSuccess(res, record, 201, `Mentor code generated: ${code}`)
  } catch (err: any) {
    sendError(res, err.message, 500)
  }
}

// ─── GET ALL MENTOR CODES (with usage status) ─────────────────────────────
export const getMentorCodes = async (req: Request, res: Response): Promise<void> => {
  try {
    const codes = await MentorCode.find()
      .populate('usedBy', 'name email')
      .sort({ createdAt: -1 })
      .lean()
    sendSuccess(res, codes)
  } catch (err: any) {
    sendError(res, err.message, 500)
  }
}

// ─── REVOKE MENTOR CODE ───────────────────────────────────────────────────
export const revokeMentorCode = async (req: Request, res: Response): Promise<void> => {
  try {
    const code = await MentorCode.findById(req.params.id)
    if (!code) { sendError(res, 'Code not found', 404); return }
    if (code.isUsed) { sendError(res, 'Cannot revoke an already-used code'); return }

    await code.deleteOne()
    sendSuccess(res, null, 200, 'Code revoked')
  } catch (err: any) {
    sendError(res, err.message, 500)
  }
}

// ─── ASSIGN MENTEE TO MENTOR ──────────────────────────────────────────────
// Delegates to mentorship controller
export { assignMentee }

// ─── DASHBOARD SUMMARY ────────────────────────────────────────────────────
export const getDashboardSummary = async (req: Request, res: Response): Promise<void> => {
  try {
    const [totalUsers, totalMentors, totalMentees, totalOrders, pendingOrders] = await Promise.all([
      User.countDocuments(),
      User.countDocuments({ role: 'mentor' }),
      User.countDocuments({ role: 'mentee' }),
      Order.countDocuments(),
      Order.countDocuments({ status: 'pending' }),
    ])

    sendSuccess(res, { totalUsers, totalMentors, totalMentees, totalOrders, pendingOrders })
  } catch (err: any) {
    sendError(res, err.message, 500)
  }
}

// ─── GET ALL ORDERS (admin view) ──────────────────────────────────────────
export const getAllOrders = async (req: Request, res: Response): Promise<void> => {
  try {
    const { status, section, page = '1', limit = '20' } = req.query as Record<string, string>
    const filter: any = {}
    if (status)  filter.status  = status
    if (section) filter.section = section

    const skip   = (parseInt(page) - 1) * parseInt(limit)
    const total  = await Order.countDocuments(filter)
    const orders = await Order.find(filter)
      .populate('userId', 'name email university')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .lean()

    sendSuccess(res, { orders, total })
  } catch (err: any) {
    sendError(res, err.message, 500)
  }
}

// ─── UPDATE ORDER STATUS ──────────────────────────────────────────────────
export const updateOrderStatus = async (req: Request, res: Response): Promise<void> => {
  try {
    const { status } = req.body
    const allowed = ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled']
    if (!allowed.includes(status)) { sendError(res, 'Invalid status'); return }

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    )
    if (!order) { sendError(res, 'Order not found', 404); return }
    sendSuccess(res, order, 200, 'Order status updated')
  } catch (err: any) {
    sendError(res, err.message, 500)
  }
}

// get all users
export const getAllUsers = async (req: Request, res: Response): Promise<void> => {
  try {
    const { role, search, page = '1', limit = '50' } = req.query as Record<string, string>

    const filter: any = {}
    if (role)   filter.role = role
    if (search) filter.$text = { $search: search }

    const skip  = (parseInt(page) - 1) * parseInt(limit)
    const total = await User.countDocuments(filter)
    const users = await User.find(filter)
      .select('name email role university isActive createdAt')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .lean()

    sendSuccess(res, { users, total, page: parseInt(page), pages: Math.ceil(total / parseInt(limit)) })
  } catch (err: any) {
    sendError(res, err.message, 500)
  }
}


// ─── GET UNASSIGNED MENTEES ────────────────────────────────────────────────
// GET /api/admin/unassigned-mentees
export const getUnassignedMentees = async (req: Request, res: Response): Promise<void> => {
  try {
    const { page = '1', limit = '20', search = '' } = req.query as Record<string, string>

    const filter: any = {
      role:     'mentee',
      mentorId: null,
    }

    if (search.trim()) {
      filter.$or = [
        { name:       { $regex: search.trim(), $options: 'i' } },
        { email:      { $regex: search.trim(), $options: 'i' } },
        { university: { $regex: search.trim(), $options: 'i' } },
      ]
    }

    const skip  = (parseInt(page) - 1) * parseInt(limit)
    const total = await User.countDocuments(filter)
    const mentees = await User.find(filter)
      .select('name email university createdAt')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .lean()

    sendSuccess(res, { mentees, total })
  } catch (err: any) {
    sendError(res, err.message || 'Failed to fetch unassigned mentees', 500)
  }
}