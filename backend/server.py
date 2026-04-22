from fastapi import FastAPI, APIRouter, HTTPException, Query, Request
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, EmailStr, field_validator
from typing import List, Optional
import uuid
from collections import defaultdict, deque
from datetime import datetime, timedelta, timezone

from mail import send_contact_email


ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / ".env")

# MongoDB connection
mongo_url = os.environ["MONGO_URL"]
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ["DB_NAME"]]

# Create the main app without a prefix
app = FastAPI(title="Farley Portfolio API")

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")


# ---------- Models ----------
def utcnow():
    return datetime.now(timezone.utc)


class ContactCreate(BaseModel):
    name: str = Field(..., min_length=1, max_length=100)
    email: EmailStr
    subject: Optional[str] = Field(default="", max_length=200)
    message: str = Field(..., min_length=1, max_length=5000)
    # Honeypot field — legitimate users never fill this (hidden input).
    # If populated, the request is treated as spam and silently accepted.
    website: Optional[str] = Field(default="", max_length=200)

    @field_validator("name", "message")
    @classmethod
    def strip_strings(cls, v: str) -> str:
        return v.strip()

    @field_validator("subject")
    @classmethod
    def strip_subject(cls, v: Optional[str]) -> str:
        return (v or "").strip()


class ContactMessage(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    email: str
    subject: str = ""
    message: str
    created_at: datetime = Field(default_factory=utcnow)
    email_sent: bool = False


class ContactListResponse(BaseModel):
    total: int
    items: List[ContactMessage]


class VisitsResponse(BaseModel):
    visits: int


# ---------- Simple in-memory rate limiter for contact form ----------
_RATE_LIMIT_MAX = 5  # max requests
_RATE_LIMIT_WINDOW = 3600  # per hour (seconds)
_rate_bucket: "dict[str, deque]" = defaultdict(deque)


def _client_ip(request: Request) -> str:
    fwd = request.headers.get("x-forwarded-for")
    if fwd:
        return fwd.split(",")[0].strip()
    real = request.headers.get("x-real-ip")
    if real:
        return real.strip()
    return request.client.host if request.client else "unknown"


def _check_rate_limit(ip: str) -> bool:
    now = datetime.now(timezone.utc)
    cutoff = now - timedelta(seconds=_RATE_LIMIT_WINDOW)
    bucket = _rate_bucket[ip]
    # Drop entries older than window
    while bucket and bucket[0] < cutoff:
        bucket.popleft()
    if len(bucket) >= _RATE_LIMIT_MAX:
        return False
    bucket.append(now)
    return True


# ---------- Routes ----------
@api_router.get("/")
async def root():
    return {"message": "Farley Portfolio API", "status": "ok"}


@api_router.get("/health")
async def health():
    try:
        await db.command("ping")
        return {"status": "ok", "db": "connected"}
    except Exception as exc:
        logging.exception("health db ping failed")
        return {"status": "degraded", "db": "disconnected", "error": str(exc)}


@api_router.post("/contact", response_model=ContactMessage, status_code=201)
async def create_contact(payload: ContactCreate, request: Request):
    # Honeypot: if filled, silently pretend success without saving/sending.
    if payload.website:
        logging.info("honeypot triggered; discarding spam submission")
        return ContactMessage(
            name=payload.name or "anon",
            email=payload.email,
            subject=payload.subject or "",
            message="",
            email_sent=False,
        )

    # Rate limit per client IP
    ip = _client_ip(request)
    if not _check_rate_limit(ip):
        logging.warning("rate limit exceeded for %s", ip)
        raise HTTPException(
            status_code=429,
            detail="Has enviado demasiados mensajes. Intenta de nuevo en una hora.",
        )

    try:
        msg = ContactMessage(
            name=payload.name,
            email=payload.email,
            subject=payload.subject or "",
            message=payload.message,
        )
        try:
            msg.email_sent = await send_contact_email(
                name=msg.name,
                email=msg.email,
                subject=msg.subject,
                message=msg.message,
            )
        except Exception:
            logging.exception("email send raised unexpectedly")
            msg.email_sent = False
        await db.contact_messages.insert_one(msg.model_dump())
        return msg
    except HTTPException:
        raise
    except Exception:
        logging.exception("failed to save contact message")
        raise HTTPException(status_code=500, detail="Failed to save message")


@api_router.get("/contact", response_model=ContactListResponse)
async def list_contact(
    limit: int = Query(default=50, ge=1, le=200),
    skip: int = Query(default=0, ge=0),
):
    try:
        total = await db.contact_messages.count_documents({})
        cursor = (
            db.contact_messages.find({}, {"_id": 0})
            .sort("created_at", -1)
            .skip(skip)
            .limit(limit)
        )
        items_raw = await cursor.to_list(length=limit)
        items = [ContactMessage(**doc) for doc in items_raw]
        return ContactListResponse(total=total, items=items)
    except Exception:
        logging.exception("failed to list contact messages")
        raise HTTPException(status_code=500, detail="Failed to list messages")


@api_router.get("/stats/ping", response_model=VisitsResponse)
async def stats_ping():
    try:
        result = await db.stats.find_one_and_update(
            {"_id": "visits"},
            {"$inc": {"count": 1}},
            upsert=True,
            return_document=True,
        )
        # On upsert with no prior doc, result may be None; fetch explicitly
        if result is None:
            result = await db.stats.find_one({"_id": "visits"})
        count = int((result or {}).get("count", 1))
        return VisitsResponse(visits=count)
    except Exception:
        logging.exception("failed to update stats")
        raise HTTPException(status_code=500, detail="Failed to update stats")


# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
)
logger = logging.getLogger(__name__)


@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
