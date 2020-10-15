import React, { useState } from 'react'
import { render } from 'react-dom'

import CustomHook from './CustomHook'
import ComposedSideEffects from './ComposedSideEffects'
import CombineTwoStores from './CombineTwoStores'

import styles from './index.less'

enum ExampleType {
  HOOKS,
  SIDE_EFFECTS,
  COMBINE_STORES
}

function App() {
  const [exampleType, setExampleType] = useState<ExampleType>(ExampleType.HOOKS)

  const renderExample = () => {
    if (exampleType === ExampleType.HOOKS) {
      return (
        <>
          <h2>Custom Hook: Counter</h2>
          <CustomHook />
        </>
      )
    }

    if (exampleType === ExampleType.SIDE_EFFECTS) {
      return (
        <>
          <h2>Side Effect</h2>
          <ComposedSideEffects />
        </>
      )
    }

    if (exampleType === ExampleType.COMBINE_STORES) {
      return (
        <>
          <h2>Combine Stores</h2>
          <CombineTwoStores />
        </>
      )
    }

    return null
  }

  return (
    <>
      <div className={styles.container}>
        <span>Examples:</span>
        <button onClick={() => setExampleType(ExampleType.HOOKS)}>
          Custom Hook
        </button>
        <button onClick={() => setExampleType(ExampleType.SIDE_EFFECTS)}>
          Side Effect
        </button>
        <button onClick={() => setExampleType(ExampleType.COMBINE_STORES)}>
          Combine Stores
        </button>
      </div>
      {renderExample()}
    </>
  )
}

render(<App />, document.getElementById('root'))
