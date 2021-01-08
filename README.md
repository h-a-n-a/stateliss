# stateliess

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
  const increment = () => setCount(count + 1)
  const decrement = () => setCount(count - 1)
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
import React, { useState } from 'react'
import { createStore } from 'unshaped'

function useCounter({ defaultValue }: { defaultValue: number }) {
  const [count, setCount] = useState(defaultValue)
  const increment = () => setCount(count + 1)
  const decrement = () => setCount(count - 1)
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

### 异步请求

除了我们能在普通的自定义 Hook 中进行异步请求，`unshaped` 还提供了相应的请求处理 API：

```typescript
// api.ts
export function getEmail({ userId }: { userId: string }): Promise<number> {
  return fetch(`url-to-fetch-email/${userId}`).then((res) => res.text())
}
```

```tsx
import React from 'react'
import { createAsyncStore, useAsyncStore } from 'unshaped'
import { getEmail } from './api'

const UserStore = createAsyncStore({
  getEmail
})

const UserInfo = () => {
  const { getEmail } = useAsyncStore(UserStore)
  return (
    <>
      <div>Email: {getEmail.loading ? 'Loading Email...' : getEmail.data}</div>
      <button onClick={() => getEmail.run({ userId: 'some-user-id' })}>
        fetch Email
      </button>
    </>
  )
}

const App = () => {
  return (
    <UserStore.Provider getEmail={{ userId: 'default-user-id' }}>
      <UserInfo />
    </UserStore.Provider>
  )
}

export default App
```

## API

### `createStore`

传入一个 custom hook 并创建一个 Store ，但你无需关心他返回了什么，`useStore` 会帮你处理一切

```ts
const Store = createStore<T, U>(
  hook: (props: T) => U
)
```

### `useStore`

使用一个 Store ，并返回自定义 hook 的返回结果。

注：该组件需要被 `Provider` 包裹

```ts
const state: StoreValueType<T> = useStore<T extends Store<any, any>>(
  store: T,
  depFn?: Deps<StoreValueType<T>>
)
```

### `createAsyncStore`

传入一个 `AsyncFunction`（或 key 为 AsyncFunction 的 id，value 为 `AsyncFunction` 的对象，即`Record<string, AsyncFn<any, any>>`）
并返回一个 Async Store，用于跟踪异步状态和持久化 `Promise` 的返回结果。

```ts
const AsyncStore: Store<
  AsyncFnPropsType<T>,
  AsyncData<AsyncFnPropsType<T>, AsyncFnDataType<T>>
> = createAsyncStore<T extends AsyncFn<any, any>>(
  asyncFn: T
)
const AsyncStore: ComposedStore<Partial<ComposedAsyncFnPropsType<T>>, ComposedContextType<T>>
 = createAsyncStore<T extends Record<string, AsyncFn<any, any>>>(
  asyncFn: T
)
```

### `useAsyncStore`

和 `useStore` 不同的是，它可以跟踪异步信息，如下所示：

```ts
const {
  data,
  loading,
  error,
  refresh,
  run
} =  useAsyncStore<T extends Store<any, any>>(
  store: T,
  options?: {
    depFn?: Deps<StoreValueType<T>>
  }
)

const {
  asyncFn1: { data, loading, error, refresh, run },
  asyncFn2: { data, loading, error, refresh, run }
} = useAsyncStore<T extends ComposedStore<any, any>>(
  store: T,
  options?: {
    depFn?: Deps<ComposedKeyValueType<T>>
  }
)
```

#### 参数说明

| 参数          | 类型                                                                                     | 描述                                                |
| ------------- | ---------------------------------------------------------------------------------------- | --------------------------------------------------- |
| store         | <code>Store &#124; ComposedStore </code>                                                 | `createAsyncStore` 返回的 Store                     |
| options.depFn | <code>(store: Deps<StoreValueType<T> &#124; ComposedKeyValueType<T>>) => unkown[]</code> | 当 `depFn` 的返回值发生改变才进行渲染，用于性能优化 |

#### 返回值

| 参数    | 类型                | 描述                                                      |
| ------- | ------------------- | --------------------------------------------------------- |
| data    | `StoreValueType<T>` | `Async Function` 返回的数据                               |
| error   | `any`               | `Async Function` 捕获到的错误信息                         |
| loading | `boolean`           | `Async Function` 的 `loading` 状态                        |
| run     | `(param?) => void`  | 发起请求，如果没有 `param` 则默认为传入 `Provider` 的参数 |
| refresh | `() => void`        | 使用上一次的参数重新发起请求                              |
