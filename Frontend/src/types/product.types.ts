export interface BeautyProduct {
  _id: string
  name: string
  description: string
  price: number
  category: 'Skincare' | 'Makeup' | 'Haircare' | 'Fragrance' | 'Nails' | 'Other'
  images: string[]
  inStock: boolean
  stock: number
  createdBy: string
  createdAt: string
  updatedAt: string
}

export interface RequirementItem {
  _id: string
  name: string
  description: string
  price: number
  category: string
  image?: string
  inStock: boolean
  stock: number
  createdBy: string
  createdAt: string
  updatedAt: string
}

export interface Order {
  _id: string
  userId: string
  items: OrderItem[]
  total: number
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled'
  section: 'beauty' | 'requirements'
  deliveryAddress?: string
  notes?: string
  createdAt: string
  updatedAt: string
}

export interface OrderItem {
  itemId: string
  name: string
  price: number
  qty: number
  image?: string
}