export default function <T>() {
  const map = ref(new Map<string, T>())

  const add = (initialValue: T) => {
    const id = window.crypto.randomUUID()
    map.value.set(id, initialValue as any)
    return id
  }

  const get = (id: string): T | undefined => map.value.get(id) as T | undefined

  return {
    add,
    get,
  }
}
