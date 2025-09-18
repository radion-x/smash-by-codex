import type { StepProps } from '../Wizard'
import { useFormStore } from '@/store/formStore'

export default function ReviewSubmit({ onBack, onNext, setBusy }: StepProps) {
  const data = useFormStore((s) => s.data)

  const submit = async () => {
    try {
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
    }
  }

  return (
    <div className="space-y-4">
      <Section title="Review & submit" subtitle="Please check everything looks right. You can go back to edit any section."></Section>
      <pre className="text-xs bg-gray-50 rounded p-3 overflow-auto" aria-label="Submission summary">{JSON.stringify(data, null, 2)}</pre>
      <div className="flex justify-between">
        <button type="button" className="btn btn-secondary" onClick={onBack}>Back</button>
        <button type="button" className="btn btn-primary" onClick={submit}>Submit</button>
      </div>
    </div>
  )
}
import Section from '@/components/Section'
