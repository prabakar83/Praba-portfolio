"""
Contact form API for prabakar-m.vercel.app

A small FastAPI service with one job: take a contact-form submission
from the Next.js site and email it to Prabakar. Deployed separately
from the Next.js app (Vercel doesn't run long-lived Python processes) —
see README.md in this folder for deploy options (Render, Railway, Fly.io).

Run locally:
    pip install -r requirements.txt
    cp .env.example .env      # then fill in real values
    uvicorn main:app --reload --port 8000
"""

import os
import logging
from typing import Optional

from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, EmailStr, Field
import resend

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

load_dotenv()  # no-op in production if you set real env vars on the host instead

app = FastAPI(title="Prabakar M — Contact API")

# Comma-separated list of allowed origins, e.g.
# "https://prabakar-m.vercel.app,http://localhost:3000"
allowed_origins = os.environ.get("ALLOWED_ORIGINS", "http://localhost:3000").split(",")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[origin.strip() for origin in allowed_origins],
    allow_methods=["POST"],
    allow_headers=["Content-Type"],
)


class ContactPayload(BaseModel):
    name: str = Field(min_length=2, max_length=120)
    email: EmailStr
    company: Optional[str] = Field(default=None, max_length=120)
    reason: str = Field(min_length=1, max_length=60)
    message: str = Field(min_length=20, max_length=4000)
    # Honeypot field: real users never fill this in. Bots that fill
    # every input on the page will, so silently drop those submissions.
    website: Optional[str] = None


def send_email(payload: ContactPayload) -> None:
    resend_api_key = os.environ.get("RESEND_API_KEY")
    to_address = os.environ.get("CONTACT_TO_EMAIL", "Prabakarmadhanagopal@gmail.com")
    from_address = os.environ.get("RESEND_FROM_EMAIL", "onboarding@resend.dev")

    if not resend_api_key:
        raise RuntimeError(
            "Resend API key not configured — set RESEND_API_KEY in environment"
        )

    resend.api_key = resend_api_key
    
    email_body = (
        f"<h2>New Portfolio Contact Message</h2>\n"
        f"<p><b>Name:</b> {payload.name}</p>\n"
        f"<p><b>Email:</b> {payload.email}</p>\n"
        f"<p><b>Company:</b> {payload.company or '—'}</p>\n"
        f"<p><b>Reason:</b> {payload.reason}</p>\n"
        f"<h3>Message:</h3>\n"
        f"<p>{payload.message}</p>\n"
    )

    logger.info(f"Attempting to send email via Resend to {to_address}")
    try:
        result = resend.Emails.send(
            {
                "from": from_address,
                "to": [to_address],
                "reply_to": payload.email,
                "subject": f"Portfolio Contact — {payload.name} ({payload.reason})",
                "html": email_body,
            }
        )
        logger.info(f"Email sent successfully via Resend. Message ID: {result.get('id')}")
    except Exception as exc:
        logger.error(f"Failed to send email via Resend: {type(exc).__name__}: {str(exc)}", exc_info=True)
        raise


@app.post("/api/contact")
def contact(payload: ContactPayload):
    # Honeypot tripped — pretend success, do nothing.
    if payload.website:
        logger.info("Honeypot triggered, ignoring submission")
        return {"ok": True}

    try:
        send_email(payload)
    except RuntimeError as exc:
        # Config problem or timeout — surface clearly in server logs
        logger.error(f"Config/timeout error: {str(exc)}")
        raise HTTPException(status_code=500, detail=str(exc)) from exc
    except Exception as exc:  # pragma: no cover — network/SMTP failures
        logger.error(f"Failed to send email: {type(exc).__name__}: {str(exc)}", exc_info=True)
        raise HTTPException(
            status_code=502, detail="Could not send the message right now."
        ) from exc

    return {"ok": True}


@app.get("/health")
def health():
    return {"status": "ok"}
