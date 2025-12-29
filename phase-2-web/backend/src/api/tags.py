"""
Tags API endpoints with authentication.

Implements tag system for task categorization:
- GET /api/tags - List user's tags
- POST /api/tags - Create new tag
- GET /api/tags/{id} - Get specific tag
- PUT /api/tags/{id} - Update tag
- DELETE /api/tags/{id} - Delete tag
"""
from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel.ext.asyncio.session import AsyncSession
from sqlmodel import select
from typing import Annotated, List
from uuid import UUID

from src.database import get_session
from src.models.user import User
from src.models.tag import Tag, TaskTag
from src.schemas.tag import TagCreate, TagUpdate, TagResponse
from src.auth.dependencies import get_current_active_user


router = APIRouter(prefix="/api/tags", tags=["Tags"])


@router.get("", response_model=List[TagResponse])
async def list_tags(
    current_user: Annotated[User, Depends(get_current_active_user)],
    session: AsyncSession = Depends(get_session),
) -> List[TagResponse]:
    """
    List all tags for the current user.

    Tags are automatically filtered by current user's ID.
    Returns tags sorted by name (alphabetically).
    """
    # Query user's tags
    statement = select(Tag).where(Tag.user_id == current_user.id).order_by(Tag.name)
    result = await session.execute(statement)
    tags = result.scalars().all()

    return [TagResponse.model_validate(tag) for tag in tags]


@router.post("", response_model=TagResponse, status_code=status.HTTP_201_CREATED)
async def create_tag(
    tag_data: TagCreate,
    current_user: Annotated[User, Depends(get_current_active_user)],
    session: AsyncSession = Depends(get_session),
) -> TagResponse:
    """
    Create a new tag for the current user.

    Required: name
    Optional: color (defaults to #3B82F6 - blue)

    Tag names must be unique per user.

    Raises:
        HTTPException 400: If tag name already exists for this user
    """
    # Check if tag name already exists for this user
    statement = select(Tag).where(
        Tag.user_id == current_user.id,
        Tag.name == tag_data.name
    )
    result = await session.execute(statement)
    existing_tag = result.scalar_one_or_none()

    if existing_tag:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Tag with name '{tag_data.name}' already exists"
        )

    # Create new tag
    tag = Tag(
        user_id=current_user.id,
        name=tag_data.name,
        color=tag_data.color
    )

    session.add(tag)
    await session.commit()
    await session.refresh(tag)

    return TagResponse.model_validate(tag)


@router.get("/{tag_id}", response_model=TagResponse)
async def get_tag(
    tag_id: UUID,
    current_user: Annotated[User, Depends(get_current_active_user)],
    session: AsyncSession = Depends(get_session),
) -> TagResponse:
    """
    Get a specific tag by ID.

    Requires: Tag must belong to current user.

    Raises:
        HTTPException 404: Tag not found
        HTTPException 403: Tag belongs to another user
    """
    # Get tag from database
    statement = select(Tag).where(Tag.id == tag_id)
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
            detail="Not authorized to access this tag"
        )

    return TagResponse.model_validate(tag)


@router.put("/{tag_id}", response_model=TagResponse)
async def update_tag(
    tag_id: UUID,
    tag_data: TagUpdate,
    current_user: Annotated[User, Depends(get_current_active_user)],
    session: AsyncSession = Depends(get_session),
) -> TagResponse:
    """
    Update a tag.

    All fields are optional.
    Only provided fields will be updated.

    Requires: Tag must belong to current user.

    Raises:
        HTTPException 404: Tag not found
        HTTPException 403: Tag belongs to another user
        HTTPException 400: Tag name already exists
    """
    # Get tag from database
    statement = select(Tag).where(Tag.id == tag_id)
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
            detail="Not authorized to update this tag"
        )

    # Check for duplicate name if name is being updated
    if tag_data.name and tag_data.name != tag.name:
        statement = select(Tag).where(
            Tag.user_id == current_user.id,
            Tag.name == tag_data.name
        )
        result = await session.execute(statement)
        existing_tag = result.scalar_one_or_none()

        if existing_tag:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Tag with name '{tag_data.name}' already exists"
            )

    # Update fields (only if provided)
    update_data = tag_data.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(tag, field, value)

    await session.commit()
    await session.refresh(tag)

    return TagResponse.model_validate(tag)


@router.delete("/{tag_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_tag(
    tag_id: UUID,
    current_user: Annotated[User, Depends(get_current_active_user)],
    session: AsyncSession = Depends(get_session),
) -> None:
    """
    Delete a tag.

    This will also remove the tag from all tasks that have it assigned.
    (Cascade delete handled by database foreign key constraint)

    Requires: Tag must belong to current user.

    Raises:
        HTTPException 404: Tag not found
        HTTPException 403: Tag belongs to another user
    """
    # Get tag from database
    statement = select(Tag).where(Tag.id == tag_id)
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
            detail="Not authorized to delete this tag"
        )

    # Delete tag (cascade will remove from task_tags junction table)
    await session.delete(tag)
    await session.commit()

    return None
