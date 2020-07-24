import { ReactElement, useEffect, memo } from 'react'
import { Hook } from './createStore'
import { arePropsEqual } from './utils'

export interface ExecutorProps<T, U> {
  hook: Hook<T, U>
  hookProps: T
  onChange: (data: U) => void
}

function Executor<T, U>({ hook, hookProps, onChange }: ExecutorProps<T, U>) {
  const result = hook(hookProps)
  useEffect(() => {
    onChange(result)
  })
  return null as ReactElement
}

export default memo(Executor, arePropsEqual)
