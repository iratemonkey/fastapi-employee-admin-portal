import uuid
from typing import Any, Dict, Optional, Union
from bson.binary import Binary, UUID_SUBTYPE


from pymongo.client_session import ClientSession

from app.core.security import get_password_hash, verify_password
from app.crud.base import CRUDBase
from app.models.employee import Employee
from app.schemas.employee import EmployeeCreate, EmployeeUpdate


def clean_data(data: dict) -> dict:
    new_dict = dict(data)

    return new_dict


class CRUDEmployee(CRUDBase[Employee, EmployeeCreate, EmployeeUpdate]):
    def get_by_email(self, db: ClientSession, *, email: str) -> Optional[Employee]:
        employee = db.get_collection("employee").find_one({"email": email})
        return Employee.from_mongo(employee)

    def create(self, db: ClientSession, *, obj_in: EmployeeCreate) -> Employee:
        data = dict(obj_in)
        data["employee_id"] = uuid.uuid4()

        doc_type = self.model.doc_type()
        _id = db.get_collection(doc_type).insert(data)
        data["id"] = _id
        return data

    # def update(
    #     self,
    #     db: ClientSession,
    #     *,
    #     db_obj: User,
    #     obj_in: Union[UserUpdate, Dict[str, Any]]
    # ) -> User:
    #     if isinstance(obj_in, dict):
    #         update_data = obj_in
    #     else:
    #         update_data = obj_in.dict(exclude_unset=True)
    #     if update_data["password"]:
    #         hashed_password = get_password_hash(update_data["password"])
    #         del update_data["password"]
    #         update_data["hashed_password"] = hashed_password
    #     return super().update(db, db_obj=db_obj, obj_in=update_data)


employee = CRUDEmployee(Employee)
