import { useState, useRef } from 'react'
import { api } from '../../services/api'

interface Props {
  section: 'beauty' | 'requirements'
  onAdded: (product: any) => void
  existing?: any | null
  onUpdated?: (product: any) => void
  onCancel?: () => void
}

const BEAUTY_CATEGORIES    = ['Skincare', 'Makeup', 'Haircare', 'Fragrance', 'Nails', 'Other']
const REQ_CATEGORIES       = ['Stationery', 'Bedding', 'Kitchen', 'Electronics', 'Clothing', 'Toiletries', 'General']

export default function AdminProductForm({ section, onAdded, existing, onUpdated, onCancel }: Props) {
  const isEdit  = Boolean(existing)
  const fileRef = useRef<HTMLInputElement>(null)

  const [form, setForm] = useState({
    name:        existing?.name        ?? '',
    description: existing?.description ?? '',
    price:       existing?.price?.toString() ?? '',
    category:    existing?.category    ?? (section === 'beauty' ? 'Skincare' : 'General'),
    stock:       existing?.stock?.toString() ?? '0',
  })
  const [files,   setFiles]   = useState<File[]>([])
  const [previews, setPreviews] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const [error,   setError]   = useState('')

  const categories = section === 'beauty' ? BEAUTY_CATEGORIES : REQ_CATEGORIES
  const endpoint   = section === 'beauty' ? '/beauty' : '/requirements'

  const SPEC_HINTS: Record<string, { ratio: string; size: string; tip: string }> = {
  beauty: {
    ratio: '1:1 Square',
    size:  '800 × 800 px',
    tip:   'Product images are cropped to a square. Centre your product in the frame.',
  },
  requirements: {
    ratio: '3:2 Landscape',
    size:  '900 × 600 px',
    tip:   'Item images are cropped to landscape. Keep the subject centred.',
  },
}

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = Array.from(e.target.files ?? [])
    setFiles(selected)
    setPreviews(selected.map(f => URL.createObjectURL(f)))
  }

  const updateField = (key: keyof typeof form) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
      setForm(prev => ({ ...prev, [key]: e.target.value }))

  const handleSubmit = async () => {
    setError('')
    if (!form.name.trim())  { setError('Name is required'); return }
    if (!form.price.trim()) { setError('Price is required'); return }
    if (isNaN(Number(form.price)) || Number(form.price) < 0) {
      setError('Price must be a valid positive number')
      return
    }

    setLoading(true)
    try {
      const data = new FormData()
      data.append('name',        form.name.trim())
      data.append('description', form.description.trim())
      data.append('price',       form.price)
      data.append('category',    form.category)
      data.append('stock',       form.stock || '0')

      const fieldName = section === 'beauty' ? 'images' : 'image'
      if (section === 'beauty') {
        files.forEach(f => data.append(fieldName, f))
      } else if (files[0]) {
        data.append(fieldName, files[0])
      }

      let res
      if (isEdit) {
        res = await api.put(`${endpoint}/${existing._id}`, data, {
          headers: { 'Content-Type': 'multipart/form-data' },
        })
        onUpdated?.(res.data.data)
      } else {
        res = await api.post(endpoint, data, {
          headers: { 'Content-Type': 'multipart/form-data' },
        })
        onAdded(res.data.data)
      }

      // Reset form on successful create
      if (!isEdit) {
        setForm({ name: '', description: '', price: '', category: categories[0], stock: '0' })
        setFiles([])
        setPreviews([])
        if (fileRef.current) fileRef.current.value = ''
      }
    } catch (err: any) {
      setError(err.response?.data?.message ?? 'Failed to save. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-white rounded-2xl border border-sky-100 p-6 mb-6">
      <div className="flex items-center justify-between mb-5">
        <h3 className="font-display text-lg text-sky-800">
          {isEdit ? 'Edit Product' : `Add New ${section === 'beauty' ? 'Beauty Product' : 'Requirement Item'}`}
        </h3>
        {onCancel && (
          <button onClick={onCancel} className="text-sky-400 hover:text-sky-600 text-sm transition-colors">
            Cancel
          </button>
        )}
      </div>
      {SPEC_HINTS[section] && (
         <div className="md:col-span-2 bg-sky-50 border border-sky-100 rounded-xl px-4 py-3 flex gap-3 items-start">
           <span className="text-sky-400 text-lg flex-shrink-0">📐</span>
            <div>
              <p className="text-sky-700 text-xs font-semibold">
               Image spec: {SPEC_HINTS[section].ratio} — {SPEC_HINTS[section].size}
             </p>
             <p className="text-sky-400 text-xs mt-0.5">{SPEC_HINTS[section].tip}</p>
             <p className="text-sky-400 text-xs mt-0.5">
               Images are automatically resized and converted to WebP. Max 5 MB per file.
             </p>
           </div>
         </div>
        )}

      <div className="grid md:grid-cols-2 gap-4">
        {/* Name */}
        <div>
          <label className="block text-sky-700 text-xs font-semibold mb-1 uppercase tracking-wide">
            Name <span className="text-red-400">*</span>
          </label>
          <input
            type="text"
            value={form.name}
            onChange={updateField('name')}
            placeholder="Product name"
            className="w-full px-3 py-2.5 rounded-xl border border-sky-200 text-sm focus:outline-none focus:border-sky-400 focus:ring-1 focus:ring-sky-100 transition-all"
          />
        </div>

        {/* Price */}
        <div>
          <label className="block text-sky-700 text-xs font-semibold mb-1 uppercase tracking-wide">
            Price (KES) <span className="text-red-400">*</span>
          </label>
          <input
            type="number"
            min="0"
            step="0.01"
            value={form.price}
            onChange={updateField('price')}
            placeholder="0.00"
            className="w-full px-3 py-2.5 rounded-xl border border-sky-200 text-sm focus:outline-none focus:border-sky-400 focus:ring-1 focus:ring-sky-100 transition-all"
          />
        </div>

        {/* Category */}
        <div>
          <label className="block text-sky-700 text-xs font-semibold mb-1 uppercase tracking-wide">
            Category
          </label>
          <select
            value={form.category}
            onChange={updateField('category')}
            className="w-full px-3 py-2.5 rounded-xl border border-sky-200 text-sm bg-white focus:outline-none focus:border-sky-400 transition-all"
          >
            {categories.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>

        {/* Stock */}
        <div>
          <label className="block text-sky-700 text-xs font-semibold mb-1 uppercase tracking-wide">
            Stock Quantity
          </label>
          <input
            type="number"
            min="0"
            value={form.stock}
            onChange={updateField('stock')}
            placeholder="0"
            className="w-full px-3 py-2.5 rounded-xl border border-sky-200 text-sm focus:outline-none focus:border-sky-400 focus:ring-1 focus:ring-sky-100 transition-all"
          />
        </div>

        {/* Description */}
        <div className="md:col-span-2">
          <label className="block text-sky-700 text-xs font-semibold mb-1 uppercase tracking-wide">
            Description
          </label>
          <textarea
            value={form.description}
            onChange={updateField('description')}
            placeholder="Describe the product..."
            rows={3}
            className="w-full px-3 py-2.5 rounded-xl border border-sky-200 text-sm focus:outline-none focus:border-sky-400 focus:ring-1 focus:ring-sky-100 transition-all resize-none"
          />
        </div>

        {/* Images */}
        <div className="md:col-span-2">
          <label className="block text-sky-700 text-xs font-semibold mb-1 uppercase tracking-wide">
            {section === 'beauty' ? 'Images (up to 5)' : 'Image'}
          </label>
          <input
            ref={fileRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            multiple={section === 'beauty'}
            onChange={handleFileChange}
            className="text-sm text-sky-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-sky-100 file:text-sky-700 hover:file:bg-sky-200 cursor-pointer"
          />
          {previews.length > 0 && (
            <div className="flex gap-2 mt-3 flex-wrap">
              {previews.map((src, i) => (
                <div key={i} className="w-14 h-14 rounded-xl overflow-hidden border border-sky-200 flex-shrink-0">
                  <img src={src} alt={`Preview ${i + 1}`} className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
          )}
          {isEdit && existing?.images?.length > 0 && previews.length === 0 && (
            <div className="flex gap-2 mt-3 flex-wrap">
              {existing.images.slice(0, 5).map((img: string, i: number) => (
                <div key={i} className="w-14 h-14 rounded-xl overflow-hidden border border-sky-200 flex-shrink-0">
                  <img src={img} alt={`Existing ${i + 1}`} className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {error && (
        <div className="mt-4 px-4 py-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600">
          {error}
        </div>
      )}

      <div className="flex gap-3 mt-5">
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="px-6 py-2.5 bg-sky-600 text-white rounded-xl text-sm font-semibold hover:bg-sky-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          {loading && (
            <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          )}
          {loading ? 'Saving...' : isEdit ? 'Save Changes' : 'Create Product'}
        </button>
        {onCancel && (
          <button
            onClick={onCancel}
            disabled={loading}
            className="px-6 py-2.5 bg-sky-50 text-sky-600 rounded-xl text-sm font-semibold hover:bg-sky-100 transition-colors"
          >
            Cancel
          </button>
        )}
      </div>
    </div>
  )
}