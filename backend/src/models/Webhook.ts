import mongoose, { Schema } from 'mongoose'

const WebhookSchema = new Schema({
  configs: [{ event: String, url: String, secret: String }]
}, { timestamps: true })

export const Webhook = mongoose.model('Webhook', WebhookSchema)

