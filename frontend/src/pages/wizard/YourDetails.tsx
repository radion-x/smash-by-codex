import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { yourDetailsSchema } from '@/schemas'
import { z } from 'zod'
import { useFormStore } from '@/store/formStore'
import type { StepProps } from '../Wizard'
import Section from '@/components/Section'

type F = z.infer<typeof yourDetailsSchema>

export default function YourDetails({ onBack, onNext }: StepProps) {
  const update = useFormStore((s) => s.update)
  const data = useFormStore((s) => s.data)
  const form = useForm<F>({ resolver: zodResolver(yourDetailsSchema), defaultValues: (data as any)?.your })

  const submit = (v: F) => { update({ your: v }); onNext() }

  return (
    <form onSubmit={form.handleSubmit(submit)} className="space-y-8">
      <Section title="Your contact details" subtitle="We’ll confirm progress and next steps using your preferred channel." />

      <div className="grid gap-6 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label className="label">Full name</label>
          <input className="input" {...form.register('fullName')} />
        </div>
        <div>
          <label className="label">Email</label>
          <input className="input" type="email" {...form.register('email')} />
        </div>
        <div>
          <label className="label">Mobile</label>
          <input className="input" inputMode="tel" placeholder="04xxxxxxxx" {...form.register('mobile')} />
          <p className="help">Use a number we can reach during business hours.</p>
        </div>
        <div>
          <label className="label">Preferred contact</label>
          <select className="input" {...form.register('preferredContact')}>
            <option value="sms">SMS</option>
            <option value="email">Email</option>
            <option value="call">Phone call</option>
          </select>
        </div>
        <div className="sm:col-span-2">
          <label className="label">Residential address</label>
          <input className="input" placeholder="Start typing…" {...form.register('address')} />
          <p className="help">Street address including suburb. Manual entry is fine.</p>
        </div>
        <div>
          <label className="label">Date of birth (optional)</label>
          <input className="input" type="date" {...form.register('dob')} />
        </div>
      </div>

      <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center gap-3 sm:justify-between">
        <button type="button" className="btn btn-secondary w-full sm:w-auto" onClick={onBack}>Back</button>
        <button type="submit" className="btn btn-primary w-full sm:w-auto">Save &amp; Continue</button>
      </div>
    </form>
  )
}
