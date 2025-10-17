from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List

from database import get_db, init_db
from models import Blog
from schemas import BlogCreate, BlogResponse, BlogUpdate
from auth_middleware import get_current_user

app = FastAPI(title="Blog Service", version="1.0.0")

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
        "service": "Blog Service",
        "status": "running",
        "version": "1.0.0"
    }


@app.post("/blogs", response_model=BlogResponse, status_code=status.HTTP_201_CREATED)
def create_blog(
    blog_data: BlogCreate,
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db)
):

    new_blog = Blog(
        title=blog_data.title,
        content=blog_data.content,
        summary=blog_data.summary,
        user_id=current_user["id"],
        is_published=blog_data.is_published
    )
    
    db.add(new_blog)
    db.commit()
    db.refresh(new_blog)
    
    return new_blog


@app.get("/blogs", response_model=List[BlogResponse])
def get_blogs(
    skip: int = 0,
    limit: int = 20,
    published_only: bool = True,
    db: Session = Depends(get_db)
):
    """Get all blog articles with pagination"""
    query = db.query(Blog)
    
    if published_only:
        query = query.filter(Blog.is_published == True)
    
    blogs = query.offset(skip).limit(limit).all()
    return blogs


@app.get("/blogs/{blog_id}", response_model=BlogResponse)
def get_blog(blog_id: int, db: Session = Depends(get_db)):
    """Get a specific blog article by ID"""
    blog = db.query(Blog).filter(Blog.id == blog_id).first()
    
    if not blog:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Blog not found"
        )
    
    blog.views += 1
    db.commit()
    db.refresh(blog)
    
    return blog


@app.put("/blogs/{blog_id}", response_model=BlogResponse)
def update_blog(
    blog_id: int,
    blog_data: BlogUpdate,
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Update a blog article (only by the author)"""
    blog = db.query(Blog).filter(Blog.id == blog_id).first()
    
    if not blog:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Blog not found"
        )
    
    if blog.user_id != current_user["id"]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to update this blog"
        )
    
    if blog_data.title is not None:
        blog.title = blog_data.title
    if blog_data.content is not None:
        blog.content = blog_data.content
    if blog_data.summary is not None:
        blog.summary = blog_data.summary
    if blog_data.is_published is not None:
        blog.is_published = blog_data.is_published
    
    db.commit()
    db.refresh(blog)
    
    return blog


@app.delete("/blogs/{blog_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_blog(
    blog_id: int,
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Delete a blog article (only by the author)"""
    blog = db.query(Blog).filter(Blog.id == blog_id).first()
    
    if not blog:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Blog not found"
        )
    
    if blog.user_id != current_user["id"]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to delete this blog"
        )
    
    db.delete(blog)
    db.commit()
    
    return None


@app.get("/blogs/user/{user_id}", response_model=List[BlogResponse])
def get_blogs_by_user(
    user_id: int,
    skip: int = 0,
    limit: int = 20,
    db: Session = Depends(get_db)
):
    """Get all blogs by a specific user"""
    blogs = db.query(Blog).filter(
        Blog.user_id == user_id,
        Blog.is_published == True
    ).offset(skip).limit(limit).all()
    
    return blogs


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8003)
