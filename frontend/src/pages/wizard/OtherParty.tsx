import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { otherPartySchema } from '@/schemas'
import { z } from 'zod'
import { useFormStore } from '@/store/formStore'
import type { StepProps } from '../Wizard'

type F = z.infer<typeof otherPartySchema>

export default function OtherParty({ onBack, onNext }: StepProps) {
  const update = useFormStore((s) => s.update)
  const data = useFormStore((s) => s.data)
  const form = useForm<F>({ resolver: zodResolver(otherPartySchema), defaultValues: (data as any)?.otherParty ?? { vehicles: [], witnesses: [] } })

  const submit = (v: F) => { update({ otherParty: v }); onNext() }

  return (
    <form onSubmit={form.handleSubmit(submit)} className="space-y-4">
      <Section title="Other party / property" subtitle="If another vehicle or property was involved, add what you know. Leave blank if unsure."></Section>
      <div className="space-y-2">
        <p className="font-medium">Other vehicles (if any)</p>
        <p className="help">Include rego, make/model/colour, driver and insurer details if known.</p>
        {/* Simplified single vehicle entry for now */}
        <div className="grid sm:grid-cols-2 gap-3">
          <input className="input" placeholder="Rego" {...form.register('vehicles.0.rego')} />
          <input className="input" placeholder="State" {...form.register('vehicles.0.state')} />
          <input className="input" placeholder="Make" {...form.register('vehicles.0.make')} />
          <input className="input" placeholder="Model" {...form.register('vehicles.0.model')} />
          <input className="input" placeholder="Colour" {...form.register('vehicles.0.colour')} />
          <input className="input" placeholder="Driver name" {...form.register('vehicles.0.driverName')} />
          <input className="input" placeholder="Licence number (optional)" {...form.register('vehicles.0.licenceNumber')} />
          <input className="input" placeholder="Insurer" {...form.register('vehicles.0.insurer')} />
          <input className="input" placeholder="Policy/Claim number (optional)" {...form.register('vehicles.0.claim')} />
          <input className="input" placeholder="Contact details" {...form.register('vehicles.0.contact')} />
        </div>
      </div>

      <div className="space-y-2">
        <p className="font-medium">Third-party property (if any)</p>
        <div className="grid sm:grid-cols-2 gap-3">
          <input className="input" placeholder="Owner name" {...form.register('property.owner' as any)} />
          <input className="input" placeholder="Owner contact" {...form.register('property.contact' as any)} />
        </div>
      </div>

      <div className="space-y-2">
        <p className="font-medium">Witnesses (if any)</p>
        <div className="grid sm:grid-cols-2 gap-3">
          <input className="input" placeholder="Witness name" {...form.register('witnesses.0.name')} />
          <input className="input" placeholder="Witness contact" {...form.register('witnesses.0.contact')} />
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
