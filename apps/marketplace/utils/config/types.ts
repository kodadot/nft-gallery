export type Prefix =
  | 'rmrk'
  | 'bsx'
  | 'statemine'
  | 'westmint'
  | 'movr'
  | 'snek'
  | 'glmr'
export type Config<T = boolean> = Record<Prefix, T>
