export const API = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:8080/api';
export async function getJSON(path:string, init?:RequestInit){
  const r = await fetch(API + path, { ...init, headers: {'Content-Type':'application/json', ...(init?.headers||{})}});
  if(!r.ok) throw new Error(await r.text()); return r.json();
}
export async function postJSON(path:string, body:any){
  const r = await fetch(API + path, { method:'POST', body: JSON.stringify(body), headers: {'Content-Type':'application/json'}});
  if(!r.ok) throw new Error(await r.text()); return r.json();
}