import { api } from './api'
import { RequirementItem, Order } from '../types/product.types'

interface RequirementsListResponse {
  items: RequirementItem[]
  total: number
  page:  number
  pages: number
}

export const requirementsService = {
  getAll: (params?: Record<string, any>): Promise<RequirementsListResponse> =>
    api.get('/requirements', { params }).then(r => r.data.data),

  getById: (id: string): Promise<RequirementItem> =>
    api.get(`/requirements/${id}`).then(r => r.data.data),

  placeOrder: (data: {
    items: { itemId: string; qty: number }[]
    deliveryAddress: string
    notes?: string
    section?: string
    idempotencyKey?:  string
  }): Promise<Order> =>
    api.post('/requirements/order', data).then(r => r.data.data),

  getMyOrders: (): Promise<Order[]> =>
    api.get('/requirements/orders/mine').then(r => r.data.data),

  create: (data: FormData): Promise<RequirementItem> =>
    api.post('/requirements', data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }).then(r => r.data.data),

  update: (id: string, data: FormData): Promise<RequirementItem> =>
    api.put(`/requirements/${id}`, data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }).then(r => r.data.data),

  delete: (id: string): Promise<void> =>
    api.delete(`/requirements/${id}`).then(() => undefined),
}