from datetime import datetime
from typing import Optional, Union
from pydantic import BaseModel, EmailStr
from uuid import UUID
from app.models.mongo import OID


# Shared properties
class EmployeeBase(BaseModel):
    _id: str
    email: Optional[EmailStr] = None
    is_active: Optional[bool] = True
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    create_at = datetime
    updated_at = datetime


# Properties to receive via API on creation
class EmployeeCreate(EmployeeBase):
    email: EmailStr
    first_name: Optional[str] = None
    last_name: Optional[str] = None


# Properties to receive via API on update
class EmployeeUpdate(EmployeeBase):
    _id: OID


class EmployeeInDBBase(EmployeeBase):
    _id: OID

    class Config:
        odm_mode = True


# Additional properties to return via API
class EmployeeOut(EmployeeInDBBase):
    employee_id: UUID
    pass


# Additional properties stored in DB
class EmployeeInDB(EmployeeInDBBase):
    employee_id: UUID
