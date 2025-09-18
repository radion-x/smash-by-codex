import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { yourDetailsSchema } from '@/schemas'
import { z } from 'zod'
import { useFormStore } from '@/store/formStore'
import type { StepProps } from '../Wizard'

type F = z.infer<typeof yourDetailsSchema>

export default function YourDetails({ onBack, onNext }: StepProps) {
  const update = useFormStore((s) => s.update)
  const data = useFormStore((s) => s.data)
  const form = useForm<F>({ resolver: zodResolver(yourDetailsSchema), defaultValues: (data as any)?.your })

  const submit = (v: F) => { update({ your: v }); onNext() }

  return (
    <form onSubmit={form.handleSubmit(submit)} className="space-y-4">
      <Section title="Your details" subtitle="We’ll use these to contact you about your repair."></Section>
      <div className="grid gap-3">
        <div>
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
          <p className="help">AU mobiles start with 04 and have 10 digits.</p>
        </div>
        <div>
          <label className="label">Preferred contact</label>
          <select className="input" {...form.register('preferredContact')}>
            <option value="sms">SMS</option>
            <option value="email">Email</option>
            <option value="call">Phone call</option>
          </select>
        </div>
        <div>
          <label className="label">Residential address</label>
          <input className="input" placeholder="Start typing…" {...form.register('address')} />
          <p className="help">Autocomplete can be enabled later; manual entry is fine.</p>
        </div>
        <div>
          <label className="label">Date of birth (optional)</label>
          <input className="input" type="date" {...form.register('dob')} />
        </div>
      </div>

      <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center gap-2 sm:justify-between">
        <button type="button" className="btn btn-secondary w-full sm:w-auto" onClick={onBack}>Back</button>
        <button type="submit" className="btn btn-primary w-full sm:w-auto">Continue</button>
      </div>
    </form>
  )
}
import Section from '@/components/Section'
