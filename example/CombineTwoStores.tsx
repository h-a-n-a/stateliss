import React from 'react'
import { useStore, createStore } from '../src'

import { CounterStore } from './CustomHook'

const useMultipleCount = () => {
  const { count, increment, decrement } = useStore(CounterStore)
  const incrementByTwo = () => {
    increment()
    increment()
  }
  const decrementByTwo = () => {
    decrement()
    decrement()
  }

  return { count, incrementByTwo, decrementByTwo }
}

const MultipleCountStore = createStore(useMultipleCount)

const Example = () => {
  const { count, incrementByTwo, decrementByTwo } = useStore(MultipleCountStore)
  return (
    <>
      <div>Count: {count}</div>
      <button onClick={incrementByTwo}>+2</button>
      <button onClick={decrementByTwo}>-2</button>
    </>
  )
}

export default () => (
  <CounterStore.Provider>
    <MultipleCountStore.Provider>
      <h4>Component 1</h4>
      <Example />
      <hr />
      <h4>Component 2</h4>
      <Example />
    </MultipleCountStore.Provider>
  </CounterStore.Provider>
)
