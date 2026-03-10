# EarthEnable Pre-House Assessment

A web application for EarthEnable Customer Sales Officers (CSOs) to assess houses before installation and register sales opportunities in Salesforce.

**Live app:** https://earthenable-prehouse-web-app.vercel.app

## Features

- Secure login with username/password or Google OAuth (earthenable.org emails only)
- Guided house assessment form covering structural and moisture checks
- Automatic result categorization: Green, Yellow, or Red
- Register Opportunity in Salesforce for qualified customers (Green/Yellow)

## Assessment Logic

| Result | Condition |
|--------|-----------|
| **Red** | Structural issues found |
| **Yellow** | Structural checks pass but moisture issues detected |
| **Green** | All checks pass |

## Tech Stack

- **Frontend:** Next.js 16, TypeScript, Tailwind CSS
- **Backend:** FastAPI (Python), deployed as Vercel serverless functions
- **Auth:** JWT tokens, Google OAuth (restricted to @earthenable.org)
- **Salesforce:** simple-salesforce for REST API integration

## Local Development

**1. Install dependencies:**
```bash
npm install
cd backend && python -m venv venv && source venv/bin/activate && pip install -r requirements.txt
```

**2. Start the backend:**
```bash
cd backend && source venv/bin/activate && uvicorn main:app --reload
```

**3. Start the frontend:**
```bash
npm run dev
```

**4. Open** http://localhost:3000

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
SF_USERNAME=your_salesforce_username
SF_PASSWORD=your_salesforce_password
SF_SECURITY_TOKEN=your_salesforce_security_token
ALLOWED_ORIGINS=http://localhost:3000
```
