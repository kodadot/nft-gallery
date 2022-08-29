export type Prefix =
  | 'rmrk'
  | 'bsx'
  | 'statemine'
  | 'westmint'
  | 'moonsama'
  | 'snek'
export type Config<T = boolean> = Record<Prefix, T>
