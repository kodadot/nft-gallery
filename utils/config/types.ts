export type Prefix =
  | 'rmrk'
  | 'bsx'
  | 'statemine'
  | 'westmint'
  | 'movr'
  | 'snek'
  | 'glmr'
  | 'ksm'
export type Config<T = boolean> = Record<Prefix, T>
