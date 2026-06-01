import mongoose from 'mongoose'
import dotenv from 'dotenv'

dotenv.config()

export const connectDB = async (): Promise<void> => {
  const uri = process.env.MONGO_URI
  if (!uri) throw new Error('MONGO_URI is not defined in environment variables')

  try {
    await mongoose.connect(uri, {
      dbName: 'Premium-Scholars',
    })
    console.log('✅ MongoDB connected successfully')
  } catch (err) {
    console.error('❌ MongoDB connection failed:', err)
    process.exit(1)
  }

  mongoose.connection.on('disconnected', () => console.warn('⚠️  MongoDB disconnected'))
  mongoose.connection.on('error', err => console.error('MongoDB error:', err))
}