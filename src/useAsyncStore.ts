import { useContext, useEffect, useRef, useState } from 'react'

import {
  Store,
  ComposedStore,
  StoreValueType,
  ComposedValueType,
  ComposedKeyToContextType,
  ComposedKeyValueType
} from './types'
import { AsyncData } from './AsyncExecutor'
import Container from './container'
import { EMPTY } from './constants'
import { areDepsEqual, isStore, isComposedStore } from './utils'

type Deps<T> = (value: T) => unknown[]

function useAsyncStore<T extends Store<any, any>>(
  store: T,
  options?: {
    depFn?: Deps<StoreValueType<T>>
  }
): StoreValueType<T>
function useAsyncStore<T extends ComposedStore<any, any>>(
  store: T,
  options?: {
    depFn?: Deps<ComposedKeyValueType<T>>
  }
): ComposedKeyValueType<T>
function useAsyncStore<T extends Store<any, any> | ComposedStore<any, any>>(
  store: T,
  options?: {
    depFn?: Deps<StoreValueType<T> | ComposedKeyValueType<T>>
  }
): StoreValueType<T> | ComposedKeyValueType<T> {
  if (isStore(store)) {
    const container = useContext(store.Context)

    if (container === EMPTY) {
      throw Error(
        '`useAsyncStore` should be wrapped in an `AsyncStore.Provider`.'
      )
    }

    const [state, setState] = useState<StoreValueType<T>>(container.data)
    const oldDepsRef = useRef<unknown[]>([])

    useEffect(() => {
      const subscriber = () => {
        if (!options?.depFn) {
          setState(container.data as StoreValueType<T>)
        } else {
          const oldDeps = oldDepsRef.current
          const newDeps = options?.depFn(container.data as StoreValueType<T>)
          if (!areDepsEqual(oldDeps, newDeps))
            setState(container.data as StoreValueType<T>)
          oldDepsRef.current = newDeps
        }
      }
      container.subscribers.add(subscriber)
      return () => {
        container.subscribers.delete(subscriber)
      }
    }, [])

    return state
  } else if (isComposedStore(store)) {
    const { keyToContext } = store

    const containers = {} as Record<string, Container<any>>
    for (const storeKey in keyToContext) {
      const container = useContext(keyToContext[storeKey]) as
        | Container<any>
        | typeof EMPTY
      if (container === EMPTY) {
        throw Error(
          '`useAsyncStore` should be wrapped in an `AsyncStore.Provider`.'
        )
      }
      containers[storeKey] = container
    }

    const getData = () => {
      const data = {} as any
      for (const containerKey in containers) {
        data[containerKey] = containers[containerKey].data
      }
      return data
    }

    const [state, setState] = useState<ComposedValueType<T>>(getData())
    const oldDepsRef = useRef<unknown[]>([])

    useEffect(() => {
      const subscriber = () => {
        const data = getData()

        if (!options?.depFn) {
          setState(data)
        } else {
          const oldDeps = oldDepsRef.current
          const newDeps = options?.depFn(data)
          if (!areDepsEqual(oldDeps, newDeps)) setState(data)
          oldDepsRef.current = newDeps
        }
      }

      Object.values(containers).forEach((item) =>
        item.subscribers.add(subscriber)
      )
      return () => {
        Object.values(containers).forEach((item) =>
          item.subscribers.delete(subscriber)
        )
      }
    }, [])

    return state
  }
}

export default useAsyncStore
