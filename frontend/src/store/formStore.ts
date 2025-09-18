import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'
import type { Submission } from '@/schemas'

type FormState = {
  data: Partial<Submission>
  step: number
  totalSteps: number
  update: (patch: Partial<Submission>) => void
  setStep: (n: number) => void
  clear: () => void
}

export const useFormStore = create<FormState>()(
  devtools(
    persist(
      (set) => ({
        data: {},
        step: 1,
        totalSteps: 10,
        update: (patch) => set((s) => ({ data: { ...s.data, ...patch } })),
        setStep: (n) => set({ step: n }),
        clear: () => set({ data: {}, step: 1 }),
      }),
      {
        name: 'smash:draft',
      }
    )
  )
)

// Helper: broadcast resume
if (typeof window !== 'undefined') {
  window.addEventListener('smash:resume', (e: any) => {
    const payload = e.detail
    // Support both { state: {...} } (zustand persist) and direct state
    const state = payload?.state ?? payload
    const data = state?.data ?? state
    const step = typeof state?.step === 'number' ? state.step : undefined
    useFormStore.setState((s) => ({ data: data ?? s.data, step: step ?? s.step }))
  })
}
