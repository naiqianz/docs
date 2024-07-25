import { defineComponent, shallowRef, computed, watch, proxyRefs } from 'vue'

import { useAxios } from '@/use/axios.ts'
import { useWatchAxios } from '@/use/watch-axios.ts'

export interface User {
  id: number
  name: string
}

export interface Project {
  id: number
  name: string

  orgId: number
  orgName: string
  canAdmin: boolean
  canInvite: boolean
  ownerId: number

  lastSpanAt: string | null
  lastMetricAt: string | null

  createdAt: string
}

export type UseUser = ReturnType<typeof useUser>

export function useUser() {
  const { status, loading, data, request } = useAxios()

  const user = computed((): User => {
    return data.value?.user ?? { id: 0, name: 'Guest' }
  })

  const projects = computed((): Project[] => {
    if (user.value.id === 0) {
      return []
    }
    return data.value?.projects ?? []
  })

  reload()

  function reload() {
    request({
      url: 'https://api2.uptrace.dev/internal/v1/users/current',
    })
  }

  return proxyRefs({ status, loading, projects, reload })
}

export function useProjectPicker() {
  const user = useUser()
  const activeProject = shallowRef<Project>()

  const { data, loading, reload } = useWatchAxios(() => {
    if (!activeProject.value) {
      return
    }
    return {
      url: `https://api2.uptrace.dev/internal/v1/projects/${activeProject.value.id}/tokens`,
    }
  })

  const projects = computed(() => {
    return user.projects
  })

  const tokens = computed(() => {
    return data.value?.tokens ?? []
  })

  const dsn = computed(() => {
    if (tokens.value.length) {
      const tok = tokens.value[0]
      return tok.dsn
    }
    return formatDsn('project_id', 'token')
  })

  watch(projects, (projects) => {
    if (projects.length) {
      activeProject.value = projects[0]
    }
  })

  return { loading, projects, activeProject, dsn }
}

function formatDsn(projectId: string, token: string): string {
  return `https://${token}@api.uptrace.dev/${projectId}`
}
