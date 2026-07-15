const store = new Map<string, { count: number; resetAt: number }>()

export function checkRateLimit(
  key: string,
  maxAttempts: number = 5,
  windowMs: number = 15 * 60 * 1000
): { allowed: boolean; remaining: number; resetIn: number } {
  const now = Date.now()
  const entry = store.get(key)

  if (!entry || now > entry.resetAt) {
    store.set(key, { count: 1, resetAt: now + windowMs })
    return { allowed: true, remaining: maxAttempts - 1, resetIn: windowMs }
  }

  if (entry.count >= maxAttempts) {
    const resetIn = entry.resetAt - now
    return { allowed: false, remaining: 0, resetIn }
  }

  entry.count++
  return { allowed: true, remaining: maxAttempts - entry.count, resetIn: entry.resetAt - now }
}

export function resetRateLimit(key: string) {
  store.delete(key)
}
