import React from 'react'
import { render } from 'react-dom'
import WithoutSideEffect from './WithoutSideEffect'
import WithSideEffect from './WithSideEffect'

function App() {
  return (
    <>
      <WithoutSideEffect />
      <hr />
      <WithSideEffect />
    </>
  )
}

render(<App />, document.getElementById('root'))
