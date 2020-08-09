import { useContext, useEffect, useRef, useState } from 'react'

import {
  ComposedStore,
  Store,
  StoreValueType,
  ComposedKeyType,
  ComposedValueType
} from './types'
import { EMPTY } from './constants'
import { areDepsEqual, isStore, isComposedStore } from './utils'

type Deps<T> = (value: T) => unknown[]

function useAsyncStore<
  T extends Store<any, any> | ComposedStore<any, any, any>
>(
  store: T,
  options?: {
    depFn?: Deps<StoreValueType<T>>
    selector?: (stores: T) => T[keyof T][]
  }
): StoreValueType<T> | ComposedValueType<T> {
  if (isStore(store)) {
    const container = useContext(store.Context)
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
  } else if (isComposedStore(store)) {
    const storesToUse = {} as typeof store
    const selectedStores = options?.selector?.(store) ?? Object.values(store)

    const storeNames = Object.keys(store)
    const storeValues = Object.values(store)

    for (const selectedStore of selectedStores) {
      const index = storeValues.indexOf(selectedStore)
      storesToUse[storeNames[index] as ComposedKeyType<T>] = storeValues[index]
    }
  }
}

export default useAsyncStore
