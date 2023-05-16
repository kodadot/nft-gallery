export type Prefix =
  | 'rmrk'
  | 'bsx'
  | 'stmn'
  | 'westmint'
  | 'movr'
  | 'snek'
  | 'glmr'
  | 'ksm'
export type Config<T = boolean> = Record<Prefix, T>
