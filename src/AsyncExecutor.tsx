import { memo, useState, useEffect, ReactElement, useRef } from 'react'

import { AsyncFn } from './createAsyncStore'
import { arePropsEqual } from './utils'

export interface AsyncExecutorProps<T, U> {
  asyncFn: AsyncFn<T, U>
  defaultAsyncParams: T
  onChange: (value: AsyncData<T, U>) => void
}

export interface AsyncData<T, U = unknown> {
  data: U
  loading: boolean
  isFulfilled: boolean
  isRejected: boolean
  refresh: () => void
  run: (params: T) => void
}

function AsyncExecutor<T, U>({
  asyncFn,
  defaultAsyncParams,
  onChange
}: AsyncExecutorProps<T, U>) {
  const [result, setResult] = useState<U>()
  const [loading, setLoading] = useState<boolean>(false)
  const [isFulfilled, setIsFulfilled] = useState<boolean>(false)
  const [isRejected, setIsRejected] = useState<boolean>(false)

  const [refreshFlag, setRefreshFlag] = useState({})
  const [asyncParams, setAsyncParams] = useState<T>()
  const initialized = useRef(false)

  const resetStatus = () => {
    setLoading(false)
    setIsFulfilled(false)
    setIsRejected(false)
  }

  const refresh = () => {
    setRefreshFlag({})
  }

  const run = (params: T) => {
    setAsyncParams(params)
  }

  useEffect(() => {
    if (!initialized.current) {
      initialized.current = true
      return
    }

    resetStatus()
    setLoading(true)
    asyncFn({ ...defaultAsyncParams, ...asyncParams })
      .then((res) => {
        setResult(res)
        setIsFulfilled(true)
      })
      .catch((err) => {
        setResult(err)
        setIsFulfilled(true)
      })
      .finally(() => {
        setLoading(false)
      })

    return () => {
      setLoading(false)
    }
  }, [defaultAsyncParams, asyncParams, refreshFlag])

  useEffect(() => {
    onChange({
      isRejected,
      isFulfilled,
      loading,
      data: result,
      refresh,
      run
    })
  }, [isRejected, isFulfilled, loading, result])

  return null as ReactElement
}

export default memo(AsyncExecutor, arePropsEqual)
