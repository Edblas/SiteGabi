import type { VercelRequest, VercelResponse } from '@vercel/node'
import {
  signToken,
  verifyPassword,
  hashPassword,
  isOriginAllowed,
  consumeRateLimit,
} from '../_lib/auth.js'

interface LoginBody {
  password?: string
  _generateHash?: string
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Método não permitido' })
    return
  }

  try {
    const origin = req.headers['origin']
    if (!isOriginAllowed(origin)) {
      res.status(403).json({ error: 'Origem não autorizada.' })
      return
    }

    const remoteIp =
      (req.headers['x-forwarded-for'] as string | undefined)?.split(',')[0]?.trim() ||
      (req.headers['x-real-ip'] as string | undefined) ||
      undefined

    const rate = await consumeRateLimit(remoteIp)
    if (!rate.ok) {
      res.setHeader('Retry-After', Math.ceil(rate.retryAfterMs / 1000))
      res.status(429).json({
        error: 'Muitas tentativas. Aguarde alguns minutos antes de tentar de novo.',
        retryAfterSeconds: Math.ceil(rate.retryAfterMs / 1000),
      })
      return
    }

    const { password, _generateHash } = (req.body || {}) as LoginBody

    if (_generateHash && _generateHash.length >= 6) {
      const hash = hashPassword(_generateHash)
      res.status(200).json({ hash, note: 'Defina ADMIN_PASSWORD_HASH no .env com esse valor.' })
      return
    }

    if (!password) {
      res.status(400).json({ error: 'Senha não enviada.' })
      return
    }

    const ok = verifyPassword(password)
    if (!ok) {
      res.status(401).json({ error: 'Senha incorreta.' })
      return
    }

    const token = signToken()
    res.status(200).json({
      ok: true,
      token,
      expiresInDays: process.env.NODE_ENV === 'production' ? 1 : 7,
    })
  } catch (err: any) {
    res.status(500).json({ error: err?.message || 'Erro interno.' })
  }
}
