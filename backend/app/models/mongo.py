import uuid
from uuid import UUID
from datetime import datetime
from pydantic import BaseModel, BaseConfig
from bson import ObjectId, errors


class OID(str):
    @classmethod
    def __get_validators__(cls):
        yield cls.validate

    @classmethod
    def validate(cls, v):
        try:
            return ObjectId(str(v))
        except errors.InvalidId:
            raise ValueError("Not a valid ObjectId")


class MongoModel(BaseModel):
    @classmethod
    def from_mongo(cls, data: dict):
        """We must convert _id into "id". """
        if not data:
            return data

        id = data.pop("_id", None)
        return cls(**dict(data, id=str(id)))

    def mongo(self, **kwargs):
        exclude_unset = kwargs.pop("exclude_unset", True)
        by_alias = kwargs.pop("by_alias", True)

        parsed = self.dict(
            exclude_unset=exclude_unset,
            by_alias=by_alias,
            **kwargs,
        )

        # Mongo uses `_id` as default key. We should stick to that as well.
        if "_id" not in parsed and "id" in parsed:
            parsed["_id"] = parsed.pop("id")

        return parsed
