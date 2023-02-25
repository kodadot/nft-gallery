export type Prefix =
  | 'rmrk'
  | 'bsx'
  | 'statemine'
  | 'westmint'
  | 'movr'
  | 'snek'
  | 'glmr'
  | 'rmrk2'
export type Config<T = boolean> = Record<Prefix, T>
