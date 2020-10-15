import React, { useEffect } from 'react'
import Mock from 'mockjs'
import { createAsyncStore, useAsyncStore } from '../src/index'

function getWelcome({ seed }: { seed: number }): Promise<string> {
  const welcomes = ['Yo!', 'Hey!', 'Bonjour!', 'Bonsoir!']
  const lastOfTime = Number(String(seed)[String(seed).length - 1])
  const index = lastOfTime % welcomes.length
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(welcomes[index])
    }, 200)
  })
}

function getUsername(): Promise<string> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(Mock.mock('@name'))
    }, 1000)
  })
}

function getEmail(): Promise<number> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(Mock.mock('@EMAIL'))
    }, 500)
  })
}

const AsyncStore = createAsyncStore({
  getUsername,
  getEmail,
  getWelcome
})

function AsyncDemo() {
  const { getUsername, getEmail, getWelcome } = useAsyncStore(AsyncStore)

  useEffect(() => {
    getWelcome.run()
  }, [])

  return (
    <>
      <h4>{getWelcome.loading ? 'Loading welcome...' : getWelcome.data}</h4>
      <p>
        Name: {getUsername.loading ? 'Loading user name...' : getUsername.data}
      </p>
      <p>Email: {getEmail.loading ? 'Loading email...' : getEmail.data}</p>
      <button onClick={() => getUsername.run()}>fetch username</button>
      <button onClick={() => getEmail.run()}>fetch email</button>
      <button
        onClick={() => {
          getUsername.run()
          getEmail.run()
        }}
      >
        fetch all
      </button>
      <button
        onClick={() => {
          getUsername.refresh()
          getEmail.refresh()
        }}
      >
        refresh all
      </button>
    </>
  )
}

export default () => (
  <AsyncStore.Provider getWelcome={{ seed: +new Date() }}>
    <h4>Component 1</h4>
    <AsyncDemo />
    <hr />
    <h4>Component 2</h4>
    <AsyncDemo />
  </AsyncStore.Provider>
)
