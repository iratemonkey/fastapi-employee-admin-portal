from pydantic import Field
from app.models.mongo import OID


class Base:
    id: OID = Field()
    __name__: str

    # Generate __collectionname__ automatically
    def __collectionname__(cls) -> str:
        return cls.__name__.lower()
