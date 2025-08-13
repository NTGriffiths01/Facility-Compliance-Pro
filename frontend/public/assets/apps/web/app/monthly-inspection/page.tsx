'use client'
import { useState } from 'react'
import { postJSON } from '../../lib/api'

export default function Monthly(){
  const [institution,setInstitution]=useState('')
  const [month,setMonth]=useState(1)
  const [year,setYear]=useState(new Date().getFullYear())
  const [pump,setPump]=useState({heatAtLeast40F:true, suctionPressurePsi:50, dischargePressurePsi:100})
  async function submit(){
    await postJSON('/inspections/monthly', {institution_name:institution, month, year, data:{electricFirePumpReport:pump}})
    alert('Saved')
  }
  return (
    <div className="container">
      <h1>Monthly Inspection</h1>
      <div className="form-section">
        <label>Institution</label>
        <input value={institution} onChange={e=>setInstitution(e.target.value)} />
        <label>Month</label>
        <input type="number" value={month} onChange={e=>setMonth(Number(e.target.value))} />
        <label>Year</label>
        <input type="number" value={year} onChange={e=>setYear(Number(e.target.value))} />
      </div>
      <div className="form-section">
        <h2>Electric Fire Pump Report</h2>
        <label><input type="checkbox" checked={pump.heatAtLeast40F} onChange={e=>setPump({...pump, heatAtLeast40F:e.target.checked})}/> Heat ≥ 40°F</label>
        <label>Suction Pressure (psi)</label>
        <input type="number" value={pump.suctionPressurePsi} onChange={e=>setPump({...pump, suctionPressurePsi:Number(e.target.value)})}/>
        <label>Discharge Pressure (psi)</label>
        <input type="number" value={pump.dischargePressurePsi} onChange={e=>setPump({...pump, dischargePressurePsi:Number(e.target.value)})}/>
      </div>
      <button onClick={submit}>Submit</button>
    </div>
  )
}
