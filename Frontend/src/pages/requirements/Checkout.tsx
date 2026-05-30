import Navbar from '../../components/shared/Navbar'
import Footer from '../../components/shared/Footer'
import OrderForm from '../../components/requirements/OrderForm'
import { useCart } from '../../hooks/useCart'
import { useNavigate } from 'react-router-dom'
import { useEffect } from 'react'

export default function Checkout() {
  const { cart } = useCart()
  const navigate = useNavigate()

  // If cart is empty, send back to requirements
  useEffect(() => {
    if (cart.length === 0) navigate('/requirements', { replace: true })
  }, [cart, navigate])

  return (
    <div className="min-h-screen bg-ivory font-body">
      <Navbar />
      <div className="pt-24 px-6 max-w-4xl mx-auto pb-16">
        <div className="mb-8">
          <div className="text-gold-500 text-sm font-semibold tracking-widest uppercase mb-2">Checkout</div>
          <h1 className="font-display text-4xl text-sky-900">Complete Your Order</h1>
        </div>

        <div className="grid md:grid-cols-5 gap-8">
          {/* Cart summary — left, narrower */}
          <div className="md:col-span-2">
            <div className="bg-white rounded-2xl border border-gold-100 p-5 sticky top-24">
              <h2 className="font-display text-lg text-sky-800 mb-4">Your Items</h2>
              <div className="space-y-3">
                {cart.map(item => (
                  <div key={item._id} className="flex gap-3 items-center">
                    <div className="w-10 h-10 rounded-lg bg-gold-50 overflow-hidden flex-shrink-0">
                      {item.image
                        ? <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                        : <div className="w-full h-full flex items-center justify-center text-lg">📦</div>
                      }
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sky-700 text-xs font-medium truncate">{item.name}</p>
                      <p className="text-sky-400 text-xs">×{item.qty}</p>
                    </div>
                    <span className="text-sky-700 text-xs font-bold flex-shrink-0">
                      KES {(item.price * item.qty).toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Order form — right, wider */}
          <div className="md:col-span-3">
            <OrderForm />
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}