import crypto from 'crypto'

/**
 * Generates a human-readable mentor code like PS-A3F9K2
 */
export const generateMentorCode = (): string => {
  const segment = crypto.randomBytes(3).toString('hex').toUpperCase()
  return `PS-${segment}`
}