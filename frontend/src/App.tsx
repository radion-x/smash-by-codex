import { Outlet, Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import MagicLink from '@/components/MagicLink'
import { useMagicToken } from '@/utils/useMagicToken'
import { useFormStore } from '@/store/formStore'

export default function App() {
  const [hasDraft, setHasDraft] = useState(false)
  useEffect(() => {
    try {
      const d = localStorage.getItem('smash:draft')
      setHasDraft(!!d)
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
      <header className="sticky top-0 z-10 bg-white/80 dark:bg-slate-900/80 backdrop-blur border-b border-slate-200 dark:border-slate-800">
        <div className="mx-auto max-w-3xl px-4 py-2 flex items-center justify-between gap-3">
          <Link to="/" className="flex items-center gap-2">
            <img src="/logo.svg" alt="Logo" className="h-7 w-auto" />
            <span className="font-semibold">Onboarding</span>
          </Link>
          <div className="hidden sm:block text-xs text-slate-600 dark:text-slate-300">Step {current} of {total} ({progress}%)</div>
          <nav className="flex items-center gap-3 text-sm">
            <button className="underline" onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>{theme === 'dark' ? 'Light mode' : 'Dark mode'}</button>
            <MagicLink />
            <a className="underline" href="/admin">Admin</a>
          </nav>
        </div>
        <div className="h-1 bg-slate-100 dark:bg-slate-800">
          <div className="h-full bg-brand-600 transition-all" style={{ width: `${progress}%` }} />
        </div>
        {hasDraft && (
          <div className="bg-yellow-50 border-t border-yellow-200">
            <div className="mx-auto max-w-3xl px-4 py-2 text-sm">
              A saved draft was found. It will auto-resume. <button className="underline" onClick={() => {
                const d = localStorage.getItem('smash:draft')
                if (d) window.dispatchEvent(new CustomEvent('smash:resume', { detail: JSON.parse(d) }))
              }}>Resume now</button>
            </div>
          </div>
        )}
      </header>
      <main className="flex-1">
        <div className="mx-auto max-w-3xl px-4 py-6">
          <Outlet />
        </div>
      </main>
      <footer className="border-t text-xs text-gray-500">
        <div className="mx-auto max-w-3xl px-4 py-4">© {new Date().getFullYear()} Your Smash Repairs (AU)</div>
      </footer>
    </div>
  )
}
