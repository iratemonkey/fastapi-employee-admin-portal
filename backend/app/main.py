from fastapi import FastAPI
from mangum import Mangum
from fastapi.middleware.cors import CORSMiddleware

from app.api.api_v1.api import router as api_router
from app.core.config import settings

app = FastAPI(title=settings.PROJECT_NAME)

# Set all CORS enabled origins
if settings.ALLOWED_CORS_ORIGINS:
    app.add_middleware(
        CORSMiddleware,
        allow_origins=[str(origin) for origin in settings.ALLOWED_CORS_ORIGINS],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )


app.include_router(api_router, prefix=settings.API_V1_STR)
handler = Mangum(app)
