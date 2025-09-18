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
    <form onSubmit={form.handleSubmit(submit)} className="space-y-8">
      <div className="space-y-2">
        <h1>Welcome to Matraville Smash Repairs</h1>
        <p className="text-base text-ink-500">We’ll guide you through ten quick steps so our assessment team can start work immediately. You can save and return at any time.</p>
      </div>

      <div className="card p-6 border-l-4 border-brand-600 space-y-3">
        <h3 className="text-sm font-semibold text-ink-700">Why we need this information</h3>
        <p className="text-sm text-ink-500">We only collect the details required to coordinate your repair, work with insurers, and keep you informed. Data is encrypted at rest and only shared with authorised parties.</p>
      </div>

      <div className="space-y-4">
        <label className="flex items-start gap-3 rounded-xl border border-ink-100 bg-white px-4 py-3">
          <input type="checkbox" className="mt-1 h-5 w-5 rounded border-ink-300 text-brand-600 focus:ring-brand-600" {...form.register('consent')} />
          <span className="text-sm leading-6">I consent to collection and use of my information for managing my repair and related insurance claim.</span>
        </label>
        {form.formState.errors.consent && <p className="error">{form.formState.errors.consent.message as any}</p>}

        <label className="flex items-center gap-3 text-sm text-ink-600">
          <input type="checkbox" className="h-4 w-4 rounded border-ink-300 text-brand-600 focus:ring-brand-600" {...form.register('notDrivable')} />
          Vehicle is not drivable
        </label>
      </div>

      {form.watch('notDrivable') && (
        <div className="card p-6 bg-amber-50/40 border-amber-200 space-y-4">
          <div>
            <h3 className="text-sm font-semibold text-ink-700">Request tow or roadside assistance</h3>
            <p className="text-sm text-ink-500">Provide your current location and a mobile number so we can coordinate help immediately.</p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label className="label">Your location</label>
              <input className="input" placeholder="Suburb or street address" {...form.register('assistance.location')} />
            </div>
            <div>
              <label className="label">Callback number</label>
              <input className="input" inputMode="tel" placeholder="04xxxxxxxx" {...form.register('assistance.callback')} />
              <p className="help">We’ll call you within a few minutes to confirm.</p>
            </div>
          </div>
        </div>
      )}

      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:justify-end">
        <button type="submit" className="btn btn-primary w-full sm:w-auto">Let’s begin</button>
      </div>
    </form>
  )
}
