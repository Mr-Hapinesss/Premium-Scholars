/* 
this file does this: 
1. Connects to the database, 
2. Checks if an admin user exists, 
3. If not, creates the admin user and seeds mentor codes, 
4. Disconnects from the database and exits.
*/
import dotenv from 'dotenv'
dotenv.config()

import mongoose from 'mongoose'
import { connectDB } from './config/db.js'
import { User } from './models/User.model.js'
import { MentorCode } from './models/MentorCode.model.js'
import { hashPassword } from './utils/password.utils.js'
import { generateMentorCode } from './utils/mentorCode.utils.js'

const seed = async () => {
  await connectDB()

  // ── Admin user ──
  const existing = await User.findOne({ email: 'admin@premiumscholars.co.ke' })
  if (!existing) {
    const hashed = await hashPassword('Admin@1234')
    const admin  = await User.create({
      name:     'Premium Scholars Admin',
      email:    'admin@premiumscholars.co.ke',
      password: hashed,
      role:     'admin',
    })
    console.log('✅ Admin created:', admin.email)

    // ── Seed 10 mentor codes ──
    const codes = Array.from({ length: 10 }, () => ({
      code:      generateMentorCode(),
      createdBy: admin._id,
    }))
    await MentorCode.insertMany(codes)
    console.log('✅ Mentor codes seeded:', codes.map(c => c.code).join(', '))
  } else {
    console.log('ℹ️  Admin already exists, skipping seed.')
  }

  await mongoose.disconnect()
  console.log('🏁 Seed complete')
  process.exit(0)
}

seed().catch(err => {
  console.error('Seed failed:', err)
  process.exit(1)
})