from pydantic import BaseModel
from typing import Optional


class RoleCreate(BaseModel):
    role_name: str
    description: Optional[str] = None


class RoleUpdate(BaseModel):
    role_name: Optional[str] = None
    description: Optional[str] = None


class RoleResponse(RoleCreate):
    role_id: int
    model_config = {"from_attributes": True}
