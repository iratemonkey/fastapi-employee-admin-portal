from fastapi import APIRouter

from .endpoints import users, auth, employees

router = APIRouter()
router.include_router(auth.router, prefix="/auth", tags=["Auth"])

# Authenticated Routes
router.include_router(users.router, prefix="/users", tags=["Users"])
router.include_router(employees.router, prefix="/employees", tags=["Employees"])
