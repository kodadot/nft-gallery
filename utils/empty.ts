export function emptyObject<T>(): T {
  return {} as T
}

export function emptyArray<T>(): T[] {
  return [] as T[]
}

export function isEmpty(obj: Record<string, any>): boolean {
  for (const _ in obj) {
    return false
  }
  return true
}
