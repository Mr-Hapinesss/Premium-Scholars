import { Router } from 'express'
import { getAll, getById, create, update, remove } from '../controllers/news.controller'
import { authenticate } from '../middleware/auth.middleware'
import { requireAdmin } from '../middleware/role.middleware'
import { uploadSingle } from '../middleware/upload.middleware'

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