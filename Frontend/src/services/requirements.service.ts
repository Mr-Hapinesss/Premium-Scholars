// services/requirements.service.ts
import { api } from './api'
import { RequirementItem, Order } from '../types/product.types'

export const requirementsService = {
  getAll:     (params?: any): Promise<{ items: RequirementItem[]; total: number }> =>
    api.get('/requirements', { params }).then(r => r.data.data),
  getById:    (id: string): Promise<RequirementItem> =>
    api.get(`/requirements/${id}`).then(r => r.data.data),
  placeOrder: (data: any): Promise<Order> =>
    api.post('/requirements/order', data).then(r => r.data.data),
  getMyOrders: (): Promise<Order[]> =>
    api.get('/requirements/orders/mine').then(r => r.data.data),
  create:     (data: FormData) =>
    api.post('/requirements', data, { headers: { 'Content-Type': 'multipart/form-data' } }).then(r => r.data.data),
  update:     (id: string, data: FormData) =>
    api.put(`/requirements/${id}`, data, { headers: { 'Content-Type': 'multipart/form-data' } }).then(r => r.data.data),
  delete:     (id: string) =>
    api.delete(`/requirements/${id}`).then(r => r.data),
}