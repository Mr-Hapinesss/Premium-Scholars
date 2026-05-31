import { api } from './api'

export const adminService = {
  getAllUsers: (params?: Record<string, any>) =>
    api.get('/admin/users', { params }).then(r => r.data.data),

  deleteUser: (id: string): Promise<void> =>
    api.delete(`/admin/users/${id}`).then(() => undefined),

  getAllMentors: () =>
    api.get('/admin/mentors').then(r => r.data.data),

  getMenteeById: (id: string) =>
    api.get(`/admin/mentees/${id}`).then(r => r.data.data),

  generateCode: () =>
    api.post('/admin/mentor-codes').then(r => r.data.data),

  getMentorCodes: () =>
    api.get('/admin/mentor-codes').then(r => r.data.data),

  revokeCode: (id: string): Promise<void> =>
    api.delete(`/admin/mentor-codes/${id}`).then(() => undefined),

  assignMentee: (menteeId: string, mentorId: string) =>
    api.patch('/admin/assign-mentee', { menteeId, mentorId }).then(r => r.data.data),

  getDashboard: () =>
    api.get('/admin/summary').then(r => r.data.data),

  getAllOrders: (params?: Record<string, any>) =>
    api.get('/admin/orders', { params }).then(r => r.data.data),

  updateOrderStatus: (id: string, status: string) =>
    api.patch(`/admin/orders/${id}/status`, { status }).then(r => r.data.data),
}