type Props = {
  open: boolean
  onClose: () => void
  title?: string
  children?: React.ReactNode
  actions?: React.ReactNode
}

export default function Modal({ open, onClose, title, children, actions }: Props) {
  if (!open) return null
  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative w-full sm:max-w-md m-0 sm:m-4 card p-4 animate-slide-up">
        {title && <h3 className="text-lg font-semibold mb-2">{title}</h3>}
        {children}
        {actions && <div className="mt-4 flex justify-end gap-2">{actions}</div>}
      </div>
    </div>
  )
}

