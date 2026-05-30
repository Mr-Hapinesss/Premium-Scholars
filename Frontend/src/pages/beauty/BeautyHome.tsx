import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../../components/shared/Navbar'
import Footer from '../../components/shared/Footer'
import { beautyService } from '../../services/beauty.service'
import { BeautyProduct } from '../../types/product.types'

const categories = ['All', 'Skincare', 'Makeup', 'Haircare', 'Fragrance', 'Nails']

export default function BeautyHome() {
  const [products, setProducts] = useState<BeautyProduct[]>([])
  const [category, setCategory] = useState('All')
  const [search, setSearch] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    beautyService.getAll({ category: category === 'All' ? '' : category, search })
      .then(setProducts)
  }, [category, search])

  return (
    <div className="min-h-screen bg-blush font-body">
      <Navbar />
      <div className="pt-16">
        {/* Beauty hero banner */}
        <div className="bg-gradient-to-r from-rose/20 via-blush to-gold-50 py-16 px-6 text-center">
          <div className="text-rose text-sm font-semibold tracking-widest uppercase mb-3">✦ Beauty ✦</div>
          <h1 className="font-display text-5xl text-sky-900 mb-4">Glow, Scholar, Glow</h1>
          <p className="text-sky-600 max-w-md mx-auto">Quality beauty products curated for the university lifestyle.</p>
        </div>

        {/* Filters */}
        <div className="sticky top-16 z-10 bg-white/90 backdrop-blur border-b border-sky-100 px-6 py-3">
          <div className="max-w-6xl mx-auto flex flex-wrap gap-3 items-center">
            <div className="flex gap-2 flex-wrap">
              {categories.map(c => (
                <button key={c} onClick={() => setCategory(c)}
                  className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all
                    ${category === c
                      ? 'bg-rose text-white shadow-sm'
                      : 'bg-sky-50 text-sky-600 hover:bg-sky-100'
                    }`}>
                  {c}
                </button>
              ))}
            </div>
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search products..."
              className="ml-auto px-4 py-2 rounded-xl border border-sky-200 text-sm focus:outline-none focus:border-sky-400 bg-sky-50"
            />
          </div>
        </div>

        {/* Product grid */}
        <div className="max-w-6xl mx-auto px-6 py-12">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map(p => (
              <button key={p._id} onClick={() => navigate(`/beauty/product/${p._id}`)}
                className="bg-white rounded-3xl overflow-hidden border border-sky-100 hover:shadow-xl transition-all hover:-translate-y-1 group text-left">
                <div className="aspect-square bg-sky-50 overflow-hidden">
                  <img src={p.images[0]} alt={p.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                </div>
                <div className="p-4">
                  <div className="text-xs text-rose font-medium mb-1">{p.category}</div>
                  <div className="font-semibold text-sky-800 text-sm mb-1 line-clamp-2">{p.name}</div>
                  <div className="font-display text-lg text-sky-900">KES {p.price.toLocaleString()}</div>
                </div>
              </button>
            ))}
          </div>
          {products.length === 0 && (
            <div className="text-center py-24 text-sky-400">No products found.</div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  )
} 