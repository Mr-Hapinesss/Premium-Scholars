import mongoose, { Schema, Document, Types } from 'mongoose'

export type OrderStatus = 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled'
export type OrderSection = 'beauty' | 'requirements'

export interface IOrderItem {
  itemId: Types.ObjectId
  name: string
  price: number
  qty: number
  image?: string
}

export interface IOrder extends Document {
  _id: Types.ObjectId
  userId: Types.ObjectId
  items: IOrderItem[]
  total: number
  status: OrderStatus
  section: OrderSection
  deliveryAddress?: string
  notes?: string
  createdAt: Date
  updatedAt: Date
}

const OrderItemSchema = new Schema<IOrderItem>(
  {
    itemId:  { type: Schema.Types.ObjectId, required: true },
    name:    { type: String, required: true },
    price:   { type: Number, required: true },
    qty:     { type: Number, required: true, min: 1 },
    image:   { type: String },
  },
  { _id: false }
)

const OrderSchema = new Schema<IOrder>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    items: {
      type: [OrderItemSchema],
      required: true,
      validate: {
        validator: (v: IOrderItem[]) => v.length > 0,
        message: 'Order must have at least one item',
      },
    },
    total: {
      type: Number,
      required: true,
      min: 0,
    },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'],
      default: 'pending',
    },
    section: {
      type: String,
      enum: ['beauty', 'requirements'],
      required: true,
    },
    deliveryAddress: { type: String },
    notes:           { type: String },
  },
  { timestamps: true }
)

export const Order = mongoose.model<IOrder>('Order', OrderSchema)