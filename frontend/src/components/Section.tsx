type Props = { title: string; subtitle?: string; children?: React.ReactNode }
export default function Section({ title, subtitle, children }: Props) {
  return (
    <div className="space-y-2 mb-4">
      <h2 className="text-lg font-semibold tracking-tight">{title}</h2>
      {subtitle && <p className="text-sm text-slate-600 dark:text-slate-300">{subtitle}</p>}
      {children}
    </div>
  )
}

