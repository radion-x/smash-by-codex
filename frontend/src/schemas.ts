import { z } from 'zod'

export const contactPreferenceEnum = z.enum(['sms','email','call'])
export const yesNoEnum = z.enum(['yes','no'])
export const severityEnum = z.enum(['minor','moderate','severe','replace','unsure'])
export const damageTypeEnum = z.enum([
  'scratch','scrape','dent','crease','puncture','crack','broken','paint_transfer','glass_chip','glass_crack','alignment','other'
])

export const consentSchema = z.object({
  consent: z.literal(true, { errorMap: () => ({ message: 'Consent is required to proceed.' }) }),
  notDrivable: z.boolean().optional(),
  assistance: z.object({
    location: z.string().min(3).optional(),
    callback: z.string().optional(),
  }).optional(),
})

export const yourDetailsSchema = z.object({
  fullName: z.string().min(2, 'Enter your full name'),
  email: z.string().email('Enter a valid email'),
  mobile: z.string().regex(/^0\d{9}$/,'Enter an AU mobile like 0412345678'),
  preferredContact: contactPreferenceEnum,
  address: z.string().min(3,'Enter your residential address'),
  dob: z.string().optional(),
})

export const vehicleDetailsSchema = z.object({
  rego: z.string().min(2),
  regoState: z.string().min(2),
  vin: z.string().min(5),
  odometerPhotoIds: z.array(z.string()).optional(),
  make: z.string().min(1),
  model: z.string().min(1),
  year: z.number().int().min(1900).max(new Date().getFullYear()).optional(),
  colour: z.string().optional(),
  bodyType: z.string().optional(),
  transmission: z.string().optional(),
  fuelType: z.string().optional(),
  options: z.array(z.string()).optional(),
  modifications: z.string().optional(),
  regoExpiryMonth: z.number().int().min(1).max(12).optional(),
  regoExpiryYear: z.number().int().min(new Date().getFullYear()-1).max(new Date().getFullYear()+5).optional(),
})

export const accidentDetailsSchema = z.object({
  when: z.string(),
  location: z.object({ lat: z.number().optional(), lng: z.number().optional(), description: z.string().optional() }),
  roadType: z.string().optional(),
  speedZone: z.string().optional(),
  weather: z.string().optional(),
  lighting: z.string().optional(),
  roadConditions: z.string().optional(),
  drivable: yesNoEnum.optional(),
  airbagDeployed: yesNoEnum.optional(),
  windscreenDamage: yesNoEnum.optional(),
  fluidLeaks: yesNoEnum.optional(),
  hazardsRemaining: yesNoEnum.optional(),
  policeAttended: yesNoEnum.optional(),
  policeNumber: z.string().optional(),
  towing: z.object({ who: z.string().optional(), yard: z.string().optional(), ref: z.string().optional() }).optional(),
  narrative: z.string().optional(),
})

export const otherPartyVehicleSchema = z.object({
  rego: z.string().optional(),
  state: z.string().optional(),
  make: z.string().optional(),
  model: z.string().optional(),
  colour: z.string().optional(),
  driverName: z.string().optional(),
  licenceNumber: z.string().optional(),
  insurer: z.string().optional(),
  policy: z.string().optional(),
  claim: z.string().optional(),
  contact: z.string().optional(),
})

export const witnessSchema = z.object({ name: z.string().optional(), contact: z.string().optional() })

export const otherPartySchema = z.object({
  vehicles: z.array(otherPartyVehicleSchema).optional(),
  property: z.object({ owner: z.string().optional(), contact: z.string().optional() }).optional(),
  witnesses: z.array(witnessSchema).optional()
})

export const damageRegionSchema = z.object({
  id: z.string(),
  viewId: z.string(),
  type: damageTypeEnum,
  severity: severityEnum,
  notes: z.string().optional(),
})

export const photosSchema = z.object({
  items: z.array(z.object({
    tag: z.string(),
    fileIds: z.array(z.string()),
    captions: z.array(z.string()).optional(),
  }))
})

export const insuranceSchema = z.object({
  insurer: z.string().optional(),
  policyNumber: z.string().optional(),
  claimNumber: z.string().optional(),
  excessAmount: z.string().optional(),
  authoriseLiaison: z.literal(true, { errorMap: () => ({ message: 'Authorisation is required.' }) }),
  courtesyCar: yesNoEnum.optional(),
  pickupDropoff: z.string().optional(),
  dateWindows: z.string().optional(),
  termsAccepted: z.literal(true),
  signature: z.string().optional(),
  signatureName: z.string().optional(),
})

export const submissionSchema = z.object({
  consent: consentSchema,
  your: yourDetailsSchema,
  vehicle: vehicleDetailsSchema,
  accident: accidentDetailsSchema,
  otherParty: otherPartySchema,
  damage: z.array(damageRegionSchema).optional(),
  photos: photosSchema.optional(),
  insurance: insuranceSchema,
})

export type Submission = z.infer<typeof submissionSchema>
