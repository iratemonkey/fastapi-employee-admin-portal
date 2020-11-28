from typing import Any, Optional, List
from pymongo.client_session import ClientSession
from jose import JWTError, jwt
from fastapi.security import OAuth2PasswordBearer
from fastapi.encoders import jsonable_encoder
from fastapi import (
    APIRouter,
    HTTPException,
    Depends,
    Header,
    Query,
    Path,
    status,
)

from app import crud, models, schemas
from app.core.config import settings
from app.api import deps
from .utils import common_parameters


oauth2_scheme = OAuth2PasswordBearer(tokenUrl="api/v1/login")

router = APIRouter()


@router.get("/", response_model=List[schemas.User])
def read_users(
    db: ClientSession = Depends(deps.get_db),
    commons: dict = Depends(common_parameters),
    current_user: models.User = Depends(deps.get_current_active_superuser),
) -> Any:
    """
    Retrieve users.
    """
    users = crud.user.get_multi(db, **commons)
    return users


@router.post("/", response_model=schemas.User)
def create_user(
    *,
    db: ClientSession = Depends(deps.get_db),
    user_in: schemas.UserCreate,
    current_user: models.User = Depends(deps.get_current_active_superuser),
) -> Any:
    """
    Create new user.
    """
    user = crud.user.get_by_email(db, email=user_in.email)
    if user:
        raise HTTPException(
            status_code=400,
            detail="The user with this username already exists in the system.",
        )
    user = crud.user.create(db, obj_in=user_in)
    return user


@router.get("/{user_id}", response_model=schemas.User)
def read_user_by_id(
    user_id: int,
    current_user: models.User = Depends(deps.get_current_active_user),
    db: ClientSession = Depends(deps.get_db),
) -> Any:
    """
    Get a specific user by id.
    """
    user = crud.user.get(db, id=user_id)
    if user == current_user:
        return user
    if not crud.user.is_superuser(current_user):
        raise HTTPException(
            status_code=400, detail="The user doesn't have enough privileges"
        )
    return user


# @router.put(
#     "/",
#     response_model=schemas.User,
#     status_code=status.HTTP_200_OK,
#     summary="Update a User",
# )
# async def update_user(user: models.User, authorization: Optional[str] = Header(None)):
#     """
#     Update a User with a specific user_id:

#     - **Authorization Header**: required
#     - **user_id**: body, required
#     """
#     # new_user = user["employee_list"].append(user)
#     return user
