export default function <T>() {
  const map = ref(new Map<string, T>())

  const generate = (initialValue: T) => {
    const id = window.crypto.randomUUID()
    map.value.set(id, initialValue)
    return id
  }

  const get = (id: string): T | undefined => map.value.get(id)

  return {
    generate,
    get,
  }
}
