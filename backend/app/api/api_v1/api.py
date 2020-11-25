from fastapi import APIRouter

from .endpoints import users, login, employees

router = APIRouter()
router.include_router(login.router, prefix="/login", tags=["Login"])

# Authenticated Routes
router.include_router(users.router, prefix="/users", tags=["Users"])
router.include_router(employees.router, prefix="/employees", tags=["Employees"])
