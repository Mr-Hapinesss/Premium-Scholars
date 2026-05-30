import mongoose, { Schema, Document, Types } from 'mongoose'

export interface IMentorCode extends Document {
  _id: Types.ObjectId
  code: string
  isUsed: boolean
  usedBy?: Types.ObjectId | null
  createdBy: Types.ObjectId
  createdAt: Date
  updatedAt: Date
}

const MentorCodeSchema = new Schema<IMentorCode>(
  {
    code: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true,
    },
    isUsed: {
      type: Boolean,
      default: false,
    },
    usedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  { timestamps: true }
)

export const MentorCode = mongoose.model<IMentorCode>('MentorCode', MentorCodeSchema)