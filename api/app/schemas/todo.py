from datetime import datetime

from pydantic import BaseModel, Field


class TodoCreate(BaseModel):
    title: str = Field(..., min_length=1, max_length=500)
    description: str | None = None


class TodoUpdate(BaseModel):
    title: str | None = Field(None, min_length=1, max_length=500)
    description: str | None = None
    completed: bool | None = None


class TodoOut(BaseModel):
    model_config = {"from_attributes": True}

    id: int
    title: str
    description: str | None
    completed: bool
    owner_id: int
    created_at: datetime
    updated_at: datetime
