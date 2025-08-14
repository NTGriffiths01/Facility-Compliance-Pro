import React from 'react'
import { Link } from 'react-router-dom'

export default function SectionCard({ title, description, icon = '/assets/apps/web/public/icon-192.png', to }) {
  const content = (
    <div className="group rounded-xl border bg-white shadow-sm hover:shadow-md transition overflow-hidden">
      <div className="flex items-center gap-4 p-5">
        <img src={icon} alt="" className="h-10 w-10 rounded-md ring-1 ring-gray-200" />
        <div>
          <h3 className="font-semibold text-gray-800 group-hover:text-primary-700">{title}</h3>
          <p className="text-sm text-gray-500">{description}</p>
        </div>
      </div>
      <div className="bg-gradient-to-r from-primary-50/60 to-transparent h-1 w-full" />
    </div>
  )
  return to ? <Link to={to} className="block">{content}</Link> : content
}
