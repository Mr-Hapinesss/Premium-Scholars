import { useNavigate } from 'react-router-dom'
import { BeautyProduct } from '../../types/product.types'
import { useCart } from '../../hooks/useCart'
import { useToast } from '../shared/Toast'

interface Props {
  product: BeautyProduct
}

export default function ProductCard({ product }: Props) {
  const navigate = useNavigate()
  const { addToCart } = useCart()
  const { toast } = useToast()

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation()
    addToCart({
      _id:     product._id,
      name:    product.name,
      price:   product.price,
      image:   product.images[0],
      section: 'beauty',
    })
    toast(`${product.name} added to cart`, 'success')
  }

  return (
    <div
      onClick={() => navigate(`/beauty/product/${product._id}`)}
      className="bg-white rounded-3xl overflow-hidden border border-sky-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1.5 cursor-pointer group"
    >
      {/* Image */}
      <div className="aspect-square bg-sky-50 overflow-hidden relative">
        {product.images[0] ? (
          <img
            src={product.images[0]}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-5xl">💄</div>
        )}
        {!product.inStock && (
          <div className="absolute inset-0 bg-white/70 flex items-center justify-center">
            <span className="text-xs font-bold text-sky-400 border border-sky-200 rounded-full px-3 py-1 bg-white">Out of Stock</span>
          </div>
        )}
        <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm rounded-full px-2.5 py-0.5 text-xs font-medium text-rose">
          {product.category}
        </div>
      </div>

      {/* Info */}
      <div className="p-4">
        <h3 className="font-semibold text-sky-800 text-sm mb-1 line-clamp-2 leading-snug">{product.name}</h3>
        <div className="flex items-center justify-between mt-2">
          <span className="font-display text-lg font-bold text-sky-900">
            KES {product.price.toLocaleString()}
          </span>
          <button
            onClick={handleAddToCart}
            disabled={!product.inStock}
            className="px-3 py-1.5 bg-rose/10 text-rose hover:bg-rose hover:text-white rounded-xl text-xs font-semibold transition-all disabled:opacity-40 disabled:cursor-not-allowed"
          >
            + Cart
          </button>
        </div>
      </div>
    </div>
  )
}