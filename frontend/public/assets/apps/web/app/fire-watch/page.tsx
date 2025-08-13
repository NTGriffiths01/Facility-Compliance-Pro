'use client'
import { useState } from 'react'
import { postJSON } from '../../lib/api'

export default function FireWatch(){
  const [location,setLocation]=useState('')
  const [id,setId]=useState<number|null>(null)
  const [time,setTime]=useState('')
  const [name,setName]=useState('')
  const [entries,setEntries]=useState<any[]>([])
  async function start(){
    const r = await postJSON('/fire-watch', {location, system_out_at:new Date().toISOString()})
    setId(r.id)
  }
  async function add(){
    if(!id) return
    await postJSON(`/fire-watch/${id}/entries`, {time, location, name, signature:name})
    setEntries([...entries, {time, location, name}])
  }
  return (
    <div className="container">
      <h1>Fire Watch Log</h1>
      <div className="form-section">
        <label>Location</label>
        <input value={location} onChange={e=>setLocation(e.target.value)} />
        <button onClick={start}>Start Fire Watch</button>
      </div>
      {id && <div className="form-section">
        <h2>Entries</h2>
        <label>Time</label><input value={time} onChange={e=>setTime(e.target.value)} placeholder="e.g., 02:00"/>
        <label>Name</label><input value={name} onChange={e=>setName(e.target.value)} />
        <button onClick={add}>Add Entry</button>
        <ul>{entries.map((e,i)=><li key={i}>{e.time} — {e.name}</li>)}</ul>
      </div>}
    </div>
  )
}
