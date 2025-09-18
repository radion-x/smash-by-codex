import DamageMap, { type DamageSelection } from '@/components/DamageMap'
import type { StepProps } from '../Wizard'
import { useFormStore } from '@/store/formStore'

export default function DamageMapPage({ onBack, onNext }: StepProps) {
  const update = useFormStore((s) => s.update)
  const data = useFormStore((s) => s.data)
  const value = (data as any).damage ?? []

  const onChange = (v: DamageSelection[]) => update({ damage: v })

  return (
    <div className="space-y-4">
      <Section title="Damage map" subtitle="Tap the panels that are damaged and tell us the type and severity."></Section>
      <DamageMap value={value} onChange={onChange} />
      <div className="flex justify-between">
        <button type="button" className="btn btn-secondary" onClick={onBack}>Back</button>
        <button type="button" className="btn btn-primary" onClick={onNext}>Continue</button>
      </div>
    </div>
  )
}
import Section from '@/components/Section'
