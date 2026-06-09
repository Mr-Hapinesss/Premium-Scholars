import mongoose, { Schema, Document, Types } from 'mongoose'

export interface IPasswordReset extends Document {
  _id:       Types.ObjectId
  userId:    Types.ObjectId
  token:     string
  expiresAt: Date
  used:      boolean
  createdAt: Date
}

const PasswordResetSchema = new Schema<IPasswordReset>(
  {
    userId: {
      type:     Schema.Types.ObjectId,
      ref:      'User',
      required: true,
      index:    true,
    },
    token: {
      type:     String,
      required: true,
      unique:   true,
      index:    true,
    },
    expiresAt: {
      type:     Date,
      required: true,
      index:    { expires: 0 },  // MongoDB TTL — auto-deletes after expiry
    },
    used: {
      type:    Boolean,
      default: false,
    },
  },
  { timestamps: true }
)

export const PasswordReset = mongoose.model<IPasswordReset>('PasswordReset', PasswordResetSchema)