import { computed, proxyRefs } from 'vue'
import { useWatchAxios } from '@/use/watch-axios.ts'

export function useUptraceBinary() {
  const { data } = useWatchAxios(() => {
    return {
      url: `https://api.github.com/repos/uptrace/uptrace/releases/latest`,
    }
  })

  const version = computed(() => {
    return data.value?.tag_name.slice(1) ?? '1.0.0'
  })

  const rpmVersion = computed(() => {
    return version.value.replace('-', '_')
  })

  return proxyRefs({ version, rpmVersion })
}
