import React from 'react'
import { render } from 'react-dom'
import WithoutSideEffect from './WithoutSideEffect'
import WithSideEffect from './WithSideEffect'
import WithMultipleSideEffects from './WithMultipleSideEffects'

function App() {
  return (
    <>
      <h4>Without side effect</h4>
      <WithoutSideEffect />
      <hr />
      <h4>With side effect</h4>
      <WithSideEffect />
      <h4>With multiple side effects</h4>
      <WithMultipleSideEffects />
    </>
  )
}

render(<App />, document.getElementById('root'))
