import { Request, Response } from 'express'
import { RequirementItem } from '../models/RequirementItem.model'
import { Order } from '../models/Order.model'
import { sendSuccess, sendError } from '../utils/apiResponse.utils'
import { buildFileUrl } from '../middleware/upload.middleware'
import fs from 'fs'
import path from 'path'

// ─── GET ALL (public) ──────────────────────────────────────────────────────
export const getAll = async (req: Request, res: Response): Promise<void> => {
  try {
    const { search, category, page = '1', limit = '20' } = req.query as Record<string, string>
    const filter: any = {}
    if (search)   filter.$text    = { $search: search }
    if (category) filter.category = category

    const skip = (parseInt(page) - 1) * parseInt(limit)
    const total = await RequirementItem.countDocuments(filter)
    const items = await RequirementItem.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .lean()

    sendSuccess(res, { items, total, page: parseInt(page), pages: Math.ceil(total / parseInt(limit)) })
  } catch (err: any) {
    sendError(res, err.message, 500)
  }
}

// ─── GET ONE (public) ──────────────────────────────────────────────────────
export const getById = async (req: Request, res: Response): Promise<void> => {
  try {
    const item = await RequirementItem.findById(req.params.id).lean()
    if (!item) { sendError(res, 'Item not found', 404); return }
    sendSuccess(res, item)
  } catch (err: any) {
    sendError(res, err.message, 500)
  }
}

// ─── CREATE (admin only) ───────────────────────────────────────────────────
export const create = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, description, price, category, stock } = req.body
    if (!name || !price) { sendError(res, 'Name and price are required'); return }

    const file  = req.file as Express.Multer.File | undefined
    const image = file ? buildFileUrl(file) : undefined

    const item = await RequirementItem.create({
      name: name.trim(),
      description: description?.trim() || '',
      price: parseFloat(price),
      category: category?.trim() || 'General',
      image,
      stock: parseInt(stock) || 0,
      inStock: parseInt(stock) > 0,
      createdBy: req.user!._id,
    })

    sendSuccess(res, item, 201, 'Item created')
  } catch (err: any) {
    sendError(res, err.message, 500)
  }
}

// ─── UPDATE (admin only) ───────────────────────────────────────────────────
export const update = async (req: Request, res: Response): Promise<void> => {
  try {
    const item = await RequirementItem.findById(req.params.id)
    if (!item) { sendError(res, 'Item not found', 404); return }

    const { name, description, price, category, stock, inStock } = req.body
    if (name)        item.name        = name.trim()
    if (description) item.description = description.trim()
    if (price)       item.price       = parseFloat(price)
    if (category)    item.category    = category.trim()
    if (stock !== undefined) {
      item.stock   = parseInt(stock)
      item.inStock = parseInt(stock) > 0
    }
    if (inStock !== undefined) item.inStock = inStock === 'true'

    if (req.file) {
      // Remove old image file from disk
      if (item.image) {
        const oldPath = path.join(__dirname, '../../', item.image)
        if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath)
      }
      item.image = buildFileUrl(req.file)
    }

    await item.save()
    sendSuccess(res, item, 200, 'Item updated')
  } catch (err: any) {
    sendError(res, err.message, 500)
  }
}

// ─── DELETE (admin only) ───────────────────────────────────────────────────
export const remove = async (req: Request, res: Response): Promise<void> => {
  try {
    const item = await RequirementItem.findById(req.params.id)
    if (!item) { sendError(res, 'Item not found', 404); return }

    if (item.image) {
      const filePath = path.join(__dirname, '../../', item.image)
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath)
    }

    await item.deleteOne()
    sendSuccess(res, null, 200, 'Item deleted')
  } catch (err: any) {
    sendError(res, err.message, 500)
  }
}

// ─── PLACE ORDER (any authenticated user) ──────────────────────────────────
export const placeOrder = async (req: Request, res: Response): Promise<void> => {
  try {
    const { items, deliveryAddress, notes, section = 'requirements' } = req.body

    if (!items || !Array.isArray(items) || items.length === 0) {
      sendError(res, 'Order must contain at least one item')
      return
    }

    // Calculate total from DB prices to prevent price tampering on the client
    const itemIds    = items.map((i: any) => i.itemId)
    const dbItems    = await RequirementItem.find({ _id: { $in: itemIds } }).lean()
    const dbMap      = new Map(dbItems.map(d => [d._id.toString(), d]))

    let total = 0
    const orderItems = items.map((i: any) => {
      const db = dbMap.get(i.itemId)
      if (!db) throw new Error(`Item ${i.itemId} not found`)
      if (!db.inStock) throw new Error(`${db.name} is out of stock`)
      const qty = parseInt(i.qty) || 1
      total += db.price * qty
      return { itemId: db._id, name: db.name, price: db.price, qty, image: db.image }
    })

    const order = await Order.create({
      userId: req.user!._id,
      items: orderItems,
      total,
      status: 'pending',
      section,
      deliveryAddress,
      notes,
    })

    sendSuccess(res, order, 201, 'Order placed successfully')
  } catch (err: any) {
    sendError(res, err.message, 500)
  }
}

// ─── GET MY ORDERS ─────────────────────────────────────────────────────────
export const getMyOrders = async (req: Request, res: Response): Promise<void> => {
  try {
    const orders = await Order.find({ userId: req.user!._id }).sort({ createdAt: -1 }).lean()
    sendSuccess(res, orders)
  } catch (err: any) {
    sendError(res, err.message, 500)
  }
}