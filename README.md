# BhardwajDeco

Production-grade full-stack web platform for a premium material catalog and enquiry workflow.

## Stack

- Frontend: Next.js (App Router), Tailwind CSS, Framer Motion
- Backend: Node.js, Express
- Database: MongoDB (Mongoose)
- Image Storage: Cloudinary
- Email: Nodemailer

## Folder Structure

- `frontend/` - Public website + admin panel UI
- `backend/` - Express API, MongoDB models, email + image upload services

## Key Features

- Luxury, visual-first product browsing experience
- Masonry product gallery with minimal top filter bar
- Product detail split layout with sticky enquiry CTA
- Editorial-style updates page
- Admin panel (no auth) for products and updates
- Enquiry API with email notifications
- Cloudinary upload endpoint for media management

## Run Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend runs on: http://localhost:3000

## Run Backend

```bash
cd backend
npm install
cp .env.example .env
npm run dev
```

Backend runs on: http://localhost:5000

## Seed Sample Data

```bash
cd backend
npm run seed
```

## Environment Variables

Backend (`backend/.env`):

- `PORT`
- `MONGO_URI`
- `FRONTEND_URL`
- `JWT_SECRET`
- `JWT_EXPIRES_IN`
- `ADMIN_EMAIL`
- `ADMIN_PASSWORD`
- `IMAGEKIT_PUBLIC_KEY`
- `IMAGEKIT_PRIVATE_KEY`
- `IMAGEKIT_URL_ENDPOINT`
- `BREVO_SMTP_HOST`
- `BREVO_SMTP_PORT`
- `BREVO_SMTP_USER`
- `BREVO_SMTP_KEY`
- `BREVO_SENDER_NAME`
- `BREVO_SENDER_EMAIL`
- `ADMIN_NOTIFICATION_EMAIL`
- `OPENAI_API_KEY`
- `RATE_LIMIT_WINDOW_MS`
- `RATE_LIMIT_MAX`

Frontend (`frontend/.env.local`):

- `NEXT_PUBLIC_API_BASE_URL`
- `NEXT_PUBLIC_CONTACT_PHONE`
- `NEXT_PUBLIC_CONTACT_EMAIL`
- `NEXT_PUBLIC_CONTACT_ADDRESS`
- `NEXT_PUBLIC_CONTACT_LABEL`

If you deploy on Vercel as two separate projects, set `NEXT_PUBLIC_API_BASE_URL` to the deployed backend URL, for example `https://your-backend.vercel.app/api`.
If the backend is separate, also set `FRONTEND_URL` in the backend project to your frontend deployment URL so CORS accepts browser requests.
If you use the monorepo Vercel service setup in this repo, the frontend can resolve the backend automatically through the `/_/backend/api` route prefix.

## Branding Compliance

- All catalog entries are treated as BhardwajDeco products
- No external brand references included in UI or API seed data
