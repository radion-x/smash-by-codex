import { Router } from 'express'
import { Submission } from '../models/Submission'
import { config } from '../lib/config'
import { createPdfBuffer } from '../services/pdf'
import { Webhook } from '../models/Webhook'
import { emitWebhook } from '../services/webhooks'

export const adminRouter = Router()

adminRouter.use((req, res, next) => {
  const auth = req.headers.authorization
  if (!auth?.startsWith('Basic ')) return res.status(401).set('WWW-Authenticate', 'Basic realm="Admin"').end()
  const creds = Buffer.from(auth.slice(6), 'base64').toString('utf8')
  const [user, pass] = creds.split(':')
  const ok = config.adminUsers.some((u) => u.user === user && u.pass === pass)
  if (!ok) return res.status(401).set('WWW-Authenticate', 'Basic realm="Admin"').end()
  next()
})

adminRouter.get('/submissions', async (req, res) => {
  const { q, status } = req.query as any
  const find: any = {}
  if (status) find.status = status
  if (q) find.$text = { $search: String(q) }
  const rows = await Submission.find(find).sort({ createdAt: -1 }).limit(100)
  res.json({ rows })
})

adminRouter.get('/submissions/:id/pdf', async (req, res) => {
  const sub = await Submission.findById(req.params.id)
  if (!sub) return res.status(404).end()
  const pdf = await createPdfBuffer(sub)
  res.setHeader('Content-Type', 'application/pdf')
  res.send(pdf)
})

adminRouter.put('/submissions/:id/status', async (req, res) => {
  const sub = await Submission.findById(req.params.id)
  if (!sub) return res.status(404).end()
  const { status } = req.body || {}
  if (!status) return res.status(400).json({ error: 'status required' })
  sub.status = status
  await sub.save()
  emitWebhook('status.changed', { id: sub._id, ref: sub.ref, status })
  res.json({ ok: true })
})

adminRouter.get('/webhooks', async (_req, res) => {
  const doc = await Webhook.findOne()
  res.json(doc || { configs: [] })
})

adminRouter.post('/webhooks', async (req, res) => {
  const body = req.body
  if (!Array.isArray(body?.configs)) return res.status(400).json({ error: 'configs required' })
  const doc = await Webhook.findOne()
  if (doc) { doc.configs = body.configs; await doc.save(); return res.json(doc) }
  const created = await Webhook.create({ configs: body.configs })
  res.json(created)
})
