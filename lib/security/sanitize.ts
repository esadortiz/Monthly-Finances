const SCRIPT_TAG = /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi
const ON_EVENT = /\son\w+\s*=\s*["'][^"']*["']/gi
const JAVASCRIPT_URL = /javascript\s*:/gi
const DOCUMENT_WRITE = /document\.write\s*\(/gi

export function sanitizeText(input: string | null | undefined): string {
  if (!input) return ""
  return input
    .replace(SCRIPT_TAG, "")
    .replace(ON_EVENT, "")
    .replace(JAVASCRIPT_URL, "")
    .replace(DOCUMENT_WRITE, "")
    .trim()
}

export function sanitizeOptional(input: string | null | undefined): string | null {
  if (!input) return null
  const cleaned = sanitizeText(input)
  return cleaned || null
}
