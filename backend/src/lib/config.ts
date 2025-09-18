export const config = {
  origin: process.env.ORIGIN || 'http://localhost:5173',
  port: Number(process.env.PORT || 5000),
  mongoUri: process.env.MONGO_URI || 'mongodb://localhost:27017/smash',
  jwtSecret: process.env.JWT_SECRET || 'change',
  rateLimitWindowMs: Number(process.env.RATE_LIMIT_WINDOW_MS || 60000),
  rateLimitMax: Number(process.env.RATE_LIMIT_MAX || 100),
  maxFileSizeMb: Number(process.env.MAX_FILE_SIZE_MB || 25),
  adminUsers: (process.env.ADMIN_USERS || '').split(',').filter(Boolean).map((p) => {
    const [user, pass] = p.split(':'); return { user, pass }
  }),
  s3: {
    bucket: process.env.S3_BUCKET || 'smash-uploads',
    region: process.env.S3_REGION || 'ap-southeast-2',
    endpoint: process.env.S3_ENDPOINT,
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
  email: {
    smtpHost: process.env.SMTP_HOST,
    smtpPort: process.env.SMTP_PORT ? Number(process.env.SMTP_PORT) : undefined,
    smtpSecure: process.env.SMTP_SECURE === 'true',
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
  company: {
    name: process.env.COMPANY_NAME || 'Your Smash Repairs',
    email: process.env.COMPANY_EMAIL || 'repairs@example.com',
    phone: process.env.COMPANY_PHONE || '02 9000 0000',
    address: process.env.COMPANY_ADDRESS || '1 Example St, Sydney NSW 2000',
    letterheadUrl: process.env.PDF_LETTERHEAD_URL || '',
  }
}

