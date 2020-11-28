from datetime import datetime
from typing import Optional, Union
from pydantic import BaseModel, EmailStr
from uuid import UUID


# Shared properties
class EmployeeBase(BaseModel):
    id: str
    email: Optional[EmailStr] = None
    is_active: Optional[bool] = True
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    created_at: datetime
    updated_at: datetime


# Properties to receive via API on creation
class EmployeeCreate(EmployeeBase):
    email: EmailStr
    first_name: Optional[str] = None
    last_name: Optional[str] = None


# Properties to receive via API on update
class EmployeeUpdate(EmployeeBase):
    id: str


class EmployeeInDBBase(EmployeeBase):
    id: str

    class Config:
        odm_mode = True


# Additional properties to return via API
class EmployeeOut(EmployeeInDBBase):
    employee_id: UUID


# Additional properties stored in DB
class EmployeeInDB(EmployeeInDBBase):
    employee_id: UUID
