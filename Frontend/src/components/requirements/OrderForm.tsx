import { useState } from 'react'
import { useCart } from '../../hooks/useCart'
import { useAuth } from '../../context/AuthContext'
import { requirementsService } from '../../services/requirements.service'
import { useToast } from '../shared/Toast'
import { useNavigate } from 'react-router-dom'

function getOrCreateIdempotencyKey(cartFingerprint: string): string {
  const storageKey = `ps_idem_${cartFingerprint}`
  const existing   = sessionStorage.getItem(storageKey)
  if (existing) return existing
  const newKey = typeof crypto !== 'undefined' && crypto.randomUUID
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
  const [lastError, setLastError] = useState('')

  // Determine section from cart — all items in cart should be same section
  const section = cart[0]?.section ?? 'requirements'

  // Fingerprint includes section so beauty and requirements carts
  // never share an idempotency key
  const cartFingerprint = cart.length > 0
    ? `${section}:${cart.map(i => `${i._id}:${i.qty}`).sort().join(',')}`
    : ''

  const idempotencyKey = cartFingerprint
    ? getOrCreateIdempotencyKey(cartFingerprint)
    : ''

  const handleSubmit = async (isRetry = false) => {
    setLastError('')

    if (!address.trim()) {
      toast('Please enter a delivery address', 'error')
      return
    }

    if (cart.length === 0) {
      toast('Your cart is empty', 'error')
      return
    }

    if (isRetry) setRetrying(true)
    else         setLoading(true)

    try {
      await requirementsService.placeOrder({
        items: cart.map(i => ({
          itemId: i._id,
          qty:    i.qty,
        })),
        deliveryAddress: address.trim(),
        notes:           notes.trim() || undefined,
        section,
        idempotencyKey,
      })

      // Clean up idempotency key — order confirmed
      if (cartFingerprint) {
        sessionStorage.removeItem(`ps_idem_${cartFingerprint}`)
      }

      clearCart()
      toast('Order placed successfully 🎉', 'success')
      navigate('/requirements')
    } catch (err: any) {
      // Extract the most useful error message
      const serverMsg  = err.response?.data?.message
      const networkMsg = err.code === 'ECONNABORTED' || !err.response
        ? 'Connection lost. Your order may still be processing — tap Retry to check.'
        : null
      const msg = networkMsg ?? serverMsg ?? err.message ?? 'Something went wrong'

      setLastError(msg)
      toast(msg, 'error')
    } finally {
      setLoading(false)
      setRetrying(false)
    }
  }

  const sectionLabel = section === 'beauty' ? 'Beauty' : 'Requirements'

  return (
    <div className="bg-white rounded-2xl border border-gold-100 p-6 shadow-sm">
      <h2 className="font-display text-xl text-sky-900 mb-1">Order Details</h2>
      <p className="text-sky-400 text-xs mb-5">
        {sectionLabel} order — {cart.length} item{cart.length !== 1 ? 's' : ''}
      </p>

      {/* Cart summary */}
      <div className="space-y-2 mb-5 p-4 bg-sky-50 rounded-xl border border-sky-100">
        {cart.map(item => (
          <div key={item._id} className="flex justify-between text-sm text-sky-600">
            <span className="truncate flex-1 mr-3">
              {item.name} × {item.qty}
            </span>
            <span className="font-semibold flex-shrink-0">
              KES {(item.price * item.qty).toLocaleString()}
            </span>
          </div>
        ))}
        <div className="border-t border-sky-200 pt-2 flex justify-between font-bold text-sky-800 text-sm">
          <span>Total</span>
          <span>KES {total.toLocaleString()}</span>
        </div>
      </div>

      <div className="space-y-4">
        {/* Name — read only */}
        <div>
          <label className="block text-sky-700 text-xs font-semibold mb-1.5 uppercase tracking-wide">
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
          <label className="block text-sky-700 text-xs font-semibold mb-1.5 uppercase tracking-wide">
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
          <label className="block text-sky-700 text-xs font-semibold mb-1.5 uppercase tracking-wide">
            Delivery Address / Hostel <span className="text-red-400">*</span>
          </label>
          <input
            type="text"
            value={address}
            onChange={e => setAddress(e.target.value)}
            placeholder="e.g. Kenya Hall, Room 14B, UoN Main Campus"
            className="w-full px-4 py-3 rounded-xl border border-gold-200 focus:outline-none focus:border-gold-400 focus:ring-2 focus:ring-gold-100 bg-gold-50 text-sky-800 text-sm transition-all"
          />
        </div>

        {/* Notes */}
        <div>
          <label className="block text-sky-700 text-xs font-semibold mb-1.5 uppercase tracking-wide">
            Notes (optional)
          </label>
          <textarea
            value={notes}
            onChange={e => setNotes(e.target.value)}
            placeholder="Any special delivery instructions..."
            rows={3}
            className="w-full px-4 py-3 rounded-xl border border-sky-200 focus:outline-none focus:border-sky-400 bg-sky-50 text-sky-800 text-sm resize-none transition-all"
          />
        </div>

        {/* Error display */}
        {lastError && (
          <div className="flex items-start gap-2 bg-red-50 border border-red-200 rounded-xl px-4 py-3">
            <span className="text-red-400 flex-shrink-0 mt-0.5">⚠</span>
            <p className="text-red-600 text-sm">{lastError}</p>
          </div>
        )}

        {/* Submit */}
        <button
          onClick={() => handleSubmit(false)}
          disabled={loading || retrying || cart.length === 0 || !address.trim()}
          className="w-full py-4 bg-gold-400 text-sky-900 rounded-xl font-bold text-base hover:bg-gold-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-sm"
        >
          {loading && (
            <span className="w-4 h-4 border-2 border-sky-900/30 border-t-sky-900 rounded-full animate-spin" />
          )}
          {loading
            ? 'Placing order...'
            : `Place Order — KES ${total.toLocaleString()}`
          }
        </button>

        {/* Retry */}
        <button
          onClick={() => handleSubmit(true)}
          disabled={loading || retrying || cart.length === 0}
          className="w-full py-2.5 bg-white text-sky-500 rounded-xl font-medium text-sm border border-sky-200 hover:bg-sky-50 transition-colors disabled:opacity-40 flex items-center justify-center gap-2"
        >
          {retrying && (
            <span className="w-3.5 h-3.5 border-2 border-sky-300 border-t-sky-600 rounded-full animate-spin" />
          )}
          {retrying ? 'Checking...' : '↻ Retry if your order did not go through'}
        </button>

        <p className="text-center text-sky-300 text-xs">
          Safe to retry — duplicate orders are automatically prevented.
        </p>
      </div>
    </div>
  )
}