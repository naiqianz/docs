import { debounce } from 'lodash-es'
import axios from 'axios'
import { shallowRef, computed, watch } from 'vue'

type AsyncFunc = (...args: any[]) => Promise<any>

export enum StatusValue {
  Unset = 'unset',
  Initing = 'initing',
  Resolved = 'resolved',
  Rejected = 'rejected',
  Reloading = 'reloading',
}

class Status {
  static Unset = new Status(StatusValue.Unset)
  static Initing = new Status(StatusValue.Initing)
  static Resolved = new Status(StatusValue.Resolved)
  static Rejected = new Status(StatusValue.Rejected)
  static Reloading = new Status(StatusValue.Reloading)

  value: StatusValue

  constructor(value: StatusValue) {
    this.value = value
  }

  toString(): string {
    return this.value
  }

  isUnset(): boolean {
    return this.value === StatusValue.Unset
  }

  initing(): boolean {
    return this.value === StatusValue.Initing
  }

  isResolved(): boolean {
    return this.value === StatusValue.Resolved
  }

  reloading(): boolean {
    return this.value === StatusValue.Reloading
  }

  hasData(): boolean {
    switch (this.value) {
      case StatusValue.Resolved:
      case StatusValue.Reloading:
        return true
    }
    return false
  }
}

export interface Options {
  debounce?: number
}

export function usePromise(fn: AsyncFunc, options?: Options) {
  const result = shallowRef<any>()
  const error = shallowRef<any>()
  const status = shallowRef<Status>(Status.Unset)

  const pending = computed((): boolean => {
    switch (status.value) {
      case Status.Initing:
      case Status.Reloading:
        return true
    }
    return false
  })

  let id = 0

  let promised = (...args: any[]): Promise<any> => {
    switch (status.value) {
      case Status.Unset:
        status.value = Status.Initing
        break
      case Status.Resolved:
        status.value = Status.Reloading
        break
    }

    let promise: Promise<any>

    id++
    ;(function (localID: number) {
      promise = fn(...args)
      promise.then(
        (res: any) => {
          if (localID === id) {
            resolve(res)
          }
        },
        (err: any) => {
          if (localID === id) {
            reject(err)
          }
          return err
        },
      )
    })(id)

    return promise
  }

  let resolve = (res: any): void => {
    result.value = res
    error.value = undefined
    status.value = Status.Resolved
  }

  let reject = (err: any): void => {
    if (err === null || axios.isCancel(err)) {
      status.value = result.value !== undefined ? Status.Resolved : Status.Unset
      return
    }

    if (err === undefined) {
      result.value = undefined
      error.value = undefined
      status.value = Status.Unset
      return
    }

    result.value = undefined
    error.value = err
    status.value = Status.Rejected
  }

  let cancel = (): void => {
    id++
  }

  if (options && options.debounce) {
    const debounced = debounce(promised, options.debounce)

    const oldCancel = cancel
    cancel = () => {
      oldCancel()
      debounced.cancel()
    }

    const oldResolve = resolve
    const oldReject = reject

    promised = (...args: any[]): Promise<any> => {
      debounced(...args)
      return new Promise((promiseResolve, promiseReject) => {
        resolve = (res: any): void => {
          oldResolve(res)
          promiseResolve(res)
        }
        reject = (err: any): void => {
          oldReject(err)
          promiseReject(err)
        }
      })
    }
  }

  const errorMessage = computed(() => {
    if (!error.value) {
      return ''
    }
    const msg = error.value.response?.data?.message
    if (msg) {
      return asString(msg)
    }
    return asString(error.value)
  })

  return {
    status,
    pending,

    promised,
    result,
    error,
    errorMessage,

    cancel,
  }
}

function asString(s: string | Error): string {
  if (typeof s === 'string') {
    return sentence(s)
  }

  if (s.message) {
    return sentence(s.message)
  }
  return ''
}

export function sentence(s: string): string {
  if (!s) {
    return ''
  }
  return s.charAt(0).toUpperCase() + s.substring(1)
}
