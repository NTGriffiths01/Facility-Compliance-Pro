import React, { useEffect, useState } from 'react'

export default function Policy(){
  const [files,setFiles]=useState([])
  useEffect(()=>{
    fetch('/assets/policy/hashes.json')
      .then(r=>r.ok?r.json():{})
      .then(j=> setFiles(Object.keys(j||{})))
      .catch(()=> setFiles(['730 - Accessible.pdf','750 - Accessible.pdf']))
  },[])
  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-4">Policies</h1>
      <p className="text-gray-600 mb-6">Official documents (served verbatim). Click to open.</p>
      <ul className="divide-y bg-white border rounded-xl">
        {files.map(n=>(
          <li key={n} className="p-4 hover:bg-gray-50 flex items-center justify-between">
            <span className="text-sm text-gray-800">{n}</span>
            <a className="text-primary-700 hover:underline" href={`/assets/policy/${n}`} target="_blank" rel="noreferrer">Open</a>
          </li>
        ))}
      </ul>
    </div>
  )
}
