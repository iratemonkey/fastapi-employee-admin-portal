from typing import List, Dict, Optional, Any
from fastapi import APIRouter, HTTPException, Depends
from pymongo.client_session import ClientSession

from app import schemas, crud, models
from app.core.config import settings
from app.api import deps
from .utils import common_parameters

router = APIRouter()


@router.get("/", response_model=List[schemas.EmployeeOut])
def read_employees(
    db: ClientSession = Depends(deps.get_db),
    commons: dict = Depends(common_parameters),
    details: Optional[str] = None,
    current_user: models.User = Depends(deps.get_current_active_user),
) -> Any:
    """
    Retrieve Employees.
    """
    employees = crud.employee.get_multi(db, query=details, **commons)
    return employees


@router.get("/{employee_id}", response_model=schemas.EmployeeOut, status_code=200)
async def read_employee(employee_id):
    return "Need to build this out"


@router.post("/", response_model=schemas.EmployeeOut)
def create_employee(
    *,
    db: ClientSession = Depends(deps.get_db),
    employee_in: schemas.EmployeeCreate,
    current_user: models.Employee = Depends(deps.get_current_active_superuser),
) -> Any:
    """
    Create new employee.
    """
    doc = crud.employee.get_by_email(db, email=employee_in.email)
    if doc:
        raise HTTPException(
            status_code=400,
            detail="The employee with this email already exists in the system.",
        )
    employee = crud.employee.create(db, obj_in=employee_in)
    return employee
