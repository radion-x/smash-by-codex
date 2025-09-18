import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { vehicleDetailsSchema } from '@/schemas'
import { z } from 'zod'
import { useFormStore } from '@/store/formStore'
import type { StepProps } from '../Wizard'

type F = z.infer<typeof vehicleDetailsSchema>

export default function VehicleDetails({ onBack, onNext }: StepProps) {
  const update = useFormStore((s) => s.update)
  const data = useFormStore((s) => s.data)
  const form = useForm<F>({ resolver: zodResolver(vehicleDetailsSchema), defaultValues: (data as any)?.vehicle })

  const submit = (v: F) => { update({ vehicle: v }); onNext() }

  return (
    <form onSubmit={form.handleSubmit(submit)} className="space-y-4">
      <Section title="Vehicle details" subtitle="Tell us about your car so we can identify parts and verify registration."></Section>
      <div className="grid sm:grid-cols-2 gap-3">
        <div>
          <label className="label">Rego</label>
          <input className="input" {...form.register('rego')} />
        </div>
        <div>
          <label className="label">State</label>
          <select className="input" {...form.register('regoState')}>
            {['NSW','VIC','QLD','WA','SA','TAS','ACT','NT'].map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
        <div className="sm:col-span-2">
          <label className="label">VIN</label>
          <input className="input" {...form.register('vin')} />
          <p className="help">VIN is usually on the windscreen, door jamb, or rego papers (17 characters).</p>
        </div>
        <div>
          <label className="label">Make</label>
          <input className="input" {...form.register('make')} />
        </div>
        <div>
          <label className="label">Model</label>
          <input className="input" {...form.register('model')} />
        </div>
        <div>
          <label className="label">Year</label>
          <input className="input" type="number" {...form.register('year', { valueAsNumber: true })} />
        </div>
        <div>
          <label className="label">Colour</label>
          <input className="input" {...form.register('colour')} />
        </div>
        <div>
          <label className="label">Body type</label>
          <input className="input" {...form.register('bodyType')} />
        </div>
        <div>
          <label className="label">Transmission</label>
          <input className="input" {...form.register('transmission')} />
        </div>
        <div>
          <label className="label">Fuel type</label>
          <input className="input" {...form.register('fuelType')} />
        </div>
        <div className="sm:col-span-2">
          <label className="label">Factory options & accessories</label>
          <input className="input" placeholder="e.g., roof racks, dash cam, bull bar" {...form.register('options.0')} />
        </div>
        <div className="sm:col-span-2">
          <label className="label">Notable modifications</label>
          <input className="input" {...form.register('modifications')} />
        </div>
        <div>
          <label className="label">Rego expiry month</label>
          <input className="input" type="number" min={1} max={12} {...form.register('regoExpiryMonth', { valueAsNumber: true })} />
        </div>
        <div>
          <label className="label">Rego expiry year</label>
          <input className="input" type="number" {...form.register('regoExpiryYear', { valueAsNumber: true })} />
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
