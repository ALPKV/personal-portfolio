from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, Field

app = FastAPI()

class Project(BaseModel):
    id: int = Field(gt=0)
    title: str = Field(min_length=1)
    description: str = Field(min_length=1)
    technologies: list[str] = Field(min_length=1)

projects: list[Project] = [
    Project(
        id=1,
        title="Personal Portfolio",
        description="My personal website showcasing my work.",
        technologies=["React", "Vite"],
    ),
    Project(
        id=2,
        title="Projects API",
        description="A backend API for managing portfolio projects.",
        technologies=["Python", "FastAPI"],
    ),
]

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

