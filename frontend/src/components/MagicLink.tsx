import { useState } from 'react'
import { useFormStore } from '@/store/formStore'

export default function MagicLink() {
  const data = useFormStore((s) => s.data)
  const [open, setOpen] = useState(false)
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  const [busy, setBusy] = useState(false)

  const send = async () => {
    if (!email) return
    try {
      setBusy(true)
      const res = await fetch('/auth/magic-link', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email, payload: data }) })
      if (!res.ok) throw new Error('Failed')
      setSent(true)
    } catch {
      alert('Could not send magic link. Please try again.')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div>
      <button className="text-sm underline" onClick={() => setOpen((o) => !o)}>{open ? 'Close' : 'Send magic link'}</button>
      {open && (
        <div className="mt-2 flex items-center gap-2">
          <input className="input" placeholder="Email to send link" value={email} onChange={(e) => setEmail(e.target.value)} />
          <button className="btn btn-secondary" disabled={busy} onClick={send}>Send</button>
          {sent && <span className="text-xs text-green-700">Sent</span>}
        </div>
      )}
    </div>
  )
}

