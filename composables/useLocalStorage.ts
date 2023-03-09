export default function <T>(key: string, defaultValue: T) {
  return customRef((track, trigger) => ({
    get: (): T => {
      track()
      const value = localStorage.getItem(key)
      return value ? JSON.parse(value) : defaultValue
    },
    set: (value: T) => {
      if (value === null) {
        localStorage.removeItem(key)
      } else {
        localStorage.setItem(key, JSON.stringify(value))
      }
      trigger()
    },
  }))
}
