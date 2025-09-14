// Simple in-memory rate limiter
const limits = new Map()

export function checkRateLimit(ip, action = 'create') {
  const now = Date.now()
  const key = `${ip}-${action}`
  const userLimits = limits.get(key) || { count: 0, resetTime: now + 60000 } // 1/min

  if (now > userLimits.resetTime) {
    userLimits.count = 0
    userLimits.resetTime = now + 60000
  }

  if (userLimits.count >= 1) {
    throw new Error('Rate limit exceeded. Try again in 1 minute.')
  }

  userLimits.count++
  limits.set(key, userLimits)
}