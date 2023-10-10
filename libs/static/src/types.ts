export type Prefix = 'bsx' | 'rmrk' | 'ksm' | 'snek' | 'ahk' | 'dot' | 'ahp'
// | 'glmr'
// | 'movr'

export type Squid = 'rubick' | 'snekk' | 'marck' | 'stick' | 'speck' | 'sneck'
// | 'click'
// | 'antick'

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
