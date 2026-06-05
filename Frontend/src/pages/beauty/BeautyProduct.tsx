import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import Navbar from '../../components/shared/Navbar'
import Footer from '../../components/shared/Footer'
import LoadingSpinner from '../../components/shared/LoadingSpinner'
import { beautyService } from '../../services/beauty.service'
import { useCart } from '../../hooks/useCart'
import { useToast } from '../../components/shared/Toast'
import { BeautyProduct as BP } from '../../types/product.types'

export default function BeautyProduct() {
  const { id }                      = useParams<{ id: string }>()
  const [product,    setProduct]    = useState<BP | null>(null)
  const [loading,    setLoading]    = useState(true)
  const [error,      setError]      = useState('')
  const [activeImg,  setActiveImg]  = useState(0)
  const [qty,        setQty]        = useState(1)
  const { addToCart }               = useCart()
  const { toast }                   = useToast()
  const navigate                    = useNavigate()

  useEffect(() => {
    if (!id) {
      setError('No product ID in URL')
      setLoading(false)
      return
    }

    setLoading(true)
    setError('')

    beautyService
      .getById(id)
      .then(data => {
        // beautyService.getById already returns the unwrapped product object
        // Do NOT call .data on it — it IS the product
        if (!data) {
          setError('Product not found')
          return
        }
        setProduct(data)
      })
      .catch(err => {
        const msg = err.response?.data?.message ?? err.message ?? 'Failed to load product'
        setError(msg)
      })
      .finally(() => setLoading(false))
  }, [id])

  const handleAddToCart = () => {
    if (!product) return
    addToCart({
      _id:     product._id,
      name:    product.name,
      price:   product.price,
      image:   product.images?.[0],
      section: 'beauty',
      qty,
    })
    toast(`${product.name} added to cart 🎉`, 'success')
  }

  if (loading) return <LoadingSpinner fullPage />

  if (error || !product) {
    return (
      <div className="min-h-screen bg-blush font-body">
        <Navbar />
        <div className="pt-32 flex flex-col items-center justify-center text-center px-6">
          <div className="text-6xl mb-4">😔</div>
          <h2 className="font-display text-3xl text-sky-800 mb-3">
            {error || 'Product not found'}
          </h2>
          <p className="text-sky-500 text-sm mb-6 max-w-xs">
            This product may have been removed or the link is incorrect.
          </p>
          <button
            onClick={() => navigate('/beauty')}
            className="px-6 py-3 bg-sky-600 text-white rounded-xl font-semibold hover:bg-sky-700 transition-colors"
          >
            ← Back to Beauty Shop
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-blush font-body">
      <Navbar />

      <div className="pt-20 max-w-6xl mx-auto px-4 sm:px-6 py-12">
        {/* Breadcrumb */}
        <nav className="text-xs text-sky-400 mb-8 flex items-center gap-2">
          <button
            onClick={() => navigate('/')}
            className="hover:text-sky-600 transition-colors"
          >
            Home
          </button>
          <span>/</span>
          <button
            onClick={() => navigate('/beauty')}
            className="hover:text-sky-600 transition-colors"
          >
            Beauty
          </button>
          <span>/</span>
          <span className="text-sky-600 truncate max-w-[200px]">{product.name}</span>
        </nav>

        <div className="grid md:grid-cols-2 gap-12">
          {/* ── Images ── */}
          <div>
            {/* Main image */}
            <div className="aspect-square w-full bg-white rounded-3xl overflow-hidden border border-sky-100 mb-4 shadow-sm">
              {product.images?.[activeImg] ? (
                <img
                  src={product.images[activeImg]}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-7xl">
                  💄
                </div>
              )}
            </div>

            {/* Thumbnail strip */}
            {product.images?.length > 1 && (
              <div className="flex gap-3 flex-wrap">
                {product.images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImg(i)}
                    className={[
                      'w-16 h-16 rounded-xl overflow-hidden border-2 transition-all flex-shrink-0',
                      activeImg === i
                        ? 'border-pink-400 shadow-md scale-105'
                        : 'border-transparent hover:border-sky-200',
                    ].join(' ')}
                  >
                    <img
                      src={img}
                      alt={`${product.name} view ${i + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* ── Details ── */}
          <div>
            {/* Category badge */}
            <div className="inline-block bg-pink-50 text-pink-400 text-xs font-bold px-3 py-1 rounded-full mb-3 border border-pink-100">
              {product.category}
            </div>

            <h1 className="font-display text-4xl text-sky-900 mb-3 leading-tight">
              {product.name}
            </h1>

            <div className="font-display text-3xl text-sky-800 font-bold mb-5">
              KES {product.price?.toLocaleString()}
            </div>

            <p className="text-sky-600 leading-relaxed mb-6 text-sm">
              {product.description || 'No description available for this product.'}
            </p>

            {/* Stock status */}
            <div className={[
              'inline-flex items-center gap-2 text-sm font-semibold mb-6 px-4 py-2 rounded-full',
              product.inStock
                ? 'bg-emerald-50 text-emerald-600 border border-emerald-100'
                : 'bg-red-50 text-red-400 border border-red-100',
            ].join(' ')}>
              <span className={[
                'w-2 h-2 rounded-full',
                product.inStock ? 'bg-emerald-400' : 'bg-red-400',
              ].join(' ')} />
              {product.inStock
                ? `In Stock${product.stock ? ` (${product.stock} available)` : ''}`
                : 'Out of Stock'
              }
            </div>

            {/* Quantity + Add to cart */}
            {product.inStock && (
              <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center border border-sky-200 rounded-xl overflow-hidden bg-white">
                  <button
                    onClick={() => setQty(q => Math.max(1, q - 1))}
                    className="w-11 h-11 text-sky-600 hover:bg-sky-50 transition-colors font-bold text-lg"
                  >
                    −
                  </button>
                  <span className="w-10 text-center text-sky-800 font-bold">{qty}</span>
                  <button
                    onClick={() => setQty(q => q + 1)}
                    className="w-11 h-11 text-sky-600 hover:bg-sky-50 transition-colors font-bold text-lg"
                  >
                    +
                  </button>
                </div>

                <button
                  onClick={handleAddToCart}
                  className="flex-1 py-3.5 bg-pink-400 text-white rounded-xl font-bold text-base hover:bg-pink-500 transition-colors shadow-sm"
                >
                  Add to Cart
                </button>
              </div>
            )}

            {!product.inStock && (
              <div className="py-3.5 bg-sky-50 text-sky-400 rounded-xl font-semibold text-center border border-sky-100 mb-4">
                Currently Unavailable
              </div>
            )}

            <button
              onClick={() => navigate('/beauty')}
              className="text-sky-400 text-sm hover:text-sky-600 transition-colors flex items-center gap-1"
            >
              ← Back to shop
            </button>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}