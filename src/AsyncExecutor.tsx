import { memo, useState, useEffect, ReactElement, useRef } from 'react'

import { AsyncFn } from './types'
import { arePropsEqual } from './utils'

export interface AsyncExecutorProps<T, U> {
  asyncFn: AsyncFn<T, U>
  defaultAsyncParams: T
  onChange: (value: AsyncData<T, U>) => void
}

export interface AsyncData<T, U = unknown> {
  data: U
  loading: boolean
  error: any
  refresh: () => void
  run: (params?: T) => void
}

function AsyncExecutor<T, U>({
  asyncFn,
  defaultAsyncParams,
  onChange
}: AsyncExecutorProps<T, U>) {
  const [data, setData] = useState<U>()
  const [error, setError] = useState()
  const [loading, setLoading] = useState<boolean>(false)

  const [refreshFlag, setRefreshFlag] = useState({})
  const initialized = useRef(false)
  const paramsRef = useRef<T>(defaultAsyncParams)
  console.log('defaultAsyncParams', defaultAsyncParams)

  const resetStatus = () => {
    setLoading(false)
    setData(undefined)
    setError(undefined)
  }

  const refresh = () => {
    setRefreshFlag({})
  }

  const run = (params?: T) => {
    console.log('params', params)
    paramsRef.current = params ?? defaultAsyncParams
    refresh()
  }

  useEffect(() => {
    if (!initialized.current) {
      initialized.current = true
      return
    }

    resetStatus()
    setLoading(true)
    asyncFn(paramsRef.current)
      .then((res) => {
        setData(res)
      })
      .catch((err) => {
        setError(err)
      })
      .finally(() => {
        setLoading(false)
      })

    return () => {
      setLoading(false)
    }
  }, [refreshFlag])

  useEffect(() => {
    onChange({
      loading,
      data,
      error,
      refresh,
      run
    })
  }, [error, loading, data])

  return null as ReactElement
}

export default memo(AsyncExecutor, arePropsEqual)
