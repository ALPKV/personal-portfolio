# Personal portfolio — Week 6

React/Vite frontend connected to a FastAPI backend. Project content is loaded from the API, with create, edit, and delete controls in the Project studio.

## Local development

In one terminal:

```powershell
cd backend
uv run fastapi dev
```

In another terminal:

```powershell
cd frontend
bun install
bun run dev
```

Vite forwards `/api/*` requests to the backend on port 8000. Open the frontend URL printed by Vite.

## Endpoints

| Method | Local backend path | Behavior |
| --- | --- | --- |
| GET | /projects | List projects |
| GET | /projects/{project_id} | Read one project |
| POST | /projects | Create; duplicate ID returns 409 |
| PUT | /projects/{project_id} | Update; body ID must match URL ID |
| DELETE | /projects/{project_id} | Delete; returns 204 |

Invalid bodies return 422; missing projects return 404. On Vercel, prefix these paths with `/api`.

## Data and hosting

`backend/projects.json` contains the real portfolio projects used to initialize each backend process. All mutations remain in memory, with no database. Restarting or scaling a serverless instance resets its data; changes are not durable or shared across instances. This deployment is an educational CRUD demo, and its editing endpoints are public.

Vercel deploys from the repository root using `vercel.json`: a static Vite build plus a Python function wrapping the existing backend. No paid services or database are configured.

## Quick demonstration

1. Load the page and show projects retrieved from the backend.
2. Create a project with an unused positive ID, title, description, and comma-separated technologies.
3. Click Edit on its card, change the title, and save.
4. Click Delete on that card, then Confirm delete in the Project studio.
