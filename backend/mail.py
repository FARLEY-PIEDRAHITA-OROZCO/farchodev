"""Lightweight SMTP helper for sending contact form emails.

Uses the built-in `smtplib` (Python stdlib) run in a thread via
`asyncio.to_thread` so we don't need extra dependencies.
"""
from __future__ import annotations

import asyncio
import logging
import os
import smtplib
import ssl
from email.message import EmailMessage
from email.utils import formataddr
from typing import Optional

logger = logging.getLogger(__name__)


def _get_cfg() -> Optional[dict]:
    host = os.environ.get("SMTP_HOST")
    port = os.environ.get("SMTP_PORT")
    user = os.environ.get("SMTP_USER")
    pwd = os.environ.get("SMTP_PASSWORD")
    to_email = os.environ.get("CONTACT_TO_EMAIL") or user
    from_name = os.environ.get("SMTP_FROM_NAME", "Portfolio Contact")
    if not (host and port and user and pwd and to_email):
        return None
    try:
        port_int = int(port)
    except ValueError:
        return None
    return {
        "host": host,
        "port": port_int,
        "user": user,
        "pwd": pwd,
        "to": to_email,
        "from_name": from_name,
    }


def _send_sync(cfg: dict, subject: str, body_text: str, body_html: str, reply_to: str) -> None:
    msg = EmailMessage()
    msg["Subject"] = subject
    msg["From"] = formataddr((cfg["from_name"], cfg["user"]))
    msg["To"] = cfg["to"]
    if reply_to:
        msg["Reply-To"] = reply_to
    msg.set_content(body_text)
    msg.add_alternative(body_html, subtype="html")

    context = ssl.create_default_context()
    if cfg["port"] == 465:
        with smtplib.SMTP_SSL(cfg["host"], cfg["port"], context=context, timeout=15) as server:
            server.login(cfg["user"], cfg["pwd"])
            server.send_message(msg)
    else:
        with smtplib.SMTP(cfg["host"], cfg["port"], timeout=15) as server:
            server.ehlo()
            try:
                server.starttls(context=context)
                server.ehlo()
            except Exception:
                pass
            server.login(cfg["user"], cfg["pwd"])
            server.send_message(msg)


async def send_contact_email(
    name: str,
    email: str,
    subject: str,
    message: str,
) -> bool:
    """Send a contact form message by email. Returns True on success, False otherwise."""
    cfg = _get_cfg()
    if cfg is None:
        logger.warning("SMTP not configured; skipping email send")
        return False

    mail_subject = f"[Portfolio] Nuevo mensaje de {name}"
    if subject:
        mail_subject += f" - {subject}"

    text = (
        f"Nuevo mensaje desde el portafolio\n\n"
        f"Nombre: {name}\n"
        f"Email: {email}\n"
        f"Asunto: {subject or '(sin asunto)'}\n\n"
        f"Mensaje:\n{message}\n"
    )
    html = f"""
    <div style="font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif; max-width: 640px; margin: 0 auto; background: #0f172a; color: #e2e8f0; padding: 32px; border-radius: 16px;">
      <div style="color: #22d3ee; font-size: 12px; letter-spacing: 2px; text-transform: uppercase; margin-bottom: 8px; font-family: monospace;">PORTFOLIO · NEW MESSAGE</div>
      <h2 style="color: #ffffff; margin: 0 0 24px 0; font-size: 22px;">Nuevo mensaje de contacto</h2>
      <table style="width:100%; border-collapse: collapse;">
        <tr><td style="padding: 8px 0; color:#94a3b8; width: 90px;">Nombre</td><td style="padding: 8px 0; color:#f1f5f9; font-weight: 500;">{_escape(name)}</td></tr>
        <tr><td style="padding: 8px 0; color:#94a3b8;">Email</td><td style="padding: 8px 0;"><a href="mailto:{_escape(email)}" style="color:#22d3ee; text-decoration: none;">{_escape(email)}</a></td></tr>
        <tr><td style="padding: 8px 0; color:#94a3b8;">Asunto</td><td style="padding: 8px 0; color:#f1f5f9;">{_escape(subject) or '<span style="color:#64748b">(sin asunto)</span>'}</td></tr>
      </table>
      <hr style="border: 0; border-top: 1px solid rgba(255,255,255,0.08); margin: 24px 0;" />
      <div style="color:#94a3b8; font-size: 12px; letter-spacing: 2px; text-transform: uppercase; margin-bottom: 8px; font-family: monospace;">MESSAGE</div>
      <div style="background: rgba(34,211,238,0.06); border-left: 3px solid #22d3ee; padding: 16px 20px; border-radius: 8px; white-space: pre-wrap; line-height: 1.55; color:#e2e8f0;">{_escape(message)}</div>
      <p style="margin-top: 24px; font-size: 12px; color:#64748b;">Responde directamente a este email para contactar a {_escape(name)}.</p>
    </div>
    """
    try:
        await asyncio.to_thread(_send_sync, cfg, mail_subject, text, html, email)
        logger.info("Contact email sent to %s", cfg["to"])
        return True
    except Exception:
        logger.exception("Failed to send contact email")
        return False


def _escape(value: Optional[str]) -> str:
    if not value:
        return ""
    return (
        value.replace("&", "&amp;")
        .replace("<", "&lt;")
        .replace(">", "&gt;")
        .replace('"', "&quot;")
        .replace("'", "&#39;")
    )
