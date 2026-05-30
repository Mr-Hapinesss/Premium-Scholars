// services/beauty.service.ts
import { api } from './api'
import { BeautyProduct } from '../types/product.types'

export const beautyService = {
  getAll:   (params?: any): Promise<{ products: BeautyProduct[]; total: number }> =>
    api.get('/beauty', { params }).then(r => r.data.data),
  getById:  (id: string): Promise<BeautyProduct> =>
    api.get(`/beauty/${id}`).then(r => r.data.data),
  create:   (data: FormData) =>
    api.post('/beauty', data, { headers: { 'Content-Type': 'multipart/form-data' } }).then(r => r.data.data),
  update:   (id: string, data: FormData) =>
    api.put(`/beauty/${id}`, data, { headers: { 'Content-Type': 'multipart/form-data' } }).then(r => r.data.data),
  delete:   (id: string) =>
    api.delete(`/beauty/${id}`).then(r => r.data),
}