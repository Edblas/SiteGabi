import { Navigate } from 'react-router-dom'

const TOKEN_KEY = 'amorena:adminToken'

export function getAdminToken(): string | null {
  try {
    return localStorage.getItem(TOKEN_KEY)
  } catch {
    return null
  }
}

export function setAdminToken(token: string): void {
  try {
    localStorage.setItem(TOKEN_KEY, token)
  } catch {}
}

export function clearAdminToken(): void {
  try {
    localStorage.removeItem(TOKEN_KEY)
  } catch {}
}

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const token = getAdminToken()
  if (!token) return <Navigate to="/admin/login" replace />
  return <>{children}</>
}
