import { api } from './api'
import { BeautyProduct } from '../types/product.types'

interface BeautyListResponse {
  products: BeautyProduct[]
  total:    number
  page:     number
  pages:    number
}

export const beautyService = {
  getAll: (params?: Record<string, any>): Promise<BeautyListResponse> =>
    api.get('/beauty', { params }).then(r => r.data.data),

  getById: (id: string): Promise<BeautyProduct> =>
    api.get(`/beauty/${id}`).then(r => r.data.data),

  create: (data: FormData): Promise<BeautyProduct> =>
    api.post('/beauty', data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }).then(r => r.data.data),

  update: (id: string, data: FormData): Promise<BeautyProduct> =>
    api.put(`/beauty/${id}`, data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }).then(r => r.data.data),

  delete: (id: string): Promise<void> =>
    api.delete(`/beauty/${id}`).then(() => undefined),
}