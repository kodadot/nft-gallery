import type { Option } from '@polkadot/types'
import type { Codec } from '@polkadot/types/types'

export function unwrapOrEmpty<T extends Codec>(value: Option<T>): T {
  return value.unwrapOr({} as T)
}

export function unwrapOrNull<T extends Codec>(value: Option<T>): T | null {
  return value.unwrapOr(null)
}

export function unwrapOrDefault<T extends Codec>(value: Option<T>): T {
  return value.unwrapOrDefault()
}

export function toHuman<T extends Codec>(value: T) {
  return value.toHuman()
}
