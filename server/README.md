# Contact API (FastAPI)

Small, single-purpose service: receives the portfolio's contact form
submission and emails it to Prabakar. Kept separate from the Next.js
app because Vercel doesn't run persistent Python servers — this needs
its own host.

## Run locally

```bash
cd server
pip install -r requirements.txt
cp .env.example .env      # fill in real SMTP credentials
uvicorn main:app --reload --port 8000
```

Test it:

```bash
curl -X POST http://localhost:8000/api/contact \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","reason":"General inquiry","message":"Just testing the endpoint, this needs to be at least 20 characters."}'
```

## Deploy

Pick any host that runs a long-lived Python process — Vercel's Python
support is for short serverless functions, not a full FastAPI app.
Free-tier options that work well for a low-traffic contact form:

- **Render** — "New Web Service" → point at this repo/`server` folder,
  build command `pip install -r requirements.txt`, start command
  `uvicorn main:app --host 0.0.0.0 --port $PORT`.
- **Railway** — same idea, auto-detects the `Procfile`-style start
  command, or set it manually to the line above.
- **Fly.io** — works too, needs a `Dockerfile` (ask if you want one).

Whichever you pick, set these environment variables on the host (from
`.env.example`): `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASSWORD`,
`CONTACT_TO_EMAIL`, `ALLOWED_ORIGINS`.

Then set `NEXT_PUBLIC_CONTACT_API_URL` in the Next.js app's environment
(Vercel project settings) to wherever this ends up, e.g.
`https://prabakar-contact-api.onrender.com`.

## Notes

- Gmail needs an **App Password** (requires 2FA on the account), not
  your normal login password: https://myaccount.google.com/apppasswords
- The `website` field in the payload is a honeypot — real visitors
  never see or fill it (hidden via CSS on the frontend); bots that
  fill every field will, so those submissions are silently dropped.
- No credentials are stored in this repo. `.env` is gitignored —
  only `.env.example` (with placeholder values) is committed.
