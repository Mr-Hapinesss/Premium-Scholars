import mongoose, { Schema, Document, Types } from 'mongoose'

export interface IAdminInvite extends Document {
  _id:       Types.ObjectId
  token:     string
  email?:    string            // optional pre-fill — admin can lock it to a specific email
  isUsed:    boolean
  usedBy?:   Types.ObjectId | null
  expiresAt: Date
  createdBy: Types.ObjectId
  createdAt: Date
  updatedAt: Date
}

const AdminInviteSchema = new Schema<IAdminInvite>(
  {
    token: {
      type:     String,
      required: true,
      unique:   true,
      index:    true,
    },
    email: {
      type:      String,
      lowercase: true,
      trim:      true,
      default:   null,
    },
    isUsed: {
      type:    Boolean,
      default: false,
      index:   true,
    },
    usedBy: {
      type:    Schema.Types.ObjectId,
      ref:     'User',
      default: null,
    },
    expiresAt: {
      type:     Date,
      required: true,
      // TTL index — MongoDB automatically deletes expired invite documents
      index:    { expires: 0 },
    },
    createdBy: {
      type:     Schema.Types.ObjectId,
      ref:      'User',
      required: true,
    },
  },
  { timestamps: true }
)

export const AdminInvite = mongoose.model<IAdminInvite>('AdminInvite', AdminInviteSchema)