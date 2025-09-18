import mongoose, { Schema } from 'mongoose'

const TokenSchema = new Schema({
  token: { type: String, index: true },
  email: String,
  payload: Schema.Types.Mixed,
  expiresAt: Date,
  used: { type: Boolean, default: false },
}, { timestamps: true })

export const Token = mongoose.model('Token', TokenSchema)

