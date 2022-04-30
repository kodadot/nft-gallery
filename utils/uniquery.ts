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
