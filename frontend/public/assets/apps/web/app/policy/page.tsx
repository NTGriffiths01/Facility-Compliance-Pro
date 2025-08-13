'use client'
export default function Policy(){
  const api = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:8080/api'
  return (
    <div className="container">
      <h1>Policy Library</h1>
      <div className="grid">
        <a className="tile" href={`${api}/policy-documents/103DOC730`} target="_blank">Open 103 DOC 730</a>
        <a className="tile" href={`${api}/policy-documents/103DOC750`} target="_blank">Open 103 DOC 750</a>
      </div>
    </div>
  )
}
