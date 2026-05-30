import { useCart } from '../../hooks/useCart'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

interface Props {
  open: boolean
  onClose: () => void
}

export default function CartDrawer({ open, onClose }: Props) {
  const { cart, removeFromCart, updateQty, total, clearCart } = useCart()
  const { user } = useAuth()
  const navigate  = useNavigate()

  const handleCheckout = () => {
  onClose()
  if (!user) {
    navigate('/mentorship/login', { state: { from: { pathname: '/requirements/checkout' } } })
    return
  }
    navigate('/requirements/checkout')
  }

  return (
    <>
      {/* Backdrop */}
      {open && (
        <div
          className="fixed inset-0 bg-sky-900/30 backdrop-blur-sm z-40"
          onClick={onClose}
        />
      )}

      {/* Drawer */}
      <div className={`
        fixed right-0 top-0 bottom-0 w-full max-w-sm bg-white z-50 shadow-2xl
        transition-transform duration-300 flex flex-col
        ${open ? 'translate-x-0' : 'translate-x-full'}
      `}>
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-sky-100">
          <h2 className="font-display text-xl text-sky-900">Your Cart</h2>
          <button onClick={onClose} className="text-sky-400 hover:text-sky-700 text-xl">✕</button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
          {cart.length === 0 ? (
            <div className="text-center py-16">
              <div className="text-5xl mb-3">🛒</div>
              <p className="text-sky-400 text-sm">Your cart is empty</p>
            </div>
          ) : (
            cart.map(item => (
              <div key={item._id} className="flex gap-3 items-start bg-sky-50 rounded-2xl p-3">
                <div className="w-14 h-14 rounded-xl bg-sky-100 overflow-hidden flex-shrink-0">
                  {item.image
                    ? <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                    : <div className="w-full h-full flex items-center justify-center text-2xl">📦</div>
                  }
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sky-800 text-sm truncate">{item.name}</p>
                  <p className="text-sky-500 text-xs mt-0.5">KES {item.price.toLocaleString()}</p>
                  {/* Qty controls */}
                  <div className="flex items-center gap-2 mt-2">
                    <button
                      onClick={() => updateQty(item._id, item.qty - 1)}
                      className="w-6 h-6 rounded-full bg-sky-200 text-sky-700 text-sm font-bold hover:bg-sky-300 transition-colors flex items-center justify-center"
                    >−</button>
                    <span className="text-sky-800 text-sm w-4 text-center">{item.qty}</span>
                    <button
                      onClick={() => updateQty(item._id, item.qty + 1)}
                      className="w-6 h-6 rounded-full bg-sky-200 text-sky-700 text-sm font-bold hover:bg-sky-300 transition-colors flex items-center justify-center"
                    >+</button>
                  </div>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="font-bold text-sky-800 text-sm">KES {(item.price * item.qty).toLocaleString()}</p>
                  <button
                    onClick={() => removeFromCart(item._id)}
                    className="text-xs text-rose hover:underline mt-1"
                  >Remove</button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {cart.length > 0 && (
          <div className="border-t border-sky-100 px-6 py-5 space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sky-600 font-medium">Total</span>
              <span className="font-display text-xl font-bold text-sky-900">KES {total.toLocaleString()}</span>
            </div>
            <button
              onClick={handleCheckout}
              className="w-full py-3.5 bg-sky-600 text-white rounded-xl font-semibold hover:bg-sky-700 transition-colors"
            >
              Checkout
            </button>
            <button
              onClick={clearCart}
              className="w-full py-2 text-sky-400 text-sm hover:text-rose transition-colors"
            >
              Clear cart
            </button>
          </div>
        )}
      </div>
    </>
  )
}