import { Request, Response } from 'express'
import { NewsPost } from '../models/NewsPost.model'
import { sendSuccess, sendError } from '../utils/apiResponse.utils'
import { buildFileUrl } from '../middleware/upload.middleware'
import fs from 'fs'
import path from 'path'
import { sanitizeHtml, sanitizeField } from '../utils/sanitize.utils'


// ─── GET ALL (public, newest first) ───────────────────────────────────────
export const getAll = async (req: Request, res: Response): Promise<void> => {
  try {
    const { page = '1', limit = '10' } = req.query as Record<string, string>
    const skip  = (parseInt(page) - 1) * parseInt(limit)
    const total = await NewsPost.countDocuments()
    const posts = await NewsPost.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .lean()

    sendSuccess(res, { posts, total, page: parseInt(page), pages: Math.ceil(total / parseInt(limit)) })
  } catch (err: any) {
    sendError(res, err.message, 500)
  }
}

// ─── GET ONE ───────────────────────────────────────────────────────────────
export const getById = async (req: Request, res: Response): Promise<void> => {
  try {
    const post = await NewsPost.findById(req.params.id).lean()
    if (!post) { sendError(res, 'Post not found', 404); return }
    sendSuccess(res, post)
  } catch (err: any) {
    sendError(res, err.message, 500)
  }
}

// ─── CREATE (admin only) ───────────────────────────────────────────────────
export const create = async (req: Request, res: Response): Promise<void> => {
  try {
    const { title, body } = req.body
    if (!title || !body) { sendError(res, 'Title and body are required'); return }

    const imageUrl = req.file ? buildFileUrl(req.file) : undefined

    const post = await NewsPost.create({
      title:     sanitizeField(title),
      body:      sanitizeHtml(body),
      imageUrl,
      author:    req.user!.name,
      createdBy: req.user!._id,
    })

    sendSuccess(res, post, 201, 'Post published')
  } catch (err: any) {
    sendError(res, err.message, 500)
  }
}

// ─── UPDATE (admin only) ───────────────────────────────────────────────────
export const update = async (req: Request, res: Response): Promise<void> => {
  try {
    const post = await NewsPost.findById(req.params.id)
    if (!post) { sendError(res, 'Post not found', 404); return }

    const { title, body } = req.body
    if (title) post.title = sanitizeField(title)
    if (body)  post.body  = sanitizeHtml(body)

    if (req.file) {
      // Remove old image from disk
      if (post.imageUrl) {
        const oldPath = path.join(__dirname, '../../', post.imageUrl)
        if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath)
      }
      post.imageUrl = buildFileUrl(req.file)
    }

    await post.save()
    sendSuccess(res, post, 200, 'Post updated')
  } catch (err: any) {
    sendError(res, err.message, 500)
  }
}

// ─── DELETE (admin only) ───────────────────────────────────────────────────
export const remove = async (req: Request, res: Response): Promise<void> => {
  try {
    const post = await NewsPost.findById(req.params.id)
    if (!post) { sendError(res, 'Post not found', 404); return }

    if (post.imageUrl) {
      const filePath = path.join(__dirname, '../../', post.imageUrl)
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath)
    }

    await post.deleteOne()
    sendSuccess(res, null, 200, 'Post deleted')
  } catch (err: any) {
    sendError(res, err.message, 500)
  }
}