import type { VercelRequest, VercelResponse } from '@vercel/node'
import { signToken, verifyPassword, hashPassword } from '../_lib/auth'

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
      expiresInDays: 7,
    })
  } catch (err: any) {
    res.status(500).json({ error: err?.message || 'Erro interno.' })
  }
}
