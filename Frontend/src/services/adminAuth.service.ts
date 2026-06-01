import { api } from './api'

export const adminAuthService = {
  // Called by the register page to verify the token before showing the form
  validateInvite: (token: string) =>
    api.get('/admin-auth/validate-invite', { params: { token } }).then(r => r.data.data),

  // Submit the registration form
  register: (payload: {
    token:       string
    name:        string
    email:       string
    password:    string
    university?: string
  }) => api.post('/admin-auth/register', payload).then(r => r.data.data),

  // Admin-only: generate an invite link
  generateInvite: (email?: string, expiresInHours?: number) =>
    api.post('/admin-auth/invite', { email, expiresInHours }).then(r => r.data.data),

  // Admin-only: list all invites
  listInvites: () =>
    api.get('/admin-auth/invites').then(r => r.data.data),

  // Admin-only: revoke an unused invite
  revokeInvite: (id: string) =>
    api.delete(`/admin-auth/invites/${id}`).then(r => r.data),
}