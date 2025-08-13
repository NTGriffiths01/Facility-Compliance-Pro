import os
import uuid
import secrets
from datetime import datetime, timedelta
from typing import Optional

from fastapi import FastAPI, Depends, HTTPException, status, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from jose import JWTError, jwt
from pydantic import BaseModel, EmailStr
from passlib.context import CryptContext
from motor.motor_asyncio import AsyncIOMotorClient

# App and Security Config
SECRET_KEY = os.environ.get("JWT_SECRET") or secrets.token_urlsafe(32)
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24

app = FastAPI(title="WorldClass Backend", openapi_url="/api/openapi.json", docs_url="/api/docs")

# CORS - allow all origins (ingress will restrict appropriately)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Database Setup
MONGO_URL = os.environ.get("MONGO_URL")
if not MONGO_URL:
    # Fail fast if DB URL missing
    raise RuntimeError("MONGO_URL environment variable is required but not set.")

mongo_client: AsyncIOMotorClient = AsyncIOMotorClient(MONGO_URL)
db = mongo_client["worldclass_app"]
users_col = db["users"]

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# Models
class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"

class UserPublic(BaseModel):
    id: str
    email: EmailStr

class LoginRequest(BaseModel):
    email: EmailStr
    password: str

# Security helpers

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    expire = datetime.utcnow() + (expires_delta or timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES))
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password: str) -> str:
    return pwd_context.hash(password)

async def get_current_user(request: Request) -> dict:
    auth_header: str = request.headers.get("Authorization", "")
    if not auth_header.startswith("Bearer "):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Not authenticated")
    token = auth_header.split(" ", 1)[1]
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id: str = payload.get("sub")
        if user_id is None:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token")
    except JWTError:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token")

    user = await users_col.find_one({"_id": user_id})
    if not user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="User not found")
    return user

# Startup: ensure default user exists and index on email
@app.on_event("startup")
async def startup_event():
    await users_col.create_index("email", unique=True)
    default_email = "Nolan.Griffiths@doc.state.ma.us"
    default_password = "Admin123"
    existing = await users_col.find_one({"email": default_email})
    if not existing:
        await users_col.insert_one({
            "_id": str(uuid.uuid4()),
            "email": default_email,
            "password_hash": get_password_hash(default_password),
            "created_at": datetime.utcnow().isoformat(),
            "role": "admin"
        })

# Routes
@app.get("/api/health")
async def health():
    return {"status": "ok", "service": "backend"}

@app.post("/api/auth/login", response_model=Token)
async def login(payload: LoginRequest):
    user = await users_col.find_one({"email": payload.email})
    if not user or not verify_password(payload.password, user.get("password_hash", "")):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Incorrect email or password")

    token = create_access_token({"sub": user["_id"], "email": user["email"]})
    return {"access_token": token, "token_type": "bearer"}

@app.get("/api/me", response_model=UserPublic)
async def me(current_user: dict = Depends(get_current_user)):
    return {"id": current_user["_id"], "email": current_user["email"]}

@app.get("/api/preview")
async def preview(current_user: dict = Depends(get_current_user)):
    # Minimal content; UI will style with assets
    return {
        "title": "World-Class Performance",
        "subtitle": "Operational excellence preview",
        "bullets": [
            "Real-time insights",
            "Streamlined workflows",
            "Actionable dashboards"
        ]
    }

# Bind to 0.0.0.0:8001 via supervisor (do not run uvicorn directly here)