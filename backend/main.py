import os

from fastapi import Depends, FastAPI, HTTPException, Query, status
from fastapi.middleware.cors import CORSMiddleware

from auth import authenticate_user, create_access_token, get_current_user, verify_google_token
from models import CreateOpportunityRequest, GoogleLoginRequest, LoginRequest, TokenResponse, UserResponse
from salesforce_client import (
    create_account,
    create_opportunity,
    get_picklists,
    get_sf,
    search_customers,
    search_employees,
    search_villages,
)

app = FastAPI(title="EarthEnable Pre-House Assessment API")

allowed_origins = os.getenv("ALLOWED_ORIGINS", "http://localhost:3000").split(",")

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.post("/api/auth/login", response_model=TokenResponse)
def login(request: LoginRequest):
    user = authenticate_user(request.username, request.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password",
        )
    token = create_access_token(data={"sub": user["username"], "name": user["name"]})
    return TokenResponse(access_token=token)


@app.post("/api/auth/google", response_model=TokenResponse)
def google_login(request: GoogleLoginRequest):
    try:
        user = verify_google_token(request.credential)
    except PermissionError as e:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail=str(e),
        )
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=str(e),
        )
    token = create_access_token(data={"sub": user["username"], "name": user["name"]})
    return TokenResponse(access_token=token)


@app.get("/api/auth/me", response_model=UserResponse)
def me(user: dict = Depends(get_current_user)):
    return UserResponse(**user)



@app.get("/api/sf/picklists")
def sf_picklists(user: dict = Depends(get_current_user)):
    try:
        sf = get_sf()
        return get_picklists(sf)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/api/sf/villages")
def sf_villages(q: str = Query(..., min_length=2), user: dict = Depends(get_current_user)):
    try:
        sf = get_sf()
        return search_villages(sf, q)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/api/sf/employees")
def sf_employees(q: str = Query(..., min_length=2), user: dict = Depends(get_current_user)):
    try:
        sf = get_sf()
        return search_employees(sf, q)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/api/sf/customers")
def sf_customers(q: str = Query(..., min_length=2), user: dict = Depends(get_current_user)):
    try:
        sf = get_sf()
        return search_customers(sf, q)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/api/sf/opportunity")
def sf_create_opportunity(
    request: CreateOpportunityRequest,
    user: dict = Depends(get_current_user),
):
    try:
        sf = get_sf()

        is_existing = bool(request.accountId or request.existingContactId)
        if is_existing:
            customer_id = request.existingContactId
            account_id = request.accountId
        else:
            new_customer = create_account(sf, {
                "salutation": request.salutation,
                "firstName": request.firstName,
                "lastName": request.lastName,
                "phone": request.phone,
            })
            customer_id = new_customer["contactId"]
            account_id = new_customer["accountId"]
        opp_input = {
            "customerId": customer_id,
            "accountId": account_id,
            "isExisting": is_existing,
            "firstName": request.firstName,
            "lastName": request.lastName,
            "phone": request.phone,
            "country": request.country,
            "villageId": request.villageId,
            "district": request.district,
            "customerCode": request.customerCode,
            "category": request.category,
            "house": request.house,
            "phase": request.phase,
            "totalSquareMeters": request.totalSquareMeters,
            "productInterest": request.productInterest,
            "employeeId": request.employeeId,
            "customerSignedDate": request.customerSignedDate,
        }
        result = create_opportunity(sf, opp_input)
        return result
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
