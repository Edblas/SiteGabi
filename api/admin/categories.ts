import type { VercelRequest, VercelResponse } from '@vercel/node'
import { unauthorized, verifyToken } from '../_lib/auth'
import { commitFiles } from '../_lib/github'
import seedJson from '../../frontend/src/data/seed.json' assert { type: 'json' }

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
    const { categories, colors, message } = req.body || {}
    if (!Array.isArray(categories) && !Array.isArray(colors)) {
      res.status(400).json({ error: 'Envie "categories" ou "colors".' })
      return
    }

    const seedShape = { ...seedJson }
    if (Array.isArray(categories)) seedShape.categories = categories
    if (Array.isArray(colors)) seedShape.colors = colors

    const jsonContent = JSON.stringify(seedShape, null, 2) + '\n'

    const result = await commitFiles(message || 'chore(admin): atualizar categorias via painel', [
      { path: SEED_JSON_PATH, content: jsonContent, encoding: 'utf-8' },
    ])

    if (!result.ok) {
      res.status(500).json({ error: result.error || 'Erro ao commitar.' })
      return
    }

    res.status(200).json({ ok: true, commitUrl: result.commitUrl })
  } catch (err: any) {
    res.status(500).json({ error: err?.message || 'Erro interno.' })
  }
}
