const base = (import.meta.env.REACT_APP_BACKEND_URL || '').replace(/\/$/, '') + '/api'

async function json(req) {
  if (!req.ok) {
    const msg = await req.text().catch(() => '')
    throw new Error(msg || `HTTP ${req.status}`)
  }
  return req.json()
}

export async function login(email, password) {
  const r = await fetch(`${base}/auth/login`, {
    method: 'POST',
    headers: {'Content-Type':'application/json'},
    body: JSON.stringify({ email, password })
  })
  return json(r) // { access_token, token_type }
}

export async function getMe(token) {
  const r = await fetch(`${base}/me`, {
    headers: { Authorization: `Bearer ${token}` }
  })
  return json(r) // { id, email }
}

export async function getPreview(token) {
  const r = await fetch(`${base}/preview`, {
    headers: { Authorization: `Bearer ${token}` }
  })
  return json(r) // { title, subtitle, bullets[] }
}