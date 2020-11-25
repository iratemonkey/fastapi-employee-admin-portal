from typing import Optional
from pydantic import EmailStr, Field
from app.models.mongo import MongoModel, OID
from uuid import UUID


class Employee(MongoModel):
    # Added this class method here because I could not
    # get User.doc_type to work
    @classmethod
    def doc_type(cls):
        return "employees"

    id: Optional[OID] = Field()
    employee_id: UUID
    email: EmailStr
    first_name: str
    last_name: str

    class Config:
        schema_extra = {
            "example": {
                "employee_id": "028d29fc-0eab-4994-b7da-e9a37b554db5",
                "email": "strongestavenger@avengers.com",
                "first_name": "thor",
                "last_name": "odinson",
                "is_active": True,
            }
        }
