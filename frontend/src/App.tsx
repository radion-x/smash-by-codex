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

  const handleResume = () => {
    try {
      const d = localStorage.getItem('smash:draft')
      if (d) {
        window.dispatchEvent(new CustomEvent('smash:resume', { detail: JSON.parse(d) }))
      }
    } catch {}
    setHasDraft(false)
    setResumeOpen(false)
  }

  return (
    <div className="min-h-screen flex flex-col">
      <header className="sticky top-0 z-50 isolate bg-white/85 dark:bg-ink-900/90 backdrop-blur supports-[backdrop-filter]:backdrop-blur shadow-header">
        <div className="border-b border-ink-100/70 dark:border-ink-800/70">
          <div className="mx-auto max-w-6xl px-6 py-3 flex flex-wrap items-center justify-between gap-4">
            <Link to="/" className="flex items-center gap-4">
              <img src="/assets/msr_dk_red.png" alt="Matraville Smash Repairs" className="h-10 w-auto dark:hidden" />
              <img src="/assets/msr__white_bright_red.png" alt="Matraville Smash Repairs" className="h-10 w-auto hidden dark:block" />
              <div className="hidden sm:block">
                <p className="text-xs uppercase tracking-[0.35em] text-ink-500">Client intake</p>
                <p className="font-semibold text-ink-800 dark:text-ink-50">Smash Repair Engagement</p>
              </div>
            </Link>
            <nav className="flex items-center gap-3 text-sm text-ink-600 dark:text-ink-200">
              <button className="btn-ghost px-3" onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>{theme === 'dark' ? 'Light mode' : 'Dark mode'}</button>
              <MagicLink trigger={(open) => (
                <button className="btn btn-outline btn-sm" onClick={open}>Send magic link</button>
              )} />
              <a className="btn btn-ghost px-3" href="/admin">Admin</a>
            </nav>
          </div>
        </div>
        <div className="mx-auto max-w-6xl px-6 py-3 flex flex-wrap items-center justify-between gap-3 text-xs sm:text-sm text-ink-500 dark:text-ink-300">
          <div className="flex items-center gap-3">
            <span className="font-medium text-ink-700 dark:text-ink-100">Step {current} of {total}</span>
            <span className="hidden sm:inline">Estimated completion: ~10 minutes</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-medium text-ink-600 dark:text-ink-200">Need help?</span>
            <a href="tel:+612000000" className="text-brand-600 font-semibold">02 9000 0000</a>
            <span className="hidden md:inline text-ink-400">or</span>
            <a href="mailto:intake@matravillesmash.com.au" className="hidden md:inline text-brand-600">intake@matravillesmash.com.au</a>
          </div>
        </div>
        {hasDraft && (
          <div className="bg-amber-50 border-t border-amber-200">
            <div className="mx-auto max-w-4xl px-6 py-2 text-sm text-ink-700">
              Draft found. <button className="font-semibold underline" onClick={handleResume}>Resume now</button> or <button className="underline" onClick={() => { localStorage.removeItem('smash:draft'); setHasDraft(false) }}>discard</button>.
            </div>
          </div>
        )}
      </header>
      <Modal open={resumeOpen} onClose={() => setResumeOpen(false)} title="Resume your saved draft?" actions={
        <>
          <button className="btn btn-secondary" onClick={() => { localStorage.removeItem('smash:draft'); setHasDraft(false); setResumeOpen(false) }}>Start over</button>
          <button className="btn btn-primary" onClick={handleResume}>Resume</button>
        </>
      }>
        <p className="text-sm text-slate-700 dark:text-slate-300">We can restore your previous progress on this device.</p>
      </Modal>
      <main className="flex-1 bg-gradient-to-b from-ink-50 via-white to-white dark:from-ink-900 dark:via-ink-900/95 dark:to-ink-900">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-10">
          <Outlet />
        </div>
      </main>
      <footer className="border-t border-ink-100 dark:border-ink-800 bg-white/80 dark:bg-ink-900/90">
        <div className="mx-auto max-w-6xl px-6 py-6 text-xs sm:text-sm text-ink-500 dark:text-ink-300 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <span>© {new Date().getFullYear()} Matraville Smash Repairs. All rights reserved.</span>
          <div className="flex gap-4">
            <a href="#" className="hover:text-brand-600">Privacy</a>
            <a href="#" className="hover:text-brand-600">Terms</a>
            <a href="mailto:intake@matravillesmash.com.au" className="hover:text-brand-600">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  )
}
