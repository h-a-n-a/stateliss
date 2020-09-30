import React, { useState } from 'react'
import { createAsyncStore, useAsyncStore } from '../src/index'

const getSomeoneRandom = async ({ seed }: { seed: number }) => {
  console.log('Requested With Seed:', seed)
  return await new Promise<number>((res) => {
    setTimeout(
      res,
      300,
      crypto.getRandomValues(new Int32Array([seed + Math.random()]))[0]
    )
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
    }
  }) as any
  const { asyncFn1, asyncFn2 } = data
  console.log('data WithMultipleSideEffects', data)
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
      <div>isFulfilled: {String(asyncFn1.isFulfilled)}</div>
      <div>isRejected: {String(asyncFn1.isRejected)}</div>
      <div>name: {asyncFn1.data}</div>
      <button onClick={() => asyncFn1.run({ seed })}>Run with inputs!</button>
      <button onClick={asyncFn1.refresh}>Refresh Data</button>

      <h4>AsyncFn2</h4>
      <div>loading: {String(asyncFn2.loading)}</div>
      <div>isFulfilled: {String(asyncFn2.isFulfilled)}</div>
      <div>isRejected: {String(asyncFn2.isRejected)}</div>
      <div>name: {asyncFn2.data}</div>
      <button onClick={() => asyncFn2.run({ seed })}>Run with inputs!</button>
      <button onClick={asyncFn2.refresh}>Refresh Data</button>
    </>
  )
}

export default () => (
  <RandomNameStore.Provider seed={20}>
    <Example />
  </RandomNameStore.Provider>
)
