from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import List

from database import get_db, init_db
from models import Question, Answer, Vote, VoteType
from schemas import (
    QuestionCreate, QuestionResponse, QuestionUpdate,
    AnswerCreate, AnswerResponse, AnswerUpdate,
    VoteCreate, VoteResponse, VoteStats
)
from auth_middleware import get_current_user

app = FastAPI(title="Question Service", version="1.0.0")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def read_root():
    """Health check endpoint"""
    return {
        "service": "Question Service",
        "status": "running",
        "version": "1.0.0"
    }


@app.post("/questions", response_model=QuestionResponse, status_code=status.HTTP_201_CREATED)
def create_question(
    question_data: QuestionCreate,
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db)
):
 
    new_question = Question(
        title=question_data.title,
        content=question_data.content,
        user_id=current_user["id"]
    )
    
    db.add(new_question)
    db.commit()
    db.refresh(new_question)
    
    return {
        **new_question.__dict__,
        "answer_count": 0,
        "vote_count": 0
    }


@app.get("/questions", response_model=List[QuestionResponse])
def get_questions(
    skip: int = 0,
    limit: int = 20,
    db: Session = Depends(get_db)
):
    """Get all questions with pagination"""
    questions = db.query(Question).offset(skip).limit(limit).all()
    
    result = []
    for question in questions:
        answer_count = db.query(Answer).filter(Answer.question_id == question.id).count()
        vote_count = db.query(Vote).filter(Vote.question_id == question.id).count()
        
        result.append({
            **question.__dict__,
            "answer_count": answer_count,
            "vote_count": vote_count
        })
    
    return result


@app.get("/questions/{question_id}", response_model=QuestionResponse)
def get_question(question_id: int, db: Session = Depends(get_db)):
    """Get a specific question by ID"""
    question = db.query(Question).filter(Question.id == question_id).first()
    
    if not question:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Question not found"
        )
    
    # Increment view count
    question.views += 1
    db.commit()
    
    answer_count = db.query(Answer).filter(Answer.question_id == question.id).count()
    vote_count = db.query(Vote).filter(Vote.question_id == question.id).count()
    
    return {
        **question.__dict__,
        "answer_count": answer_count,
        "vote_count": vote_count
    }


@app.put("/questions/{question_id}", response_model=QuestionResponse)
def update_question(
    question_id: int,
    question_data: QuestionUpdate,
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Update a question (only by the author)"""
    question = db.query(Question).filter(Question.id == question_id).first()
    
    if not question:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Question not found"
        )
    
    if question.user_id != current_user["id"]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to update this question"
        )
    
    if question_data.title is not None:
        question.title = question_data.title
    if question_data.content is not None:
        question.content = question_data.content
    
    db.commit()
    db.refresh(question)
    
    answer_count = db.query(Answer).filter(Answer.question_id == question.id).count()
    vote_count = db.query(Vote).filter(Vote.question_id == question.id).count()
    
    return {
        **question.__dict__,
        "answer_count": answer_count,
        "vote_count": vote_count
    }


@app.delete("/questions/{question_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_question(
    question_id: int,
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Delete a question (only by the author)"""
    question = db.query(Question).filter(Question.id == question_id).first()
    
    if not question:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Question not found"
        )
    
    if question.user_id != current_user["id"]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to delete this question"
        )
    
    db.delete(question)
    db.commit()
    
    return None


@app.post("/answers", response_model=AnswerResponse, status_code=status.HTTP_201_CREATED)
def create_answer(
    answer_data: AnswerCreate,
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # Verify question exists
    question = db.query(Question).filter(Question.id == answer_data.question_id).first()
    if not question:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Question not found"
        )
    
    new_answer = Answer(
        content=answer_data.content,
        question_id=answer_data.question_id,
        user_id=current_user["id"]
    )
    
    db.add(new_answer)
    db.commit()
    db.refresh(new_answer)
    
    return new_answer


@app.get("/answers/question/{question_id}", response_model=List[AnswerResponse])
def get_answers_by_question(question_id: int, db: Session = Depends(get_db)):
    """Get all answers for a specific question"""
    answers = db.query(Answer).filter(Answer.question_id == question_id).all()
    return answers

@app.post("/votes", response_model=VoteResponse, status_code=status.HTTP_201_CREATED)
def create_vote(
    vote_data: VoteCreate,
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    
    # Verify question exists
    question = db.query(Question).filter(Question.id == vote_data.question_id).first()
    if not question:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Question not found"
        )
    
    # Check if user already voted
    existing_vote = db.query(Vote).filter(
        Vote.question_id == vote_data.question_id,
        Vote.user_id == current_user["id"]
    ).first()
    
    if existing_vote:
        # Update existing vote
        existing_vote.vote_type = VoteType(vote_data.vote_type.value)
        db.commit()
        db.refresh(existing_vote)
        return existing_vote
    
    # Create new vote
    new_vote = Vote(
        question_id=vote_data.question_id,
        user_id=current_user["id"],
        vote_type=VoteType(vote_data.vote_type.value)
    )
    
    db.add(new_vote)
    db.commit()
    db.refresh(new_vote)
    
    return new_vote


@app.get("/votes/question/{question_id}/stats", response_model=VoteStats)
def get_vote_stats(question_id: int, db: Session = Depends(get_db)):
    """Get vote statistics for a question"""
    upvotes = db.query(Vote).filter(
        Vote.question_id == question_id,
        Vote.vote_type == VoteType.UPVOTE
    ).count()
    
    downvotes = db.query(Vote).filter(
        Vote.question_id == question_id,
        Vote.vote_type == VoteType.DOWNVOTE
    ).count()
    
    return {
        "upvotes": upvotes,
        "downvotes": downvotes,
        "total": upvotes - downvotes
    }


@app.delete("/votes/{vote_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_vote(
    vote_id: int,
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Delete a vote (only by the voter)"""
    vote = db.query(Vote).filter(Vote.id == vote_id).first()
    
    if not vote:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Vote not found"
        )
    
    if vote.user_id != current_user["id"]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to delete this vote"
        )
    
    db.delete(vote)
    db.commit()
    
    return None


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8002)
