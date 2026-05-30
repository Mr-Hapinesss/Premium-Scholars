import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import Navbar from '../../components/shared/Navbar'
import Footer from '../../components/shared/Footer'
import { beautyService } from '../../services/beauty.service'
import { useCart } from '../../hooks/useCart'
import { useToast } from '../../components/shared/Toast'
import LoadingSpinner from '../../components/shared/LoadingSpinner'
import { BeautyProduct as BP } from '../../types/product.types'

export default function BeautyProduct() {
  const { id }           = useParams<{ id: string }>()
  const [product, setProduct] = useState<BP | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeImg, setActiveImg] = useState(0)
  const [qty,    setQty]    = useState(1)
  const { addToCart }      = useCart()
  const { toast }          = useToast()
  const navigate           = useNavigate()

  useEffect(() => {
    if (!id) return
    beautyService.getById(id)
      .then((res: any) => setProduct(res.data))
      .finally(() => setLoading(false))
  }, [id])

  if (loading) return <LoadingSpinner fullPage />
  if (!product) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="text-5xl mb-4">😔</div>
        <p className="text-sky-500 mb-4">Product not found</p>
        <button onClick={() => navigate('/beauty')} className="px-6 py-2 bg-sky-600 text-white rounded-xl text-sm">← Back to Shop</button>
      </div>
    </div>
  )

  const handleAdd = () => {
    addToCart({ _id: product._id, name: product.name, price: product.price, image: product.images[0], section: 'beauty', qty })
    toast(`${product.name} added to cart 🎉`, 'success')
  }

  return (
    <div className="min-h-screen bg-blush font-body">
      <Navbar />
      <div className="pt-20 max-w-6xl mx-auto px-6 py-12">
        {/* Breadcrumb */}
        <div className="text-xs text-sky-400 mb-6 flex items-center gap-2">
          <button onClick={() => navigate('/beauty')} className="hover:text-sky-600">Beauty</button>
          <span>/</span>
          <span className="text-sky-600">{product.name}</span>
        </div>

        <div className="grid md:grid-cols-2 gap-12">
          {/* Images */}
          <div>
            <div className="aspect-square bg-white rounded-3xl overflow-hidden border border-sky-100 mb-4 shadow-sm">
              {product.images[activeImg] ? (
                <img src={product.images[activeImg]} alt={product.name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-7xl">💄</div>
              )}
            </div>
            {product.images.length > 1 && (
              <div className="flex gap-3">
                {product.images.map((img, i) => (
                  <button key={i} onClick={() => setActiveImg(i)}
                    className={`w-16 h-16 rounded-xl overflow-hidden border-2 transition-all ${activeImg === i ? 'border-rose shadow-md' : 'border-transparent'}`}>
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Details */}
          <div>
            <div className="inline-block bg-rose/10 text-rose text-xs font-semibold px-3 py-1 rounded-full mb-3">
              {product.category}
            </div>
            <h1 className="font-display text-4xl text-sky-900 mb-3 leading-tight">{product.name}</h1>
            <div className="font-display text-3xl text-sky-800 mb-5">KES {product.price.toLocaleString()}</div>

            <p className="text-sky-600 leading-relaxed mb-6">{product.description || 'No description available.'}</p>

            <div className={`inline-flex items-center gap-2 text-sm font-medium mb-6 px-3 py-1.5 rounded-full ${product.inStock ? 'bg-emerald-50 text-emerald-600' : 'bg-rose/10 text-rose'}`}>
              <span className={`w-2 h-2 rounded-full ${product.inStock ? 'bg-emerald-400' : 'bg-rose'}`} />
              {product.inStock ? `In Stock (${product.stock})` : 'Out of Stock'}
            </div>

            {/* Qty + Add */}
            <div className="flex items-center gap-4">
              <div className="flex items-center border border-sky-200 rounded-xl overflow-hidden">
                <button onClick={() => setQty(q => Math.max(1, q - 1))}
                  className="w-10 h-11 text-sky-600 hover:bg-sky-50 transition-colors font-bold">−</button>
                <span className="w-10 text-center text-sky-800 font-semibold">{qty}</span>
                <button onClick={() => setQty(q => q + 1)}
                  className="w-10 h-11 text-sky-600 hover:bg-sky-50 transition-colors font-bold">+</button>
              </div>
              <button
                onClick={handleAdd}
                disabled={!product.inStock}
                className="flex-1 py-3 bg-rose text-white rounded-xl font-semibold hover:bg-rose/80 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Add to Cart
              </button>
            </div>

            <button onClick={() => navigate('/beauty')} className="mt-4 text-sky-400 text-sm hover:text-sky-600 transition-colors">
              ← Back to shop
            </button>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}