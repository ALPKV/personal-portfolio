import { useCallback, useEffect, useState } from 'react'
import type { Project } from './data'

export type ApiProject = Omit<Project, 'id' | 'tags'> & {
  id: number
  technologies: string[]
}

export function useProjects() {
  const [projects, setProjects] = useState<ApiProject[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const load = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const response = await fetch('/api/projects')
      if (!response.ok) throw new Error('Unable to load projects. Please try again.')
      setProjects(await response.json())
    } catch (e) { setError(e instanceof Error ? e.message : 'Unable to load projects.') }
    finally { setLoading(false) }
  }, [])
  useEffect(() => { void load() }, [load])
  return { projects, loading, error, load }
}
