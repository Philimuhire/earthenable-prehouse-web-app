import os
from datetime import datetime, timedelta, timezone

import bcrypt
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError, jwt
from google.oauth2 import id_token
from google.auth.transport import requests as google_requests
from dotenv import load_dotenv

load_dotenv()

SECRET_KEY = os.getenv("SECRET_KEY")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24

DEFAULT_USERNAME = os.getenv("DEFAULT_USERNAME", "eerwcso@earthenable.org")
DEFAULT_PASSWORD = os.getenv("DEFAULT_PASSWORD")
GOOGLE_CLIENT_ID = os.getenv("GOOGLE_CLIENT_ID")

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/auth/login")

HASHED_PASSWORD = bcrypt.hashpw(DEFAULT_PASSWORD.encode(), bcrypt.gensalt())


def verify_password(plain_password: str, hashed_password: bytes) -> bool:
    return bcrypt.checkpw(plain_password.encode(), hashed_password)


def authenticate_user(username: str, password: str) -> dict | None:
    if username != DEFAULT_USERNAME:
        return None
    if not verify_password(password, HASHED_PASSWORD):
        return None
    return {"username": DEFAULT_USERNAME, "name": "CSO Admin"}


def verify_google_token(token: str) -> dict | None:
    try:
        idinfo = id_token.verify_oauth2_token(
            token, google_requests.Request(), GOOGLE_CLIENT_ID
        )
    except Exception as e:
        print(f"Google token verification failed: {e}")
        return None

    email = idinfo.get("email", "")
    print(f"Google login attempt with email: {email}")
    if "earthenable" not in email.lower():
        return None
    return {
        "username": email,
        "name": idinfo.get("name", email.split("@")[0]),
    }


def create_access_token(data: dict) -> str:
    to_encode = data.copy()
    expire = datetime.now(timezone.utc) + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)


def get_current_user(token: str = Depends(oauth2_scheme)) -> dict:
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Invalid or expired token",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception

    return {"username": username, "name": payload.get("name", "CSO")}
