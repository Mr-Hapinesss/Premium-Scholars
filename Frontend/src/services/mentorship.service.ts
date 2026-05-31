import { api } from './api'
import { Mentee, MentorStats } from '../types/mentorship.types'
import { AuthUser } from '../context/AuthContext'

export const mentorshipService = {
  getMyMentees: (): Promise<Mentee[]> =>
    api.get('/mentorship/my-mentees').then(r => r.data.data),

  getMentorStats: (): Promise<MentorStats> =>
    api.get('/mentorship/mentor-stats').then(r => r.data.data),

  getMyMentor: (): Promise<AuthUser | null> =>
    api.get('/mentorship/my-mentor').then(r => r.data.data),
}