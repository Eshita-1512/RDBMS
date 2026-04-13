from pydantic import BaseModel
from typing import Optional


class CategoryCreate(BaseModel):
    category_name: str
    description: Optional[str] = None


class CategoryUpdate(BaseModel):
    category_name: Optional[str] = None
    description: Optional[str] = None


class CategoryResponse(CategoryCreate):
    category_id: int
    model_config = {"from_attributes": True}
