import { useState, useRef } from 'react'
import { useToast } from '../shared/Toast'

interface Props {
  section: 'beauty' | 'requirements'
  onAdded: (product: any) => void
  existing?: any
  onUpdated?: (product: any) => void
}

const beautyCategories = ['Skincare', 'Makeup', 'Haircare', 'Fragrance', 'Nails', 'Other']

export default function AdminProductForm({ section, onAdded, existing, onUpdated }: Props) {
  const { toast } = useToast()
  const fileRef   = useRef<HTMLInputElement>(null)
  const isEdit    = !!existing

  const [form, setForm] = useState({
    name:        existing?.name        || '',
    description: existing?.description || '',
    price:       existing?.price       || '',
    category:    existing?.category    || (section === 'beauty' ? 'Skincare' : 'General'),
    stock:       existing?.stock       || '',
  })
  const [files,   setFiles]   = useState<File[]>([])
  const [loading, setLoading] = useState(false)

  const handleSubmit = async () => {
    if (!form.name || !form.price) { toast('Name and price are required', 'error'); return }

    setLoading(true)
    try {
      const data = new FormData()
      Object.entries(form).forEach(([k, v]) => data.append(k, String(v)))
      files.forEach(f => data.append('images', f))

      const endpoint = section === 'beauty' ? '/beauty' : '/requirements'
      const method   = isEdit ? 'PUT' : 'POST'
      const url      = isEdit ? `${endpoint}/${existing._id}` : endpoint

      // Using raw fetch here so we can send FormData
      const res = await fetch(`${import.meta.env.VITE_API_URL}${url}`, {
        method,
        headers: { Authorization: `Bearer ${localStorage.getItem('ps_token')}` },
        body: data,
      })
      const json = await res.json()
      if (!json.success) throw new Error(json.message)

      isEdit ? onUpdated?.(json.data) : onAdded(json.data)
      toast(isEdit ? 'Product updated ✓' : 'Product created ✓', 'success')

      if (!isEdit) {
        setForm({ name: '', description: '', price: '', category: beautyCategories[0], stock: '' })
        setFiles([])
        if (fileRef.current) fileRef.current.value = ''
      }
    } catch (err: any) {
      toast(err.message || 'Failed to save product', 'error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-white rounded-2xl border border-sky-100 p-6 mb-6">
      <h3 className="font-display text-lg text-sky-800 mb-4">{isEdit ? 'Edit Product' : 'Add New Product'}</h3>
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="text-sky-600 text-xs font-medium block mb-1">Name *</label>
          <input
            value={form.name}
            onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
            placeholder="Product name"
            className="w-full px-3 py-2.5 rounded-xl border border-sky-200 text-sm focus:outline-none focus:border-sky-400"
          />
        </div>
        <div>
          <label className="text-sky-600 text-xs font-medium block mb-1">Price (KES) *</label>
          <input
            type="number" min="0"
            value={form.price}
            onChange={e => setForm(p => ({ ...p, price: e.target.value }))}
            placeholder="0"
            className="w-full px-3 py-2.5 rounded-xl border border-sky-200 text-sm focus:outline-none focus:border-sky-400"
          />
        </div>
        <div>
          <label className="text-sky-600 text-xs font-medium block mb-1">Category</label>
          <select
            value={form.category}
            onChange={e => setForm(p => ({ ...p, category: e.target.value }))}
            className="w-full px-3 py-2.5 rounded-xl border border-sky-200 text-sm focus:outline-none focus:border-sky-400 bg-white"
          >
            {(section === 'beauty' ? beautyCategories : ['Stationery', 'Bedding', 'Kitchen', 'Electronics', 'Clothing', 'General']).map(c => (
              <option key={c}>{c}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="text-sky-600 text-xs font-medium block mb-1">Stock Quantity</label>
          <input
            type="number" min="0"
            value={form.stock}
            onChange={e => setForm(p => ({ ...p, stock: e.target.value }))}
            placeholder="0"
            className="w-full px-3 py-2.5 rounded-xl border border-sky-200 text-sm focus:outline-none focus:border-sky-400"
          />
        </div>
        <div className="md:col-span-2">
          <label className="text-sky-600 text-xs font-medium block mb-1">Description</label>
          <textarea
            value={form.description}
            onChange={e => setForm(p => ({ ...p, description: e.target.value }))}
            placeholder="Product description..."
            rows={3}
            className="w-full px-3 py-2.5 rounded-xl border border-sky-200 text-sm focus:outline-none focus:border-sky-400 resize-none"
          />
        </div>
        <div className="md:col-span-2">
          <label className="text-sky-600 text-xs font-medium block mb-1">
            {section === 'beauty' ? 'Images (up to 5)' : 'Image'}
          </label>
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            multiple={section === 'beauty'}
            onChange={e => setFiles(Array.from(e.target.files || []))}
            className="text-sm text-sky-500"
          />
          {files.length > 0 && (
            <div className="flex gap-2 mt-2">
              {files.map((f, i) => (
                <div key={i} className="w-12 h-12 rounded-lg overflow-hidden border border-sky-200">
                  <img src={URL.createObjectURL(f)} alt="" className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      <button
        onClick={handleSubmit}
        disabled={loading}
        className="mt-4 px-6 py-2.5 bg-sky-600 text-white rounded-xl text-sm font-semibold hover:bg-sky-700 transition-colors disabled:opacity-50"
      >
        {loading ? 'Saving...' : isEdit ? 'Save Changes' : 'Create Product'}
      </button>
    </div>
  )
}