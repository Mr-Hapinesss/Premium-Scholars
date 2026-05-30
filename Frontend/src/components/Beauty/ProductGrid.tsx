import ProductCard from './ProductCard'
import LoadingSpinner from '../shared/LoadingSpinner'
import EmptyState from '../shared/EmptyState'
import { BeautyProduct } from '../../types/product.types'

interface Props {
  products: BeautyProduct[]
  loading: boolean
}

export default function ProductGrid({ products, loading }: Props) {
  if (loading) return <LoadingSpinner />

  if (!products.length) {
    return (
      <EmptyState
        icon="💄"
        title="No products found"
        subtitle="Try a different search or category."
      />
    )
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
      {products.map(p => (
        <ProductCard key={p._id} product={p} />
      ))}
    </div>
  )
}