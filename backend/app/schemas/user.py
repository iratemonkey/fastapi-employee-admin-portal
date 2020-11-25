from typing import Optional, List

from pydantic import EmailStr, Field
from app.models.mongo import MongoModel, OID


# Shared properties
class UserBase(MongoModel):
    id: Optional[OID] = Field()
    email: EmailStr = None
    is_active: bool = True
    is_superuser: bool = False
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    employee_list: Optional[List[str]] = None


# Properties to receive via API on creation
class UserCreate(MongoModel):
    email: EmailStr
    password: str
    is_active: bool = True
    is_superuser: bool = False
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    employee_list: Optional[List[str]] = None


# Properties to receive via API on update
class UserUpdate(UserBase):
    password: Optional[str] = None


class UserInDBBase(UserBase):
    id: OID = Field()
    hashed_password: str

    class Config:
        odm_mode = True


# Additional properties to return via API
class User(UserInDBBase):
    pass


# Additional properties stored in DB
class UserInDB(UserInDBBase):
    id: OID = Field()
    hashed_password: str
