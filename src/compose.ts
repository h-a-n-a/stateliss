import { AsyncFn } from './types'

function compose<T extends Record<string, AsyncFn<any, any>>>(
  ...asyncStores: T[]
): T {
  return asyncStores.reduce((stores, currentStore) => {
    return {
      ...stores,
      ...currentStore
    }
  }, {} as T)
}

export default compose
