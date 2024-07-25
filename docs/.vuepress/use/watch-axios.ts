import { watch } from 'vue'

import { useAxios, AxiosOptions } from '@/use/axios'
import {
  useWatchAxiosConfig,
  AxiosRequestSource,
  AxiosWatchOptions as BaseAxiosWatchOptions,
  AxiosRequestConfig,
} from '@/use/watch-axios-config'

export type { AxiosRequestSource, AxiosRequestConfig }

export interface AxiosWatchOptions extends BaseAxiosWatchOptions, AxiosOptions {
  once?: boolean
}

export function useWatchAxios(source: AxiosRequestSource, options: AxiosWatchOptions = {}) {
  options.immediate = true
  options.flush = 'pre'
  if (options.debounce === undefined) {
    options.debounce = 1
  }
  if (options.notEqual === undefined) {
    options.notEqual = true
  }

  const {
    status,
    loading,
    data,
    error,
    errorMessage,

    request,
  } = useAxios({ debounce: options.debounce })

  const { reload, abort, stopWatch } = useWatchAxiosConfig(
    source,
    (config, oldConfig, onInvalidate, abortCtrl) => {
      return request(config!, abortCtrl)
    },
    options,
  )

  if (options.once) {
    const stopSelf = watch(status, (status) => {
      if (status.isResolved()) {
        stopWatch()
        stopSelf()
      }
    })
  }

  return {
    status,
    loading,

    data,
    error,
    errorMessage,

    abort,
    reload,
  }
}
