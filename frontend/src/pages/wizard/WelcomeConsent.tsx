import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { consentSchema } from '@/schemas'
import { z } from 'zod'
import { useFormStore } from '@/store/formStore'
import type { StepProps } from '../Wizard'

type F = z.infer<typeof consentSchema>

export default function WelcomeConsent({ onNext }: StepProps) {
  const update = useFormStore((s) => s.update)
  const data = useFormStore((s) => s.data)
  const form = useForm<F>({ resolver: zodResolver(consentSchema), defaultValues: (data as any)?.consent ?? { consent: false, notDrivable: false } })

  const submit = (v: F) => { update({ consent: v }); onNext() }

  return (
    <form onSubmit={form.handleSubmit(submit)} className="space-y-4">
      <div>
        <h1 className="text-xl font-semibold">Welcome</h1>
        <p className="text-sm text-gray-600">Please provide details about your vehicle and the accident so we can assist with your repair and any related insurance claim.</p>
      </div>
      <div className="card p-3">
        <p className="text-sm">Privacy: We collect only what we need to manage your repair and liaise with insurers. See our privacy policy for details.</p>
      </div>
      <label className="flex gap-2 items-start">
        <input type="checkbox" className="mt-1" {...form.register('consent')} />
        <span className="text-sm">I consent to collection and use of my information for managing my repair and related insurance claim.</span>
      </label>
      {form.formState.errors.consent && <p className="error">{form.formState.errors.consent.message as any}</p>}

      <label className="flex gap-2 items-center">
        <input type="checkbox" {...form.register('notDrivable')} /> Not drivable
      </label>

      {form.watch('notDrivable') && (
        <div className="rounded border p-3 bg-yellow-50">
          <p className="font-medium mb-2">Request Tow/Assistance</p>
          <div className="grid grid-cols-1 gap-3">
            <div>
              <label className="label">Your location</label>
              <input className="input" placeholder="Suburb or street address" {...form.register('assistance.location')} />
            </div>
            <div>
              <label className="label">Callback number</label>
              <input className="input" inputMode="tel" placeholder="04xxxxxxxx" {...form.register('assistance.callback')} />
              <p className="help">We’ll call you to coordinate towing.</p>
            </div>
          </div>
        </div>
      )}

      <div className="flex justify-end gap-2">
        <button type="submit" className="btn btn-primary">Continue</button>
      </div>
    </form>
  )
}
