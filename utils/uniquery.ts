// TODO: if you will see this file in the future (Sep 2022)
// please contact @vikiival to merge it into API

type List<T> = T[]

type Something<T> = {
  nodes: List<T>
}

type OneOf<T> = Something<T> | List<T>

export function unwrapSafe<T = any>(value: OneOf<T>): List<T> {
  if (Array.isArray(value)) {
    return value
  } else {
    return value.nodes
  }
}

export function correctPrefix(prefix: string): string {
  return prefix === 'rmrk' ? '' : prefix
}
