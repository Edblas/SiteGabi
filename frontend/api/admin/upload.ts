import type { VercelRequest, VercelResponse } from '@vercel/node'
import { unauthorized, verifyToken, isOriginAllowed } from '../_lib/auth.js'
import { commitFiles } from '../_lib/github.js'

const PUBLIC_PREFIX_PATH = 'frontend/public/'

interface UploadBody {
  filePath: string
  base64: string
  alt?: string
  message?: string
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Método não permitido' })
    return
  }

  if (!isOriginAllowed(req.headers['origin'])) {
    res.status(403).json({ error: 'Origem não autorizada.' })
    return
  }

  const admin = verifyToken(req.headers.authorization)
  if (!admin) {
    unauthorized(res)
    return
  }

  try {
    const { filePath, base64, message, alt } = (req.body || {}) as UploadBody
    if (!filePath || !base64) {
      res.status(400).json({ error: '"filePath" e "base64" obrigatórios.' })
      return
    }

    if (filePath.includes('..') || filePath.startsWith('/')) {
      res.status(400).json({ error: 'Caminho de arquivo inseguro.' })
      return
    }

    const cleanBase64 = base64.includes(',') ? base64.substring(base64.indexOf(',') + 1) : base64

    const commitPath = `${PUBLIC_PREFIX_PATH}${filePath}`
    const publicUrl = `/${filePath}`

    const result = await commitFiles(message || `chore(admin): upload foto ${filePath}`, [
      { path: commitPath, content: cleanBase64, encoding: 'base64' },
    ])

    if (!result.ok) {
      res.status(500).json({ error: result.error || 'Erro ao commitar upload.' })
      return
    }

    res.status(200).json({
      ok: true,
      url: publicUrl,
      alt: alt ?? filePath,
      commitUrl: result.commitUrl,
    })
  } catch (err: any) {
    res.status(500).json({ error: err?.message || 'Erro interno.' })
  }
}
