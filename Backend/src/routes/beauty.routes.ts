import { Router } from 'express'
import { getAll, getById, create, update, remove } from '../controllers/beauty.controller.js'
import { authenticate } from '../middleware/auth.middleware.js'
import { requireAdmin } from '../middleware/role.middleware.js'
import { uploadMultiple, processImages } from '../middleware/upload.middleware.js'



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
  processImages,
  create
)

router.put(
  '/:id',
  authenticate,
  requireAdmin,
  uploadMultiple('images', 5),
  processImages,
  update
)

router.delete('/:id', authenticate, requireAdmin, remove)

export default router