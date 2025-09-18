import { useEffect, useState } from 'react'
import Stepper from '@/components/Stepper'
import WelcomeConsent from './wizard/WelcomeConsent'
import YourDetails from './wizard/YourDetails'
import VehicleDetails from './wizard/VehicleDetails'
import AccidentDetails from './wizard/AccidentDetails'
import OtherParty from './wizard/OtherParty'
import DamageMapPage from './wizard/DamageMapPage'
import RequiredPhotos from './wizard/RequiredPhotos'
import InsuranceAuth from './wizard/InsuranceAuth'
import ReviewSubmit from './wizard/ReviewSubmit'
import Confirmation from './wizard/Confirmation'
import { useFormStore } from '@/store/formStore'

const steps = [
  { id: 1, title: 'Welcome & Consent', component: WelcomeConsent },
  { id: 2, title: 'Your Details', component: YourDetails },
  { id: 3, title: 'Vehicle Details', component: VehicleDetails },
  { id: 4, title: 'Accident Details', component: AccidentDetails },
  { id: 5, title: 'Other Party / Property', component: OtherParty },
  { id: 6, title: 'Damage Map', component: DamageMapPage },
  { id: 7, title: 'Required Photos', component: RequiredPhotos },
  { id: 8, title: 'Insurance & Authorisations', component: InsuranceAuth },
  { id: 9, title: 'Review & Submit', component: ReviewSubmit },
  { id: 10, title: 'Confirmation', component: Confirmation },
]

export default function Wizard() {
  const step = useFormStore((s) => s.step)
  const setStep = useFormStore((s) => s.setStep)
  const [busy, setBusy] = useState(false)
  const [hasDraft, setHasDraft] = useState(false)
  useEffect(() => {
    if (typeof window === 'undefined') return
    setHasDraft(!!localStorage.getItem('smash:draft'))
  }, [])
  const Current = steps[Math.min(step - 1, steps.length - 1)].component

  return (
    <div className="space-y-8">
      <Stepper
        steps={steps.map(s => ({ key: String(s.id), label: s.title }))}
        currentIndex={step-1}
        onStepChange={(i) => setStep(i+1)}
        canNavigateTo={(i) => i <= (step-1)}
        sticky
        showProgressBar
      />

      <section className="grid gap-8 lg:grid-cols-[minmax(0,2fr)_minmax(260px,1fr)]">
        <div className="card p-6 sm:p-8 space-y-8 motion-safe:animate-slide-up">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-ink-100 pb-6">
            <div>
              <p className="text-xs uppercase tracking-[0.4em] text-ink-500">Current step</p>
              <h1>{steps[step-1]?.title}</h1>
            </div>
            <div className="text-sm text-ink-500">
              {step < steps.length && <span>Next: <span className="font-medium text-ink-700">{steps[step]?.title}</span></span>}
            </div>
          </div>

          <Current setBusy={setBusy} onNext={() => setStep(step + 1)} onBack={() => setStep(Math.max(1, step - 1))} />
        </div>

        <aside className="space-y-6 self-start">
          <div className="card p-6 space-y-3">
            <h3 className="text-sm font-semibold text-ink-700">Status summary</h3>
            <ul className="space-y-2 text-sm text-ink-500">
              <li className="flex items-center justify-between"><span>Progress</span><span className="font-medium text-ink-700">{Math.round((step/steps.length)*100)}%</span></li>
              <li className="flex items-center justify-between"><span>Remaining steps</span><span className="font-medium text-ink-700">{steps.length - step}</span></li>
              <li className="flex items-center justify-between"><span>Draft saved</span><span className="font-medium text-ink-700">{hasDraft ? 'Yes' : 'No'}</span></li>
            </ul>
          </div>

          <div className="card p-6 space-y-3">
            <h3 className="text-sm font-semibold text-ink-700">Helpful tips</h3>
            <ul className="space-y-2 text-sm text-ink-500">
              <li>Upload clear, well-lit photos — landscape works best.</li>
              <li>Have your licence, rego and insurer details handy.</li>
              <li>You can revisit earlier steps anytime without losing data.</li>
            </ul>
          </div>
        </aside>
      </section>
    </div>
  )
}

export type StepProps = {
  onNext: () => void
  onBack: () => void
  setBusy?: (busy: boolean) => void
}
