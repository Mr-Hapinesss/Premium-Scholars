import { useState } from 'react'
import { useCart } from '../../hooks/useCart'
import { useAuth } from '../../context/AuthContext'
import { requirementsService } from '../../services/requirements.service'
import { useToast } from '../shared/Toast'
import { useNavigate } from 'react-router-dom'

export default function OrderForm() {
  const { cart, total, clearCart } = useCart()
  const { user }                    = useAuth()
  const { toast }                   = useToast()
  const navigate                    = useNavigate()
  const [address, setAddress]       = useState('')
  const [notes,   setNotes]         = useState('')
  const [loading, setLoading]       = useState(false)

  const handleSubmit = async () => {
    if (!address.trim()) { toast('Please enter a delivery address', 'error'); return }

    setLoading(true)
    try {
      await requirementsService.placeOrder({
        items: cart.map(i => ({ itemId: i._id, qty: i.qty })),
        deliveryAddress: address,
        notes,
        section: cart[0]?.section || 'requirements',
      })
      clearCart()
      toast('Order placed successfully! 🎉', 'success')
      navigate('/requirements')
    } catch (err: any) {
      toast(err.response?.data?.message || 'Failed to place order', 'error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-white rounded-2xl border border-gold-100 p-6">
      <h2 className="font-display text-xl text-sky-900 mb-5">Order Details</h2>

      {/* Order summary */}
      <div className="space-y-2 mb-5">
        {cart.map(item => (
          <div key={item._id} className="flex justify-between text-sm text-sky-600">
            <span>{item.name} × {item.qty}</span>
            <span className="font-medium">KES {(item.price * item.qty).toLocaleString()}</span>
          </div>
        ))}
        <div className="border-t border-gold-100 pt-2 flex justify-between font-bold text-sky-800">
          <span>Total</span>
          <span>KES {total.toLocaleString()}</span>
        </div>
      </div>

      {/* Form fields */}
      <div className="space-y-4">
        <div>
          <label className="text-sky-700 text-sm font-medium block mb-1">Your Name</label>
          <input
            value={user?.name || ''}
            disabled
            className="w-full px-4 py-3 rounded-xl border border-sky-200 bg-sky-50 text-sky-600 text-sm cursor-not-allowed"
          />
        </div>
        <div>
          <label className="text-sky-700 text-sm font-medium block mb-1">Email</label>
          <input
            value={user?.email || ''}
            disabled
            className="w-full px-4 py-3 rounded-xl border border-sky-200 bg-sky-50 text-sky-600 text-sm cursor-not-allowed"
          />
        </div>
        <div>
          <label className="text-sky-700 text-sm font-medium block mb-1">Delivery Address / Hostel <span className="text-rose">*</span></label>
          <input
            value={address}
            onChange={e => setAddress(e.target.value)}
            placeholder="e.g. Kenya Hall, Room 14B, UoN"
            className="w-full px-4 py-3 rounded-xl border border-gold-200 focus:outline-none focus:border-gold-400 bg-gold-50 text-sky-800 text-sm"
          />
        </div>
        <div>
          <label className="text-sky-700 text-sm font-medium block mb-1">Notes (optional)</label>
          <textarea
            value={notes}
            onChange={e => setNotes(e.target.value)}
            placeholder="Any special instructions..."
            rows={3}
            className="w-full px-4 py-3 rounded-xl border border-sky-200 focus:outline-none focus:border-sky-400 bg-sky-50 text-sky-800 text-sm resize-none"
          />
        </div>

        <button
          onClick={handleSubmit}
          disabled={loading || cart.length === 0}
          className="w-full py-4 bg-gold-400 text-sky-900 rounded-xl font-bold text-lg hover:bg-gold-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Placing order...' : `Place Order — KES ${total.toLocaleString()}`}
        </button>
      </div>
    </div>
  )
}