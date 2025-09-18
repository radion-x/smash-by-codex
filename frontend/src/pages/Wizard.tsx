import { useState } from 'react'
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
  const Current = steps[Math.min(step - 1, steps.length - 1)].component

  return (
    <div>
      <ol className="flex items-center gap-2 text-xs mb-4 overflow-x-auto" aria-label="progress">
        {steps.map((s) => (
          <li key={s.id} className={`shrink-0 px-2 py-1 rounded ${step >= s.id ? 'bg-brand-600 text-white' : 'bg-gray-100 text-gray-600'}`}>{s.id}. {s.title}</li>
        ))}
      </ol>

      <div className="card p-4 motion-safe:animate-slide-up">
        <Current setBusy={setBusy} onNext={() => setStep(step + 1)} onBack={() => setStep(Math.max(1, step - 1))} />
      </div>
    </div>
  )
}

export type StepProps = {
  onNext: () => void
  onBack: () => void
  setBusy?: (busy: boolean) => void
}
