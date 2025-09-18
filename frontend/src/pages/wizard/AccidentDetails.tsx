import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { accidentDetailsSchema } from '@/schemas'
import { z } from 'zod'
import { useFormStore } from '@/store/formStore'
import type { StepProps } from '../Wizard'

type F = z.infer<typeof accidentDetailsSchema>

export default function AccidentDetails({ onBack, onNext }: StepProps) {
  const update = useFormStore((s) => s.update)
  const data = useFormStore((s) => s.data)
  const form = useForm<F>({ resolver: zodResolver(accidentDetailsSchema), defaultValues: (data as any)?.accident ?? { when: new Date().toISOString().slice(0,16) } })

  const submit = (v: F) => { update({ accident: v }); onNext() }

  return (
    <form onSubmit={form.handleSubmit(submit)} className="space-y-4">
      <Section title="Accident details" subtitle="Approximate date/time and location are fine. Add anything that helps explain what happened."></Section>
      <div className="grid sm:grid-cols-2 gap-3">
        <div>
          <label className="label">Date/time</label>
          <input className="input" type="datetime-local" {...form.register('when')} />
        </div>
        <div className="sm:col-span-2">
          <label className="label">Location</label>
          <input className="input" placeholder="Pin on map or type address" {...form.register('location.description')} />
          <p className="help">Map can be enabled later; manual entry is fine.</p>
        </div>
        <div>
          <label className="label">Road type</label>
          <input className="input" {...form.register('roadType')} />
        </div>
        <div>
          <label className="label">Speed zone</label>
          <input className="input" {...form.register('speedZone')} />
        </div>
        <div>
          <label className="label">Weather / lighting</label>
          <input className="input" placeholder="e.g., clear, raining, night" {...form.register('weather')} />
        </div>
        <div>
          <label className="label">Road conditions</label>
          <input className="input" placeholder="e.g., wet, gravel" {...form.register('roadConditions')} />
        </div>

        {[
          { name: 'drivable', label: 'Drivable?'},
          { name: 'airbagDeployed', label: 'Airbag deployed?'},
          { name: 'windscreenDamage', label: 'Windscreen damage?'},
          { name: 'fluidLeaks', label: 'Fluid leaks?'},
          { name: 'hazardsRemaining', label: 'Hazards remaining?'},
          { name: 'policeAttended', label: 'Police attended?'},
        ].map((f) => (
          <div key={f.name}>
            <label className="label">{f.label}</label>
            <select className="input" {...form.register(f.name as any)}>
              <option value="">Select…</option>
              <option value="yes">Yes</option>
              <option value="no">No</option>
            </select>
          </div>
        ))}

        <div className="sm:col-span-2">
          <label className="label">Police Event/Report number (optional)</label>
          <input className="input" {...form.register('policeNumber')} />
        </div>
        <div className="sm:col-span-2">
          <label className="label">Towing details (if applicable)</label>
          <input className="input mb-2" placeholder="Who towed (company)" {...form.register('towing.who')} />
          <input className="input mb-2" placeholder="Yard address" {...form.register('towing.yard')} />
          <input className="input" placeholder="Reference number" {...form.register('towing.ref')} />
        </div>
        <div className="sm:col-span-2">
          <label className="label">What happened?</label>
          <textarea className="input" rows={4} placeholder="Briefly describe the incident" {...form.register('narrative')} />
        </div>
      </div>

      <div className="flex justify-between">
        <button type="button" className="btn btn-secondary" onClick={onBack}>Back</button>
        <button type="submit" className="btn btn-primary">Continue</button>
      </div>
    </form>
  )
}
import Section from '@/components/Section'
