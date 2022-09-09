export type Prefix = 'rmrk' | 'bsx' | 'statemine' | 'westmint' | 'movr' | 'snek'
export type Config<T = boolean> = Record<Prefix, T>
