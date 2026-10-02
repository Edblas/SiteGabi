import type { VercelRequest, VercelResponse } from '@vercel/node'
import { unauthorized, verifyToken } from '../_lib/auth'
import { commitFiles } from '../_lib/github'
import seedJson from '../../src/data/seed.json' assert { type: 'json' }

export const config = { runtime: 'nodejs20.x' }

const SEED_JSON_PATH = 'frontend/src/data/seed.json'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'PUT') {
    res.status(405).json({ error: 'Método não permitido' })
    return
  }

  const admin = verifyToken(req.headers.authorization)
  if (!admin) {
    unauthorized(res)
    return
  }

  try {
    const { products, message } = req.body || {}
    if (!Array.isArray(products)) {
      res.status(400).json({ error: 'Payload "products" deve ser array.' })
      return
    }

    const seedShape = { ...seedJson, products }
    const jsonContent = JSON.stringify(seedShape, null, 2) + '\n'

    const result = await commitFiles(message || 'chore(admin): atualizar produtos via painel', [
      {
        path: SEED_JSON_PATH,
        content: jsonContent,
        encoding: 'utf-8',
      },
    ])

    if (!result.ok) {
      res.status(500).json({ error: result.error || 'Erro ao commitar.' })
      return
    }

    res.status(200).json({ ok: true, commitUrl: result.commitUrl, redeployMessage: 'Aguarde 30~60s para a Vercel recompilar.' })
  } catch (err: any) {
    res.status(500).json({ error: err?.message || 'Erro interno.' })
  }
}
