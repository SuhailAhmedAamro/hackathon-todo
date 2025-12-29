"""
Task CRUD API endpoints with authentication and database.

Implements @specs/features/task-crud.md with user isolation:
- GET /api/tasks - List user's tasks with filters
- POST /api/tasks - Create new task
- GET /api/tasks/{id} - Get specific task
- PUT /api/tasks/{id} - Update task
- DELETE /api/tasks/{id} - Delete task
- PATCH /api/tasks/{id}/complete - Toggle task completion
"""
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlmodel.ext.asyncio.session import AsyncSession
from sqlmodel import select, or_, and_, func
from sqlalchemy import desc, asc
from typing import Annotated, Optional, List
from uuid import UUID
from datetime import datetime

from src.database import get_session
from src.models.user import User
from src.models.task import Task, StatusEnum, PriorityEnum
from src.models.tag import Tag, TaskTag
from src.schemas.task import TaskCreate, TaskUpdate, TaskResponse, TaskWithTags, TagInResponse
from src.schemas.tag import AssignTagRequest
from src.schemas.common import MessageResponse, PaginatedResponse
from src.auth.dependencies import get_current_active_user


router = APIRouter(prefix="/api/tasks", tags=["Tasks"])


@router.get("", response_model=PaginatedResponse[TaskResponse])
async def list_tasks(
    current_user: Annotated[User, Depends(get_current_active_user)],
    session: AsyncSession = Depends(get_session),
    # Filters
    status_filter: Optional[StatusEnum] = Query(None, alias="status", description="Filter by status"),
    priority: Optional[PriorityEnum] = Query(None, description="Filter by priority"),
    search: Optional[str] = Query(None, description="Search in title and description (case-insensitive)"),
    tag_ids: Optional[List[str]] = Query(None, description="Filter by tag IDs (any match)"),
    date_from: Optional[datetime] = Query(None, description="Filter tasks with due_date >= this date"),
    date_to: Optional[datetime] = Query(None, description="Filter tasks with due_date <= this date"),
    # Sorting
    sort_by: Optional[str] = Query("created_at", description="Sort by field (created_at, due_date, priority, title, status)"),
    sort_order: Optional[str] = Query("desc", description="Sort order (asc, desc)"),
    # Pagination
    page: int = Query(1, ge=1, description="Page number (starts at 1)"),
    limit: int = Query(20, ge=1, le=100, description="Items per page (max 100)"),
) -> PaginatedResponse[TaskResponse]:
    """
    List all tasks for the current user with advanced filtering, search, and pagination.

    **Filters:**
    - status: pending, in_progress, completed
    - priority: low, medium, high
    - search: Full-text search on title and description
    - tag_ids: Filter by tag IDs (matches tasks with ANY of the specified tags)
    - date_from: Tasks with due_date >= this date
    - date_to: Tasks with due_date <= this date

    **Sorting:**
    - sort_by: created_at (default), due_date, priority, title, status
    - sort_order: desc (default), asc

    **Pagination:**
    - page: Page number (starts at 1, default: 1)
    - limit: Items per page (default: 20, max: 100)

    All filters can be combined. Tasks are automatically filtered by current user's ID.

    **Returns:**
    Paginated response with metadata:
    - items: List of tasks
    - total: Total number of tasks (after filtering)
    - page: Current page number
    - limit: Items per page
    - total_pages: Total number of pages

    **Examples:**
    - `/api/tasks?search=urgent&status=pending&page=1&limit=20`
    - `/api/tasks?tag_ids=uuid1&tag_ids=uuid2&page=2`
    - `/api/tasks?date_from=2025-01-01&date_to=2025-12-31&sort_by=due_date&sort_order=asc`
    - `/api/tasks?limit=50&page=1`
    """
    # Base query - filter by user
    statement = select(Task).where(Task.user_id == current_user.id)

    # Apply status filter
    if status_filter:
        statement = statement.where(Task.status == status_filter)

    # Apply priority filter
    if priority:
        statement = statement.where(Task.priority == priority)

    # Apply search filter (case-insensitive, searches title and description)
    if search:
        search_term = f"%{search}%"
        statement = statement.where(
            or_(
                Task.title.ilike(search_term),
                Task.description.ilike(search_term)
            )
        )

    # Apply tag filter (tasks with ANY of the specified tags)
    if tag_ids:
        # Join with TaskTag to filter by tags
        statement = statement.join(TaskTag).where(
            TaskTag.tag_id.in_([UUID(tag_id) for tag_id in tag_ids])
        ).distinct()

    # Apply date range filters
    if date_from:
        statement = statement.where(Task.due_date >= date_from)
    if date_to:
        statement = statement.where(Task.due_date <= date_to)

    # Apply sorting
    sort_column = Task.created_at  # default
    if sort_by == "due_date":
        sort_column = Task.due_date
    elif sort_by == "priority":
        # Custom priority sorting: high -> medium -> low
        # We'll handle this after fetching
        pass
    elif sort_by == "title":
        sort_column = Task.title
    elif sort_by == "status":
        sort_column = Task.status
    elif sort_by == "created_at":
        sort_column = Task.created_at

    # Apply sort order
    if sort_by != "priority":
        if sort_order == "asc":
            statement = statement.order_by(asc(sort_column))
        else:
            statement = statement.order_by(desc(sort_column))
    else:
        # For priority, we'll sort in Python after fetching
        pass

    # Count total items (before pagination)
    count_statement = select(func.count()).select_from(statement.alias())
    total_result = await session.execute(count_statement)
    total = total_result.scalar() or 0

    # Apply pagination
    offset = (page - 1) * limit
    statement = statement.offset(offset).limit(limit)

    # Execute query
    result = await session.execute(statement)
    tasks = result.scalars().all()

    # Custom priority sorting if needed (only for current page)
    if sort_by == "priority":
        priority_order = {"high": 0, "medium": 1, "low": 2}
        tasks = sorted(
            tasks,
            key=lambda t: priority_order.get(t.priority, 999),
            reverse=(sort_order == "desc")
        )

    # Calculate total pages
    total_pages = (total + limit - 1) // limit if total > 0 else 0

    # Return paginated response
    return PaginatedResponse(
        items=[TaskResponse.model_validate(task) for task in tasks],
        total=total,
        page=page,
        limit=limit,
        total_pages=total_pages
    )


@router.post("", response_model=TaskResponse, status_code=status.HTTP_201_CREATED)
async def create_task(
    task_data: TaskCreate,
    current_user: Annotated[User, Depends(get_current_active_user)],
    session: AsyncSession = Depends(get_session),
) -> TaskResponse:
    """
    Create a new task for the current user.

    Required: title
    Optional: description, priority, due_date

    Task is automatically assigned to current user.
    Status defaults to 'pending'.
    """
    # Create task with user_id
    task = Task(
        user_id=current_user.id,
        title=task_data.title,
        description=task_data.description,
        priority=task_data.priority,
        due_date=task_data.due_date,
        status=StatusEnum.PENDING
    )

    session.add(task)
    await session.commit()
    await session.refresh(task)

    return TaskResponse.model_validate(task)


@router.get("/{task_id}", response_model=TaskResponse)
async def get_task(
    task_id: UUID,
    current_user: Annotated[User, Depends(get_current_active_user)],
    session: AsyncSession = Depends(get_session),
) -> TaskResponse:
    """
    Get a specific task by ID.

    Requires: Task must belong to current user.

    Raises:
        HTTPException 404: Task not found
        HTTPException 403: Task belongs to another user
    """
    # Get task from database
    statement = select(Task).where(Task.id == task_id)
    result = await session.execute(statement)
    task = result.scalar_one_or_none()

    if not task:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Task not found"
        )

    # Verify user owns this task
    if task.user_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to access this task"
        )

    return TaskResponse.model_validate(task)


@router.put("/{task_id}", response_model=TaskResponse)
async def update_task(
    task_id: UUID,
    task_data: TaskUpdate,
    current_user: Annotated[User, Depends(get_current_active_user)],
    session: AsyncSession = Depends(get_session),
) -> TaskResponse:
    """
    Update a task.

    All fields are optional.
    Only provided fields will be updated.

    Requires: Task must belong to current user.

    Raises:
        HTTPException 404: Task not found
        HTTPException 403: Task belongs to another user
    """
    # Get task from database
    statement = select(Task).where(Task.id == task_id)
    result = await session.execute(statement)
    task = result.scalar_one_or_none()

    if not task:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Task not found"
        )

    # Verify user owns this task
    if task.user_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to update this task"
        )

    # Update fields (only if provided)
    update_data = task_data.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(task, field, value)

    # Update timestamp
    task.update_timestamp()

    await session.commit()
    await session.refresh(task)

    return TaskResponse.model_validate(task)


@router.delete("/{task_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_task(
    task_id: UUID,
    current_user: Annotated[User, Depends(get_current_active_user)],
    session: AsyncSession = Depends(get_session),
) -> None:
    """
    Delete a task.

    Requires: Task must belong to current user.

    Raises:
        HTTPException 404: Task not found
        HTTPException 403: Task belongs to another user
    """
    # Get task from database
    statement = select(Task).where(Task.id == task_id)
    result = await session.execute(statement)
    task = result.scalar_one_or_none()

    if not task:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Task not found"
        )

    # Verify user owns this task
    if task.user_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to delete this task"
        )

    # Delete task
    await session.delete(task)
    await session.commit()

    return None


@router.patch("/{task_id}/complete", response_model=TaskResponse)
async def toggle_task_completion(
    task_id: UUID,
    current_user: Annotated[User, Depends(get_current_active_user)],
    session: AsyncSession = Depends(get_session),
) -> TaskResponse:
    """
    Toggle task completion status.

    If task is completed: marks as incomplete (pending)
    If task is not completed: marks as completed

    Updates completed_at timestamp accordingly.

    Requires: Task must belong to current user.

    Raises:
        HTTPException 404: Task not found
        HTTPException 403: Task belongs to another user
    """
    # Get task from database
    statement = select(Task).where(Task.id == task_id)
    result = await session.execute(statement)
    task = result.scalar_one_or_none()

    if not task:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Task not found"
        )

    # Verify user owns this task
    if task.user_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to update this task"
        )

    # Toggle completion
    if task.status == StatusEnum.COMPLETED:
        task.mark_incomplete()
    else:
        task.mark_completed()

    await session.commit()
    await session.refresh(task)

    return TaskResponse.model_validate(task)


# ============================================================================
# TAG ASSIGNMENT ENDPOINTS
# ============================================================================

@router.post("/{task_id}/tags", response_model=TaskWithTags, status_code=status.HTTP_200_OK)
async def assign_tag_to_task(
    task_id: UUID,
    tag_request: AssignTagRequest,
    current_user: Annotated[User, Depends(get_current_active_user)],
    session: AsyncSession = Depends(get_session),
) -> TaskWithTags:
    """
    Assign a tag to a task.

    Creates a relationship between task and tag in the task_tags junction table.
    If tag is already assigned, returns success (idempotent).

    Requires:
    - Task must belong to current user
    - Tag must belong to current user

    Raises:
        HTTPException 404: Task or tag not found
        HTTPException 403: Task or tag belongs to another user
    """
    # Get task from database
    statement = select(Task).where(Task.id == task_id)
    result = await session.execute(statement)
    task = result.scalar_one_or_none()

    if not task:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Task not found"
        )

    # Verify user owns this task
    if task.user_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to modify this task"
        )

    # Get tag from database
    statement = select(Tag).where(Tag.id == tag_request.tag_id)
    result = await session.execute(statement)
    tag = result.scalar_one_or_none()

    if not tag:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Tag not found"
        )

    # Verify user owns this tag
    if tag.user_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to use this tag"
        )

    # Check if tag is already assigned (idempotent)
    statement = select(TaskTag).where(
        TaskTag.task_id == task_id,
        TaskTag.tag_id == tag_request.tag_id
    )
    result = await session.execute(statement)
    existing = result.scalar_one_or_none()

    if not existing:
        # Create task-tag relationship
        task_tag = TaskTag(task_id=task_id, tag_id=tag_request.tag_id)
        session.add(task_tag)
        await session.commit()

    # Return task with all tags
    return await get_task_with_tags(task_id, session)


@router.delete("/{task_id}/tags/{tag_id}", status_code=status.HTTP_204_NO_CONTENT)
async def remove_tag_from_task(
    task_id: UUID,
    tag_id: UUID,
    current_user: Annotated[User, Depends(get_current_active_user)],
    session: AsyncSession = Depends(get_session),
) -> None:
    """
    Remove a tag from a task.

    Deletes the relationship between task and tag.
    If tag is not assigned, returns success (idempotent).

    Requires:
    - Task must belong to current user

    Raises:
        HTTPException 404: Task not found
        HTTPException 403: Task belongs to another user
    """
    # Get task from database
    statement = select(Task).where(Task.id == task_id)
    result = await session.execute(statement)
    task = result.scalar_one_or_none()

    if not task:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Task not found"
        )

    # Verify user owns this task
    if task.user_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to modify this task"
        )

    # Find and delete task-tag relationship
    statement = select(TaskTag).where(
        TaskTag.task_id == task_id,
        TaskTag.tag_id == tag_id
    )
    result = await session.execute(statement)
    task_tag = result.scalar_one_or_none()

    if task_tag:
        await session.delete(task_tag)
        await session.commit()

    return None


@router.get("/{task_id}/tags", response_model=List[TagInResponse])
async def get_task_tags(
    task_id: UUID,
    current_user: Annotated[User, Depends(get_current_active_user)],
    session: AsyncSession = Depends(get_session),
) -> List[TagInResponse]:
    """
    Get all tags assigned to a task.

    Requires: Task must belong to current user.

    Raises:
        HTTPException 404: Task not found
        HTTPException 403: Task belongs to another user
    """
    # Get task from database
    statement = select(Task).where(Task.id == task_id)
    result = await session.execute(statement)
    task = result.scalar_one_or_none()

    if not task:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Task not found"
        )

    # Verify user owns this task
    if task.user_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to access this task"
        )

    # Get tags for this task
    statement = select(Tag).join(TaskTag).where(TaskTag.task_id == task_id)
    result = await session.execute(statement)
    tags = result.scalars().all()

    return [TagInResponse.model_validate(tag) for tag in tags]


# ============================================================================
# HELPER FUNCTIONS
# ============================================================================

async def get_task_with_tags(task_id: UUID, session: AsyncSession) -> TaskWithTags:
    """
    Helper function to get a task with all its tags loaded.

    Args:
        task_id: Task UUID
        session: Database session

    Returns:
        TaskWithTags with tags populated
    """
    # Get task
    statement = select(Task).where(Task.id == task_id)
    result = await session.execute(statement)
    task = result.scalar_one()

    # Get tags for this task
    statement = select(Tag).join(TaskTag).where(TaskTag.task_id == task_id)
    result = await session.execute(statement)
    tags = result.scalars().all()

    # Convert to TaskWithTags
    task_dict = TaskResponse.model_validate(task).model_dump()
    task_dict["tags"] = [TagInResponse.model_validate(tag) for tag in tags]

    return TaskWithTags(**task_dict)
