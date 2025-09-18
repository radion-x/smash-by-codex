import type { StepProps } from '../Wizard'
import PhotoPicker from '@/components/PhotoPicker'
import { useFormStore } from '@/store/formStore'

type Uploaded = { id: string; key: string; mime: string; size: number }

const CATEGORIES = [
  { tag: 'front', label: 'Front' },
  { tag: 'rear', label: 'Rear' },
  { tag: 'left', label: 'Left side' },
  { tag: 'right', label: 'Right side' },
  { tag: 'roof', label: 'Roof / top view' },
  { tag: 'interior', label: 'Interior (airbags)' },
  { tag: 'damage_closeup', label: 'Close-ups of damage', min: 2 },
  { tag: 'odometer', label: 'Odometer' },
  { tag: 'vin_plate', label: 'VIN plate' },
  { tag: 'licence_front', label: 'Driver licence (front)' },
  { tag: 'licence_back', label: 'Driver licence (back)' },
  { tag: 'rego_plate', label: 'Rego plate close-up' },
  { tag: 'insurance_doc', label: 'Insurance card/email screenshot' },
]

export default function RequiredPhotos({ onBack, onNext }: StepProps) {
  const update = useFormStore((s) => s.update)
  const data = useFormStore((s) => s.data)
  const items: any[] = (data as any).photos?.items || []
  const damage = (data as any).damage || []

  const addFiles = (tag: string) => (files: Uploaded[]) => {
    const existing = items.find((i) => i.tag === tag)
    const fileIds = files.map((f) => f.key)
    if (existing) {
      existing.fileIds = [...(existing.fileIds || []), ...fileIds]
    } else {
      items.push({ tag, fileIds })
    }
    update({ photos: { items: [...items] } as any })
  }

  const removeFile = (tag: string, key: string) => {
    const existing = items.find((i) => i.tag === tag)
    if (!existing) return
    existing.fileIds = (existing.fileIds || []).filter((k: string) => k !== key)
    update({ photos: { items: [...items] } as any })
  }

  const countFor = (tag: string) => items.find((i) => i.tag === tag)?.fileIds?.length || 0

  const canContinue = () => {
    const must = ['front','rear','left','right']
    for (const t of must) if (countFor(t) < 1) return false
    if (damage?.length >= 1 && countFor('damage_closeup') < 2) return false
    return true
  }

  return (
    <div className="space-y-4">
      <Section title="Required photos" subtitle="Take clear, well-lit photos. Use landscape where possible. We’ll auto-rotate and compress for upload."></Section>

      <div className="grid gap-3">
        {CATEGORIES.map((c) => (
          <div key={c.tag} className="relative">
            <PhotoPicker
              tag={c.tag}
              label={`${c.label} ${c.min?`(min ${c.min})`:''}`}
              min={c.min}
              onUploaded={addFiles(c.tag)}
              files={items.find((i) => i.tag === c.tag)?.fileIds || []}
              onRemove={(key) => removeFile(c.tag, key)}
            />
            <div className="absolute top-2 right-2 text-xs">
              {countFor(c.tag) > 0 ? <span className="px-2 py-0.5 rounded bg-green-100 text-green-800">{countFor(c.tag)} ✓</span> : null}
            </div>
          </div>
        ))}
      </div>

      <div className="text-sm text-gray-700 dark:text-slate-300">
        Required: Front, Rear, Left, Right. If you marked damage, add at least two close-ups.
      </div>

      <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center gap-2 sm:justify-between">
        <button type="button" className="btn btn-secondary w-full sm:w-auto" onClick={onBack}>Back</button>
        <button type="button" className="btn btn-primary w-full sm:w-auto" onClick={() => {
          if (!canContinue()) { alert('Please upload Front, Rear, Left and Right photos. If damage was marked, include at least two close-ups.'); return }
          onNext()
        }}>Continue</button>
      </div>
    </div>
  )
}
import Section from '@/components/Section'
