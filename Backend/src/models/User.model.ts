import mongoose, { Schema, Document, Types } from 'mongoose'

export type UserRole = 'admin' | 'mentor' | 'mentee'

export interface IUser extends Document {
  _id: Types.ObjectId
  name: string
  email: string
  password: string
  role: UserRole
  university?: string
  mentorId?: Types.ObjectId | null
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

const UserSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      maxlength: [100, 'Name cannot exceed 100 characters'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email'],
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [6, 'Password must be at least 6 characters'],
      select: false,
    },
    role: {
      type: String,
      enum: ['admin', 'mentor', 'mentee'],
      default: 'mentee',
    },
    university: {
      type: String,
      trim: true,
    },
    mentorId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      default: null,
      index: true,      // ← index added: getMyMentees queries this constantly
    },
    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
  },
  { timestamps: true }
)

// Compound index for mentor's mentee lookups
UserSchema.index({ mentorId: 1, role: 1 })

// Text index for admin user search
UserSchema.index({ name: 'text', email: 'text' })

UserSchema.methods.toJSON = function () {
  const obj = this.toObject()
  delete obj.password
  return obj
}

export const User = mongoose.model<IUser>('User', UserSchema)