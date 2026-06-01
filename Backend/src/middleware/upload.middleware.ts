// Use require to avoid missing @types/multer in the project
import multer from 'multer';
import path from 'path'
import crypto from 'crypto'
import type { Request } from 'express'
import type { ParamsDictionary } from 'express-serve-static-core'
import type { ParsedQs } from 'qs'
import { getDirname } from '../utils/paths.utils.js';

// Minimal FileFilterCallback type to avoid depending on @types/multer
type FileFilterCallback = (error: Error | null, acceptFile?: boolean) => void
// Type for multer file object
interface MulterFile {
  fieldname: string
  originalname: string
  mimetype: string
  path: string
  [key: string]: any
}
const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
const MAX_FILE_SIZE = 5 * 1024 * 1024  // 5 MB

// Resolve upload subdirectory based on route base URL
const resolveFolder = (req: Request): string => {
  const url = req.baseUrl + req.path
  if (url.includes('beauty'))       return 'beauty'
  if (url.includes('requirements')) return 'requirements'
  if (url.includes('news'))         return 'news'
  return 'misc'
}

const storage = multer.diskStorage({
  destination: (req: Request, _file: MulterFile, cb: (error: Error | null, destination: string) => void) => {    const folder = resolveFolder(req)

    const dest = path.join(getDirname(import.meta.url), '../../uploads', folder)
    cb(null, dest)
  },
  filename: (_req: any, file: { originalname: string }, cb: (arg0: null, arg1: string) => void) => {
    const rand    = crypto.randomBytes(8).toString('hex')
    const ext     = path.extname(file.originalname).toLowerCase()
    const safeName = `${Date.now()}-${rand}${ext}`
    cb(null, safeName)
  },
})

const fileFilter = (_req: Request, file: MulterFile, cb: FileFilterCallback) => {
  if (ALLOWED_MIME_TYPES.includes(file.mimetype)) {
    cb(null, true)
  } else {
    cb(new Error(`Invalid file type. Allowed: ${ALLOWED_MIME_TYPES.join(', ')}`))
  }
}

// Single-file uploader (news, requirements)
export const uploadSingle = (fieldName: string) =>
  multer({ storage, fileFilter, limits: { fileSize: MAX_FILE_SIZE } }).single(fieldName)

// Multi-file uploader (beauty products can have multiple images)
export const uploadMultiple = (fieldName: string, maxCount = 5) =>
  multer({ storage, fileFilter, limits: { fileSize: MAX_FILE_SIZE } }).array(fieldName, maxCount)

/**
 * Builds the public URL path from a multer file object.
 * The uploads folder is served statically at /uploads.
 */
export const buildFileUrl = (file: MulterFile): string => {
  // file.path is absolute; extract from 'uploads/' onwards
  const idx = file.path.replace(/\\/g, '/').indexOf('uploads/')
  return '/' + file.path.replace(/\\/g, '/').slice(idx)
}