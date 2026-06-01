import { Router } from 'express'
import { getAll, getById, create, update, remove } from '../controllers/news.controller.js'
import { authenticate } from '../middleware/auth.middleware.js'
import { requireAdmin } from '../middleware/role.middleware.js'
import { uploadSingle } from '../middleware/upload.middleware.js'

const router = Router()

// Public
router.get('/',    getAll)
router.get('/:id', getById)

// Admin only
router.post(
  '/',
  authenticate,
  requireAdmin,
  uploadSingle('image'),
  create
)

router.put(
  '/:id',
  authenticate,
  requireAdmin,
  uploadSingle('image'),
  update
)

router.delete('/:id', authenticate, requireAdmin, remove)

export default router