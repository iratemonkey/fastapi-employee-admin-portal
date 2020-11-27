from typing import Optional, List
from pydantic import EmailStr, Field
from app.models.mongo import MongoModel, OID


class User(MongoModel):
    # Added this class method here because I could not
    # get User.doc_type to work
    @classmethod
    def doc_type(cls):
        return "users"

    id: str
    email: Optional[EmailStr] = None
    hashed_password: str
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    is_active: Optional[bool] = None
    is_superuser: bool = False
    employee_list: Optional[List[str]] = None

    class Config:
        schema_extra = {
            "example": {
                "email": "steve.rogers@avengers.com",
                "first_name": "steve",
                "last_name": "rogers",
                "is_active": True,
                "employee_list": [],
                "created_at": "2008-09-15T15:53:00+05:00",
                "updated_at": "2008-09-15T15:53:00+05:00",
            }
        }
