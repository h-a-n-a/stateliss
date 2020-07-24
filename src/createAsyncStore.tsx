import React, {
  FC,
  useRef,
  useState,
  useCallback,
  createContext,
  PropsWithChildren
} from 'react'
import Container from './container'
import AsyncExecutor, { AsyncData } from './AsyncExecutor'
import { EMPTY } from './constants'
import { Store } from './types'

export type AsyncFn<T extends Record<string, any>, U> = (props: T) => Promise<U>

function createAsyncStore<T, U>(
  asyncFn: AsyncFn<T, U>
): Store<T, AsyncData<T, U>> {
  const Ctx = createContext<Container<AsyncData<T, U>> | typeof EMPTY>(EMPTY)

  const Provider: FC<PropsWithChildren<T>> = (props) => {
    const containerRef = useRef(new Container<AsyncData<T, U>>())
    const container = containerRef.current

    const [hasExecutorMounted, setHasExecutorMounted] = useState(false)
    const onChange = useCallback((data: AsyncData<T, U>) => {
      if (!hasExecutorMounted) setHasExecutorMounted(true)
      container.data = data
      container.notify()
    }, [])

    return (
      <Ctx.Provider value={container}>
        <AsyncExecutor
          asyncFn={asyncFn}
          defaultAsyncParams={props}
          onChange={onChange}
        />
        {hasExecutorMounted && props.children}
      </Ctx.Provider>
    )
  }

  return {
    Provider,
    Context: Ctx
  }
}

export default createAsyncStore
