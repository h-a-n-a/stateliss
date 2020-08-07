import { useContext, useEffect, useRef, useState } from 'react'
import { Store, StoreValueType } from './types'
import { EMPTY } from './constants'
import { areDepsEqual } from './utils'

type Deps<T> = (value: T) => unknown[]

function useStore<T extends Store<any, any>, U>(
  store: T,
  depFn?: Deps<StoreValueType<T>>
) {
  const container = useContext(store.Context)
  if (container === EMPTY) {
    throw Error('`useStore` should be wrapped in a `Store.Provider`.')
  }

  const [state, setState] = useState<StoreValueType<T>>(container.data)
  const oldDepsRef = useRef<unknown[]>([])

  useEffect(() => {
    const subscriber = () => {
      if (!depFn) {
        setState(container.data)
      } else {
        const oldDeps = oldDepsRef.current
        const newDeps = depFn(container.data)
        if (!areDepsEqual(oldDeps, newDeps)) setState(container.data)
        oldDepsRef.current = newDeps
      }
    }
    container.subscribers.add(subscriber)
    return () => {
      container.subscribers.delete(subscriber)
    }
  }, [])

  return state
}

export default useStore
