# Contact API (FastAPI)

Small, single-purpose service: receives the portfolio's contact form
submission and emails it to Prabakar using Resend. Kept separate from the Next.js
app because Vercel doesn't run persistent Python servers — this needs
its own host.

## Setup

1. **Get a free Resend API key** at [resend.com](https://resend.com)
   - Free tier includes 100 emails per day, plenty for a portfolio contact form
   - Sign up and grab your API key from the dashboard

2. **Run locally**:
```bash
cd server
pip install -r requirements.txt
cp .env.example .env
# Edit .env and add your Resend API key and contact email
RESEND_API_KEY=your-key-here
CONTACT_TO_EMAIL=your-email@example.com
ALLOWED_ORIGINS=https://your-site.vercel.app,http://localhost:3000

uvicorn main:app --reload --port 8000
```

3. **Test it**:
```bash
curl -X POST http://localhost:8000/api/contact \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","reason":"General inquiry","message":"Just testing the endpoint, this needs to be at least 20 characters."}'
```

## Deploy

Pick any host that runs a long-lived Python process — Vercel's Python
support is for short serverless functions, not a full FastAPI app.

**Why Resend works great on Render/Railway/Fly.io:**
- SMTP is often blocked on shared hosting (including Render free tier)
- Resend uses HTTPS API instead — works anywhere with internet access
- No firewall/port restrictions

### Render
- "New Web Service" → point at this repo/`server` folder
- Build command: `pip install -r requirements.txt`
- Start command: `uvicorn main:app --host 0.0.0.0 --port $PORT`
- Environment variables:
  - `RESEND_API_KEY` (from your Resend dashboard)
  - `CONTACT_TO_EMAIL` (where you want emails sent)
  - `ALLOWED_ORIGINS` (your frontend URL)

### Railway
Similar to Render — auto-detects Python, set the same env vars

### Fly.io
Works too, just needs the same Python setup

Then set `NEXT_PUBLIC_CONTACT_API_URL` in your Next.js app's environment
to wherever this ends up (e.g., `https://your-api-name.onrender.com`).

## Notes

- The `website` field in the payload is a honeypot — real visitors
  never see or fill it (hidden via CSS on the frontend); bots that
  fill every field will, so those submissions are silently dropped.
- No credentials are stored in this repo. `.env` is gitignored —
  only `.env.example` (with placeholder values) is committed.
