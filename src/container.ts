import { AsyncData } from './AsyncExecutor'

type Subscriber = () => void

class Container<T> {
  constructor(public data?: T | AsyncData<T>) {}
  subscribers = new Set<Subscriber>()
  notify() {
    this.subscribers.forEach((s) => s())
  }
}

export default Container
