export default function<T>(key: string, defaultValue: T, type: 'localStorage' | 'sessionStorage' = 'localStorage') {
  const storage = type === 'localStorage' ? localStorage : sessionStorage
  return customRef((track, trigger) => ({
    get: (): T => {
      track()
      const value = storage.getItem(key)
      return value ? JSON.parse(value) : defaultValue
    },
    set: (value: T) => {
      if (value === null) {
        storage.removeItem(key)
      }
      else {
        storage.setItem(key, JSON.stringify(value))
      }
      trigger()
    },
  }))
}
