import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../../components/shared/Navbar'
import Footer from '../../components/shared/Footer'
import { requirementsService } from '../../services/requirements.service'
import { useCart } from '../../hooks/useCart'
import { useAuth } from '../../context/AuthContext'

export default function RequirementsHome() {
  const [items, setItems] = useState<any[]>([])
  const [filter, setFilter] = useState('')
  const { addToCart, cart } = useCart()
  const { user } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    requirementsService.getAll(filter).then(setItems)
  }, [filter])

  const handleOrder = (item: any) => {
    if (!user) {
      navigate('/mentorship/login', { state: { from: { pathname: '/requirements' } } })
      return
    }
    addToCart(item)
    navigate('/requirements/checkout')
  }

  return (
    <div className="min-h-screen bg-ivory font-body">
      <Navbar />
      <div className="pt-16">
        <div className="bg-gradient-to-r from-gold-50 to-sky-50 py-16 px-6 text-center">
          <div className="text-gold-500 text-sm font-semibold tracking-widest uppercase mb-3">📦 First Year Requirements</div>
          <h1 className="font-display text-5xl text-sky-900 mb-4">Everything on Your List</h1>
          <p className="text-sky-600 max-w-xl mx-auto">Browse freely. When you're ready to order, sign in to complete your purchase.</p>
        </div>

        <div className="sticky top-16 z-10 bg-white/90 backdrop-blur border-b border-gold-100 px-6 py-3">
          <div className="max-w-6xl mx-auto">
            <input value={filter} onChange={e => setFilter(e.target.value)}
              placeholder="Filter by item name or category..."
              className="w-full max-w-sm px-4 py-2 rounded-xl border border-gold-200 focus:outline-none focus:border-gold-400 bg-gold-50 text-sky-800 text-sm"
            />
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-6 py-12 grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map(item => (
            <div key={item._id} className="bg-white rounded-2xl border border-gold-100 overflow-hidden hover:shadow-lg transition-shadow">
              {item.image && (
                <div className="aspect-video bg-gold-50 overflow-hidden">
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                </div>
              )}
              <div className="p-5">
                <div className="text-xs text-gold-500 font-medium mb-1">{item.category}</div>
                <h3 className="font-semibold text-sky-800 mb-1">{item.name}</h3>
                <p className="text-sky-500 text-sm mb-3 line-clamp-2">{item.description}</p>
                <div className="flex items-center justify-between">
                  <span className="font-display text-lg text-sky-900">KES {item.price.toLocaleString()}</span>
                  <button onClick={() => handleOrder(item)}
                    className="px-4 py-2 bg-gold-400 text-sky-900 rounded-xl text-sm font-semibold hover:bg-gold-500 transition-colors">
                    {user ? 'Add to Cart' : 'Order (Sign In)'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  )
}