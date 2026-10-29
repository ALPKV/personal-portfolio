"""Expose the existing FastAPI application under /api on Vercel."""
from fastapi import FastAPI
from backend.main import app as backend_app

app = FastAPI()
app.mount("/api", backend_app)
