import { Routes, Route, Link } from 'react-router-dom'
import { useEffect, useState } from 'react'

function AdminHome() {
  return (
    <div>
      <h1 className="text-xl font-semibold mb-2">Admin</h1>
      <ul className="list-disc pl-5">
        <li><Link to="submissions">Submissions</Link></li>
        <li><Link to="webhooks">Webhooks</Link></li>
        <li><Link to="settings">Settings</Link></li>
      </ul>
    </div>
  )
}

function Submissions() {
  const [rows, setRows] = useState<any[]>([])
  const [q, setQ] = useState('')
  const [status, setStatus] = useState('')
  const load = async () => {
    const params = new URLSearchParams()
    if (q) params.set('q', q)
    if (status) params.set('status', status)
    const res = await fetch(`/admin-api/submissions?${params.toString()}`)
    if (res.ok) {
      const json = await res.json()
      setRows(json.rows || [])
    }
  }
  useEffect(() => { load() }, [])
  return (
    <div className="space-y-3">
      <div className="flex gap-2 items-end">
        <div>
          <label className="label">Search</label>
          <input className="input" value={q} onChange={(e) => setQ(e.target.value)} placeholder="name, rego, ref, claim" />
        </div>
        <div>
          <label className="label">Status</label>
          <select className="input" value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="">All</option>
            {['New','In Review','Awaiting Insurer','Booked','Complete'].map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
        <button className="btn btn-secondary" onClick={load}>Apply</button>
      </div>
      <div className="overflow-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="text-left border-b">
              <th className="p-2">Ref</th>
              <th className="p-2">Created</th>
              <th className="p-2">Name</th>
              <th className="p-2">Email</th>
              <th className="p-2">Rego</th>
              <th className="p-2">Status</th>
              <th className="p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r._id} className="border-b">
                <td className="p-2 font-mono">{r.ref}</td>
                <td className="p-2">{new Date(r.createdAt).toLocaleString()}</td>
                <td className="p-2">{r.your?.fullName}</td>
                <td className="p-2">{r.your?.email}</td>
                <td className="p-2">{r.vehicle?.rego}</td>
                <td className="p-2">
                  <select className="input" value={r.status} onChange={async (e) => {
                    const status = e.target.value
                    const res = await fetch(`/admin-api/submissions/${r._id}/status`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ status }) })
                    if (res.ok) load()
                  }}>
                    {['New','In Review','Awaiting Insurer','Booked','Complete'].map((s: string) => <option key={s} value={s}>{s}</option>)}
                  </select>
                </td>
                <td className="p-2">
                  <a className="underline" href={`/admin-api/submissions/${r._id}/pdf`} target="_blank" rel="noreferrer">PDF</a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
function Webhooks() { return <div>Configure outgoing webhooks</div> }
function Settings() { return <div>Company details & required photos</div> }

export default function Admin() {
  return (
    <div className="space-y-4">
      <Routes>
        <Route index element={<AdminHome />} />
        <Route path="submissions" element={<Submissions />} />
        <Route path="webhooks" element={<Webhooks />} />
        <Route path="settings" element={<Settings />} />
      </Routes>
    </div>
  )
}
