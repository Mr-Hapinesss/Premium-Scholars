// services/news.service.ts
import { api } from './api'
import { NewsPost, NewsPaginated } from '../types/news.types'

export const newsService = {
  getAll:   (params?: any): Promise<NewsPaginated> =>
    api.get('/news', { params }).then(r => r.data.data),
  getById:  (id: string): Promise<NewsPost> =>
    api.get(`/news/${id}`).then(r => r.data.data),
  create:   (data: FormData): Promise<NewsPost> =>
    api.post('/news', data, { headers: { 'Content-Type': 'multipart/form-data' } }).then(r => r.data.data),
  update:   (id: string, data: FormData): Promise<NewsPost> =>
    api.put(`/news/${id}`, data, { headers: { 'Content-Type': 'multipart/form-data' } }).then(r => r.data.data),
  delete:   (id: string) =>
    api.delete(`/news/${id}`).then(r => r.data),
}