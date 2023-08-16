import type { Prefix as ChainPrefix } from '@kodadot1/static'

export type Prefix = ChainPrefix | 'ahp'
export type Config<T = boolean> = Record<Prefix, T>
