import type { StepProps } from '../Wizard'
import { useFormStore } from '@/store/formStore'
import { useState } from 'react'

export default function ReviewSubmit({ onBack, onNext, setBusy }: StepProps) {
  const data = useFormStore((s) => s.data)
  const [submitting, setSubmitting] = useState(false)

  const submit = async () => {
    try {
      setSubmitting(true)
      setBusy?.(true)
      const res = await fetch('/api/submissions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      if (!res.ok) throw new Error('Submit failed')
      onNext()
    } catch (e) {
      alert('There was a problem submitting your details. Please try again.')
    } finally {
      setBusy?.(false)
      setSubmitting(false)
    }
  }

  return (
    <div className="space-y-4">
      <Section title="Review & submit" subtitle="Please check everything looks right. You can go back to edit any section."></Section>
      <pre className="text-xs bg-gray-50 rounded p-3 overflow-auto" aria-label="Submission summary">{JSON.stringify(data, null, 2)}</pre>
      <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center gap-2 sm:justify-between">
        <button type="button" className="btn btn-secondary w-full sm:w-auto" onClick={onBack}>Back</button>
        <button type="button" className="btn btn-primary w-full sm:w-auto" onClick={submit} disabled={submitting}>
          {submitting ? (<span className="inline-flex items-center">Submitting<span className="spinner" /></span>) : 'Submit'}
        </button>
      </div>
    </div>
  )
}
import Section from '@/components/Section'
