import mongoose, { Schema, Document, Types } from 'mongoose'

export interface INewsPost extends Document {
  _id: Types.ObjectId
  title: string
  body: string
  imageUrl?: string    // relative path served under /uploads/news/
  author: string       // display name — pulled from req.user.name at creation
  createdBy: Types.ObjectId
  createdAt: Date
  updatedAt: Date
}

const NewsPostSchema = new Schema<INewsPost>(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      maxlength: [200, 'Title cannot exceed 200 characters'],
    },
    body: {
      type: String,
      required: [true, 'Body is required'],
    },
    imageUrl: {
      type: String,
      default: null,
    },
    author: {
      type: String,
      required: true,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  { timestamps: true }
)

export const NewsPost = mongoose.model<INewsPost>('NewsPost', NewsPostSchema)