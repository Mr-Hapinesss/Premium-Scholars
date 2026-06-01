import dotenv from 'dotenv'
dotenv.config()

import app from './app.js'
import { connectDB } from './config/db.js'

const PORT = process.env.PORT || 5000

app.get('/', (req, res) => {
  res.status(200).json({
    message: "Premium Scholars API Backend is running perfectly!",
    status: "healthy",
    timestamp: new Date()
  });
});

const start = async () => {
  await connectDB()
  app.listen(PORT, () => {
    console.log(`Premium Scholars API running on http://localhost:${PORT}`)
  })
}

start().catch(err => {
  console.error('Failed to start server:', err)
  process.exit(1)
})