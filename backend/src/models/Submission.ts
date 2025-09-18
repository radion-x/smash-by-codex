import mongoose, { Schema } from 'mongoose'

const Encrypted = new Schema({ iv: String, tag: String, data: String }, { _id: false })

const Damage = new Schema({
  id: String,
  viewId: String,
  type: String,
  severity: String,
  notes: String,
}, { _id: false })

const OtherVehicle = new Schema({
  rego: String,
  state: String,
  make: String,
  model: String,
  colour: String,
  driverName: String,
  licenceNumber: String,
  insurer: String,
  policy: String,
  claim: String,
  contact: String,
}, { _id: false })

const SubmissionSchema = new Schema({
  consent: {
    consent: Boolean,
    notDrivable: Boolean,
    assistance: { location: String, callback: String }
  },
  your: {
    fullName: String,
    email: String,
    mobile: String,
    preferredContact: String,
    address: String,
    dob: Encrypted, // encrypted at rest
  },
  vehicle: {
    rego: String,
    regoState: String,
    vin: String,
    make: String,
    model: String,
    year: Number,
    colour: String,
    bodyType: String,
    transmission: String,
    fuelType: String,
    options: [String],
    modifications: String,
    regoExpiryMonth: Number,
    regoExpiryYear: Number,
  },
  accident: {
    when: String,
    location: { lat: Number, lng: Number, description: String },
    roadType: String,
    speedZone: String,
    weather: String,
    lighting: String,
    roadConditions: String,
    drivable: String,
    airbagDeployed: String,
    windscreenDamage: String,
    fluidLeaks: String,
    hazardsRemaining: String,
    policeAttended: String,
    policeNumber: String,
    towing: { who: String, yard: String, ref: String },
    narrative: String,
  },
  otherParty: {
    vehicles: [OtherVehicle],
    property: { owner: String, contact: String },
    witnesses: [{ name: String, contact: String }]
  },
  damage: [Damage],
  photos: {
    items: [{ tag: String, fileIds: [String], captions: [String] }]
  },
  insurance: {
    insurer: String,
    policyNumber: String,
    claimNumber: String,
    excessAmount: String,
    authoriseLiaison: Boolean,
    courtesyCar: String,
    pickupDropoff: String,
    dateWindows: String,
    termsAccepted: Boolean,
    signature: String,
    signatureName: String,
  },
  ref: { type: String, index: true },
  status: { type: String, default: 'New', index: true },
}, { timestamps: true })

// Text index for admin search
SubmissionSchema.index({ 'your.fullName': 'text', 'vehicle.rego': 'text', ref: 'text', 'insurance.claimNumber': 'text' })

export const Submission = mongoose.model('Submission', SubmissionSchema)
