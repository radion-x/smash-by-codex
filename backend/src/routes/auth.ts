import { Router } from 'express'
import { randomBytes } from 'node:crypto'
import { Token } from '../models/Token'
import { sendMail } from '../services/mailer'
import { config } from '../lib/config'

export const authRouter = Router()

authRouter.post('/magic-link', async (req, res) => {
  const { email, payload } = req.body || {}
  if (!email) return res.status(400).json({ error: 'email is required' })
  const token = randomBytes(16).toString('hex')
  const expiresAt = new Date(Date.now() + 1000*60*30)
  await Token.create({ token, email, payload, expiresAt })
  const link = `${config.origin}/?token=${token}`
  await sendMail({ to: email, subject: 'Your magic link', text: `Resume your submission: ${link}` })
  res.json({ ok: true })
})

authRouter.get('/magic-link/:token', async (req, res) => {
  const t = await Token.findOne({ token: req.params.token })
  if (!t || t.used || (t.expiresAt && t.expiresAt < new Date())) return res.status(400).json({ error: 'invalid or expired token' })
  t.used = true
  await t.save()
  res.json({ ok: true, email: t.email, payload: t.payload })
})

