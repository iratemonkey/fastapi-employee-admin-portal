from typing import Any, Dict, Generic, List, Optional, Type, TypeVar, Union

from fastapi.encoders import jsonable_encoder
from pydantic import BaseModel
from bson import ObjectId
from inspect import getmembers, getmodulename, getmodule

# from sqlalchemy.orm import Session
from pymongo.client_session import ClientSession

from app.db.base_class import Base

ModelType = TypeVar("ModelType", bound=Base)
CreateSchemaType = TypeVar("CreateSchemaType", bound=BaseModel)
UpdateSchemaType = TypeVar("UpdateSchemaType", bound=BaseModel)


class CRUDBase(Generic[ModelType, CreateSchemaType, UpdateSchemaType]):
    def __init__(self, model: Type[ModelType]):
        """
        CRUD object with default methods to Create, Read, Update, Delete (CRUD).
        **Parameters**
        * `model`: A Pymongo model class
        * `schema`: A Pydantic model (schema) class
        """
        self.model = model

    def get(self, db: ClientSession, id: Any) -> Optional[ModelType]:
        _id = ObjectId(id)
        doc_type = self.model.doc_type()
        doc = db.get_collection(doc_type).find_one({"_id": _id})
        return self.model.from_mongo(doc)

    def get_multi(
        self, db: ClientSession, *, skip: int = 0, limit: int = 10
    ) -> List[ModelType]:
        doc_type = self.model.doc_type()
        docs: List[self.model] = []
        cursor = db.get_collection(doc_type).find().skip(skip).limit(limit)
        for item in cursor:
            docs.append(self.model.from_mongo(item))

        return docs

    def create(self, db: ClientSession, *, obj_in: CreateSchemaType) -> ModelType:
        obj_in = jsonable_encoder(obj_in)

        db_obj = self.model(**obj_in)  # type: ignore
        doc_type = self.model.doc_type()

        new_doc = db.get_collection(doc_type).insert(db_obj)
        return new_doc

    def update(
        self,
        db: ClientSession,
        *,
        db_obj: ModelType,
        obj_in: Union[UpdateSchemaType, Dict[str, Any]]
    ) -> ModelType:
        obj_data = jsonable_encoder(db_obj)
        if isinstance(obj_in, dict):
            update_data = obj_in
        else:
            update_data = obj_in.dict(exclude_unset=True)
        for field in obj_data:
            if field in update_data:
                setattr(db_obj, field, update_data[field])
        db.add(db_obj)
        db.commit()
        db.refresh(db_obj)
        return db_obj

    # def remove(self, db: connect, *, id: int) -> ModelType:
    #     obj = db.query(self.model).get(id)
    #     db.delete(obj)
    #     db.commit()
    #     return obj