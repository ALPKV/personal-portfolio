import { useCallback, useEffect, useState } from 'react'
import type { FormEvent } from 'react'

type Comment = { id: string; name: string; message: string; created_at: string; updated_at: string | null }
type Tokens = Record<string, string>
const STORAGE_KEY = 'portfolio-guestbook-ownership'

function readTokens(): Tokens {
  try { return JSON.parse(sessionStorage.getItem(STORAGE_KEY) ?? '{}') }
  catch { return {} }
}

async function request(path = '', options?: RequestInit) {
  const response = await fetch(`/api/comments${path}`, { cache: 'no-store', ...options })
  if (!response.ok) {
    const body = await response.json().catch(() => null)
    throw new Error(typeof body?.detail === 'string' ? body.detail : 'Please check your name and comment, then try again.')
  }
  return response.status === 204 ? null : response.json()
}

export function Guestbook() {
  const [comments, setComments] = useState<Comment[]>([])
  const [tokens, setTokens] = useState<Tokens>(readTokens)
  const [editing, setEditing] = useState<Comment | null>(null)
  const [deleting, setDeleting] = useState<Comment | null>(null)
  const [busy, setBusy] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')

  function remember(next: Tokens) {
    setTokens(next)
    try { sessionStorage.setItem(STORAGE_KEY, JSON.stringify(next)) }
    catch { /* Keep ownership in React state if browser storage is disabled. */ }
  }

  const load = useCallback(async () => {
    setLoading(true); setError('')
    try { setComments(await request()) }
    catch (e) { setError(e instanceof Error ? e.message : 'Unable to load the guestbook.') }
    finally { setLoading(false) }
  }, [])
  useEffect(() => { void load() }, [load])

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const form = event.currentTarget
    const fields = new FormData(form)
    const name = String(fields.get('name')).trim()
    const message = String(fields.get('message')).trim()
    if (!name || !message) { setError('Please enter your name and a comment.'); return }
    setBusy(true); setError(''); setNotice('')
    try {
      if (editing) {
        const updated: Comment = await request(`/${editing.id}`, {
          method: 'PUT', headers: { 'Content-Type': 'application/json', 'X-Comment-Token': tokens[editing.id] },
          body: JSON.stringify({ name, message }),
        })
        setComments(current => current.map(c => c.id === updated.id ? updated : c))
        setNotice('Your comment has been updated.')
      } else {
        const created: Comment & { edit_token: string } = await request('', {
          method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name, message }),
        })
        const { edit_token, ...comment } = created
        remember({ ...tokens, [comment.id]: edit_token })
        setComments(current => [comment, ...current])
        setNotice('Your comment has been added to the temporary guestbook.')
      }
      setEditing(null); form.reset()
    } catch (e) { setError(e instanceof Error ? e.message : 'Unable to save your comment.') }
    finally { setBusy(false) }
  }

  async function remove() {
    if (!deleting) return
    setBusy(true); setError(''); setNotice('')
    try {
      await request(`/${deleting.id}`, { method: 'DELETE', headers: { 'X-Comment-Token': tokens[deleting.id] } })
      setComments(current => current.filter(c => c.id !== deleting.id))
      const next = { ...tokens }; delete next[deleting.id]; remember(next)
      if (editing?.id === deleting.id) setEditing(null)
      setDeleting(null); setNotice('Your comment has been deleted.')
    } catch (e) { setError(e instanceof Error ? e.message : 'Unable to delete your comment.') }
    finally { setBusy(false) }
  }

  function startEdit(comment: Comment) {
    setEditing(comment); setNotice(''); setError('')
    document.getElementById('guestbook-form')?.scrollIntoView({ behavior: 'smooth', block: 'center' })
  }

  return <section id="guestbook" className="guestbook" aria-labelledby="guestbook-title">
    <div className="guestbook-heading">
      <div><p className="section-tag">(04) Guestbook</p><h2 id="guestbook-title" className="section-title">Leave a little hello.</h2></div>
      <p>Feedback, a project idea, or just a wave. I’d love to hear what brought you here.</p>
    </div>
    <div className="guestbook-layout">
      <div className="guestbook-compose">
        <h3>{editing ? 'Edit your comment' : 'Sign the guestbook'}</h3>
        <p id="guestbook-disclosure">Your name and comment will be public. This is a temporary homework demo: comments can disappear when the server restarts. For a private message, <a href="mailto:alekshman@terpmail.umd.edu">email me</a>.</p>
        <form id="guestbook-form" key={editing?.id ?? 'new'} onSubmit={submit} aria-describedby="guestbook-disclosure">
          <label>Your name<input name="name" autoComplete="name" required maxLength={60} defaultValue={editing?.name ?? ''} /></label>
          <label>Your comment<textarea name="message" required maxLength={1000} rows={5} defaultValue={editing?.message ?? ''} placeholder="Say hello…" /></label>
          <div className="project-actions"><button className="btn btn-primary" disabled={busy}>{busy ? 'Saving…' : editing ? 'Save comment' : 'Post comment'}</button>
            {editing && <button type="button" disabled={busy} onClick={() => setEditing(null)}>Cancel edit</button>}</div>
        </form>
        <p className="guestbook-help">You can edit or delete your own comments while this browser tab stays open.</p>
        {notice && <p role="status">{notice}</p>}
        {error && <p role="alert">{error}</p>}
      </div>
      <div className="guestbook-messages">
        <div className="guestbook-list-heading"><h3>Notes from visitors</h3><button type="button" onClick={() => void load()} disabled={busy || loading}>Refresh</button></div>
        {loading && <p role="status">Loading comments…</p>}
        {!loading && !comments.length && <p className="guestbook-empty">A fresh page. Be the first to leave a note.</p>}
        {comments.map(comment => <article key={comment.id} className="guestbook-note">
          <header><strong>{comment.name}</strong><span>{new Date(comment.created_at).toLocaleDateString()}{comment.updated_at ? ' · edited' : ''}</span></header>
          <p>{comment.message}</p>
          {tokens[comment.id] && <div className="project-actions">
            <button type="button" disabled={busy} onClick={() => startEdit(comment)}>Edit your comment</button>
            <button type="button" disabled={busy} onClick={() => setDeleting(comment)}>Delete your comment</button>
          </div>}
          {deleting?.id === comment.id && <div role="alert"><p>Delete your comment?</p><div className="project-actions"><button type="button" disabled={busy} onClick={() => void remove()}>Confirm delete</button><button type="button" disabled={busy} onClick={() => setDeleting(null)}>Keep comment</button></div></div>}
        </article>)}
      </div>
    </div>
  </section>
}
