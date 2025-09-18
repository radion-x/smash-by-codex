import { useEffect, useRef, useState } from 'react'
import { uploadFiles, type UploadedFile } from '@/utils/upload'

type Props = {
  tag: string
  label: string
  min?: number
  onUploaded: (files: UploadedFile[]) => void
  files?: string[]
  onRemove?: (key: string) => void
}

export default function PhotoPicker({ tag, label, min = 1, onUploaded, files = [], onRemove }: Props) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [progress, setProgress] = useState<number>(0)
  const [count, setCount] = useState<number>(0)
  const [urls, setUrls] = useState<Record<string, string>>({})

  const onFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return
    try {
      setProgress(1)
      const uploaded = await uploadFiles(Array.from(files), (p) => setProgress(p))
      setCount((c) => c + uploaded.length)
      onUploaded(uploaded)
    } catch (e) {
      alert('Upload failed. Please try again.')
    } finally {
      setProgress(0)
      if (inputRef.current) inputRef.current.value = ''
    }
  }

  useEffect(() => {
    let aborted = false
    async function loadUrls() {
      const entries = await Promise.all(files.map(async (key) => {
        try {
          const res = await fetch(`/api/file-url?key=${encodeURIComponent(key)}`)
          if (!res.ok) return [key, ''] as const
          const { url } = await res.json()
          return [key, url] as const
        } catch { return [key, ''] as const }
      }))
      if (!aborted) setUrls(Object.fromEntries(entries))
    }
    if (files.length) loadUrls()
    return () => { aborted = true }
  }, [files])

  return (
    <div className="rounded border p-3">
      <div className="flex items-center justify-between mb-2">
        <div>
          <div className="font-medium">{label}</div>
          <div className="text-xs text-gray-600">{min>1?`At least ${min} photos required`: '1+ photo'}</div>
        </div>
        <div className="text-xs text-gray-600">{(files?.length||0) + count} uploaded</div>
      </div>
      <div className="flex items-center gap-2">
        <input
          ref={inputRef}
          type="file"
          accept="image/*,.heic,.heif"
          capture="environment"
          multiple
          onChange={(e) => onFiles(e.currentTarget.files)}
        />
        {progress > 0 && <div className="text-xs">Uploading… {progress}%</div>}
      </div>
      {files?.length ? (
        <div className="mt-3 grid grid-cols-4 gap-2">
          {files.map((k) => (
            <div key={k} className="relative group border rounded overflow-hidden">
              {urls[k] ? <img src={urls[k]} className="w-full h-24 object-cover" alt="uploaded" /> : <div className="w-full h-24 bg-gray-100" />}
              {onRemove && (
                <button type="button" className="absolute top-1 right-1 text-xs bg-black/60 text-white px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100" onClick={async () => {
                  try {
                    await fetch(`/api/upload?key=${encodeURIComponent(k)}`, { method: 'DELETE' })
                  } catch {}
                  onRemove(k)
                }}>Remove</button>
              )}
            </div>
          ))}
        </div>
      ) : null}
    </div>
  )
}
