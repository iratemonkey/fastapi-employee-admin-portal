from typing import Any, Dict, Optional, Union

from pymongo.client_session import ClientSession

from app.core.security import get_password_hash, verify_password
from app.crud.base import CRUDBase
from app.models.user import User
from app.schemas.user import UserCreate, UserUpdate


def clean_data(data: dict) -> dict:
    new_dict = dict(data)

    return new_dict


class CRUDUser(CRUDBase[User, UserCreate, UserUpdate]):
    def get_by_email(self, db: ClientSession, *, email: str) -> Optional[User]:
        user = db.get_collection("users").find_one({"email": email})
        return User.from_mongo(user)

    def create(self, db: ClientSession, *, obj_in: UserCreate) -> User:
        data = dict(obj_in)
        data["hashed_password"] = get_password_hash(obj_in.password)
        del data["password"]

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

    def authenticate(
        self, db: ClientSession, *, email: str, password: str
    ) -> Optional[User]:
        user = self.get_by_email(db, email=email)
        if not user:
            return None
        if not verify_password(password, user.hashed_password):
            return None
        return user

    def is_active(self, user: User) -> bool:
        return user.is_active

    def is_superuser(self, user: User) -> bool:
        return user.is_superuser


user = CRUDUser(User)
