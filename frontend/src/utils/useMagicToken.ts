import { useEffect } from 'react'
import { useFormStore } from '@/store/formStore'

export function useMagicToken() {
  const update = useFormStore((s) => s.update)
  useEffect(() => {
    const url = new URL(window.location.href)
    const token = url.searchParams.get('token')
    if (!token) return
    fetch(`/auth/magic-link/${token}`).then(async (r) => {
      if (!r.ok) return
      const json = await r.json()
      if (json?.payload) update(json.payload)
      url.searchParams.delete('token')
      window.history.replaceState({}, '', url.toString())
    })
  }, [update])
}

