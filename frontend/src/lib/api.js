const BASE_URL = (import.meta.env.REACT_APP_BACKEND_URL || '').replace(/\/$/, '')

async function handle(res) {
  if (!res.ok) {
    const text = await res.text().catch(() => '')
    const msg = text || res.statusText || 'Request failed'
    throw new Error(msg)
  }
  return res.json()
}

export async function login(email, password) {
  const res = await fetch(`${BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  })
  return handle(res)
}

export async function getMe(token) {
  const res = await fetch(`${BASE_URL}/me`, {
    headers: { Authorization: `Bearer ${token}` }
  })
  return handle(res)
}

export async function getPreview(token) {
  const res = await fetch(`${BASE_URL}/preview`, {
    headers: { Authorization: `Bearer ${token}` }
  })
  return handle(res)
}