import nodemailer from 'nodemailer'
import { config } from '../lib/config'

const transporter = nodemailer.createTransport({
  host: config.email.smtpHost,
  port: config.email.smtpPort,
  secure: !!config.email.smtpSecure,
  auth: config.email.user ? { user: config.email.user, pass: config.email.pass } : undefined,
})

export async function sendMail(opts: { to: string, subject: string, text: string, attachments?: any[] }) {
  if (!opts.to) return
  try {
    await transporter.sendMail({ from: config.company.email, ...opts })
  } catch (e) {
    // log only
    console.error('Email error', e)
  }
}

