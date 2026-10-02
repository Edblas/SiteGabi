import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'

const ADMIN_PASSWORD_HASH_ENV = process.env.ADMIN_PASSWORD_HASH || ''
const ADMIN_JWT_SECRET = process.env.ADMIN_JWT_SECRET || 'change-me-please-amorena-local-dev-only'

export interface AdminJwtPayload {
  role: 'admin'
  sub: 'amorena-admin'
  iat?: number
  exp?: number
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
  return bcrypt.hashSync(password, 10)
}

export function signToken(): string {
  const payload: AdminJwtPayload = { role: 'admin', sub: 'amorena-admin' }
  return jwt.sign(payload, ADMIN_JWT_SECRET, { expiresIn: '7d' })
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
