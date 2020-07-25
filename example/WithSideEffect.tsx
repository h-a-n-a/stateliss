import React, { useState } from 'react'
import { createAsyncStore, useStore } from '../src/index'

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

const RandomNameStore = createAsyncStore(getSomeoneRandom)

function Example() {
  const [seed, setSeed] = useState<number>(undefined)
  const {
    data,
    run,
    refresh,
    loading,
    isRejected,
    isFulfilled
  } = useStore(RandomNameStore, (dep) => [
    dep.data,
    dep.loading,
    dep.isRejected,
    dep.isFulfilled
  ])
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
      <div>loading: {String(loading)}</div>
      <div>isFulfilled: {String(isFulfilled)}</div>
      <div>isRejected: {String(isRejected)}</div>
      <div>name: {data}</div>
      <button onClick={() => run({ seed })}>Run with inputs!</button>
      <button onClick={refresh}>Refresh Data</button>
    </>
  )
}

export default () => (
  <RandomNameStore.Provider seed={20}>
    <Example />
  </RandomNameStore.Provider>
)