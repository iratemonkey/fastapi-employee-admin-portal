from pymongo import MongoClient
from app.core.config import settings


class MongoDBCLient:
    def __init__(self):
        self.client = MongoClient(settings.MONGO_DB_URI, uuidRepresentation="standard")
        self.db = self.client[settings.MONGO_DB_NAME]

    def get_db(self):
        return self.db

    def get_collection(self, collection: str):
        return self.db[collection]

    def close(self):
        return self.client.close()
