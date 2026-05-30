export interface Mentee {
  _id: string
  name: string
  email: string
  university: string
  mentorId?: string | null
  createdAt: string
}

export interface Mentor {
  _id: string
  name: string
  email: string
  university: string
  menteeCount: number
  createdAt: string
}

export interface MentorStats {
  menteeCount: number
}