import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { login as apiLogin } from '../lib/api'

export default function Login({ backendUrl, onLogin }) {
  const [email, setEmail] = useState('Nolan.Griffiths@doc.state.ma.us')
  const [password, setPassword] = useState('Admin123')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  async function handleSubmit(e){
    e.preventDefault()
    setError(''); setLoading(true)
    try {
      const res = await apiLogin(email, password)
      onLogin(res.access_token)
      navigate('/preview')
    } catch (err) {
      setError(err.message || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
      <form onSubmit={handleSubmit} className="w-full max-w-sm space-y-4 bg-white p-6 rounded-xl border">
        <h1 className="text-lg font-semibold text-gray-800">Sign in</h1>
        {error && <div className="text-sm text-red-600">{error}</div>}
        <div>
          <label className="text-sm text-gray-600">Email</label>
          <input className="w-full mt-1 rounded-md border p-2" value={email} onChange={e=>setEmail(e.target.value)} />
        </div>
        <div>
          <label className="text-sm text-gray-600">Password</label>
          <input type="password" className="w-full mt-1 rounded-md border p-2" value={password} onChange={e=>setPassword(e.target.value)} />
        </div>
        <button disabled={loading} className="w-full rounded-md bg-primary-600 text-white py-2 hover:bg-primary-700 disabled:opacity-50">
          {loading ? 'Signing in…' : 'Sign in'}
        </button>
      </form>
    </div>
  )
}