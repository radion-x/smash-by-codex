import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent,
  type MouseEvent,
} from 'react'
import { damageViews } from '@/data/damageMapConfig'
import { damageTypeEnum, severityEnum } from '@/schemas'

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

type ActivePopover = {
  regionId: string
  viewId: string
  anchor: { x: number; y: number }
}

export default function DamageMap({ value, onChange }: Props) {
  const [viewId, setViewId] = useState(damageViews[0]?.id ?? 'top')
  const [active, setActive] = useState<ActivePopover | null>(null)
  const [hovered, setHovered] = useState<string | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  const view = useMemo(
    () => damageViews.find((v) => v.id === viewId) ?? damageViews[0],
    [viewId]
  )

  const selectionsByView = useMemo(() => {
    return value.reduce<Record<string, DamageSelection[]>>((acc, sel) => {
      acc[sel.viewId] = acc[sel.viewId] ? [...acc[sel.viewId], sel] : [sel]
      return acc
    }, {})
  }, [value])

  const isSelected = (regionId: string, vId: string) =>
    selectionsByView[vId]?.some((sel) => sel.id === regionId) ?? false

  const selectionFor = (regionId: string, vId: string) =>
    selectionsByView[vId]?.find((sel) => sel.id === regionId)

  const handleClear = () => {
    onChange([])
    setActive(null)
  }

  const handleRegionToggle = (
    regionId: string,
    regionDefaults: { type?: typeof damageTypeEnum._type; severity?: typeof severityEnum._type },
    event: MouseEvent<SVGPathElement> | KeyboardEvent<SVGPathElement>
  ) => {
    const target = event.currentTarget
    const alreadySelected = isSelected(regionId, view.id)

    if (alreadySelected) {
      onChange(value.filter((sel) => !(sel.id === regionId && sel.viewId === view.id)))
      setActive(null)
      return
    }

    const selection = {
      id: regionId,
      viewId: view.id,
      type: regionDefaults.type ?? damageTypeEnum.options[0],
      severity: regionDefaults.severity ?? severityEnum.options[0],
    }

    const containerRect = containerRef.current?.getBoundingClientRect()
    const pathRect = target.getBoundingClientRect()
    const anchor = {
      x: pathRect.left - (containerRect?.left ?? 0) + pathRect.width + 12,
      y: pathRect.top - (containerRect?.top ?? 0),
    }

    onChange([...value, selection])
    setActive({ regionId, viewId: view.id, anchor })
  }

  const handleNotesMutation = (
    regionId: string,
    viewKey: string,
    updates: Partial<DamageSelection>
  ) => {
    onChange(
      value.map((sel) =>
        sel.id === regionId && sel.viewId === viewKey
          ? { ...sel, ...updates }
          : sel
      )
    )
  }

  const aspectRatio = useMemo(() => {
    const [, , width, height] = view.viewBox.split(' ').map(Number)
    return width && height ? height / width : 0.5
  }, [view.viewBox])

  const currentSelection = active ? selectionFor(active.regionId, active.viewId) : null

  useEffect(() => {
    if (active && !selectionFor(active.regionId, active.viewId)) {
      setActive(null)
    }
  }, [active, value])

  return (
    <div className="w-full">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
        <div className="text-sm text-gray-600">
          Tap a panel to mark damage. Tap again to unselect. Switch the view to reach other panels.
        </div>
        <button type="button" className="btn btn-secondary" onClick={handleClear} disabled={value.length === 0}>
          Clear selections
        </button>
      </div>

      <div className="flex flex-wrap gap-2 mb-4">
        {damageViews.map((v) => (
          <button
            key={v.id}
            type="button"
            className={`btn btn-sm ${v.id === view.id ? 'btn-primary' : 'btn-ghost'}`}
            onClick={() => {
              setViewId(v.id)
              setActive(null)
            }}
          >
            {v.label}
            {value.some((sel) => sel.viewId === v.id) && (
              <span className="ml-2 inline-flex h-5 min-w-[20px] items-center justify-center rounded-full bg-white/20 px-2 text-xs">
                {value.filter((sel) => sel.viewId === v.id).length}
              </span>
            )}
          </button>
        ))}
      </div>

      <div ref={containerRef} className="relative card overflow-hidden">
        <div style={{ paddingBottom: `${aspectRatio * 100}%` }} />
        <svg
          role="img"
          aria-label={view.label}
          viewBox={view.viewBox}
          className="absolute inset-0 h-full w-full"
          preserveAspectRatio="xMidYMid meet"
        >
          <defs>
            <clipPath id={`clip-${view.id}`}>
              <path d={view.outlinePath} />
            </clipPath>
          </defs>

          <path
            d={view.outlinePath}
            fill="#eff6ff"
            stroke="#c7d2fe"
            strokeWidth={3}
            pointerEvents="none"
          />

          <g clipPath={`url(#clip-${view.id})`}>
            {view.regions.map((region) => {
              const selected = isSelected(region.id, view.id)
              const isHover = hovered === region.id && !selected
              const fill = selected ? 'rgba(59, 130, 246, 0.5)' : isHover ? 'rgba(59, 130, 246, 0.18)' : 'transparent'
              const stroke = selected ? 'rgba(37, 99, 235, 1)' : 'rgba(37, 99, 235, 0.7)'
              const strokeWidth = selected ? 3 : 2
              return (
                <path
                  key={region.id}
                  d={region.path}
                  className="cursor-pointer transition-colors focus:outline-none focus:ring-2 focus:ring-blue-400"
                  fill={fill}
                  stroke={stroke}
                  strokeWidth={strokeWidth}
                  strokeLinejoin="round"
                  strokeLinecap="round"
                  role="button"
                  tabIndex={0}
                  aria-pressed={selected}
                  onMouseEnter={() => setHovered(region.id)}
                  onMouseLeave={() => setHovered((h) => (h === region.id ? null : h))}
                  onClick={(event) => handleRegionToggle(region.id, { type: region.defaultType, severity: region.defaultSeverity }, event)}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter' || event.key === ' ') {
                      event.preventDefault()
                      handleRegionToggle(region.id, { type: region.defaultType, severity: region.defaultSeverity }, event)
                    }
                  }}
                />
              )
            })}
          </g>
        </svg>

        {active && currentSelection && (
          <Popover
            anchor={active.anchor}
            containerRef={containerRef}
            selection={currentSelection}
            onChange={(updates) => handleNotesMutation(active.regionId, active.viewId, updates)}
          />
        )}
      </div>
    </div>
  )
}

type PopoverProps = {
  anchor: { x: number; y: number }
  containerRef: React.RefObject<HTMLDivElement>
  selection: DamageSelection
  onChange: (updates: Partial<DamageSelection>) => void
}

function Popover({ anchor, containerRef, selection, onChange }: PopoverProps) {
  const width = 280
  const containerWidth = containerRef.current?.clientWidth ?? 0
  const left = containerWidth ? Math.min(anchor.x, containerWidth - width - 16) : anchor.x
  const top = Math.max(8, anchor.y)

  return (
    <div
      className="absolute z-20 w-[280px] rounded border bg-white p-4 shadow"
      style={{ left, top }}
    >
      <div className="text-sm font-medium mb-2">Damage details</div>
      <div className="space-y-3 text-sm">
        <div>
          <label className="label mb-1 block">Type</label>
          <select
            className="input"
            value={selection.type}
            onChange={(event) => onChange({ type: event.target.value as typeof damageTypeEnum._type })}
          >
            {damageTypeEnum.options.map((option) => (
              <option key={option} value={option}>
                {option.replace(/_/g, ' ')}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="label mb-1 block">Severity</label>
          <div className="flex flex-wrap gap-2">
            {severityEnum.options.map((severity) => (
              <label key={severity} className="inline-flex items-center gap-1">
                <input
                  type="radio"
                  name={`severity-${selection.viewId}-${selection.id}`}
                  checked={selection.severity === severity}
                  onChange={() => onChange({ severity })}
                />
                {severity}
              </label>
            ))}
          </div>
        </div>
        <div>
          <label className="label mb-1 block">Notes (optional)</label>
          <input
            className="input"
            value={selection.notes ?? ''}
            onChange={(event) => onChange({ notes: event.target.value })}
          />
        </div>
      </div>
    </div>
  )
}
