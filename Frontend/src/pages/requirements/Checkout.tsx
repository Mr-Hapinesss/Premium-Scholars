import { useEffect, useState } from 'react'
import { useNavigate }         from 'react-router-dom'
import Navbar                  from '../../components/shared/Navbar'
import Footer                  from '../../components/shared/Footer'
import OrderForm               from '../../components/requirements/OrderForm'
import { useCart }             from '../../hooks/useCart'
import LoadingSpinner          from '../../components/shared/LoadingSpinner'

export default function Checkout() {
  const { cart }          = useCart()
  const navigate          = useNavigate()
  const [ready, setReady] = useState(false)

  useEffect(() => {
    // Give sessionStorage rehydration one tick to complete
    const t = setTimeout(() => {
      if (cart.length === 0) {
        navigate('/requirements', { replace: true })
      } else {
        setReady(true)
      }
    }, 100)
    return () => clearTimeout(t)
  }, [cart.length, navigate])

  if (!ready) return <LoadingSpinner fullPage />

  return (
    <div className="min-h-screen font-body" style={{ backgroundColor: '#fefce8' }}>
      <Navbar />

      <div className="pt-24 px-4 sm:px-6 max-w-4xl mx-auto pb-16">
        <div className="mb-8">
          <p className="text-gold-500 text-xs font-bold tracking-widest uppercase mb-2">
            Checkout
          </p>
          <h1 className="font-display text-4xl text-sky-900">Complete Your Order</h1>
        </div>

        <div className="grid md:grid-cols-5 gap-8">
          {/* Cart summary sidebar */}
          <div className="md:col-span-2">
            <div className="bg-white rounded-2xl border border-gold-100 p-5 sticky top-24 shadow-sm">
              <h2 className="font-display text-lg text-sky-800 mb-4">Your Items</h2>
              <div className="space-y-3">
                {cart.map(item => (
                  <div key={item._id} className="flex gap-3 items-center">
                    <div className="w-10 h-10 rounded-lg bg-gold-50 overflow-hidden flex-shrink-0 border border-gold-100">
                      {item.image ? (
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-lg">
                          {item.section === 'beauty' ? '💄' : '📦'}
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sky-700 text-xs font-medium truncate">
                        {item.name}
                      </p>
                      <p className="text-sky-400 text-xs">×{item.qty}</p>
                    </div>
                    <span className="text-sky-700 text-xs font-bold flex-shrink-0">
                      KES {(item.price * item.qty).toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>

              <div className="border-t border-gold-100 mt-4 pt-4 flex justify-between">
                <span className="text-sky-600 text-sm font-semibold">Total</span>
                <span className="text-sky-800 font-display text-xl font-bold">
                  KES {cart.reduce((acc, i) => acc + i.price * i.qty, 0).toLocaleString()}
                </span>
              </div>

              <button
                onClick={() => navigate(-1)}
                className="mt-4 w-full py-2 text-sky-400 text-xs hover:text-sky-600 transition-colors text-center"
              >
                ← Continue shopping
              </button>
            </div>
          </div>

          {/* Order form */}
          <div className="md:col-span-3">
            <OrderForm />
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}