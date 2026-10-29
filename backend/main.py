from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
import json
from pathlib import Path

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_methods=["GET", "POST", "PUT", "DELETE"],
    allow_headers=["Content-Type"],
)

class Project(BaseModel):
    id: int = Field(gt=0)
    title: str = Field(min_length=1)
    description: str = Field(min_length=1)
    technologies: list[str] = Field(min_length=1)
    tagline: str = ""
    credit: str = ""
    links: list[dict[str, str]] = Field(default_factory=list)
    art: str = "bot"
    accent: str = "#e8102e"

# Seeded once per process; changes intentionally remain in memory.
projects = [Project(**item) for item in json.loads(
    Path(__file__).with_name("projects.json").read_text(encoding="utf-8")
)]

@app.get("/")
def main():
    return {"message": "Hello World"}

@app.get("/projects")
def get_projects():
    return projects

@app.get("/projects/{project_id}")
def get_project(project_id: int):
    for project in projects:
        if project.id == project_id:
            return project
    raise HTTPException(status_code=404, detail="Project not found")

@app.post("/projects", status_code=201)
def create_project(project: Project):
    for existing_project in projects:
        if existing_project.id == project.id:
            raise HTTPException(status_code=409, detail="Project ID already exists",)
    projects.append(project)
    return project

@app.put("/projects/{project_id}")
def update_project(project_id: int, updated_project: Project):
    if updated_project.id != project_id:
        raise HTTPException(status_code=400, detail="Body ID must match the URL ID")
    for project in projects:
        if project.id == project_id:
            project.title = updated_project.title
            project.description = updated_project.description
            project.technologies = updated_project.technologies
            return project
    raise HTTPException(status_code=404, detail="Project not found")

@app.delete("/projects/{project_id}", status_code=204)
def delete_project(project_id: int):
    for project in projects:
        if project.id == project_id:
            projects.remove(project)
            return
    raise HTTPException(status_code=404, detail="Project not found")
