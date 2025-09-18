import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { otherPartySchema } from '@/schemas'
import { z } from 'zod'
import { useFormStore } from '@/store/formStore'
import type { StepProps } from '../Wizard'
import Section from '@/components/Section'

type F = z.infer<typeof otherPartySchema>

export default function OtherParty({ onBack, onNext }: StepProps) {
  const update = useFormStore((s) => s.update)
  const data = useFormStore((s) => s.data)
  const form = useForm<F>({ resolver: zodResolver(otherPartySchema), defaultValues: (data as any)?.otherParty ?? { vehicles: [], witnesses: [] } })

  const submit = (v: F) => { update({ otherParty: v }); onNext() }

  return (
    <form onSubmit={form.handleSubmit(submit)} className="space-y-8">
      <Section title="Other party / property" subtitle="Provide details for any other vehicles, property owners or witnesses involved." />

      <div className="card p-6 space-y-4">
        <h3 className="text-sm font-semibold text-ink-700">Other vehicle (optional)</h3>
        <div className="grid gap-4 sm:grid-cols-2">
          <input className="input" placeholder="Rego" {...form.register('vehicles.0.rego')} />
          <input className="input" placeholder="State" {...form.register('vehicles.0.state')} />
          <input className="input" placeholder="Make" {...form.register('vehicles.0.make')} />
          <input className="input" placeholder="Model" {...form.register('vehicles.0.model')} />
          <input className="input" placeholder="Colour" {...form.register('vehicles.0.colour')} />
          <input className="input" placeholder="Driver name" {...form.register('vehicles.0.driverName')} />
          <input className="input" placeholder="Licence number (optional)" {...form.register('vehicles.0.licenceNumber')} />
          <input className="input" placeholder="Insurer" {...form.register('vehicles.0.insurer')} />
          <input className="input sm:col-span-2" placeholder="Policy/Claim number (optional)" {...form.register('vehicles.0.claim')} />
          <input className="input sm:col-span-2" placeholder="Contact details" {...form.register('vehicles.0.contact')} />
        </div>
      </div>

      <div className="card p-6 space-y-4">
        <h3 className="text-sm font-semibold text-ink-700">Third‑party property (optional)</h3>
        <div className="grid gap-4 sm:grid-cols-2">
          <input className="input" placeholder="Owner name" {...form.register('property.owner' as any)} />
          <input className="input" placeholder="Owner contact" {...form.register('property.contact' as any)} />
        </div>
      </div>

      <div className="card p-6 space-y-4">
        <h3 className="text-sm font-semibold text-ink-700">Witnesses (optional)</h3>
        <div className="grid gap-4 sm:grid-cols-2">
          <input className="input" placeholder="Witness name" {...form.register('witnesses.0.name')} />
          <input className="input" placeholder="Witness contact" {...form.register('witnesses.0.contact')} />
        </div>
      </div>

      <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center gap-3 sm:justify-between">
        <button type="button" className="btn btn-secondary w-full sm:w-auto" onClick={onBack}>Back</button>
        <button type="submit" className="btn btn-primary w-full sm:w-auto">Save &amp; Continue</button>
      </div>
    </form>
  )
}

