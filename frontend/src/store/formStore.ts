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
    const details = e.detail
    if (details) {
      useFormStore.setState({ data: details.data ?? details })
    }
  })
}

