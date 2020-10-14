import React from 'react'
import Mock from 'mockjs'
import { createAsyncStore, useAsyncStore } from '../src/index'

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
  getEmail
})

function AsyncDemo() {
  const { getUsername, getEmail } = useAsyncStore(AsyncStore)

  return (
    <>
      <h4>User Info</h4>
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
    </>
  )
}

export default () => (
  <AsyncStore.Provider>
    <h4>Component 1</h4>
    <AsyncDemo />
    <hr />
    <h4>Component 2</h4>
    <AsyncDemo />
  </AsyncStore.Provider>
)
