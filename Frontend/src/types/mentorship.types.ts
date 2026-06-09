export interface Mentee {
  _id: string
  name: string
  email: string
  university: string
  whatsapp: string | null
  mentorId?: string | null
  createdAt: string
}

export interface Mentor {
  _id: string
  name: string
  email: string
  university: string
  whatsapp: string | null
  menteeCount: number
  createdAt: string
}

export interface MentorStats {
  menteeCount: number
  recentActivity: any[] // You can swap 'any' for a specific Activity interface later if you want
}