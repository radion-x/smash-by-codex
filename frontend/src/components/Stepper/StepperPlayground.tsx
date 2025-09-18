import React, { useState } from 'react'
import Stepper from './'

const demoSteps = [
  'Welcome & Consent','Your Details','Vehicle Details','Accident Details','Other Party / Property','Damage Map','Required Photos','Insurance & Authorisations','Review & Submit','Confirmation'
].map((label, i) => ({ key: String(i+1), label }))

export default function StepperPlayground() {
  const [idx, setIdx] = useState(1)
  return (
    <div className="min-h-screen">
      <Stepper
        steps={demoSteps}
        currentIndex={idx}
        onStepChange={setIdx}
        canNavigateTo={(i) => i <= idx}
      />
      <div className="mx-auto max-w-3xl p-6">
        <p>Use this playground to preview sticky + scroll behaviors.</p>
      </div>
    </div>
  )
}

