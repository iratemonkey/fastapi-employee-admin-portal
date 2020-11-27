from datetime import timedelta
from typing import Any

from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from pymongo.client_session import ClientSession

from app import crud, schemas
from app.api import deps
from app.core import security
from app.core.config import settings

router = APIRouter()


@router.post("/login", response_model=schemas.Token)
def login_access_token(
    db: ClientSession = Depends(deps.get_db),
    form_data: OAuth2PasswordRequestForm = Depends(),
) -> Any:
    """
    OAuth2 compatible token login, get an access token for future requests
    """
    current_user = crud.user.authenticate(
        db, email=form_data.username, password=form_data.password
    )

    if not current_user:
        raise HTTPException(status_code=400, detail="Incorrect email or password")
    elif not crud.user.is_active(current_user):
        raise HTTPException(status_code=400, detail="Inactive user")
    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)

    response = {
        "current_user": current_user,
        "access_token": security.create_access_token(
            current_user.id, expires_delta=access_token_expires
        ),
    }

    return response


@router.post("/register", response_model=schemas.Token)
def create_user_open(
    *,
    db: ClientSession = Depends(deps.get_db),
    user_in: schemas.UserCreate,
) -> Any:
    """
    Create new user without the need to be logged in.
    """

    if not settings.USERS_OPEN_REGISTRATION:
        raise HTTPException(
            status_code=403,
            detail="Open user registration is forbidden on this server",
        )
    user = crud.user.get_by_email(db, email=user_in.email)
    if user:
        raise HTTPException(
            status_code=400,
            detail="The user with this username already exists in the system",
        )

    current_user = crud.user.create(db, obj_in=user_in)
    if not current_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Failed to create new user {user_in.email}",
        )

    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)

    response = {
        "current_user": current_user,
        "access_token": security.create_access_token(
            current_user.id, expires_delta=access_token_expires
        ),
    }

    return response
