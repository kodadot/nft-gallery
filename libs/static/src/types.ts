export type Prefix = 'rmrk' | 'ksm' | 'ahk' | 'dot' | 'ahp' | 'imx'
//  | 'ahr'
// | 'glmr'
// | 'movr'

export type Squid = 'rubick' | 'marck' | 'stick' | 'speck' | 'flick'
// | 'snack'
// | 'click'
// | 'antick'

export type ChainVM = 'SUB' | 'EVM'

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
  vm: ChainVM // vm stands for vitrual machine
}
