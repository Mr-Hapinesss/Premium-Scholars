import { Router } from 'express'
import { getAll, getById, create, update, remove } from '../controllers/beauty.controller'
import { authenticate } from '../middleware/auth.middleware'
import { requireAdmin } from '../middleware/role.middleware'
import { uploadMultiple } from '../middleware/upload.middleware'

const router = Router()

// Public
router.get('/',    getAll)
router.get('/:id', getById)

// Admin only
router.post(
  '/',
  authenticate,
  requireAdmin,
  uploadMultiple('images', 5),
  create
)

router.put(
  '/:id',
  authenticate,
  requireAdmin,
  uploadMultiple('images', 5),
  update
)

router.delete('/:id', authenticate, requireAdmin, remove)

export default router