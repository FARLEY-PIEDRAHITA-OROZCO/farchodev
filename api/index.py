"""Vercel serverless entry for the FastAPI backend.

Vercel auto-detects Python files inside `/api` as serverless functions.
This module simply imports the FastAPI `app` defined in `backend/server.py`
and exposes it as the default ASGI handler.

Vercel's Python runtime speaks ASGI natively — no adapter needed.
"""
import sys
from pathlib import Path

# Add backend/ to the import path so we can reuse the existing module layout
BACKEND_DIR = Path(__file__).resolve().parent.parent / "backend"
if str(BACKEND_DIR) not in sys.path:
    sys.path.insert(0, str(BACKEND_DIR))

from server import app  # noqa: E402  (after sys.path manipulation)

# Expose `app` for Vercel ASGI runtime
__all__ = ["app"]
