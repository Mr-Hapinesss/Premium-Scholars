import mongoose, { Schema, Document, Types } from 'mongoose'

export type BeautyCategory = 'Skincare' | 'Makeup' | 'Haircare' | 'Fragrance' | 'Nails' | 'Other'

export interface IBeautyProduct extends Document {
  _id: Types.ObjectId
  name: string
  description: string
  price: number
  category: BeautyCategory
  images: string[]       // relative paths served under /uploads/beauty/
  inStock: boolean
  stock: number
  createdBy: Types.ObjectId
  createdAt: Date
  updatedAt: Date
}

const BeautyProductSchema = new Schema<IBeautyProduct>(
  {
    name: {
      type: String,
      required: [true, 'Product name is required'],
      trim: true,
    },
    description: {
      type: String,
      default: '',
    },
    price: {
      type: Number,
      required: [true, 'Price is required'],
      min: [0, 'Price cannot be negative'],
    },
    category: {
      type: String,
      enum: ['Skincare', 'Makeup', 'Haircare', 'Fragrance', 'Nails', 'Other'],
      default: 'Other',
    },
    images: [{ type: String }],
    inStock: {
      type: Boolean,
      default: true,
    },
    stock: {
      type: Number,
      default: 0,
      min: 0,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  { timestamps: true }
)

BeautyProductSchema.index({ name: 'text', description: 'text' })

export const BeautyProduct = mongoose.model<IBeautyProduct>('BeautyProduct', BeautyProductSchema)