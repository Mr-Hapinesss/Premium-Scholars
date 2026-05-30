import { Request, Response } from 'express'
import { BeautyProduct } from '../models/BeautyProduct.model'
import { sendSuccess, sendError } from '../utils/apiResponse.utils'
import { buildFileUrl } from '../middleware/upload.middleware'
import fs from 'fs'
import path from 'path'

// ─── GET ALL ───────────────────────────────────────────────────────────────
export const getAll = async (req: Request, res: Response): Promise<void> => {
  try {
    const { category, search, page = '1', limit = '20' } = req.query as Record<string, string>

    const filter: any = {}
    if (category && category !== 'All') filter.category = category
    if (search) filter.$text = { $search: search }

    const skip  = (parseInt(page) - 1) * parseInt(limit)
    const total = await BeautyProduct.countDocuments(filter)
    const products = await BeautyProduct.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .lean()

    sendSuccess(res, { products, total, page: parseInt(page), pages: Math.ceil(total / parseInt(limit)) })
  } catch (err: any) {
    sendError(res, err.message, 500)
  }
}

// ─── GET ONE ───────────────────────────────────────────────────────────────
export const getById = async (req: Request, res: Response): Promise<void> => {
  try {
    const product = await BeautyProduct.findById(req.params.id).lean()
    if (!product) { sendError(res, 'Product not found', 404); return }
    sendSuccess(res, product)
  } catch (err: any) {
    sendError(res, err.message, 500)
  }
}

// ─── CREATE (admin only) ───────────────────────────────────────────────────
export const create = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, description, price, category, stock } = req.body
    if (!name || !price) { sendError(res, 'Name and price are required'); return }

    const files = req.files as Express.Multer.File[]
    const images = files ? files.map(buildFileUrl) : []

    const product = await BeautyProduct.create({
      name: name.trim(),
      description: description?.trim() || '',
      price: parseFloat(price),
      category: category || 'Other',
      images,
      stock: parseInt(stock) || 0,
      inStock: parseInt(stock) > 0,
      createdBy: req.user!._id,
    })

    sendSuccess(res, product, 201, 'Product created')
  } catch (err: any) {
    sendError(res, err.message, 500)
  }
}

// ─── UPDATE (admin only) ───────────────────────────────────────────────────
export const update = async (req: Request, res: Response): Promise<void> => {
  try {
    const product = await BeautyProduct.findById(req.params.id)
    if (!product) { sendError(res, 'Product not found', 404); return }

    const { name, description, price, category, stock, inStock, removeImages } = req.body

    if (name)        product.name        = name.trim()
    if (description) product.description = description.trim()
    if (price)       product.price       = parseFloat(price)
    if (category)    product.category    = category
    if (stock !== undefined) {
      product.stock   = parseInt(stock)
      product.inStock = parseInt(stock) > 0
    }
    if (inStock !== undefined) product.inStock = inStock === 'true'

    // Handle image removal — removeImages is a JSON array of image URLs to drop
    if (removeImages) {
      const toRemove: string[] = JSON.parse(removeImages)
      toRemove.forEach(imgUrl => {
        // Delete physical file
        const filePath = path.join(__dirname, '../../', imgUrl)
        if (fs.existsSync(filePath)) fs.unlinkSync(filePath)
      })
      product.images = product.images.filter(img => !toRemove.includes(img))
    }

    // Append newly uploaded images
    const newFiles = req.files as Express.Multer.File[]
    if (newFiles && newFiles.length > 0) {
      product.images.push(...newFiles.map(buildFileUrl))
    }

    await product.save()
    sendSuccess(res, product, 200, 'Product updated')
  } catch (err: any) {
    sendError(res, err.message, 500)
  }
}

// ─── DELETE (admin only) ───────────────────────────────────────────────────
export const remove = async (req: Request, res: Response): Promise<void> => {
  try {
    const product = await BeautyProduct.findById(req.params.id)
    if (!product) { sendError(res, 'Product not found', 404); return }

    // Delete associated image files from disk
    product.images.forEach(imgUrl => {
      const filePath = path.join(__dirname, '../../', imgUrl)
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath)
    })

    await product.deleteOne()
    sendSuccess(res, null, 200, 'Product deleted')
  } catch (err: any) {
    sendError(res, err.message, 500)
  }
}