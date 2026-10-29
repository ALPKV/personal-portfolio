# Aathyanth Lekshman — Personal portfolio

React/Vite frontend connected to a FastAPI backend. Projects are read-only. A public guestbook demonstrates CRUD without allowing visitors to modify portfolio content.

## Run locally

In one terminal:

```powershell
cd backend
uv run fastapi dev
```

In another:

```powershell
cd frontend
bun install
bun run dev
```

Open the URL printed by Vite. Its proxy forwards `/api/*` to FastAPI on port 8000.

## Guestbook endpoints

| Method | Local backend path | Behavior |
| --- | --- | --- |
| GET | /comments | List public comments, without ownership tokens |
| POST | /comments | Create a comment; return 201 and a private edit token |
| PUT | /comments/{comment_id} | Update the creator's comment |
| DELETE | /comments/{comment_id} | Delete the creator's comment; return 204 |

PUT and DELETE require the `X-Comment-Token` header returned when the comment was created. Only a token hash is kept on the server. The browser keeps its own tokens in session storage; these are never included in public responses or URLs. Other visitors cannot edit/delete that comment. This is a small capability-token demo, not a full account system or moderation platform.

Names and messages are trimmed and length-validated. Invalid bodies return 422, unauthorized mutations return 403, and missing comments return 404. The guestbook is bounded to 100 comments per process.

GET `/projects` and GET `/projects/{project_id}` serve real portfolio content from `backend/projects.json`. POST, PUT, and DELETE for projects are intentionally disabled.

On Vercel, add `/api` before these endpoint paths.

## Temporary data

Comments remain in memory only, with no database or email delivery. A server restart or another serverless instance can yield a different or empty guestbook. Ownership tokens stay in the current browser tab's session. The form explicitly tells visitors their name/comment will be public and temporary. Use the email link for private contact.

## Verification

```powershell
backend/.venv/Scripts/python.exe -m unittest backend.test_guestbook -v
npm --prefix frontend run build
```

Tests cover guestbook CRUD, private ownership tokens, forbidden mutations, validation, missing IDs, and read-only projects.

## Homework recording

1. Show the projects loaded from the API and scroll to Guestbook.
2. Post a comment using the form.
3. Edit your comment and save it.
4. Delete your comment and confirm.
5. Refresh the comment list to demonstrate GET.

Vercel uses the root `vercel.json` to build the Vite frontend and Python API in one project.
