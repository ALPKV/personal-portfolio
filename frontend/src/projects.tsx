import { useCallback, useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import type { Project } from './data'

export type ApiProject = Omit<Project, 'id' | 'tags'> & {
  id: number
  technologies: string[]
}

async function request(path: string, options?: RequestInit) {
  const response = await fetch(`/api/projects${path}`, options)
  if (!response.ok) {
    const body = await response.json().catch(() => null)
    const detail = body?.detail
    throw new Error(typeof detail === 'string' ? detail : `Request failed (${response.status}). Check all fields.`)
  }
  return response.status === 204 ? null : response.json()
}

export function useProjects() {
  const [projects, setProjects] = useState<ApiProject[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)
  const [editing, setEditing] = useState<ApiProject | null>(null)
  const [notice, setNotice] = useState('')
  const [pendingDelete, setPendingDelete] = useState<ApiProject | null>(null)
  const load = useCallback(async () => {
    setError('')
    setLoading(true)
    try { setProjects(await request('')) }
    catch (e) { setError(e instanceof Error ? e.message : 'Unable to load projects.') }
    finally { setLoading(false) }
  }, [])
  useEffect(() => { void load() }, [load])

  async function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const form = event.currentTarget
    const fields = new FormData(form)
    const project = {
      ...editing,
      id: Number(fields.get('id')),
      title: String(fields.get('title')).trim(),
      description: String(fields.get('description')).trim(),
      technologies: String(fields.get('technologies')).split(',').map(t => t.trim()).filter(Boolean),
    }
    setBusy(true); setError(''); setNotice('')
    try {
      const saved: ApiProject = await request(editing ? `/${editing.id}` : '', {
        method: editing ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(project),
      })
      setProjects(current => editing ? current.map(p => p.id === saved.id ? saved : p) : [...current, saved])
      setNotice(editing ? 'Project updated.' : 'Project created.')
      setEditing(null); form.reset()
    } catch (e) { setError(e instanceof Error ? e.message : 'Unable to save project.') }
    finally { setBusy(false) }
  }

  async function edit(id: number) {
    setBusy(true); setError('')
    try {
      setEditing(await request(`/${id}`))
      document.getElementById('project-editor')?.scrollIntoView({ behavior: 'smooth', block: 'center' })
    } catch (e) { setError(e instanceof Error ? e.message : 'Unable to load project.') }
    finally { setBusy(false) }
  }

  async function remove(project: ApiProject) {
    setBusy(true); setError(''); setNotice('')
    try {
      await request(`/${project.id}`, { method: 'DELETE' })
      setProjects(current => current.filter(p => p.id !== project.id))
      if (editing?.id === project.id) setEditing(null)
      setNotice('Project deleted.')
      setPendingDelete(null)
    } catch (e) { setError(e instanceof Error ? e.message : 'Unable to delete project.') }
    finally { setBusy(false) }
  }
  return { projects, loading, error, busy, editing, notice, pendingDelete, load, save, edit,
    remove: (project: ApiProject) => {
      setPendingDelete(project)
      document.getElementById('project-editor')?.scrollIntoView({ behavior: 'smooth', block: 'center' })
    },
    confirmDelete: () => pendingDelete && remove(pendingDelete),
    cancelDelete: () => setPendingDelete(null), cancel: () => setEditing(null) }
}

export function ProjectEditor({ state }: { state: ReturnType<typeof useProjects> }) {
  const { editing, busy, save, cancel } = state
  return <section className="project-manager" id="project-editor" aria-label="Manage projects">
    <div><p className="section-tag">Project studio</p><h2>{editing ? 'Edit project' : 'Add a project'}</h2>
      <p>Create, update, and remove projects. Changes are temporary and reset when the server restarts.</p>
    </div>
    <form key={editing?.id ?? 'new'} onSubmit={save} className="project-form">
      <label>Project ID<input name="id" type="number" min="1" step="1" required readOnly={!!editing} defaultValue={editing?.id ?? ''} /></label>
      <label>Title<input name="title" required pattern=".*\S.*" defaultValue={editing?.title ?? ''} /></label>
      <label className="full">Description<textarea name="description" required defaultValue={editing?.description ?? ''} /></label>
      <label className="full">Technologies, separated by commas<input name="technologies" required defaultValue={editing?.technologies.join(', ') ?? ''} placeholder="Python, React" /></label>
      <div className="project-actions full"><button className="btn btn-primary" disabled={busy}>{busy ? 'Please wait…' : editing ? 'Save changes' : 'Create project'}</button>
      {editing && <button type="button" className="btn btn-ghost" onClick={cancel} disabled={busy}>Cancel</button>}</div>
    </form>
    {state.loading && <p role="status">Loading projects…</p>}
    {state.error && <div role="alert"><p>{state.error}</p><button type="button" onClick={() => void state.load()} disabled={busy}>Retry loading</button></div>}
    {state.notice && <p role="status">{state.notice}</p>}
    {state.pendingDelete && <div role="alert">
      <p>Delete “{state.pendingDelete.title}”?</p>
      <div className="project-actions">
        <button type="button" disabled={busy} onClick={() => void state.confirmDelete()}>Confirm delete</button>
        <button type="button" disabled={busy} onClick={state.cancelDelete}>Keep project</button>
      </div>
    </div>}
  </section>
}
