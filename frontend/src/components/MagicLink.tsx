import { useState } from 'react'
import { useFormStore } from '@/store/formStore'

export default function MagicLink({ trigger }: { trigger?: (open: () => void) => React.ReactNode }) {
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

  if (trigger) {
    return (
      <>
        {trigger(() => setOpen(true))}
        {open && (
          <div className="absolute z-40">
            <div className="card p-3">
              <div className="flex items-center gap-2">
                <input className="input" placeholder="Email to send link" value={email} onChange={(e) => setEmail(e.target.value)} />
                <button className="btn btn-secondary" disabled={busy} onClick={send}>Send</button>
                <button className="btn btn-ghost" onClick={() => setOpen(false)}>Close</button>
              </div>
              {sent && <div className="mt-2 text-xs text-green-700">Sent</div>}
            </div>
          </div>
        )}
      </>
    )
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
