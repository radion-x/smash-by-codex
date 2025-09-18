import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { insuranceSchema } from '@/schemas'
import { z } from 'zod'
import { useFormStore } from '@/store/formStore'
import type { StepProps } from '../Wizard'

type F = z.infer<typeof insuranceSchema>

export default function InsuranceAuth({ onBack, onNext }: StepProps) {
  const update = useFormStore((s) => s.update)
  const data = useFormStore((s) => s.data)
  const form = useForm<F>({ resolver: zodResolver(insuranceSchema), defaultValues: (data as any)?.insurance ?? { authoriseLiaison: false, termsAccepted: false } })

  const submit = (v: F) => { update({ insurance: v }); onNext() }

  return (
    <form onSubmit={form.handleSubmit(submit)} className="space-y-4">
      <Section title="Insurance & authorisations" subtitle="If you know your policy or claim number, add it. Please authorise us to liaise with your insurer."></Section>
      <div className="grid sm:grid-cols-2 gap-3">
        <input className="input" placeholder="Your insurer" {...form.register('insurer')} />
        <input className="input" placeholder="Policy number" {...form.register('policyNumber')} />
        <input className="input" placeholder="Claim number (optional)" {...form.register('claimNumber')} />
        <input className="input" placeholder="Excess amount (if known)" {...form.register('excessAmount')} />
        <div>
          <label className="label">Courtesy car needed?</label>
          <select className="input" {...form.register('courtesyCar')}>
            <option value="">Select…</option>
            <option value="yes">Yes</option>
            <option value="no">No</option>
          </select>
        </div>
        <input className="input" placeholder="Pickup/Drop-off preference" {...form.register('pickupDropoff')} />
        <input className="input sm:col-span-2" placeholder="Date windows" {...form.register('dateWindows')} />
      </div>

      <label className="flex gap-2 items-start">
        <input type="checkbox" className="mt-1" {...form.register('authoriseLiaison')} />
        <span className="text-sm">I authorise the shop to liaise with my insurer and act on my behalf for assessment and repair.</span>
      </label>

      <div className="rounded border p-3 bg-gray-50 text-sm">
        <p className="font-medium">Terms of Service & Privacy Policy</p>
        <p>By continuing, you agree to the shop’s terms and privacy policy.</p>
      </div>
      <label className="flex gap-2 items-start">
        <input type="checkbox" className="mt-1" {...form.register('termsAccepted')} />
        <span className="text-sm">I have read and agree to the Terms of Service and Privacy Policy.</span>
      </label>

      <div className="flex justify-between">
        <button type="button" className="btn btn-secondary" onClick={onBack}>Back</button>
        <button type="submit" className="btn btn-primary">Continue</button>
      </div>
    </form>
  )
}
import Section from '@/components/Section'
