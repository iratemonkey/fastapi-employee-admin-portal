from typing import Any, Optional, List
from pydantic.networks import EmailStr
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


oauth2_scheme = OAuth2PasswordBearer(tokenUrl="api/v1/login")

router = APIRouter()


@router.get("/", response_model=List[schemas.User])
def read_users(
    db: ClientSession = Depends(deps.get_db),
    skip: int = 0,
    limit: int = 100,
    current_user: models.User = Depends(deps.get_current_active_superuser),
) -> Any:
    """
    Retrieve users.
    """
    users = crud.user.get_multi(db, skip=skip, limit=limit)
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


@router.get(
    "/me",
    response_model=schemas.User,
    status_code=status.HTTP_200_OK,
    summary="Get the current_user",
)
async def read_users_me(
    current_user: models.User = Depends(deps.get_current_active_user),
):
    """
    Get the current user to check for authorization.

    - **Authorization Header**: required
    """
    return current_user


@router.post("/register", response_model=schemas.User)
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
    print("user", user)
    if user:
        raise HTTPException(
            status_code=400,
            detail="The user with this username already exists in the system",
        )

    print("user_in", user_in)
    user = crud.user.create(db, obj_in=user_in)
    return user


# @router.get(
#     "/{user_id}",
#     response_model=schemas.User,
#     status_code=status.HTTP_200_OK,
#     summary="Get a User by user_id",
# )
# async def read_user(
#     user_id: str = Path(..., title="The ID od the user to get"),
#     authorization: str = Header(...),
# ):
#     """
#     Get a User by a specific user_id:

#     - **Authorization Header**: required
#     - **user_id**: path, required in path
#     """
#     if authorization:
#         user = models.User(username="seanbaier", token=TOKEN)
#         return user
#     else:
#         raise HTTPException(
#             status_code=status.HTTP_404_NOT_FOUND, detail="User not found"
#         )


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
