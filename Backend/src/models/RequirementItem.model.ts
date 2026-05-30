import mongoose, { Schema, Document, Types } from 'mongoose'

export interface IRequirementItem extends Document {
  _id: Types.ObjectId
  name: string
  description: string
  price: number
  category: string
  image?: string      // relative path served under /uploads/requirements/
  inStock: boolean
  stock: number
  createdBy: Types.ObjectId
  createdAt: Date
  updatedAt: Date
}

const RequirementItemSchema = new Schema<IRequirementItem>(
  {
    name: {
      type: String,
      required: [true, 'Item name is required'],
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
      trim: true,
      default: 'General',
    },
    image: {
      type: String,
      default: null,
    },
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

RequirementItemSchema.index({ name: 'text', description: 'text', category: 'text' })

export const RequirementItem = mongoose.model<IRequirementItem>('RequirementItem', RequirementItemSchema)