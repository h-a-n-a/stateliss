# unshaped

> React Hook 状态管理于无形

## 特性

- 支持异步状态处理
- 底层使用 `Context.Provider` 实现，支持 Custom Hook 完整生命周期
- API 简单易懂，极速上手
- TypeScript 支持

## 在线体验

[![Edit](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/unshaped-demo-b2tw5)

## 安装

```bash
npm install unshaped --save
```

## 简易上手

### 创建一个 Store

使用 `createStore` 包装一个 custom hook，将其转化为状态持久化的容器

```tsx
import { useState } from 'react'
import { createStore } from 'unshaped'

function useCounter() {
  const [count, setCount] = useState(0)
  const increment = () => {
    setCount(count + 1)
  }
  const decrement = () => {
    setCount(count - 1)
  }
  return { count, increment, decrement }
}

export default createStore(useCounter)
```

### 使用一个 Store

使用 `useStore` 包裹刚刚创建完成的 Store 即可获取经过持久化的数据。不要忘记包裹 `Provider`！

```tsx
import React from 'react'
import { useStore } from 'unshaped'

import CounterStore from './CounterStore'

function Counter() {
  const { count, increment, decrement } = useStore(CounterStore)
  return (
    <>
      <div>Count: {count}</div>
      <button onClick={increment}>+1</button>
      <button onClick={decrement}>-1</button>
    </>
  )
}

function App() {
  return (
    <CounterStore.Provider>
      <Counter />
    </CounterStore.Provider>
  )
}

export default App
```

## 进阶使用

### 参数传递

有的时候我们希望 custom hook 能接受一个参数，你可以在这里写成一个对象，如下方 `useCounter` 所示

```tsx
import { useState } from 'react'
import { createStore } from 'unshaped'

function useCounter({ defaultValue }: { defaultValue: number }) {
  const [count, setCount] = useState(defaultValue)
  const increment = () => {
    setCount(count + 1)
  }
  const decrement = () => {
    setCount(count - 1)
  }
  return { count, increment, decrement }
}

export default createStore(useCounter)
```

然后在 `Provider` 上提供这个参数：

```tsx
function App() {
  return (
    <CounterStore.Provider defaultValue={10}>
      <Counter />
    </CounterStore.Provider>
  )
}

export default App
```

## API

### `createStore`

传入一个 custom hook 并创建一个 Store ，但你无需关心他返回了什么，`useStore` 会帮你处理一切

```ts
const {
  Provider: FC<PropsWithChildren<T>>
  Context: Context<Container<U> | typeof EMPTY>
} = createStore<T, U>(
  hook: (props: T) => U
): Store<T, U>
```

### `useStore`

使用一个 Store ，并返回 custom hook 的最新结果。

注：该组件需要被 `Provider` 包裹

```ts
const state: StoreValueType<T> = useStore<T extends Store<any, any>>(
  store: T,
  depFn?: Deps<StoreValueType<T>>
)
```

### `useAsyncStore`

传入一个 `AsyncFunction` 并返回一个 Async Store，用于跟踪异步状态和持久化 `Promise` 返回结果

```ts
const {
  Provider: FC<PropsWithChildren<T>>
  Context: Context<Container<AsyncData<T, U>> | typeof EMPTY>
} = createAsyncStore<T, U>(
  asyncFn: AsyncFn<T, U>
): Store<T, AsyncData<T, U>>
```

和 `createStore` 不同的是，它可以跟踪异步信息，如下所示：

```ts
const {
  data: StoreValueType<T>['data']
  loading: boolean
  isFulfilled: boolean
  isRejected: boolean
  refresh: () => void
  run: (params: StorePropsType<T>) => void
} = useStore<T extends Store<any, any>>(
  store: T,
  depFn?: Deps<StoreValueType<T>>
)
```
