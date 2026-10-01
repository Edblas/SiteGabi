import { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { setAdminToken } from '../components/admin/ProtectedRoute'

export default function AdminLoginPage() {
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const navigate = useNavigate()

  async function onSubmit(e: FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      })
      const json = await res.json()
      if (!res.ok) {
        setError(json?.error || 'Erro ao tentar entrar.')
      } else {
        if (json?.token) setAdminToken(json.token as string)
        navigate('/admin', { replace: true })
      }
    } catch (err: any) {
      setError(err?.message || 'Erro de rede.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-creme-deep">
      <div className="mx-auto flex min-h-screen max-w-md flex-col justify-center px-6 py-10">
        <div className="mb-10 text-center">
          <h1 className="font-display text-5xl text-bordo">amorena</h1>
          <p className="mt-3 label-eyebrow">Painel Administrativo</p>
        </div>

        <form onSubmit={onSubmit} className="rounded-sm border border-bordo/20 bg-creme p-6 shadow-card">
          <label className="block label-eyebrow mb-2">Senha de acesso</label>
          <input
            type="password"
            autoFocus
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded border border-bordo/25 bg-white px-4 py-3 font-sans text-sm text-vinho outline-none focus:border-bordo/70"
            placeholder="Digite a senha fornecida"
            disabled={loading}
          />

          {error && (
            <p className="mt-4 text-sm text-rose-700">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading || password.length < 3}
            className="mt-6 btn-bordo w-full disabled:opacity-50"
          >
            {loading ? 'Entrando…' : 'Entrar no painel →'}
          </button>

          <p className="mt-6 text-xs leading-relaxed text-vinho/60">
            Alterar produtos, preços e fotos. Toda alteração é enviada automaticamente para o site (aguarde ~30s após cada salvamento).
          </p>
        </form>
      </div>
    </div>
  )
}
