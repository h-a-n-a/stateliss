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

const RandomNameStore = createAsyncStore({
  asyncFn1: getSomeoneRandom,
  asyncFn2: getSomeoneRandom
})

function Example() {
  const [seed, setSeed] = useState<number>(0)
  const data = useAsyncStore(RandomNameStore, {
    selector: (stores) => {
      return [stores.asyncFn1, stores.asyncFn2]
    },
    depFn: (state) => {
      // buggy
      return []
    }
  })
  const { asyncFn1, asyncFn2 } = data
  return (
    <>
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
      <div>name: {asyncFn1.data}</div>
      <button onClick={() => asyncFn1.run({ seed })}>Run with inputs!</button>
      <button onClick={asyncFn1.refresh}>Refresh Data</button>

      <h4>AsyncFn2</h4>
      <div>loading: {String(asyncFn2.loading)}</div>
      <div>error: {String(asyncFn2.error)}</div>
      <div>name: {asyncFn2.data}</div>
      <button onClick={() => asyncFn2.run({ seed })}>Run with inputs!</button>
      <button onClick={asyncFn2.refresh}>Refresh Data</button>
    </>
  )
}

export default () => (
  <RandomNameStore.Provider seed={20}>
    <Example />
    <br />
    {/*<Example />*/}
  </RandomNameStore.Provider>
)
