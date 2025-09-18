type Props = { title: string; subtitle?: string; children?: React.ReactNode }
export default function Section({ title, subtitle, children }: Props) {
  return (
    <div className="space-y-2">
      <h2 className="text-xl font-semibold text-ink-800 dark:text-ink-50">{title}</h2>
      {subtitle && <p className="text-sm text-ink-500 dark:text-ink-200">{subtitle}</p>}
      {children}
    </div>
  )
}
