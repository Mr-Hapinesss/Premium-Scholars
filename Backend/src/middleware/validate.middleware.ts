import type { Request, Response, NextFunction } from 'express'

type ValidationRule = {
  field: string
  required?: boolean
  type?: 'string' | 'number' | 'email'
  min?: number
  max?: number
}

export const validate = (rules: ValidationRule[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const errors: string[] = []

    for (const rule of rules) {
      const value = req.body[rule.field]

      if (rule.required && (value === undefined || value === null || value === '')) {
        errors.push(`${rule.field} is required`)
        continue
      }

      if (value === undefined || value === null || value === '') continue

      if (rule.type === 'email') {
        if (!/^\S+@\S+\.\S+$/.test(String(value))) errors.push(`${rule.field} must be a valid email`)
      }

      if (rule.type === 'number') {
        const num = Number(value)
        if (isNaN(num)) errors.push(`${rule.field} must be a number`)
        else {
          if (rule.min !== undefined && num < rule.min) errors.push(`${rule.field} must be >= ${rule.min}`)
          if (rule.max !== undefined && num > rule.max) errors.push(`${rule.field} must be <= ${rule.max}`)
        }
      }

      if (rule.type === 'string') {
        const str = String(value)
        if (rule.min !== undefined && str.length < rule.min) errors.push(`${rule.field} must be at least ${rule.min} characters`)
        if (rule.max !== undefined && str.length > rule.max) errors.push(`${rule.field} cannot exceed ${rule.max} characters`)
      }
    }

    if (errors.length > 0) {
      res.status(400).json({ success: false, message: 'Validation failed', errors })
      return
    }

    next()
  }
}