import React from 'react'

export function Skeleton({ className = '' }) {
  return <div className={`animate-pulse bg-gray-200 rounded ${className}`} />
}

export function BulletsSkeleton() {
  return (
    <div className="mt-6 grid gap-2 md:grid-cols-3">
      {[0,1,2].map(i => (
        <div key={i} className="flex items-center gap-3 rounded-lg border bg-white p-3">
          <Skeleton className="h-7 w-7 rounded-md" />
          <Skeleton className="h-4 w-40" />
        </div>
      ))}
    </div>
  )
}

export function CardsSkeleton({ count = 6 }) {
  return (
    <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
      {Array.from({length: count}).map((_, i) => (
        <div key={i} className="rounded-xl border bg-white p-5">
          <div className="flex items-center gap-4">
            <Skeleton className="h-10 w-10 rounded-md" />
            <div className="flex-1">
              <Skeleton className="h-4 w-32 mb-2" />
              <Skeleton className="h-3 w-48" />
            </div>
          </div>
          <Skeleton className="h-1 w-full mt-4" />
        </div>
      ))}
    </div>
  )
}
