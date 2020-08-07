import { useContext, useEffect, useRef, useState, Context } from 'react'
import { Store, StorePropsType, StoreValueType } from './types'
import { EMPTY } from './constants'
import { areDepsEqual } from './utils'
import Container from '@/container'
import { Simulate } from 'react-dom/test-utils'
import select = Simulate.select

type Deps<T> = (value: T) => unknown[]

// function useAsyncStore<T extends Record<string, Store<any, any>>, U>(
//   store: T,
//   depFn?: Deps<StoreValueType<T>>
// ): StoreValueType<T>
// function useAsyncStore<T extends Store<any, any>, U>(
//   store: T,
//   depFn?: Deps<StoreValueType<T>>
// ): StoreValueType<T>
function useAsyncStore<
  T extends Store<any, any> | Record<P, Store<any, any>>,
  U,
  P extends string
>(
  store: T,
  options?: {
    depFn?: Deps<StoreValueType<T>>
    selector?: (stores: T) => T[keyof T][]
  }
): StoreValueType<T> {
  if ('Provider' in store && 'Context' in store) {
    const container = useContext(
      (store as Store<StorePropsType<T>, StoreValueType<T>>).Context as Context<
        Container<U> | typeof EMPTY
      >
    )
    if (container === EMPTY) {
      throw Error(
        '`useAsyncStore` should be wrapped in an `AsyncStore.Provider`.'
      )
    }

    const [state, setState] = useState<StoreValueType<T>>(
      container.data as StoreValueType<T>
    )

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
  } else {
    const storesToUse = {} as Record<P, Store<any, any>>
    const selectedStores = options?.selector?.(store) ?? Object.values(store)

    const storeNames = Object.keys(store)
    const storeValues = Object.values(store)

    for (const selectedStore of selectedStores) {
      const index = storeValues.indexOf(selectedStore)
      storesToUse[storeNames[index] as P] = storeValues[index]
    }
  }
}

export default useAsyncStore
