import type { Prefix as ChainPrefix } from '@kodadot1/static'

export type Prefix = ChainPrefix | 'stt'
export type Config<T = boolean> = Record<Prefix, T>
