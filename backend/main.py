"""Portfolio read endpoints and an in-memory guestbook for Week 6."""
import hashlib
import json
import secrets
from datetime import datetime, timezone
from pathlib import Path
from threading import Lock
from typing import Annotated
from uuid import uuid4

from fastapi import FastAPI, Header, HTTPException, Response
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, ConfigDict, Field

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_methods=["GET", "POST", "PUT", "DELETE"],
    allow_headers=["Content-Type", "X-Comment-Token"],
)

class Project(BaseModel):
    id: int = Field(gt=0)
    title: str
    description: str
    technologies: list[str]
    tagline: str = ""
    credit: str = ""
    links: list[dict[str, str]] = Field(default_factory=list)
    art: str = "bot"
    accent: str = "#e8102e"

projects = [Project(**item) for item in json.loads(
    Path(__file__).with_name("projects.json").read_text(encoding="utf-8")
)]

class CommentInput(BaseModel):
    model_config = ConfigDict(str_strip_whitespace=True, extra="forbid")
    name: str = Field(min_length=1, max_length=60)
    message: str = Field(min_length=1, max_length=1000)

class Comment(CommentInput):
    id: str
    created_at: str
    updated_at: str | None = None

class CreatedComment(Comment):
    # Returned only to the creator, never in public list responses.
    edit_token: str

comments: dict[str, Comment] = {}
comment_token_hashes: dict[str, str] = {}
comment_lock = Lock()

def require_owner(comment_id: str, token: str | None):
    if comment_id not in comments:
        raise HTTPException(status_code=404, detail="Comment not found")
    digest = hashlib.sha256((token or "").encode()).hexdigest()
    if not token or not secrets.compare_digest(digest, comment_token_hashes[comment_id]):
        raise HTTPException(status_code=403, detail="You can only change comments created in this browser session")

@app.get("/")
def main():
    return {"message": "Portfolio API"}

@app.get("/projects")
def get_projects():
    return projects

@app.get("/projects/{project_id}")
def get_project(project_id: int):
    for project in projects:
        if project.id == project_id:
            return project
    raise HTTPException(status_code=404, detail="Project not found")

@app.get("/comments", response_model=list[Comment])
def get_comments(response: Response):
    response.headers["Cache-Control"] = "no-store"
    with comment_lock:
        return list(reversed(list(comments.values())))

@app.post("/comments", status_code=201, response_model=CreatedComment)
def create_comment(body: CommentInput, response: Response):
    response.headers["Cache-Control"] = "no-store"
    with comment_lock:
        if len(comments) >= 100:
            raise HTTPException(status_code=503, detail="This temporary demo guestbook is full")
        comment_id = str(uuid4())
        token = secrets.token_urlsafe(32)
        comment = Comment(**body.model_dump(), id=comment_id, created_at=datetime.now(timezone.utc).isoformat())
        comments[comment_id] = comment
        comment_token_hashes[comment_id] = hashlib.sha256(token.encode()).hexdigest()
        return CreatedComment(**comment.model_dump(), edit_token=token)

@app.put("/comments/{comment_id}", response_model=Comment)
def update_comment(comment_id: str, body: CommentInput, response: Response,
                   x_comment_token: Annotated[str | None, Header()] = None):
    response.headers["Cache-Control"] = "no-store"
    with comment_lock:
        require_owner(comment_id, x_comment_token)
        original = comments[comment_id]
        updated = Comment(**body.model_dump(), id=comment_id, created_at=original.created_at,
                          updated_at=datetime.now(timezone.utc).isoformat())
        comments[comment_id] = updated
        return updated

@app.delete("/comments/{comment_id}", status_code=204)
def delete_comment(comment_id: str, x_comment_token: Annotated[str | None, Header()] = None):
    with comment_lock:
        require_owner(comment_id, x_comment_token)
        del comments[comment_id]
        del comment_token_hashes[comment_id]
    return Response(status_code=204)
