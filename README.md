# EarthEnable Pre-House Assessment

A web application for EarthEnable Customer Sales Officers (CSOs) to assess houses before installation and categorize them as **Green**, **Yellow**, or **Red** based on structural and moisture conditions.

**Live app:** https://earthenable-prehouse-web-app.vercel.app

## Features

- Secure login with username/password or Google OAuth (earthenable.org emails only)
- Guided house assessment form covering structural and moisture checks
- Automatic result categorization: Green, Yellow, or Red
- Protected routes — only authenticated CSOs can access the assessment

## Assessment Logic

| Result | Condition |
|--------|-----------|
| **Red** | Structural issues found (house fails structural checks) |
| **Yellow** | Structural checks pass but moisture issues detected |
| **Green** | All structural and moisture checks pass |

## Tech Stack

- **Frontend:** Next.js 16, TypeScript, Tailwind CSS
- **Backend:** FastAPI (Python), deployed as Vercel serverless functions
- **Auth:** JWT tokens, Google OAuth (restricted to @earthenable.org)

## Local Development

**1. Start the backend:**
```bash
cd backend
source venv/bin/activate
uvicorn main:app --reload
```

**2. Start the frontend:**
```bash
npm run dev
```

**3. Open** http://localhost:3000

## Environment Variables

### Frontend (`.env.local`)
```
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_google_client_id
```

### Backend (`backend/.env`)
```
SECRET_KEY=your_secret_key
DEFAULT_USERNAME=eerwcso@earthenable.org
DEFAULT_PASSWORD=your_password
GOOGLE_CLIENT_ID=your_google_client_id
```
