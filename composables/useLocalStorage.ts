export default function <T>(key: string, defaultValue: T) {
  return customRef((track, trigger) => ({
    get: (): T => {
      track()
      const value = process.client && localStorage.getItem(key)
      return value ? JSON.parse(value) : defaultValue
    },
    set: (value: T) => {
      if (value === null) {
        process.client && localStorage.removeItem(key)
      } else {
        process.client && localStorage.setItem(key, JSON.stringify(value))
      }
      trigger()
    },
  }))
}
