Smash Repairs Onboarding App (AU)

Overview
- Mobile-first onboarding web app for Australian smash-repair businesses.
- Collects accident details, photos, consent/signature; generates a PDF summary; emails customer and shop; provides an admin portal.

Tech Stack
- Frontend: React + TypeScript + Vite, Tailwind CSS, React Router, React Hook Form + Zod, Zustand.
- Backend: Node.js + TypeScript + Express, MongoDB (Mongoose), S3-compatible storage (AWS S3 by default).
- Auth: Magic-link (resume form) + anonymous session; Admin UI protected via backend basic auth (env-configured users).
- Testing: Vitest + RTL (frontend), Jest + supertest (backend), minimal Playwright e2e.
- Infra: .env-driven config; Dockerfiles; Nginx example; CORS.

Quick Start
1) Prereqs: Node 18+, Docker (optional), a MongoDB URI, AWS credentials or S3-compatible endpoint.
2) Copy env and configure:
   cp .env.example .env
3) Install deps (from frontend and backend folders):
   cd frontend && npm i && cd ../backend && npm i
4) Dev:
   - Backend: npm run dev (port 5000)
   - Frontend: npm run dev (port 5173)
   Frontend proxies /api to backend.

Assets Note
- Vite serves public assets from the repo-level public/ folder via publicDir config.

Project Structure
- frontend/  React + Vite app (public assets served from repo ./public via Vite publicDir)
- backend/   Express + TS API server (Mongo, S3, email, PDF, auth)
- public/    Static assets (car diagram + regions JSON)

Environment (.env)
- Common
  - ORIGIN=http://localhost:5173
  - PORT=5000
  - MONGO_URI=mongodb://localhost:27017/smash
  - JWT_SECRET=<random string>
  - RATE_LIMIT_WINDOW_MS=60000
  - RATE_LIMIT_MAX=100
  - MAX_FILE_SIZE_MB=25
  - ADMIN_USERS=admin:changeme,ops:anothersecret
  - COMPANY_NAME=Your Smash Repairs
  - COMPANY_EMAIL=repairs@example.com
  - COMPANY_PHONE=02 9000 0000
  - COMPANY_ADDRESS=1 Example St, Sydney NSW 2000
  - PDF_LETTERHEAD_URL=https://example.com/logo.png

- S3
  - S3_BUCKET=smash-uploads
  - S3_REGION=ap-southeast-2
  - S3_ENDPOINT= (optional for MinIO)
  - AWS_ACCESS_KEY_ID=...
  - AWS_SECRET_ACCESS_KEY=...

- Email (choose one)
  - SMTP_HOST=localhost
  - SMTP_PORT=1025
  - SMTP_SECURE=false
  - SMTP_USER=
  - SMTP_PASS=
  or SES creds via AWS above.

Scripts
- Frontend: npm run dev | build | preview
- Backend: npm run dev | build | start | test

Admin Access
- Configure ADMIN_USERS in .env as comma-separated username:password pairs.
- Admin UI at /admin -> browser prompts for credentials.

Assets
- public/assets/car-diagram.png
- public/assets/regions.json (interactive damage regions)

Testing
- Frontend: cd frontend && npm test
- Backend: cd backend && npm test
- E2E: cd frontend && npm run e2e

Deploy
- See Dockerfiles in frontend/ and backend/.
- Example Nginx config in infra/nginx/.

Security & Privacy
- Server-side validation mirrors Zod schemas.
- Sensitive PII fields (DOB, licence) encrypted at rest (AES-256-GCM).
- Rate limiting by IP + session. File quotas enforced.
- Magic-link tokens are one-time and short-lived.

Notes
- Address autocomplete can integrate with Places APIs; current build exposes a hook to wire your provider.
- HEIC/EXIF handling occurs server-side via Sharp (with fallback).
- PDF generated via PDFKit.
