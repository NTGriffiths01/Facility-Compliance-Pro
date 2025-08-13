import React, { useEffect, useState } from 'react'

export default function Preview({ backendUrl, token }) {
  const [data, setData] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`${backendUrl}/preview`, {
          headers: { Authorization: `Bearer ${token}` }
        })
        if (!res.ok) throw new Error('Failed to load preview')
        const json = await res.json()
        setData(json)
      } catch (e) {
        setError(e.message)
      }
    }
    if (token) fetchData()
  }, [backendUrl, token])

  if (!token) {
    return (
      <div className="p-8 text-center">
        <p className="text-gray-600">Please login to view the preview.</p>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      {error && <div className="text-red-600 mb-4">{error}</div>}
      {!data ? (
        <div className="animate-pulse h-40 bg-gray-200 rounded" />
      ) : (
        <div className="bg-white rounded-lg shadow-sm p-8">
          <h1 className="text-2xl font-bold text-gray-800">{data.title}</h1>
          <p className="text-gray-600 mt-2">{data.subtitle}</p>
          <ul className="mt-4 list-disc pl-6 text-gray-700">
            {data.bullets.map((b, i) => <li key={i}>{b}</li>)}
          </ul>
        </div>
      )}
    </div>
  )
}