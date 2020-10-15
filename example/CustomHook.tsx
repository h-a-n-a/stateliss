import React, { useState } from 'react'
import { createStore, useStore } from '../src/index'

function useCounter() {
  const [count, setCount] = useState(0)

  const increment = () => setCount((c) => c + 1)
  const decrement = () => setCount((c) => c - 1)

  return { count, increment, decrement }
}

export const CounterStore = createStore(useCounter)

const Example = () => {
  const { count, increment, decrement } = useStore(CounterStore)
  return (
    <>
      <div>Count: {count}</div>
      <button onClick={increment}>+1</button>
      <button onClick={decrement}>-1</button>
    </>
  )
}

export default () => (
  <CounterStore.Provider>
    <h4>Component 1</h4>
    <Example />
    <hr />
    <h4>Component 2</h4>
    <Example />
  </CounterStore.Provider>
)
