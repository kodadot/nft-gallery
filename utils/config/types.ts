import type { Prefix as ChainPrefix } from '@kodadot1/static'

export type Prefix = ChainPrefix
export type Config<T = boolean> = Record<Prefix, T>
