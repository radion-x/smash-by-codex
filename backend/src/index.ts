import express from 'express'
import helmet from 'helmet'
import cors from 'cors'
import mongoose from 'mongoose'
import rateLimit from 'express-rate-limit'
import { config } from './lib/config'
import { submissionsRouter } from './routes/submissions'
import { adminRouter } from './routes/admin'
import { uploadRouter } from './routes/upload'
import { authRouter } from './routes/auth'

const app = express()
app.use(helmet())
app.use(express.json({ limit: `${config.maxFileSizeMb}mb` }))
app.use(cors({ origin: config.origin, credentials: true }))

const limiter = rateLimit({ windowMs: config.rateLimitWindowMs, max: config.rateLimitMax })
app.use(limiter)

app.get('/health', (_req, res) => res.json({ ok: true }))
app.use('/api', submissionsRouter)
app.use('/admin-api', adminRouter)
app.use('/api', uploadRouter)
app.use('/auth', authRouter)

async function start() {
  await mongoose.connect(config.mongoUri)
  app.listen(config.port, () => console.log(`API on :${config.port}`))
}

start().catch((e) => { console.error(e); process.exit(1) })
