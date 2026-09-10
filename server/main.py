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
import smtplib
import logging
import socket
from email.message import EmailMessage
from typing import Optional

from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, EmailStr, Field

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)
# Also log SMTP details
logging.getLogger("smtplib").setLevel(logging.DEBUG)

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
    smtp_host = os.environ.get("SMTP_HOST")
    smtp_port = int(os.environ.get("SMTP_PORT", "587"))
    smtp_user = os.environ.get("SMTP_USER")
    smtp_password = os.environ.get("SMTP_PASSWORD")
    to_address = os.environ.get("CONTACT_TO_EMAIL", "Prabakarmadhanagopal@gmail.com")

    if not all([smtp_host, smtp_user, smtp_password]):
        raise RuntimeError(
            "SMTP is not configured — set SMTP_HOST, SMTP_USER and "
            "SMTP_PASSWORD (see .env.example)."
        )

    msg = EmailMessage()
    msg["Subject"] = f"Portfolio contact — {payload.name} ({payload.reason})"
    msg["From"] = smtp_user
    msg["To"] = to_address
    msg["Reply-To"] = payload.email
    msg.set_content(
        f"Name: {payload.name}\n"
        f"Email: {payload.email}\n"
        f"Company: {payload.company or '—'}\n"
        f"Reason: {payload.reason}\n\n"
        f"Message:\n{payload.message}\n"
    )

    logger.info(f"Attempting to send email via {smtp_host}:{smtp_port}")
    try:
        # Set socket timeout to prevent hanging
        socket.setdefaulttimeout(10)
        
        logger.info(f"Creating SMTP connection to {smtp_host}:{smtp_port}")
        with smtplib.SMTP(smtp_host, smtp_port, timeout=10) as server:
            logger.info("Connected to SMTP server, attempting STARTTLS")
            server.starttls()
            logger.info("STARTTLS successful, attempting login")
            server.login(smtp_user, smtp_password)
            logger.info(f"Logged in as {smtp_user}, sending message")
            server.send_message(msg)
            logger.info(f"Email sent successfully to {to_address}")
    except socket.timeout:
        logger.error(f"Socket timeout connecting to {smtp_host}:{smtp_port}")
        raise RuntimeError(f"SMTP connection timeout to {smtp_host}:{smtp_port}")
    except smtplib.SMTPAuthenticationError as exc:
        logger.error(f"SMTP authentication failed: {str(exc)}")
        raise RuntimeError(f"SMTP authentication failed: check SMTP_USER and SMTP_PASSWORD")
    except smtplib.SMTPException as exc:
        logger.error(f"SMTP error: {type(exc).__name__}: {str(exc)}")
        raise
    except Exception as exc:
        logger.error(f"Unexpected error: {type(exc).__name__}: {str(exc)}", exc_info=True)
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
