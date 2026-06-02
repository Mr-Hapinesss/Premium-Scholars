import { useState, useEffect } from 'react'
import { useCart } from '../../hooks/useCart'
import { useAuth } from '../../context/AuthContext'
import { requirementsService } from '../../services/requirements.service'
import { useToast } from '../shared/Toast'
import { useNavigate } from 'react-router-dom'

// Generate or retrieve a stable idempotency key for this checkout session
function getOrCreateIdempotencyKey(cartFingerprint: string): string {
  const storageKey = `ps_idem_${cartFingerprint}`
  const existing   = sessionStorage.getItem(storageKey)
  if (existing) return existing
  // crypto.randomUUID is available in all modern browsers
  const newKey = typeof crypto.randomUUID === 'function'
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(36).slice(2)}`
  sessionStorage.setItem(storageKey, newKey)
  return newKey
}

export default function OrderForm() {
  const { cart, total, clearCart } = useCart()
  const { user }                   = useAuth()
  const { toast }                  = useToast()
  const navigate                   = useNavigate()

  const [address,  setAddress]  = useState('')
  const [notes,    setNotes]    = useState('')
  const [loading,  setLoading]  = useState(false)
  const [retrying, setRetrying] = useState(false)

  // Cart fingerprint — changes if cart contents change
  // Used to scope the idempotency key to this specific cart
  const cartFingerprint = cart
    .map(i => `${i._id}:${i.qty}`)
    .sort()
    .join(',')

  const idempotencyKey = cartFingerprint ? getOrCreateIdempotencyKey(cartFingerprint) : ''

  const handleSubmit = async (isRetry = false) => {
    if (!address.trim()) {
      toast('Please enter a delivery address', 'error')
      return
    }
    if (isRetry) setRetrying(true)
    else         setLoading(true)

    try {
      await requirementsService.placeOrder({
        items:           cart.map(i => ({ itemId: i._id, qty: i.qty })),
        deliveryAddress: address.trim(),
        notes:           notes.trim(),
        section:         cart[0]?.section ?? 'requirements',
        idempotencyKey,
      })

      // Clear the idempotency key from session — order is done
      sessionStorage.removeItem(`ps_idem_${cartFingerprint}`)

      clearCart()
      toast('Order placed successfully 🎉', 'success')
      navigate('/requirements')
    } catch (err: any) {
      const msg = err.response?.data?.message ?? err.message ?? 'Something went wrong'

      // Network error or timeout — tell the user they can safely retry
      if (!err.response || err.code === 'ECONNABORTED') {
        toast(
          'Connection lost. Your order may still be processing — tap "Retry" to check.',
          'error'
        )
      } else {
        toast(msg, 'error')
      }
    } finally {
      setLoading(false)
      setRetrying(false)
    }
  }

  return (
    <div className="bg-white rounded-2xl border border-gold-100 p-6 shadow-sm">
      <h2 className="font-display text-xl text-sky-900 mb-5">Order Details</h2>

      {/* Cart summary */}
      <div className="space-y-2 mb-5 p-4 bg-sky-50 rounded-xl border border-sky-100">
        {cart.map(item => (
          <div key={item._id} className="flex justify-between text-sm text-sky-600">
            <span className="truncate flex-1 mr-3">{item.name} × {item.qty}</span>
            <span className="font-semibold flex-shrink-0">
              KES {(item.price * item.qty).toLocaleString()}
            </span>
          </div>
        ))}
        <div className="border-t border-sky-200 pt-2 flex justify-between font-bold text-sky-800">
          <span>Total</span>
          <span>KES {total.toLocaleString()}</span>
        </div>
      </div>

      <div className="space-y-4">
        {/* Name — read only */}
        <div>
          <label className="text-sky-700 text-xs font-semibold block mb-1.5 uppercase tracking-wide">
            Your Name
          </label>
          <input
            value={user?.name ?? ''}
            disabled
            className="w-full px-4 py-3 rounded-xl border border-sky-200 bg-sky-50 text-sky-500 text-sm cursor-not-allowed"
          />
        </div>

        {/* Email — read only */}
        <div>
          <label className="text-sky-700 text-xs font-semibold block mb-1.5 uppercase tracking-wide">
            Email
          </label>
          <input
            value={user?.email ?? ''}
            disabled
            className="w-full px-4 py-3 rounded-xl border border-sky-200 bg-sky-50 text-sky-500 text-sm cursor-not-allowed"
          />
        </div>

        {/* Delivery address */}
        <div>
          <label className="text-sky-700 text-xs font-semibold block mb-1.5 uppercase tracking-wide">
            Delivery Address / Hostel <span className="text-red-400">*</span>
          </label>
          <input
            value={address}
            onChange={e => setAddress(e.target.value)}
            placeholder="e.g. Kenya Hall, Room 14B, UoN Main Campus"
            className="w-full px-4 py-3 rounded-xl border border-gold-200 focus:outline-none focus:border-gold-400 focus:ring-2 focus:ring-gold-100 bg-gold-50 text-sky-800 text-sm transition-all"
          />
        </div>

        {/* Notes */}
        <div>
          <label className="text-sky-700 text-xs font-semibold block mb-1.5 uppercase tracking-wide">
            Notes (optional)
          </label>
          <textarea
            value={notes}
            onChange={e => setNotes(e.target.value)}
            placeholder="Any special instructions for delivery..."
            rows={3}
            className="w-full px-4 py-3 rounded-xl border border-sky-200 focus:outline-none focus:border-sky-400 bg-sky-50 text-sky-800 text-sm resize-none transition-all"
          />
        </div>

        {/* Submit */}
        <button
          onClick={() => handleSubmit(false)}
          disabled={loading || retrying || cart.length === 0}
          className="w-full py-4 bg-gold-400 text-sky-900 rounded-xl font-bold text-base hover:bg-gold-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-sm"
        >
          {loading && (
            <span className="w-4 h-4 border-2 border-sky-900/30 border-t-sky-900 rounded-full animate-spin" />
          )}
          {loading ? 'Placing order...' : `Place Order — KES ${total.toLocaleString()}`}
        </button>

        {/* Retry button — only shows after a network failure leaves ambiguity */}
        <button
          onClick={() => handleSubmit(true)}
          disabled={loading || retrying || cart.length === 0}
          className="w-full py-3 bg-white text-sky-600 rounded-xl font-semibold text-sm border border-sky-200 hover:bg-sky-50 transition-colors disabled:opacity-40 flex items-center justify-center gap-2"
        >
          {retrying && (
            <span className="w-3.5 h-3.5 border-2 border-sky-300 border-t-sky-600 rounded-full animate-spin" />
          )}
          {retrying ? 'Checking...' : '↻ Retry if your order did not go through'}
        </button>

        <p className="text-center text-sky-400 text-xs">
          Safe to retry — duplicate orders are automatically prevented.
        </p>
      </div>
    </div>
  )
}