import dotenv from 'dotenv'
dotenv.config()

import app from './app.js'
import { connectDB } from './config/db.js'
import { verifyEmailConnection } from './utils/email.utils.js'


const PORT = process.env.PORT || 5000


const start = async () => {
  await connectDB()
  await verifyEmailConnection()
  app.listen(PORT, () => {
    console.log(`Premium Scholars API running on http://localhost:${PORT}`)
  })
}

start().catch(err => {
  console.error('Failed to start server:', err)
  process.exit(1)
})