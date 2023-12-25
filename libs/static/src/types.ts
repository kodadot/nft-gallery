export type Prefix = 'rmrk' | 'ksm' | 'ahk' | 'dot' | 'ahp'
//  | 'ahr'
// | 'glmr'
// | 'movr'
// |'bsx'

export type Squid = 'rubick' | 'marck' | 'stick' | 'speck'
// | 'snack'
// | 'click'
// | 'antick'
// | 'snekk'

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
