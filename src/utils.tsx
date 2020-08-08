import { ExecutorProps } from './Executor'
import { AsyncExecutorProps } from './AsyncExecutor'
import React, {
  FC,
  FunctionComponentElement,
  PropsWithChildren,
  ReactNode
} from 'react'

export const arePropsEqual = (
  prevProps: ExecutorProps<any, any> | AsyncExecutorProps<any, any>,
  nextProps: ExecutorProps<any, any> | AsyncExecutorProps<any, any>
) => {
  if ('hookProps' in nextProps && 'hookProps' in prevProps) {
    for (const key in nextProps.hookProps) {
      const prevHookProps = prevProps.hookProps
      const nextHookProps = nextProps.hookProps
      if (key === 'children') continue
      if (prevHookProps[key] !== nextHookProps[key]) {
        return false
      }
    }
  }
  if ('defaultAsyncParams' in nextProps && 'defaultAsyncParams' in prevProps) {
    for (const key in nextProps.defaultAsyncParams) {
      const prevHookProps = prevProps.defaultAsyncParams
      const nextHookProps = nextProps.defaultAsyncParams
      if (key === 'children') continue
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
  component: FC<PropsWithChildren<any>>
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
  const internalComponentState = components[index]
  const Component = internalComponentState.component
  const componentProps = internalComponentState.props

  if (isLastNode) {
    // eslint-disable-next-line react/no-children-prop
    return React.createElement(Component, {
      ...(componentProps ?? {}),
      children: lastChildren
    })
  } else {
    return React.createElement(
      Component,
      {},
      createComponentTree(components, lastChildren, ++index)
    )
  }
}
