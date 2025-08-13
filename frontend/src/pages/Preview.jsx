import React, { useEffect, useState } from 'react'
import SectionCard from '../components/SectionCard'
import { BulletsSkeleton, CardsSkeleton } from '../components/Skeleton'
import { getPreview } from '../lib/api'

export default function Preview({ backendUrl, token }) {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [policies, setPolicies] = useState([])

  useEffect(() => {
    let mounted = true
    async function run() {
      try {
        const res = await getPreview(token)
        if (mounted) setData(res)
      } catch {
        if (mounted) setData({ title:'World-Class Performance', subtitle:'Operational excellence preview', bullets:[] })
      } finally {
        if (mounted) setLoading(false)
      }
    }
    if (token) run(); else setLoading(false)
    return () => { mounted = false }
  }, [token])

  useEffect(() => {
    // Load policy list from public assets
    fetch('/assets/policy/hashes.json')
      .then(r => r.ok ? r.json() : {})
      .then(j => {
        const names = Object.keys(j || {}).slice(0,5)
        setPolicies(names)
      })
      .catch(() => setPolicies([]))
  }, [])

  const sections = [
    { title: 'Weekly Inspection', description: 'Routine checks to ensure safety readiness', to: '/weekly-inspection' },
    { title: 'Monthly Inspection', description: 'Structured monthly assessments', to: '/monthly-inspection' },
    { title: 'Fire Watch', description: 'Monitoring and incident readiness', to: '/fire-watch' },
    { title: 'Policy', description: 'Access organizational policies and compliance', to: '/policy' },
    { title: 'Functional Testing', description: 'Validate systems performance', to: '/functional-testing' },
    { title: 'Hot Work', description: 'Permit tracking and controls', to: '/hot-work' },
    { title: 'Discrepancies', description: 'Track, assign, and resolve', to: '/discrepancies' },
  ]

  if (!token) {
    return <div className="p-8 text-center text-gray-600">Please login to view the preview.</div>
  }

  return (
    <div>
      <div className="relative isolate overflow-hidden bg-gradient-to-b from-white to-gray-50">
        <div className="mx-auto max-w-6xl px-6 pt-10 pb-4">
          <div className="flex items-center gap-3 mb-6">
            <img src="/assets/apps/web/public/icon-192.png" alt="" className="h-8 w-8 rounded" />
            <span className="text-sm font-medium text-primary-700">WorldClass</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-gray-900">
            {data?.title || 'World-Class Performance'}
          </h1>
          <p className="mt-2 text-lg text-gray-600">{data?.subtitle || 'Operational excellence preview'}</p>

          {loading ? <BulletsSkeleton /> : (
            <div className="mt-6 grid gap-2 md:grid-cols-3">
              {(data?.bullets || []).map((b, i) => (
                <div key={i} className="flex items-center gap-3 rounded-lg border bg-white p-3">
                  <span className="inline-flex h-7 w-7 items-center justify-center rounded-md bg-primary-100 text-primary-700 text-sm font-semibold">{i+1}</span>
                  <span className="text-gray-700 text-sm">{b}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-6 pb-12">
        {loading ? <CardsSkeleton /> : (
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {sections.map((s) => (
              <SectionCard key={s.title} title={s.title} description={s.description} to={s.to} />
            ))}
          </div>
        )}

        <div className="mt-10 rounded-xl border bg-white p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-gray-800">Policies</h2>
              <p className="text-sm text-gray-500">Reference documents for field teams</p>
            </div>
            {policies.length > 0 && (
              <a href={`/assets/policy/${policies[0]}`} target="_blank" rel="noreferrer"
                 className="px-3 py-2 rounded-md bg-primary-600 text-white text-sm hover:bg-primary-700">
                Open First
              </a>
            )}
          </div>
          <ul className="mt-4 list-disc pl-6 text-sm text-gray-700">
            {policies.map(name => (
              <li key={name}>
                <a className="text-primary-700 hover:underline" href={`/assets/policy/${name}`} target="_blank" rel="noreferrer">
                  {name}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}