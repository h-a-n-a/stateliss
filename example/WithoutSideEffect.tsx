import React, { useState } from 'react'
import { createStore, useStore } from '../src/index'

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

const CounterStore = createStore(useCounter)

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
    <Example />
    <Example />
  </CounterStore.Provider>
)
