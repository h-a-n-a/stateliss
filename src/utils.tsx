import React, {
  FC,
  FunctionComponentElement,
  PropsWithChildren,
  ReactNode
} from 'react'

import { ExecutorProps } from './Executor'
import { AsyncExecutorProps } from './AsyncExecutor'
import { ComposedStore, Store, AsyncFn } from './types'

export const arePropsEqual = (
  prevProps: ExecutorProps<any, any> | AsyncExecutorProps<any, any>,
  nextProps: ExecutorProps<any, any> | AsyncExecutorProps<any, any>
) => {
  if ('hookProps' in nextProps && 'hookProps' in prevProps) {
    for (const key in nextProps.hookProps) {
      const prevHookProps = prevProps.hookProps
      const nextHookProps = nextProps.hookProps
      if (prevHookProps[key] !== nextHookProps[key]) {
        return false
      }
    }
  }
  if ('defaultAsyncParams' in nextProps && 'defaultAsyncParams' in prevProps) {
    for (const key in nextProps.defaultAsyncParams) {
      const prevHookProps = prevProps.defaultAsyncParams
      const nextHookProps = nextProps.defaultAsyncParams
      if (prevHookProps[key] !== nextHookProps[key]) {
        return false
      }
    }
  }
  return true
}

export function areDepsEqual(oldDeps: unknown[], newDeps: unknown[]) {
  if (oldDeps.length !== newDeps.length) return false

  for (const index in newDeps) {
    if (oldDeps[index] !== newDeps[index]) {
      return false
    }
  }
  return true
}

interface ComponentWithProps {
  component: FC<any>
  props: Record<string, any>
}

// [ComponentA, ComponentB, ComponentC] => <ComponentA><ComponentB><ComponentC></ComponentC></ComponentB></ComponentA>
export function composeComponents(
  components: ComponentWithProps[],
  children?: ReactNode
) {
  return createComponentTree(components, children)
}

function createComponentTree<T extends ReactNode>(
  components: ComponentWithProps[],
  lastChildren?: T,
  index = 0
): FunctionComponentElement<{
  lastChildren?: T
}> {
  const isLastNode = index === components.length - 1
  const currentDetailedComponent = components[index]
  const Component = currentDetailedComponent.component
  const componentProps = currentDetailedComponent.props

  if (isLastNode) {
    // eslint-disable-next-line react/no-children-prop
    return React.createElement(Component, {
      ...(componentProps ?? {}),
      children: lastChildren
    })
  } else {
    return React.createElement(
      Component,
      componentProps ?? {},
      createComponentTree(components, lastChildren, ++index)
    )
  }
}

export function isComposedStore(
  store: unknown
): store is ComposedStore<any, any> {
  return (
    store && typeof store === 'object' && store.hasOwnProperty('keyToContext')
  )
}

export function isStore(store: unknown): store is Store<any, any> {
  return store && typeof store === 'object' && store.hasOwnProperty('Context')
}

export function isAsyncFunction(value: unknown): value is AsyncFn<any, any> {
  return typeof value === 'function'
}

export function isAsyncFunctions(
  value: unknown
): value is Record<string, AsyncFn<any, any>> {
  return value && typeof value === 'object'
}

// eslint-disable-next-line @typescript-eslint/ban-types
export function omit<T extends object, U extends keyof T>(
  o: T,
  key: U[]
): Omit<T, U> {
  const data = {} as Omit<T, U>
  for (const k in o) {
    if (!o.hasOwnProperty(k)) continue
    if ((key as any[]).includes(k)) continue
    ;(data as any)[k] = o[k]
  }
  return data
}

export const isDev = process.env.NODE_ENV !== 'production'
