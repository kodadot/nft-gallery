export type Prefix = 'rmrk' | 'bsx' | 'statemine' | 'westmint' | 'moonsama'
export type Config<T = boolean> = Record<Prefix, T>
