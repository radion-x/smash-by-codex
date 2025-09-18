import type { StepProps } from '../Wizard'

export default function Confirmation({}: StepProps) {
  return (
    <div className="space-y-2">
      <h1 className="text-xl font-semibold">Thanks — we’ve received your details</h1>
      <p className="text-gray-700">We’ll be in touch with next steps. A copy of your submission will be emailed shortly with a tracking reference.</p>
    </div>
  )
}

