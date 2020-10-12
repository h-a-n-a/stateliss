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
import {
  Store,
  AsyncFn,
  AsyncFnPropsType,
  AsyncFnDataType,
  ComposedStore,
  ComposedAsyncFnPropsType,
  ContextType,
  ComposedAsyncFnDataType,
  ContextTypes
} from './types'
import { composeComponents, isAsyncFunction, isAsyncFunctions } from './utils'

function createAsyncStore<T extends AsyncFn<any, any>>(
  asyncFn: T
): Store<
  AsyncFnPropsType<T>,
  AsyncData<AsyncFnPropsType<T>, AsyncFnDataType<T>>
>
function createAsyncStore<T extends Record<string, AsyncFn<any, any>>>(
  asyncFn: T
): ComposedStore<
  ComposedAsyncFnPropsType<T>,
  ContextTypes<ComposedAsyncFnDataType<T>>
>
function createAsyncStore<
  T extends AsyncFn<any, any> | Record<string, AsyncFn<any, any>>
>(asyncFn: T): any {
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

  function createStores<R extends Record<string, AsyncFn<any, any>>>(
    asyncFns: R
  ) {
    const stores: {
      name: keyof R
      store: ReturnType<typeof createStore>
    }[] = []

    for (const asyncFnName in asyncFns) {
      if (!asyncFns.hasOwnProperty(asyncFnName)) continue
      stores.push({
        name: asyncFnName,
        store: createStore(asyncFns[asyncFnName])
      })
    }

    const Provider: FC<ComposedAsyncFnPropsType<R>> = ({ children }) => {
      const providers = stores.reduce((provider, currentComponent) => {
        return provider.concat({
          component: currentComponent.store.Provider,
          props: currentComponent.name ?? {}
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
        {} as {
          [K in keyof R]: ContextType<
            AsyncData<ComposedAsyncFnPropsType<K>, ComposedAsyncFnDataType<K>>
          >
        }
      )
    }
  }

  function createStore(
    asyncFn: AsyncFn<AsyncFnPropsType<T>, AsyncFnDataType<T>>
  ) {
    const Ctx = createContext<
      | Container<AsyncData<AsyncFnPropsType<T>, AsyncFnDataType<T>>>
      | typeof EMPTY
    >(EMPTY)

    const Provider: FC<T> = (props) => {
      const containerRef = useRef(
        new Container<AsyncData<AsyncFnPropsType<T>, AsyncFnDataType<T>>>()
      )
      const container = containerRef.current

      const [hasExecutorMounted, setHasExecutorMounted] = useState(false)
      const onChange = useCallback(
        (data: AsyncData<AsyncFnPropsType<T>, AsyncFnDataType<T>>) => {
          if (!hasExecutorMounted) setHasExecutorMounted(true)
          container.data = data
          container.notify()
        },
        []
      )

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
