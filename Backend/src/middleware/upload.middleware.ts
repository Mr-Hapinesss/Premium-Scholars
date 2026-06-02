import type { FileFilterCallback } from 'multer'
import multer from 'multer';
import path from 'path'
import crypto from 'crypto'
import sharp from 'sharp'
import fs from 'fs'
import type { Request, Response, NextFunction } from 'express'
import { getDirname } from '../utils/paths.utils.js';


const ALLOWED_MIME   = ['image/jpeg', 'image/png', 'image/webp']
const MAX_SIZE_BYTES = 5 * 1024 * 1024   // 5 MB raw upload limit

// ── Dimension rules per section ────────────────────────────────────────────
// width x height in pixels, enforced after upload, before saving final file
const DIMENSION_RULES: Record<string, {
  width:      number
  height:     number
  fit:        keyof sharp.FitEnum
  label:      string
}> = {
  beauty: {
    width:  800,
    height: 800,
    fit:    'cover',   // square crop centred — beauty products always square
    label:  '1:1 square (800×800)',
  },
  requirements: {
    width:  900,
    height: 600,
    fit:    'cover',   // 3:2 landscape crop — item shelf look
    label:  '3:2 landscape (900×600)',
  },
  news: {
    width:  1200,
    height: 630,
    fit:    'cover',   // 1.91:1 — standard social/news card ratio
    label:  '1.91:1 banner (1200×630)',
  },
  misc: {
    width:  800,
    height: 800,
    fit:    'inside',  // scale down without cropping for miscellaneous
    label:  'max 800×800',
  },
}

// ── Resolve section from route ─────────────────────────────────────────────
const resolveSection = (req: Request): string => {
  const url = req.baseUrl + req.path
  if (url.includes('beauty'))       return 'beauty'
  if (url.includes('requirements')) return 'requirements'
  if (url.includes('news'))         return 'news'
  return 'misc'
}

// ── Temp storage — sharp processes then moves to final dir ─────────────────
const tempStorage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    const dir = path.join(getDirname(import.meta.url), '../../uploads/temp')
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true })
    cb(null, dir)
  },
  filename: (_req, file, cb) => {
    const rand = crypto.randomBytes(8).toString('hex')
    const ext  = path.extname(file.originalname).toLowerCase() || '.jpg'
    cb(null, `tmp-${Date.now()}-${rand}${ext}`)
  },
})

const fileFilter = (
  _req: Request,
  file: Express.Multer.File,
  cb: FileFilterCallback
) => {
  if (ALLOWED_MIME.includes(file.mimetype)) {
    cb(null, true)
  } else {
    cb(new Error(`Invalid file type. Allowed: JPEG, PNG, WebP`))
  }
}

// ── Process images with sharp after upload ─────────────────────────────────
// This middleware runs after multer saves the temp file.
// It resizes/crops to the spec for the section, converts to WebP,
// saves the final file, deletes the temp file, and updates req.file/req.files.

export const processImages = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const section = resolveSection(req)
  const rule    = DIMENSION_RULES[section]

  const processOne = async (file: Express.Multer.File): Promise<Express.Multer.File> => {
    const dest = path.join(getDirname(import.meta.url), '../../uploads', section)
    if (!fs.existsSync(dest)) fs.mkdirSync(dest, { recursive: true })

    const finalName = file.filename.replace(/^tmp-/, '').replace(/\.[^.]+$/, '.webp')
    const finalPath = path.join(dest, finalName)

    if (!rule){
      throw new Error(`No dimension rule defined for section "${section}"`)
    }
    try {
      await sharp(file.path)
        .resize({
          width:    rule.width,
          height:   rule.height,
          fit:      rule.fit,
          position: 'centre',
        })
        .webp({ quality: 82 })
        .toFile(finalPath)

      // Delete temp file
      fs.unlinkSync(file.path)

      // Return a new file descriptor pointing to the processed file
      return {
        ...file,
        filename:  finalName,
        path:      finalPath,
        mimetype:  'image/webp',
        size:      fs.statSync(finalPath).size,
      }
    } catch (err) {
      // Clean up temp file on error
      if (fs.existsSync(file.path)) fs.unlinkSync(file.path)
      throw new Error(`Image processing failed: ${(err as Error).message}`)
    }
  }

  try {
    if (req.file) {
      req.file = await processOne(req.file)
    }
    if (req.files && Array.isArray(req.files)) {
      req.files = await Promise.all(req.files.map(processOne))
    }
    next()
  } catch (err: any) {
    res.status(400).json({ success: false, message: err.message })
  }
}

// ── Public upload helpers ──────────────────────────────────────────────────
const multerBase = multer({
  storage:   tempStorage,
  fileFilter,
  limits:    { fileSize: MAX_SIZE_BYTES },
})

export const uploadSingle = (fieldName: string) =>
  multerBase.single(fieldName)

export const uploadMultiple = (fieldName: string, maxCount = 5) =>
  multerBase.array(fieldName, maxCount)

// ── Build public URL from processed file ──────────────────────────────────
export const buildFileUrl = (file: Express.Multer.File): string => {
  const idx = file.path.replace(/\\/g, '/').indexOf('uploads/')
  return '/' + file.path.replace(/\\/g, '/').slice(idx)
}

// ── Export dimension specs so frontend can show them to admin ─────────────
export const IMAGE_SPECS = Object.fromEntries(
  Object.entries(DIMENSION_RULES).map(([k, v]) => [k, v.label])
)