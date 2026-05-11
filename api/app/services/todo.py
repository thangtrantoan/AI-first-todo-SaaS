from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.todo import Todo
from app.schemas.todo import TodoCreate, TodoUpdate


async def get_todos(db: AsyncSession, owner_id: int) -> list[Todo]:
    result = await db.execute(
        select(Todo).where(Todo.owner_id == owner_id).order_by(Todo.created_at.desc())
    )
    return list(result.scalars().all())


async def get_todo(db: AsyncSession, todo_id: int, owner_id: int) -> Todo | None:
    result = await db.execute(
        select(Todo).where(Todo.id == todo_id, Todo.owner_id == owner_id)
    )
    return result.scalar_one_or_none()


async def create_todo(db: AsyncSession, data: TodoCreate, owner_id: int) -> Todo:
    todo = Todo(**data.model_dump(), owner_id=owner_id)
    db.add(todo)
    await db.commit()
    await db.refresh(todo)
    return todo


async def update_todo(db: AsyncSession, todo: Todo, data: TodoUpdate) -> Todo:
    for field, value in data.model_dump(exclude_unset=True).items():
        setattr(todo, field, value)
    await db.commit()
    await db.refresh(todo)
    return todo


async def delete_todo(db: AsyncSession, todo: Todo) -> None:
    await db.delete(todo)
    await db.commit()
