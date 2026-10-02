import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'

const ADMIN_PASSWORD_HASH_ENV = process.env.ADMIN_PASSWORD_HASH || ''
const ADMIN_JWT_SECRET = process.env.ADMIN_JWT_SECRET || 'change-me-please-amorena-local-dev-only'

const JWT_EXPIRES_IN = process.env.NODE_ENV === 'production' ? '1d' : '7d'
const BCRYPT_ROUNDS = 12

const ALLOWED_ORIGINS = new Set([
  'https://site-gabi-five.vercel.app',
  'https://site-gabi-git-main-edblas-projects.vercel.app',
  'http://localhost:5175',
  'http://localhost:5173',
])

export interface AdminJwtPayload {
  role: 'admin'
  sub: 'amorena-admin'
  iat?: number
  exp?: number
}

export function isOriginAllowed(originHeader: string | undefined): boolean {
  if (!originHeader) return process.env.NODE_ENV !== 'production'
  try {
    const u = new URL(originHeader)
    const origin = `${u.protocol}//${u.host}`
    if (ALLOWED_ORIGINS.has(origin)) return true
    if (u.hostname.endsWith('.vercel.app')) return true
    return u.hostname === 'localhost'
  } catch {
    return false
  }
}

function sleep(ms: number): Promise<void> {
  return new Promise((r) => setTimeout(r, ms))
}

const attemptMap = new Map<string, { count: number; firstAt: number }>()
const ATTEMPT_WINDOW_MS = 10 * 60 * 1000
const ATTEMPT_MAX = 5

export async function consumeRateLimit(remoteIp: string | undefined): Promise<{ ok: boolean; retryAfterMs: number }> {
  const key = remoteIp || 'global'
  const now = Date.now()
  let rec = attemptMap.get(key)
  if (!rec || now - rec.firstAt > ATTEMPT_WINDOW_MS) {
    rec = { count: 0, firstAt: now }
    attemptMap.set(key, rec)
  }
  rec.count += 1
  if (rec.count > ATTEMPT_MAX) {
    const retryAfterMs = ATTEMPT_WINDOW_MS - (now - rec.firstAt)
    const backoffMs = Math.min(5000, rec.count * 500)
    await sleep(backoffMs)
    return { ok: false, retryAfterMs: Math.max(1000, retryAfterMs) }
  }
  const backoffMs = Math.min(1500, rec.count * 200)
  await sleep(backoffMs)
  return { ok: true, retryAfterMs: 0 }
}

export function verifyPassword(password: string): boolean {
  if (!password || !ADMIN_PASSWORD_HASH_ENV) return false
  try {
    return bcrypt.compareSync(password, ADMIN_PASSWORD_HASH_ENV)
  } catch (err) {
    console.error('[auth] bcrypt compare failed:', err)
    return false
  }
}

export function hashPassword(password: string): string {
  return bcrypt.hashSync(password, BCRYPT_ROUNDS)
}

export function signToken(): string {
  const payload: AdminJwtPayload = { role: 'admin', sub: 'amorena-admin' }
  return jwt.sign(payload, ADMIN_JWT_SECRET, { expiresIn: JWT_EXPIRES_IN })
}

export function verifyToken(authHeader: string | undefined): AdminJwtPayload | null {
  if (!authHeader?.startsWith('Bearer ')) return null
  const token = authHeader.substring(7)
  try {
    const decoded = jwt.verify(token, ADMIN_JWT_SECRET) as AdminJwtPayload
    return decoded && decoded.role === 'admin' ? decoded : null
  } catch (err) {
    return null
  }
}

export function unauthorized(res: any, msg = 'Não autorizado'): void {
  res.status(401).json({ error: msg })
}
