from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime


class BlogBase(BaseModel):
    title: str = Field(..., min_length=5, max_length=255)
    content: str = Field(..., min_length=50)
    summary: Optional[str] = Field(None, max_length=500)
    is_published: Optional[bool] = True


class BlogCreate(BlogBase):
    pass


class BlogUpdate(BaseModel):
    title: Optional[str] = Field(None, min_length=5, max_length=255)
    content: Optional[str] = Field(None, min_length=50)
    summary: Optional[str] = Field(None, max_length=500)
    is_published: Optional[bool] = None


class BlogResponse(BlogBase):
    id: int
    user_id: int
    views: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
