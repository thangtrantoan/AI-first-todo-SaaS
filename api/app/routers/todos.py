from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.dependencies import get_current_user
from app.models.user import User
from app.schemas.todo import TodoCreate, TodoOut, TodoUpdate
from app.services.todo import create_todo, delete_todo, get_todo, get_todos, update_todo

router = APIRouter(prefix="/todos", tags=["todos"])


@router.get("/", response_model=list[TodoOut])
async def list_todos(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return await get_todos(db, current_user.id)


@router.post("/", response_model=TodoOut, status_code=status.HTTP_201_CREATED)
async def create(
    payload: TodoCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return await create_todo(db, payload, current_user.id)


@router.patch("/{todo_id}", response_model=TodoOut)
async def update(
    todo_id: int,
    payload: TodoUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    todo = await get_todo(db, todo_id, current_user.id)
    if not todo:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Todo not found")
    return await update_todo(db, todo, payload)


@router.delete("/{todo_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete(
    todo_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    todo = await get_todo(db, todo_id, current_user.id)
    if not todo:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Todo not found")
    await delete_todo(db, todo)
