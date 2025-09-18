import { Router } from 'express'
import { z } from 'zod'
import { Submission } from '../models/Submission'
import { encrypt } from '../lib/crypto'
import { config } from '../lib/config'
import { createPdfBuffer } from '../services/pdf'
import { sendMail } from '../services/mailer'
import { emitWebhook } from '../services/webhooks'

export const submissionsRouter = Router()

// Mirror of frontend zod (minified here)
const submissionSchema = z.object({
  consent: z.object({ consent: z.literal(true), notDrivable: z.boolean().optional(), assistance: z.object({ location: z.string().optional(), callback: z.string().optional() }).optional() }),
  your: z.object({ fullName: z.string(), email: z.string(), mobile: z.string(), preferredContact: z.string(), address: z.string(), dob: z.string().optional() }),
  vehicle: z.object({ rego: z.string(), regoState: z.string(), vin: z.string(), make: z.string(), model: z.string(), year: z.number().optional(), colour: z.string().optional(), bodyType: z.string().optional(), transmission: z.string().optional(), fuelType: z.string().optional(), options: z.any().optional(), modifications: z.string().optional(), regoExpiryMonth: z.number().optional(), regoExpiryYear: z.number().optional() }),
  accident: z.object({ when: z.string(), location: z.object({ lat: z.number().optional(), lng: z.number().optional(), description: z.string().optional() }), roadType: z.string().optional(), speedZone: z.string().optional(), weather: z.string().optional(), lighting: z.string().optional(), roadConditions: z.string().optional(), drivable: z.string().optional(), airbagDeployed: z.string().optional(), windscreenDamage: z.string().optional(), fluidLeaks: z.string().optional(), hazardsRemaining: z.string().optional(), policeAttended: z.string().optional(), policeNumber: z.string().optional(), towing: z.object({ who: z.string().optional(), yard: z.string().optional(), ref: z.string().optional() }).optional(), narrative: z.string().optional() }),
  otherParty: z.any().optional(),
  damage: z.array(z.object({ id: z.string(), viewId: z.string(), type: z.string(), severity: z.string(), notes: z.string().optional() })).optional(),
  photos: z.any().optional(),
  insurance: z.object({ insurer: z.string().optional(), policyNumber: z.string().optional(), claimNumber: z.string().optional(), excessAmount: z.string().optional(), authoriseLiaison: z.literal(true), courtesyCar: z.string().optional(), pickupDropoff: z.string().optional(), dateWindows: z.string().optional(), termsAccepted: z.literal(true), signature: z.string().optional(), signatureName: z.string().optional() }),
})

submissionsRouter.post('/submissions', async (req, res) => {
  const parse = submissionSchema.safeParse(req.body)
  if (!parse.success) return res.status(400).json({ error: 'Invalid data', details: parse.error.flatten() })
  const data = parse.data

  const ref = 'S' + Date.now().toString(36).toUpperCase()
  const doc = new Submission({ ...data, ref })
  if (data.your?.dob) { doc.set('your.dob', encrypt(data.your.dob, config.jwtSecret)) }

  await doc.save()

  // Create PDF & email (non-blocking)
  createPdfBuffer(doc).then(async (pdf) => {
    const subject = `Submission ${doc.ref} - ${config.company.name}`
    await sendMail({ to: data.your.email, subject, text: 'Thanks for your submission.', attachments: [{ filename: `${doc.ref}.pdf`, content: pdf }] })
    await sendMail({ to: config.company.email, subject: `New submission ${doc.ref}`, text: 'See attached PDF summary.', attachments: [{ filename: `${doc.ref}.pdf`, content: pdf }] })
  }).catch(() => {})

  emitWebhook('submission.created', { id: doc._id, ref: doc.ref })

  res.json({ ok: true, ref })
})
