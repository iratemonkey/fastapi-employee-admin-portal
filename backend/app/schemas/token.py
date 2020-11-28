from typing import Optional

from pydantic import BaseModel, EmailStr
from app.schemas.user import User


class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"
    current_user: User


class TokenPayload(BaseModel):
    sub: Optional[str] = None
