import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

export interface CartItem {
  _id: string
  name: string
  price: number
  qty: number
  image?: string
  section: 'beauty' | 'requirements'
}

interface CartContextType {
  cart: CartItem[]
  addToCart: (item: Omit<CartItem, 'qty'> & { qty?: number }) => void
  removeFromCart: (id: string) => void
  updateQty: (id: string, qty: number) => void
  clearCart: () => void
  total: number
  itemCount: number
}

const CartContext = createContext<CartContextType | null>(null)

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>(() => {
    // Rehydrate from sessionStorage on first load
    try {
      const saved = sessionStorage.getItem('ps_cart')
      return saved ? JSON.parse(saved) : []
    } catch {
      return []
    }
  })

  // Persist cart to sessionStorage whenever it changes
  useEffect(() => {
    sessionStorage.setItem('ps_cart', JSON.stringify(cart))
  }, [cart])

  const addToCart = (incoming: Omit<CartItem, 'qty'> & { qty?: number }) => {
    setCart(prev => {
      const existing = prev.find(i => i._id === incoming._id)
      if (existing) {
        return prev.map(i =>
          i._id === incoming._id
            ? { ...i, qty: i.qty + (incoming.qty ?? 1) }
            : i
        )
      }
      return [...prev, { ...incoming, qty: incoming.qty ?? 1 }]
    })
  }

  const removeFromCart = (id: string) =>
    setCart(prev => prev.filter(i => i._id !== id))

  const updateQty = (id: string, qty: number) => {
    if (qty <= 0) { removeFromCart(id); return }
    setCart(prev => prev.map(i => i._id === id ? { ...i, qty } : i))
  }

  const clearCart = () => setCart([])

  const total     = cart.reduce((acc, i) => acc + i.price * i.qty, 0)
  const itemCount = cart.reduce((acc, i) => acc + i.qty, 0)

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateQty, clearCart, total, itemCount }}>
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used inside CartProvider')
  return ctx
}