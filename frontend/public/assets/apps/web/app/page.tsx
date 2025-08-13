'use client'
import Link from 'next/link'

export default function Page(){
  const Tile = ({href,title,desc}:{href:string,title:string,desc:string}) => (
    <Link href={href} className="tile">
      <h2>{title}</h2>
      <p>{desc}</p>
    </Link>
  )
  return (
    <div className="container">
      <h1>Compliance Control Center</h1>
      <div className="grid" style={{marginTop:16}}>
        <Tile href="/weekly-inspection" title="Start Weekly Inspection" desc="Attachment #2"/>
        <Tile href="/monthly-inspection" title="Start Monthly Inspection" desc="Attachment #7"/>
        <Tile href="/fire-watch" title="Start Fire Watch" desc="Attachment #3"/>
        <Tile href="/functional-testing" title="Functional Testing" desc="Attachment #4"/>
        <Tile href="/hot-work" title="Hot Work Permit" desc="Attachment #5"/>
        <Tile href="/discrepancies" title="Discrepancy Boards" desc="Attachment #8"/>
        <Tile href="/policy" title="Policy Library" desc="730/750 verbatim PDFs"/>
      </div>
    </div>
  )
}
