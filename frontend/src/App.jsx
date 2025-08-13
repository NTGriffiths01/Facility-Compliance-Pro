import React, { useEffect, useState } from 'react'
import { Routes, Route, useNavigate, Link } from 'react-router-dom'
import Login from './pages/Login'
import Preview from './pages/Preview'

const backendUrl = (import.meta.env.REACT_APP_BACKEND_URL || '').replace(/\/$/, '')

function useAuth() {
  const [token, setToken] = useState(() => localStorage.getItem('token'))
  const login = (t) => { localStorage.setItem('token', t); setToken(t) }
  const logout = () => { localStorage.removeItem('token'); setToken(null) }
  return { token, login, logout }
}

function Navbar({ onLogout }) {
  return (
    <div className="w-full bg-white/90 backdrop-blur-sm border-b sticky top-0 z-10">
      <div className="max-w-6xl mx-auto flex items-center justify-between py-3 px-4">
        <Link to="/" className="flex items-center gap-2">
          <img src="/assets/apps/web/public/icon-192.png" alt="" className="h-6 w-6 rounded" />
          <span className="font-semibold text-primary-700">WorldClass</span>
        </Link>
        <div className="flex items-center gap-3">
          <Link to="/preview" className="text-sm text-primary-700 hover:underline">Preview</Link>
          <button onClick={onLogout} className="px-3 py-1.5 text-sm bg-primary-600 text-white rounded hover:bg-primary-700">Logout</button>
        </div>
      </div>
    </div>
  )
}

export default function App() {
  const navigate = useNavigate()
  const { token, login, logout } = useAuth()
  useEffect(() => {
    if (!token) navigate('/login')
  }, [token, navigate])

  return (
    <div className="min-h-screen bg-gray-50">
      {token && <Navbar onLogout={() => { logout(); navigate('/login') }} />}
      <Routes>
        <Route path="/login" element={<Login backendUrl={backendUrl} onLogin={login} />} />
        <Route path="/preview" element={<Preview backendUrl={backendUrl} token={token} />} />
        <Route path="/" element={<Preview backendUrl={backendUrl} token={token} />} />
      </Routes>
      <footer className="text-center text-xs text-gray-500 py-6">© {new Date().getFullYear()} WorldClass</footer>
    </div>
  )
}