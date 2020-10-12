import { FC, Context } from 'react'

import Container from './container'
import { EMPTY } from './constants'

export type ContextType<T> = Context<Container<T> | typeof EMPTY>

export type ContextTypes<T> = {
  [K in keyof T]: ContextType<T[K]>
}

export type Store<T, U> = {
  Provider: FC<T>
  Context: ContextType<U>
}

export type AsyncFn<T extends Record<string, any>, U> = (props: T) => Promise<U>

export type AsyncFnPropsType<T> = T extends AsyncFn<infer Props, any>
  ? Props
  : unknown

export type AsyncFnDataType<T> = T extends AsyncFn<any, infer Data>
  ? Data
  : unknown

export type ComposedAsyncFnPropsType<
  T extends Record<string, AsyncFn<any, any>>
> = {
  [K in keyof T]: AsyncFnPropsType<T[K]>
}

export type ComposedAsyncFnDataType<
  T extends Record<string, AsyncFn<any, any>>
> = {
  [K in keyof T]: AsyncFnDataType<T[K]>
}

export type ComposedStore<T, U extends Record<string, ContextType<any>>> = {
  Provider: FC<T>
  keyToContext: U
}

export type StorePropsType<T> = T extends Store<infer Props, any>
  ? Props
  : unknown

export type StoreValueType<T> = T extends Store<any, infer Value>
  ? Value
  : unknown

export type ComposedPropsType<T> = T extends ComposedStore<infer Props, any>
  ? Props
  : unknown

export type ComposedValueType<T> = T extends ComposedStore<any, infer Value>
  ? Value
  : unknown

export type ComposedKeyToContextType<T> = T extends {
  Provider: any
  keyToContext: infer KeyToContext
}
  ? KeyToContext
  : unknown

export type ComposedKeyValueType<T> = T extends {
  Provider: any
  keyToContext: infer KeyToContext
}
  ? {
      [K in keyof KeyToContext]: KeyToContext[K] extends ContextType<
        infer Value
      >
        ? Value
        : unknown
    }
  : unknown
