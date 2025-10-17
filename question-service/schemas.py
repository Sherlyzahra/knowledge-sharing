from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime
from enum import Enum


class VoteTypeEnum(str, Enum):
    UPVOTE = "upvote"
    DOWNVOTE = "downvote"


class QuestionBase(BaseModel):
    title: str = Field(..., min_length=10, max_length=255)
    content: str = Field(..., min_length=20)


class QuestionCreate(QuestionBase):
    pass


class QuestionUpdate(BaseModel):
    title: Optional[str] = Field(None, min_length=10, max_length=255)
    content: Optional[str] = Field(None, min_length=20)


class QuestionResponse(QuestionBase):
    id: int
    user_id: int
    views: int
    created_at: datetime
    updated_at: datetime
    answer_count: Optional[int] = 0
    vote_count: Optional[int] = 0

    class Config:
        from_attributes = True


class AnswerBase(BaseModel):
    content: str = Field(..., min_length=20)


class AnswerCreate(AnswerBase):
    question_id: int


class AnswerUpdate(BaseModel):
    content: Optional[str] = Field(None, min_length=20)
    is_accepted: Optional[bool] = None


class AnswerResponse(AnswerBase):
    id: int
    question_id: int
    user_id: int
    is_accepted: bool
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class VoteCreate(BaseModel):
    question_id: int
    vote_type: VoteTypeEnum


class VoteResponse(BaseModel):
    id: int
    question_id: int
    user_id: int
    vote_type: VoteTypeEnum
    created_at: datetime

    class Config:
        from_attributes = True


class VoteStats(BaseModel):
    upvotes: int
    downvotes: int
    total: int
