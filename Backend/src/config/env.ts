// Centralised env validation — import this early in server.ts if you want strict startup checks
const required = ['MONGO_URI', 'JWT_SECRET', 'FRONTEND_URL']

export const validateEnv = () => {
  const missing = required.filter(k => !process.env[k])
  if (missing.length) {
    throw new Error(`Missing required environment variables: ${missing.join(', ')}`)
  }
}

export const env = {
  PORT:          process.env.PORT         || '5000',
  MONGO_URI:     process.env.MONGO_URI    || '',
  JWT_SECRET:    process.env.JWT_SECRET   || 'fallback_secret_change_me',
  JWT_EXPIRES:   process.env.JWT_EXPIRES  || '24h',
  FRONTEND_URL:  process.env.FRONTEND_URL || 'http://localhost:5173',
  NODE_ENV:      process.env.NODE_ENV     || 'development',
}