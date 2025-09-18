import { Router } from 'express'
import multer from 'multer'
import { putObject, getObjectUrl, deleteObject } from '../services/storage'
import { randomUUID } from 'node:crypto'
import { processImage } from '../services/image'

const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 25 * 1024 * 1024 } })
export const uploadRouter = Router()

uploadRouter.post('/upload', upload.array('files', 20), async (req, res) => {
  const files = (req.files as Express.Multer.File[]) || []
  const out: any[] = []
  for (const f of files) {
    const id = randomUUID()
    let body = f.buffer
    let contentType = f.mimetype
    let ext = ''
    if (f.mimetype.startsWith('image/')) {
      const processed = await processImage(f.buffer)
      body = processed.buffer
      contentType = processed.contentType
      ext = processed.ext
    }
    const key = `uploads/${id}${ext}`
    await putObject(key, body, contentType)
    out.push({ id, key, mime: contentType, size: body.length })
  }
  res.json({ files: out })
})

uploadRouter.get('/file-url', async (req, res) => {
  const key = String(req.query.key || '')
  if (!key.startsWith('uploads/')) return res.status(400).json({ error: 'invalid key' })
  const url = await getObjectUrl(key)
  res.json({ url })
})

uploadRouter.delete('/upload', async (req, res) => {
  const key = String(req.query.key || '')
  if (!key.startsWith('uploads/')) return res.status(400).json({ error: 'invalid key' })
  await deleteObject(key)
  res.json({ ok: true })
})
