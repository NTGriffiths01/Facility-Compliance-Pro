import React from 'react'
export default function Discrepancies(){
  return (<div className="max-w-6xl mx-auto p-6">
    <h1 className="text-2xl font-bold text-gray-800 mb-2">Discrepancies</h1>
    <p className="text-gray-600 mb-4">Boards: Corrective Maintenance, Fire Alarm, Suppression, DPH, Completed.</p>
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-4">
      {['Corrective','Fire Alarm','Suppression','DPH','Completed'].map(c=>(<div key={c} className="rounded-xl border bg-white p-4 text-gray-700">
        <div className="font-semibold mb-2">{c}</div><div className="text-sm text-gray-500">No items yet.</div></div>))}
    </div>
  </div>)}
