import crypto from 'node:crypto'

const ALGO = 'aes-256-gcm'

export function encrypt(value: string, secret: string) {
  const iv = crypto.randomBytes(12)
  const key = crypto.createHash('sha256').update(secret).digest()
  const cipher = crypto.createCipheriv(ALGO, key, iv)
  const enc = Buffer.concat([cipher.update(value, 'utf8'), cipher.final()])
  const tag = cipher.getAuthTag()
  return {
    iv: iv.toString('base64'),
    tag: tag.toString('base64'),
    data: enc.toString('base64')
  }
}

export function decrypt(payload: { iv: string, tag: string, data: string }, secret: string) {
  const iv = Buffer.from(payload.iv, 'base64')
  const tag = Buffer.from(payload.tag, 'base64')
  const data = Buffer.from(payload.data, 'base64')
  const key = crypto.createHash('sha256').update(secret).digest()
  const decipher = crypto.createDecipheriv(ALGO, key, iv)
  decipher.setAuthTag(tag)
  const dec = Buffer.concat([decipher.update(data), decipher.final()])
  return dec.toString('utf8')
}

