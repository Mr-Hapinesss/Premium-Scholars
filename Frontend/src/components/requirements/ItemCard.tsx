import { useAuth } from '../../context/AuthContext'
import { useCart } from '../../hooks/useCart'
import { useNavigate } from 'react-router-dom'
import { useToast } from '../shared/Toast'

interface RequirementItem {
  _id: string
  name: string
  description: string
  price: number
  category: string
  image?: string
  inStock: boolean
}

interface Props {
  item: RequirementItem
}

export default function ItemCard({ item }: Props) {
  const { user }     = useAuth()
  const { addToCart } = useCart()
  const navigate     = useNavigate()
  const { toast }    = useToast()

  const handleAdd = () => {
    if (!user) {
      navigate('/mentorship/login', { state: { from: { pathname: '/requirements' } } })
      return
    }
    addToCart({ _id: item._id, name: item.name, price: item.price, image: item.image, section: 'requirements' })
    toast(`${item.name} added to cart`, 'success')
  }

  return (
    <div className="bg-white rounded-2xl border border-gold-100 overflow-hidden hover:shadow-lg transition-all hover:-translate-y-0.5 group">
      {/* Image */}
<div className="aspect-video w-full overflow-hidden bg-gold-50 relative">
  {item.image ? (
    <img
      src={item.image}
      alt={item.name}
      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
    />
  ) : (
    <div className="w-full h-full flex items-center justify-center text-5xl">📦</div>
  )}
  {!item.inStock && (
    <div className="absolute inset-0 bg-white/70 flex items-center justify-center">
      <span className="text-xs font-bold text-sky-400 border border-sky-200 rounded-full px-3 py-1 bg-white">
        Out of Stock
      </span>
    </div>
  )}
  <div className="absolute top-3 left-3 bg-gold-100 text-gold-700 text-xs font-semibold px-2.5 py-0.5 rounded-full">
    {item.category}
  </div>
</div>

      {/* Content */}
      <div className="p-5">
        <h3 className="font-semibold text-sky-800 mb-1 line-clamp-2 leading-snug">{item.name}</h3>
        <p className="text-sky-500 text-xs mb-3 line-clamp-2 leading-relaxed">{item.description}</p>
        <div className="flex items-center justify-between">
          <span className="font-display text-lg font-bold text-sky-900">
            KES {item.price.toLocaleString()}
          </span>
          <button
            onClick={handleAdd}
            disabled={!item.inStock}
            className="px-4 py-2 bg-gold-400 text-sky-900 rounded-xl text-xs font-bold hover:bg-gold-500 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {user ? '+ Add' : 'Sign In to Order'}
          </button>
        </div>
      </div>
    </div>
  )
}