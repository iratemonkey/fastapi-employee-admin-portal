from typing import List, Dict, Optional, Any
from fastapi import APIRouter, HTTPException, Query, Depends
from pymongo.client_session import ClientSession


from app.db.temp_data import EMPLOYEES
from app import schemas, crud, models
from app.core.config import settings
from app.api import deps

router = APIRouter()


async def common_parameters(
    skip: Optional[int] = Query(0),
    sort: Optional[int] = Query(0),
    limit: Optional[int] = Query(15),
):
    return {"skip": skip, "sort": sort, "limit": limit}


@router.get("/", response_model=List[schemas.EmployeeOut])
def read_users(
    db: ClientSession = Depends(deps.get_db),
    skip: int = 0,
    limit: int = 100,
    current_user: models.User = Depends(deps.get_current_active_superuser),
) -> Any:
    """
    Retrieve Employees.
    """
    employees = crud.employee.get_multi(db, skip=skip, limit=limit)
    return employees


@router.get("/{employee_id}", response_model=schemas.EmployeeOut, status_code=200)
async def read_employee(employee_id):
    employee = [x for x in EMPLOYEES if employee_id == x["_id"]]
    if employee:
        return employee
    else:
        raise HTTPException(status_code=404, detail="Employee Not Found")


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
    user = crud.employee.get_by_email(db, email=employee_in.email)
    if user:
        raise HTTPException(
            status_code=400,
            detail="The user with this username already exists in the system.",
        )
    employee = crud.employee.create(db, obj_in=employee_in)
    return employee
