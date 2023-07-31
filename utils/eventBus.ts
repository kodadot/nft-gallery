type UnkownFunction = (...args: unknown[]) => unknown

class EventBus {
  events: { [key: string]: UnkownFunction[] }

  constructor() {
    this.events = {}
  }

  on(eventName: string, fn: UnkownFunction) {
    this.events[eventName] = this.events[eventName] || []
    this.events[eventName].push(fn)
  }

  off(eventName: string, fn?: UnkownFunction) {
    if (this.events[eventName]) {
      for (let i = 0; i < this.events[eventName].length; i++) {
        if (this.events[eventName][i] === fn) {
          this.events[eventName].splice(i, 1)
          break
        }
      }
    }
  }

  emit(eventName: string, data?: unknown) {
    if (this.events[eventName]) {
      this.events[eventName].forEach((fn) => fn(data))
    }
  }
}

export default new EventBus()
