import React, { useEffect, useMemo, useRef, useState } from 'react'

export type Step = {
  key: string
  label: string
  sublabel?: string
  state?: 'completed' | 'current' | 'upcoming' | 'disabled'
  tooltip?: string
}

export type StepperProps = {
  steps: Step[]
  currentIndex: number
  onStepChange?: (index: number) => void
  canNavigateTo?: (index: number) => boolean
  onBlockedAttempt?: (index: number) => void
  sticky?: boolean
  showProgressBar?: boolean
  className?: string
  theme?: {
    primary?: string
    accent?: string
  }
  forceCompact?: boolean
  showChevronControls?: boolean
}

const CheckIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" aria-hidden="true" {...props}>
    <path d="M9 16.2 4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4z" />
  </svg>
)
const DotIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" aria-hidden="true" {...props}>
    <circle cx="12" cy="12" r="4" />
  </svg>
)

function useStuck(enabled: boolean) {
  const ref = useRef<HTMLDivElement | null>(null)
  const [stuck, setStuck] = useState(false)
  useEffect(() => {
    if (!enabled || !ref.current) return
    const sentinel = document.createElement('div')
    sentinel.style.position = 'absolute'
    sentinel.style.top = '0px'
    sentinel.style.height = '1px'
    ref.current.prepend(sentinel)
    const io = new IntersectionObserver(([entry]) => {
      setStuck(!entry.isIntersecting)
    })
    io.observe(sentinel)
    return () => io.disconnect()
  }, [enabled])
  return { containerRef: ref, stuck }
}

export default function Stepper({
  steps,
  currentIndex,
  onStepChange,
  canNavigateTo,
  onBlockedAttempt,
  sticky = true,
  showProgressBar = true,
  className,
  theme = {},
  forceCompact,
  showChevronControls,
}: StepperProps) {
  const { containerRef, stuck } = useStuck(sticky)
  const total = steps.length
  const pct = Math.round(((currentIndex + 1) / total) * 100)
  const primary = theme.primary ?? 'text-slate-900 dark:text-slate-100'
  const accentBorder = theme.accent ?? 'border-brand-600'
  const accentBg = theme.accent ? '' : 'bg-brand-50/60'

  // navigation helpers
  const tryGo = (idx: number) => {
    const allow = canNavigateTo ? canNavigateTo(idx) : true
    if (allow) onStepChange?.(idx)
    else onBlockedAttempt?.(idx)
  }
  const listRef = useRef<HTMLOListElement | null>(null)
  const itemRefs = useRef<Array<HTMLButtonElement | null>>([])
  const onKeyDown = (e: React.KeyboardEvent) => {
    const focusIndex = itemRefs.current.findIndex((el) => el === document.activeElement)
    const active = focusIndex >= 0 ? focusIndex : currentIndex
    if (['ArrowLeft','ArrowUp','ArrowRight','ArrowDown','Home','End','Enter',' '].includes(e.key)) e.preventDefault()
    if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') itemRefs.current[Math.max(0, active-1)]?.focus()
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') itemRefs.current[Math.min(total-1, active+1)]?.focus()
    if (e.key === 'Home') itemRefs.current[0]?.focus()
    if (e.key === 'End') itemRefs.current[total-1]?.focus()
    if (e.key === 'Enter' || e.key === ' ') tryGo(active)
  }

  // state mapping
  const visualSteps = useMemo(() => steps.map((s, i) => ({
    ...s,
    _state: s.state ?? (i < currentIndex ? 'completed' : i === currentIndex ? 'current' : 'upcoming')
  })), [steps, currentIndex])

  // center current item
  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const el = itemRefs.current[currentIndex]
    if (!el) return
    el.scrollIntoView({ inline: 'center', block: 'nearest', behavior: prefersReduced ? 'auto' : 'smooth' })
  }, [currentIndex])

  // chevrons visibility
  const [canScroll, setCanScroll] = useState(false)
  const [showLeft, setShowLeft] = useState(false)
  const [showRight, setShowRight] = useState(false)
  useEffect(() => {
    const el = listRef.current
    if (!el) return
    const check = () => {
      const scrollable = el.scrollWidth > el.clientWidth + 4
      setCanScroll(scrollable)
      if (scrollable) {
        setShowLeft(el.scrollLeft > 1)
        setShowRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 1)
      } else { setShowLeft(false); setShowRight(false) }
    }
    check()
    const ro = new ResizeObserver(check)
    ro.observe(el)
    const onScroll = () => check()
    el.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', check)
    return () => { ro.disconnect(); el.removeEventListener('scroll', onScroll); window.removeEventListener('resize', check) }
  }, [])

  // mobile sheet
  const [open, setOpen] = useState(false)

  return (
    <div ref={containerRef} className={sticky ? `sticky top-0 z-40 ${className ?? ''}` : className}>
      <nav aria-label="Progress" className={`backdrop-blur supports-[backdrop-filter]:backdrop-blur bg-white/80 dark:bg-slate-900/80 border-b border-slate-200 dark:border-slate-800 ${stuck ? 'shadow-sm' : ''}`}>
        {/* Scrollable row with snap and edge fades (tablet/desktop) */}
        <div className="relative">
          <div className="hidden md:block relative">
            <div className="stepper-mask overflow-hidden">
              <ol
                ref={listRef}
                className="mx-auto max-w-6xl py-2 flex flex-nowrap items-center gap-7 lg:gap-9 overflow-x-auto whitespace-nowrap snap-x snap-mandatory scrollbar-none scroll-px-10 px-6 md:px-8"
                onKeyDown={onKeyDown}
              >
                {visualSteps.map((s, i) => (
                  <li key={s.key} className="min-w-0">
                    <button
                      ref={(el) => (itemRefs.current[i] = el)}
                      aria-current={i === currentIndex ? 'step' : undefined}
                      title={s.tooltip || s.label}
                      aria-describedby={`tip-${s.key}`}
                      tabIndex={i === currentIndex ? 0 : -1}
                    className={`snap-start inline-flex shrink-0 items-center gap-3 h-11 md:h-12 px-5 py-0 rounded-full border transition-all min-w-[max-content] leading-none bg-white relative focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-600/50 ${
                        s._state === 'current'
                          ? `z-10 ${accentBorder} ${primary} shadow-md font-semibold`
                          : s._state === 'completed'
                          ? 'z-0 border-ink-200 text-ink-600 hover:text-ink-700'
                          : 'z-0 border-ink-200 text-ink-500 hover:text-ink-600'
                      }`}
                      onClick={() => tryGo(i)}
                    >
                      <span className={`inline-flex items-center justify-center h-5 w-5 rounded-full ring-1 ${
                        s._state === 'completed' ? 'bg-brand-600 ring-brand-600 text-white' : s._state === 'current' ? 'ring-brand-600 text-brand-700' : 'ring-ink-200 text-ink-400'
                      }`}>
                        {s._state === 'completed' ? <CheckIcon /> : s._state === 'current' ? <DotIcon /> : <span className="sr-only">{i+1}</span>}
                      </span>
                      <span className="truncate leading-5 max-w-[20ch] md:max-w-[24ch] lg:max-w-[30ch]">{s.label}</span>
                    </button>
                    <span id={`tip-${s.key}`} className="sr-only">{s.tooltip || s.label}</span>
                  </li>
                ))}
              </ol>
            </div>
            {/* Chevron overlays */}
            { (canScroll && (showLeft || showRight)) && (
              <>
                <button
                  type="button"
                  aria-label="Scroll steps left"
                  className={`absolute z-20 left-2 top-1/2 -translate-y-1/2 h-9 w-9 rounded-full bg-white/90 dark:bg-slate-900/90 shadow ring-1 ring-ink-200 dark:ring-ink-700 flex items-center justify-center transition-opacity ${showLeft ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
                  onClick={() => { const el=listRef.current; if(!el) return; el.scrollBy({ left: -el.clientWidth*0.8, behavior: 'smooth' }) }}
                >
                  <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" aria-hidden="true"><path d="M15.41 7.41 14 6l-6 6 6 6 1.41-1.41L10.83 12z"/></svg>
                </button>
                <button
                  type="button"
                  aria-label="Scroll steps right"
                  className={`absolute z-20 right-2 top-1/2 -translate-y-1/2 h-9 w-9 rounded-full bg-white/90 dark:bg-slate-900/90 shadow ring-1 ring-ink-200 dark:ring-ink-700 flex items-center justify-center transition-opacity ${showRight ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
                  onClick={() => { const el=listRef.current; if(!el) return; el.scrollBy({ left: el.clientWidth*0.8, behavior: 'smooth' }) }}
                >
                  <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" aria-hidden="true"><path d="M8.59 16.59 10 18l6-6-6-6-1.41 1.41L13.17 12z"/></svg>
                </button>
              </>
            )}
          </div>
        </div>

        {/* Mobile compact header (only mobile or when forceCompact) */}
        <div className={`px-4 py-2 flex items-center justify-between gap-3 ${ (typeof forceCompact !== 'undefined' && forceCompact) ? '' : 'md:hidden' }`}>
          <div className={`text-sm ${primary}`}>
            <span className="font-medium">{steps[currentIndex]?.label}</span>
            <span className="ml-2 text-slate-500">Step {currentIndex+1} of {total}</span>
          </div>
          <button className="btn btn-secondary btn-sm" onClick={() => setOpen(true)}>Show steps</button>
        </div>

        {/* Progress bar: one bar with healthy spacing (desktop/tablet under strip; mobile under header) */}
        {showProgressBar && (
          <div className="h-1 rounded-full bg-slate-200 dark:bg-slate-800 mx-6 md:mx-8 mt-2">
            <div className="h-full bg-brand-600 rounded-full transition-[width] duration-200 ease-out" style={{ width: `${pct}%` }} />
          </div>
        )}
      </nav>

      {/* Mobile bottom sheet */}
      {open && (
        <div className="fixed inset-0 z-50" role="dialog" aria-modal="true" aria-label="Choose step" onKeyDown={(e) => { if (e.key === 'Escape') setOpen(false) }}>
          <div className="absolute inset-0 bg-black/40" onClick={() => setOpen(false)} />
          <div className="absolute inset-x-0 bottom-0 bg-white dark:bg-slate-900 rounded-t-2xl shadow-xl p-4 space-y-2 max-h-[70vh] overflow-auto">
            <div className="flex items-center justify-between">
              <div className="text-sm text-slate-600">Step {currentIndex+1} of {total}</div>
              <button className="btn btn-ghost btn-sm" onClick={() => setOpen(false)}>Close</button>
            </div>
            <ol className="space-y-1" onKeyDown={onKeyDown}>
              {visualSteps.map((s, i) => (
                <li key={s.key}>
                  <button
                    className={`w-full text-left min-h-[44px] px-3 py-2 rounded-lg flex items-center gap-3 ${
                      i === currentIndex ? 'bg-slate-100 dark:bg-slate-800 '+primary : 'hover:bg-slate-50 dark:hover:bg-slate-800/60'
                    }`}
                    aria-current={i === currentIndex ? 'step' : undefined}
                    onClick={() => { tryGo(i); setOpen(false) }}
                  >
                    <span className={`inline-flex items-center justify-center h-5 w-5 rounded-full border ${i < currentIndex ? 'bg-brand-600 border-brand-600 text-white' : i === currentIndex ? `${accentBorder} text-brand-700` : 'border-slate-300 text-slate-400'}`}>
                      {i < currentIndex ? <CheckIcon /> : i === currentIndex ? <DotIcon /> : <span className="sr-only">{i+1}</span>}
                    </span>
                    <div className="min-w-0">
                      <div className="truncate">{s.label}</div>
                      {s.sublabel && <div className="text-xs text-slate-500 truncate">{s.sublabel}</div>}
                    </div>
                  </button>
                </li>
              ))}
            </ol>
          </div>
        </div>
      )}
    </div>
  )
}
