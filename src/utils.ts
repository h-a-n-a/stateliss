import { ExecutorProps } from './Executor'
import { AsyncExecutorProps } from './AsyncExecutor'

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
