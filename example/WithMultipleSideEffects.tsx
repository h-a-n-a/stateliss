import React, { useState } from 'react'
import { createAsyncStore, useAsyncStore } from '../src/index'

const getSomeoneRandom = async ({ seed }: { seed: number }) => {
  console.log('Requested With Seed:', seed)
  return await new Promise<number>((res, rej) => {
    const val = crypto.getRandomValues(
      new Int32Array([seed + Math.random()])
    )[0]
    console.log(val)
    setTimeout(val > 0 ? res : rej, 300, val)
  })
}

const getSomethingReallyRandom = async ({ seed2 }: { seed2: number }) => {
  return await new Promise<number>((res, rej) => {
    const val = crypto.getRandomValues(
      new Int32Array([seed2 + Math.random()])
    )[0]
    console.log(val)
    setTimeout(val > 0 ? res : rej, 300, val)
  })
}

const RandomNameStore = createAsyncStore({
  asyncFn1: getSomeoneRandom,
  asyncFn2: getSomethingReallyRandom
})

function Example() {
  const [seed, setSeed] = useState<number>(0)
  const data = useAsyncStore(RandomNameStore, {
    depFn: (state) => {
      return [state.asyncFn1]
    }
  })
  const { asyncFn1, asyncFn2 } = data
  return (
    <>
      <p>Negative `data` would be marked as errors</p>
      <input
        value={seed}
        onChange={(evt) => {
          const val = evt.target.value
          if (!isNaN(Number(val))) {
            setSeed(Number(val))
          }
        }}
      />
      <h4>AsyncFn1</h4>
      <div>loading: {String(asyncFn1.loading)}</div>
      <div>error: {String(asyncFn1.error)}</div>
      <div>data: {asyncFn1.data}</div>
      <button onClick={() => asyncFn1.run({ seed })}>Run with inputs!</button>
      <button onClick={asyncFn1.refresh}>Refresh Data</button>

      <h4>AsyncFn2</h4>
      <div>loading: {String(asyncFn2.loading)}</div>
      <div>error: {String(asyncFn2.error)}</div>
      <div>data: {asyncFn2.data}</div>
      <button onClick={() => asyncFn2.run({ seed2: seed })}>
        Run with inputs!
      </button>
      <button onClick={asyncFn2.refresh}>Refresh Data</button>
    </>
  )
}

export default () => (
  <RandomNameStore.Provider asyncFn1={{ seed: 123 }} asyncFn2={{ seed2: 456 }}>
    <Example />
    <br />
    <Example />
  </RandomNameStore.Provider>
)
