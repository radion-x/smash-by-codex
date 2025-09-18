import sharp from 'sharp'

export async function processImage(input: Buffer): Promise<{ buffer: Buffer, contentType: string, ext: string }> {
  try {
    // Auto-rotate based on EXIF, fit inside 1600px box, convert to JPEG
    const out = await sharp(input, { failOn: 'none' })
      .rotate()
      .resize({ width: 1600, height: 1600, fit: 'inside', withoutEnlargement: true })
      .jpeg({ quality: 80 })
      .toBuffer()
    return { buffer: out, contentType: 'image/jpeg', ext: '.jpg' }
  } catch (e) {
    // Fallback: return original buffer
    return { buffer: input, contentType: 'application/octet-stream', ext: '' }
  }
}

