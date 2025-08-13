'use client'
import { useState } from 'react'
import { postJSON } from '../../lib/api'

export default function WeeklyInspection(){
  const [location,setLocation]=useState('')
  const [extinguisher,setExtinguisher]=useState(true)
  const [exitsClear,setExitsClear]=useState(true)
  const [comments,setComments]=useState('')
  const [pdfUrl,setPdfUrl]=useState<string|null>(null)

  async function submit(){
    const payload={location, data:{extinguishersTaggedChargedSealed:extinguisher, exitsClear, comments}}
    await postJSON('/inspections/weekly', payload)
    const pdf = await fetch((process.env.NEXT_PUBLIC_API_BASE||'http://localhost:8080/api') + '/export/weekly/pdf',{method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(payload)})
    const blob = await pdf.blob(); setPdfUrl(URL.createObjectURL(blob))
  }
  return (
    <div className="container">
      <h1>Weekly Inspection</h1>
      <div className="form-section">
        <label>Location</label>
        <input value={location} onChange={e=>setLocation(e.target.value)} placeholder="e.g., Unit A East Wing"/>
      </div>
      <div className="form-section">
        <label><input type="checkbox" checked={extinguisher} onChange={e=>setExtinguisher(e.target.checked)}/> Extinguishers tagged/charged/sealed</label>
        <label><input type="checkbox" checked={exitsClear} onChange={e=>setExitsClear(e.target.checked)}/> Exits clear</label>
        <label>Comments</label>
        <textarea value={comments} onChange={e=>setComments(e.target.value)} rows={4}/>
      </div>
      <button onClick={submit}>Submit & Generate PDF</button>
      {pdfUrl && <div className="form-section"><a href={pdfUrl} download>Download PDF</a></div>}
    </div>
  )
}
