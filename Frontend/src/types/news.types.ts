export interface NewsPost {
  _id: string
  title: string
  body: string
  imageUrl?: string | null
  author: string
  createdBy: string
  createdAt: string
  updatedAt: string
}

export interface NewsPaginated {
  posts: NewsPost[]
  total: number
  page: number
  pages: number
}