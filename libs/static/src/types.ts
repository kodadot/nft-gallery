export type Prefix =
  | 'bsx'
  | 'glmr'
  | 'rmrk'
  | 'movr'
  | 'ksm'
  | 'snek'
  | 'stmn'
  | 'dot'
  | 'stt'
// | 'wst'

export type Squid =
  | 'rubick'
  | 'snekk'
  | 'click'
  | 'antick'
  | 'marck'
  | 'stick'
  | 'speck'
  | 'sneck'

export type Config<T = boolean> = Record<Prefix, T>

export type Option = {
  disabled?: boolean
  info: string
  text: string
  value: string | number
}

export type ApolloEndpoint = {
  httpEndpoint: string
}

export type ChainProperties = {
  ss58Format: number
  tokenDecimals: number
  tokenSymbol: string
  blockExplorer?: string
  genesisHash?: string
}
