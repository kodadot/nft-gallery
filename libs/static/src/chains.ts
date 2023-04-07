import { NAMES } from './names'
import type {
  BackwardPrefix,
  ChainProperties,
  Config,
  Option,
  Prefix,
} from './types'

export const toChainProperty = (
  ss58Format: number,
  tokenDecimals: number,
  tokenSymbol: string,
  blockExplorer?: string
): ChainProperties => {
  return {
    ss58Format,
    tokenDecimals,
    tokenSymbol,
    blockExplorer,
  }
}

const DEFAULT_CHAIN_PROPERTIES: ChainProperties = toChainProperty(
  2,
  12,
  'KSM',
  'https://kusama.subscan.io/'
)

export const CHAINS: Config<ChainProperties> = {
  rmrk: DEFAULT_CHAIN_PROPERTIES,
  ksm: DEFAULT_CHAIN_PROPERTIES,
  bsx: toChainProperty(10_041, 12, 'BSX', 'https://basilisk.subscan.io/'),
  snek: toChainProperty(
    10_041,
    12,
    'BSX',
    'https://calamar.play.hydration.cloud/rococo%20basilisk/search?query='
  ),
  movr: toChainProperty(1285, 18, 'MOVR', 'https://moonriver.subscan.io/'),
  glmr: toChainProperty(1284, 18, 'GLMR', 'https://moonbeam.subscan.io/'),
}

export const chainPrefixes: Prefix[] = [
  'bsx',
  'rmrk',
  'snek',
  'movr',
  'glmr',
  'ksm',
]

export const chainInfo = {
  bsx: 'basilisk',
  rmrk: 'kusama',
  snek: 'snek',
  movr: 'moonriver',
  glmr: 'moonbeam',
  ksm: 'rmrk',
}

export const chainList = (): Option[] => {
  return chainPrefixes.map((prefix) => ({
    info: chainInfo[prefix],
    text: NAMES[prefix],
    value: prefix === 'ksm' ? 'rmrk2' : prefix,
  }))
}

// TODO: our url prefix still rmrk2
// e.g: https://kodadot.xyz/rmrk2/explore/items
export const rmrk2ToKsm = (prefix: BackwardPrefix): Prefix => {
  return prefix === 'rmrk2' ? 'ksm' : prefix
}
