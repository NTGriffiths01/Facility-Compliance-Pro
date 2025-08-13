import React from 'react'

export function Skeleton({ className = '' }) {
  return <div className={`animate-pulse bg-gray-200 rounded ${className}`} />
}

export function BulletsSkeleton() {
  return (
    <div className="mt-6 grid gap-2 md:grid-cols-3">
      {[0,1,2].map(i => (
        <div key={i} className="flex items-center gap-3 rounded-lg border bg-white p-3">
          <div className="h-7 w-7 rounded-md bg-gray-200 animate-pulse" />
          <div className="h-4 w-48 rounded bg-gray-200 animate-pulse" />
        </div>
      ))}
    </div>
  )
}

export function CardsSkeleton() {
  return (
    <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
      {Array.from({ length: 6 }).map((_, i) => (
        <Skeleton key={i} className="h-24 border" />
      ))}
    </div>
  )
}