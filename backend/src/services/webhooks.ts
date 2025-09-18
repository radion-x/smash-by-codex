import { Webhook } from '../models/Webhook'

export async function emitWebhook(event: string, payload: any) {
  const doc = await Webhook.findOne()
  if (!doc) return
  const items = (doc.configs || []).filter((c: any) => c.event === event)
  await Promise.all(items.map(async (c: any) => {
    try {
      await fetch(c.url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Webhook-Event': event,
          'X-Webhook-Secret': c.secret || ''
        },
        body: JSON.stringify(payload)
      })
    } catch {}
  }))
}

