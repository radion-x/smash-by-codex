import { useEffect, useMemo, useRef, useState } from 'react'
import { severityEnum, damageTypeEnum } from '@/schemas'

type RegionsJson = {
  version: string
  spritePath: string
  coordinateSystem: 'relative'
  views: Array<{
    id: string
    label: string
    rect: { x: number, y: number, w: number, h: number }
    regions: Array<{
      id: string
      label: string
      shape: 'polygon'
      points: Array<[number, number]>
    }>
  }>
  legend: Array<{ type: string, label: string }>
  severity: Array<typeof severityEnum._type>
}

export type DamageSelection = {
  id: string
  viewId: string
  type: typeof damageTypeEnum._type
  severity: typeof severityEnum._type
  notes?: string
}

type Props = {
  value: DamageSelection[]
  onChange: (v: DamageSelection[]) => void
}

export default function DamageMap({ value, onChange }: Props) {
  const [cfg, setCfg] = useState<RegionsJson | null>(null)
  const [imgSize, setImgSize] = useState<{w:number, h:number}>({ w: 0, h: 0 })
  const [active, setActive] = useState<{ id: string, viewId: string, x: number, y: number } | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    fetch('/assets/regions.json').then(r => r.json()).then(setCfg)
  }, [])

  const imgSrc = cfg?.spritePath

  const isSelected = (rid: string, vid: string) => value.some(v => v.id === rid && v.viewId === vid)
  const selectionFor = (rid: string, vid: string) => value.find(v => v.id === rid && v.viewId === vid)

  const toggle = (rid: string, vid: string, click?: {x:number,y:number}) => {
    const exists = isSelected(rid, vid)
    if (exists) {
      onChange(value.filter(v => !(v.id === rid && v.viewId === vid)))
      setActive(null)
    } else {
      onChange([...value, { id: rid, viewId: vid, type: 'scratch', severity: 'minor' }])
      if (click) setActive({ id: rid, viewId: vid, ...click })
    }
  }

  const clear = () => { onChange([]); setActive(null) }

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-2">
        <div className="text-sm text-gray-600">Tap a panel to mark damage. Tap again to unselect.</div>
        <button type="button" className="btn btn-secondary" onClick={clear}>Clear selections</button>
      </div>
      <div ref={containerRef} className="relative card overflow-hidden">
        {imgSrc && (
          <img src={imgSrc} alt="Car diagram" className="block w-full h-auto" onLoad={(e) => {
            const el = e.currentTarget
            setImgSize({ w: el.naturalWidth, h: el.naturalHeight })
          }} />
        )}
        {cfg && cfg.views.map((v) => (
          <SvgOverlay key={v.id} view={v} imgSize={imgSize} onToggle={toggle} isSelected={isSelected} setActive={setActive} />
        ))}
        {active && (
          <Popover
            x={active.x} y={active.y}
            selection={selectionFor(active.id, active.viewId)}
            onChange={(s) => {
              onChange(value.map(v => v.id===active.id && v.viewId===active.viewId ? { ...v, ...s } : v))
            }}
          />
        )}
      </div>
      {cfg && (
        <div className="mt-3 text-xs text-gray-600">
          Legend: {cfg.legend.map(l => l.label).join(', ')}
        </div>
      )}
    </div>
  )
}

function SvgOverlay({ view, imgSize, onToggle, isSelected, setActive }: any) {
  const { x, y, w, h } = view.rect
  return (
    <svg
      role="img" aria-label={view.label}
      viewBox={`0 0 ${imgSize.w} ${imgSize.h}`}
      className="absolute inset-0 pointer-events-none"
    >
      <g transform={`translate(${x*imgSize.w}, ${y*imgSize.h}) scale(${w}, ${h})`}>
        {view.regions.map((r: any, idx: number) => {
          const d = polygonPath(r.points)
          const sel = isSelected(r.id, view.id)
          return (
            <path key={idx} d={d}
              onClick={(e) => {
                const bbox = (e.target as SVGPathElement).getBoundingClientRect()
                onToggle(r.id, view.id, { x: bbox.x + bbox.width + 8, y: bbox.y })
              }}
              className="pointer-events-auto cursor-pointer"
              fill={sel ? 'rgba(37, 99, 235, 0.45)' : 'rgba(37, 99, 235, 0.12)'}
              stroke={sel ? 'rgba(37, 99, 235, 0.9)' : 'rgba(37, 99, 235, 0.6)'}
              strokeWidth={0.005}
            >
            </path>
          )
        })}
      </g>
    </svg>
  )
}

function polygonPath(points: Array<[number, number]>) {
  return points.map((p, i) => `${i===0?'M':'L'} ${p[0]} ${p[1]}`).join(' ') + ' Z'
}

function Popover({ x, y, selection, onChange }: { x:number, y:number, selection: any, onChange: (s: any) => void }) {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) {
        // ignore
      }
    }
    window.addEventListener('click', handler)
    return () => window.removeEventListener('click', handler)
  }, [])
  if (!selection) return null
  return (
    <div ref={ref} className="absolute z-20 bg-white border rounded shadow p-3 w-64" style={{ left: Math.min(x, window.innerWidth-280), top: Math.max(8, y) }}>
      <div className="text-sm font-medium mb-2">Damage details</div>
      <div className="space-y-2">
        <div>
          <label className="label">Type</label>
          <select className="input" value={selection.type} onChange={(e) => onChange({ type: e.target.value })}>
            {damageTypeEnum.options.map(t => <option key={t} value={t}>{t.replace('_',' ')}</option>)}
          </select>
        </div>
        <div>
          <label className="label">Severity</label>
          <div className="flex flex-wrap gap-2">
            {severityEnum.options.map(s => (
              <label key={s} className="inline-flex items-center gap-1 text-sm">
                <input type="radio" name={`sev-${selection.id}-${selection.viewId}`} checked={selection.severity===s} onChange={() => onChange({ severity: s })} /> {s}
              </label>
            ))}
          </div>
        </div>
        <div>
          <label className="label">Notes (optional)</label>
          <input className="input" value={selection.notes ?? ''} onChange={e => onChange({ notes: e.target.value })} />
        </div>
      </div>
    </div>
  )
}
