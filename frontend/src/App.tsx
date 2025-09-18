import { Outlet, Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import MagicLink from '@/components/MagicLink'
import { useMagicToken } from '@/utils/useMagicToken'
import { useFormStore } from '@/store/formStore'
import Modal from '@/components/Modal'

export default function App() {
  const [hasDraft, setHasDraft] = useState(false)
  const [resumeOpen, setResumeOpen] = useState(false)
  useEffect(() => {
    try {
      const d = localStorage.getItem('smash:draft')
      const present = !!d
      setHasDraft(present)
      if (present) setResumeOpen(true)
    } catch {}
  }, [])
  useMagicToken()
  const current = useFormStore((s) => s.step)
  const total = useFormStore((s) => s.totalSteps)
  const progress = Math.min(100, Math.round((current-1) / (total-1) * 100))
  const [theme, setTheme] = useState<string>(() => (localStorage.getItem('theme') || 'light'))
  useEffect(() => {
    const root = document.documentElement
    if (theme === 'dark') root.classList.add('dark'); else root.classList.remove('dark')
    localStorage.setItem('theme', theme)
  }, [theme])

  return (
    <div className="min-h-screen flex flex-col">
      <header className="sticky top-0 z-10 bg-white/90 dark:bg-slate-900/90 backdrop-blur border-b border-slate-200 dark:border-slate-800">
        <div className="mx-auto max-w-5xl px-4 py-2 flex items-center justify-between gap-3 flex-wrap">
          <Link to="/" className="flex items-center gap-3 truncate">
            <img src="/assets/msr_dk_red.png" alt="Matraville Smash Repairs" className="h-9 w-auto dark:hidden" />
            <img src="/assets/msr__white_bright_red.png" alt="Matraville Smash Repairs" className="h-9 w-auto hidden dark:block" />
            <span className="sr-only">Matraville Smash Repairs Onboarding</span>
          </Link>
          <div className="hidden md:block text-xs text-slate-600 dark:text-slate-300">Step {current} of {total} ({progress}%)</div>
          <nav className="relative flex items-center gap-3">
            <button className="text-sm underline" onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>{theme === 'dark' ? 'Light mode' : 'Dark mode'}</button>
            <MagicLink trigger={(open) => (
              <button className="btn btn-outline btn-sm" onClick={open}>Send magic link</button>
            )} />
            <a className="text-sm underline" href="/admin">Admin</a>
          </nav>
        </div>
        <div className="h-1 bg-slate-100 dark:bg-slate-800 rounded">
          <div className="h-full bg-brand-600 rounded transition-all" style={{ width: `${progress}%` }} />
        </div>
        {hasDraft && (
          <div className="bg-yellow-50 border-t border-yellow-200">
            <div className="mx-auto max-w-3xl px-4 py-2 text-sm">
              A saved draft was found. <button className="underline" onClick={() => setResumeOpen(true)}>Resume now</button> or <button className="underline" onClick={() => { localStorage.removeItem('smash:draft'); setHasDraft(false) }}>discard</button>.
            </div>
          </div>
        )}
      </header>
      <Modal open={resumeOpen} onClose={() => setResumeOpen(false)} title="Resume your saved draft?" actions={
        <>
          <button className="btn btn-secondary" onClick={() => { localStorage.removeItem('smash:draft'); setHasDraft(false); setResumeOpen(false) }}>Start over</button>
          <button className="btn btn-primary" onClick={() => {
            const d = localStorage.getItem('smash:draft')
            if (d) window.dispatchEvent(new CustomEvent('smash:resume', { detail: JSON.parse(d) }))
            setResumeOpen(false)
          }}>Resume</button>
        </>
      }>
        <p className="text-sm text-slate-700 dark:text-slate-300">We can restore your previous progress on this device.</p>
      </Modal>
      <main className="flex-1">
        <div className="mx-auto max-w-5xl px-4 py-6">
          <Outlet />
        </div>
      </main>
      <footer className="border-t text-xs text-gray-500">
        <div className="mx-auto max-w-3xl px-4 py-4">© {new Date().getFullYear()} Your Smash Repairs (AU)</div>
      </footer>
    </div>
  )
}
