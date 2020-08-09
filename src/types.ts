import { FC, Context } from 'react'

import Container from './container'
import { EMPTY } from './constants'

export type ContextType<T> = Context<Container<T> | typeof EMPTY>

export type Store<T, U> = {
  Provider: FC<T>
  Context: ContextType<U>
}

export interface ComposedStoreProps<T> {
  providerProps: T
}

export type ComposedStore<T, U, P extends string> = {
  Provider: FC<ComposedStoreProps<T>>
  keyToContext: Record<P, ContextType<U>>
}

export type StorePropsType<T> = T extends Store<infer Props, any>
  ? Props
  : unknown

export type StoreValueType<T> = T extends Store<any, infer Value>
  ? Value
  : unknown

export type ComposedPropsType<T> = T extends ComposedStore<
  infer Props,
  any,
  any
>
  ? Props
  : unknown

export type ComposedValueType<T> = T extends ComposedStore<
  any,
  infer Value,
  any
>
  ? Value
  : unknown

export type ComposedContextType<T> = T extends {
  Provider: any
  keyToContext: infer Context
}
  ? Context
  : unknown

export type ComposedKeyType<T> = T extends ComposedStore<any, any, infer Key>
  ? Key
  : unknown
