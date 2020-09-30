import React, {
  FC,
  useRef,
  Context,
  useState,
  useCallback,
  createContext
} from 'react'

import Container from './container'
import AsyncExecutor, { AsyncData } from './AsyncExecutor'
import { EMPTY } from './constants'
import { Store, ComposedStore, ComposedStoreProps, ContextType } from './types'
import { composeComponents, isAsyncFunction, isAsyncFunctions } from './utils'

export type AsyncFn<T extends Record<string, any>, U> = (props: T) => Promise<U>

function createAsyncStore<T, U, P extends string>(
  asyncFn: AsyncFn<T, U>
): Store<T, AsyncData<T, U>>
function createAsyncStore<T, U, P extends string>(
  asyncFn: Record<P, AsyncFn<T, U>>
): ComposedStore<Record<P, T>, AsyncData<T, U>, P>
function createAsyncStore<T, U, P extends string>(
  asyncFn: AsyncFn<T, U> | Record<P, AsyncFn<T, U>>
): Store<T, AsyncData<T, U>> | ComposedStore<Record<P, T>, AsyncData<T, U>, P> {
  if (isAsyncFunction(asyncFn)) {
    return createStore(asyncFn)
  } else if (isAsyncFunctions(asyncFn)) {
    if ('Provider' in asyncFn || `Context` in asyncFn) {
      throw new Error(
        '`Provider` or `Context` is a pre-defined keyword in unshaped. You may use other property name instead.'
      )
    }
    // { Provider: <NestedProviders>{children}</NestedProviders>, Context: [Context1, Context2, Context3] }
    return createStores(asyncFn)
  }

  function createStores(asyncFns: Record<P, AsyncFn<T, U>>) {
    const stores: { name: P; store: ReturnType<typeof createStore> }[] = []

    for (const asyncFnName in asyncFns) {
      if (!asyncFns.hasOwnProperty(asyncFnName)) continue
      stores.push({
        name: asyncFnName,
        store: createStore(asyncFns[asyncFnName])
      })
    }

    const Provider: FC<ComposedStoreProps<Record<P, T>>> = ({
      providerProps,
      children
    }) => {
      const providers = stores.reduce((provider, currentComponent) => {
        return provider.concat({
          component: currentComponent.store.Provider,
          props: providerProps?.[currentComponent.name] ?? {}
        })
      }, [])
      return composeComponents(providers, children)
    }

    return {
      Provider,
      keyToContext: stores.reduce(
        (components, currentComponent) => ({
          ...components,
          [currentComponent.name]: currentComponent.store.Context
        }),
        {} as Record<P, ContextType<AsyncData<T, U>>>
      )
    }
  }

  function createStore(asyncFn: AsyncFn<T, U>) {
    const Ctx = createContext<Container<AsyncData<T, U>> | typeof EMPTY>(EMPTY)

    const Provider: FC<T> = (props) => {
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
}

export default createAsyncStore
