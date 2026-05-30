import { api } from './api'
import { Mentee, Mentor, MentorStats } from '../types/mentorship.types'

export const mentorshipService = {
  getMyMentees:   (): Promise<Mentee[]>     => api.get('/mentorship/my-mentees').then(r => r.data.data),
  getMentorStats: (): Promise<MentorStats>  => api.get('/mentorship/mentor-stats').then(r => r.data.data),
  getMyMentor:    (): Promise<Mentor | null> => api.get('/mentorship/my-mentor').then(r => r.data.data),
}