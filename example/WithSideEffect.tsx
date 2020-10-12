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

const RandomNameStore = createAsyncStore(getSomeoneRandom)

function Example() {
  const [seed, setSeed] = useState<number>(0)
  const { data, run, refresh, loading, error } = useAsyncStore(
    RandomNameStore,
    {
      depFn: (dep) => [dep.data, dep.loading]
    }
  )
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
      <div>error: {String(error)}</div>
      <div>data: {data}</div>
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
