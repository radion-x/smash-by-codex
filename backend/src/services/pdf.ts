import PDFDocument from 'pdfkit'
import { config } from '../lib/config'

export async function createPdfBuffer(doc: any): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const pdf = new PDFDocument({ size: 'A4', margin: 36 })
    const chunks: Buffer[] = []
    pdf.on('data', (c) => chunks.push(c))
    pdf.on('end', () => resolve(Buffer.concat(chunks)))
    pdf.on('error', reject)

    if (config.company.letterheadUrl) {
      // remote images require additional handling; omit in base build
    }

    pdf.fontSize(16).text(`${config.company.name} - Submission Summary`, { align: 'center' })
    pdf.moveDown()
    pdf.fontSize(10).text(`Ref: ${doc.ref}`)
    pdf.text(`Date: ${new Date(doc.createdAt ?? Date.now()).toLocaleString()}`)
    pdf.moveDown()
    pdf.text(`Customer: ${doc.your?.fullName || ''}`)
    pdf.text(`Email: ${doc.your?.email || ''}`)
    pdf.text(`Phone: ${doc.your?.mobile || ''}`)
    pdf.moveDown()
    pdf.text('Vehicle:')
    pdf.text(`${doc.vehicle?.year || ''} ${doc.vehicle?.make || ''} ${doc.vehicle?.model || ''} (${doc.vehicle?.rego || ''})`)
    pdf.moveDown()
    pdf.text('Accident details:')
    pdf.text(`When: ${doc.accident?.when || ''}`)
    pdf.text(`Where: ${doc.accident?.location?.description || ''}`)
    pdf.moveDown()
    pdf.text('Damage selections:')
    ;(doc.damage || []).forEach((d: any) => pdf.text(`- ${d.viewId} / ${d.id}: ${d.type}, ${d.severity}${d.notes?` (${d.notes})`:''}`))
    pdf.end()
  })
}

