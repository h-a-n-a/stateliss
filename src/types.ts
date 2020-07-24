import { FC, PropsWithChildren, Context } from 'react'
import Container from './container'
import { EMPTY } from './constants'

export type Store<T, U> = {
  Provider: FC<PropsWithChildren<T>>
  Context: Context<Container<U> | typeof EMPTY>
}

export type StorePropsType<T> = T extends Store<infer Props, any>
  ? Props
  : unknown

export type StoreValueType<T> = T extends Store<any, infer Value>
  ? Value
  : unknown
