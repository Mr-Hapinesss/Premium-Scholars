import { Router } from 'express'
import {
  getAll, getById, create, update, remove,
  placeOrder, getMyOrders,
} from '../controllers/requirements.controller.js'
import { authenticate } from '../middleware/auth.middleware.js'
import { requireAdmin, requireAny } from '../middleware/role.middleware.js'
import { uploadSingle, processImages } from '../middleware/upload.middleware.js'

const router = Router()

// Public
router.get('/',    getAll)
router.get('/:id', getById)

// Authenticated — any logged-in user
router.post('/order',  authenticate, requireAny, placeOrder)
router.get('/orders/mine', authenticate, requireAny, getMyOrders)

// Admin only
router.post(
  '/',
  authenticate,
  requireAdmin,
  uploadSingle('image'),
  processImages,
  create
)

router.put(
  '/:id',
  authenticate,
  requireAdmin,
  uploadSingle('image'),
  processImages,
  update
)

router.delete('/:id', authenticate, requireAdmin, remove)

// ── Public wildcard — MUST be last ──
router.get('/:id', getById)

export default router