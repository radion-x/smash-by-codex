import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { accidentDetailsSchema } from '@/schemas'
import { z } from 'zod'
import { useFormStore } from '@/store/formStore'
import type { StepProps } from '../Wizard'
import Section from '@/components/Section'

type F = z.infer<typeof accidentDetailsSchema>

export default function AccidentDetails({ onBack, onNext }: StepProps) {
  const update = useFormStore((s) => s.update)
  const data = useFormStore((s) => s.data)
  const form = useForm<F>({ resolver: zodResolver(accidentDetailsSchema), defaultValues: (data as any)?.accident ?? { when: new Date().toISOString().slice(0,16) } })

  const submit = (v: F) => { update({ accident: v }); onNext() }

  const yesNo = (
    <>
      <option value="">Select…</option>
      <option value="yes">Yes</option>
      <option value="no">No</option>
    </>
  )

  return (
    <form onSubmit={form.handleSubmit(submit)} className="space-y-8">
      <Section title="Accident snapshot" subtitle="Approximate information is okay. Add anything that helps us understand the scene." />

      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <label className="label">Date &amp; time</label>
          <input className="input" type="datetime-local" {...form.register('when')} />
        </div>
        <div className="sm:col-span-2">
          <label className="label">Location</label>
          <input className="input" placeholder="Pin on map or type address" {...form.register('location.description')} />
          <p className="help">Use suburb / intersection if you don’t have an exact street.</p>
        </div>
        <div>
          <label className="label">Road type</label>
          <input className="input" placeholder="e.g. residential street" {...form.register('roadType')} />
        </div>
        <div>
          <label className="label">Speed zone</label>
          <input className="input" placeholder="50 km/h" {...form.register('speedZone')} />
        </div>
        <div>
          <label className="label">Weather / lighting</label>
          <input className="input" placeholder="e.g. clear daytime" {...form.register('weather')} />
        </div>
        <div>
          <label className="label">Road conditions</label>
          <input className="input" placeholder="e.g. wet, debris" {...form.register('roadConditions')} />
        </div>

        {[{ name: 'drivable', label: 'Vehicle drivable?' },
          { name: 'airbagDeployed', label: 'Airbags deployed?' },
          { name: 'windscreenDamage', label: 'Windscreen damage?' },
          { name: 'fluidLeaks', label: 'Leaking fluids?' },
          { name: 'hazardsRemaining', label: 'Hazards remaining?' },
          { name: 'policeAttended', label: 'Police attended?' }].map((f) => (
          <div key={f.name}>
            <label className="label">{f.label}</label>
            <select className="input" {...form.register(f.name as any)}>{yesNo}</select>
          </div>
        ))}

        <div className="sm:col-span-2">
          <label className="label">Police event/report number (optional)</label>
          <input className="input" {...form.register('policeNumber')} />
        </div>
        <div className="sm:col-span-2 grid gap-4">
          <div>
            <label className="label">Towed by</label>
            <input className="input" placeholder="Company or person" {...form.register('towing.who')} />
          </div>
          <div>
            <label className="label">Yard address</label>
            <input className="input" placeholder="Where the vehicle is stored" {...form.register('towing.yard')} />
          </div>
          <div>
            <label className="label">Reference number</label>
            <input className="input" placeholder="Tow or storage reference" {...form.register('towing.ref')} />
          </div>
        </div>
        <div className="sm:col-span-2">
          <label className="label">What happened?</label>
          <textarea className="input" rows={4} placeholder="Briefly describe the incident from your perspective" {...form.register('narrative')} />
        </div>
      </div>

      <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center gap-3 sm:justify-between">
        <button type="button" className="btn btn-secondary w-full sm:w-auto" onClick={onBack}>Back</button>
        <button type="submit" className="btn btn-primary w-full sm:w-auto">Save &amp; Continue</button>
      </div>
    </form>
  )
}
