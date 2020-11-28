from typing import Optional
from fastapi import Query
from app.core.config import settings


async def common_parameters(
    skip: Optional[int] = Query(settings.DEFAULT_QUERY_SKIP),
    sort: Optional[str] = Query(settings.DEFAULT_QUERY_SORT),
    limit: Optional[int] = Query(settings.DEFAULT_QUERY_LIMIT),
):
    return {"skip": skip, "sort": sort, "limit": limit}
