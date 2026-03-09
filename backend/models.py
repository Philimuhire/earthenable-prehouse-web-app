from typing import Optional

from pydantic import BaseModel


class LoginRequest(BaseModel):
    username: str
    password: str


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"


class GoogleLoginRequest(BaseModel):
    credential: str


class UserResponse(BaseModel):
    username: str
    name: str


class CreateOpportunityRequest(BaseModel):
    existingContactId: Optional[str] = None
    accountId: Optional[str] = None
    salutation: Optional[str] = None
    firstName: str
    lastName: str
    phone: Optional[str] = None
    country: Optional[str] = None
    villageId: Optional[str] = None
    district: Optional[str] = None
    customerCode: Optional[str] = None
    category: Optional[str] = None
    house: Optional[str] = None
    phase: Optional[str] = None
    totalSquareMeters: Optional[float] = None
    productInterest: Optional[str] = None
    employeeId: Optional[str] = None
    customerSignedDate: str
