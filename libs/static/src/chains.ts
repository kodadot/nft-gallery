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
  ksm: DEFAULT_CHAIN_PROPERTIES,
  rmrk2: DEFAULT_CHAIN_PROPERTIES,
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
  'ksm',
  'snek',
  'movr',
  'glmr',
  'rmrk2',
]

export const chainInfo = {
  bsx: 'basilisk',
  ksm: 'kusama',
  snek: 'snek',
  movr: 'moonriver',
  glmr: 'moonbeam',
  rmrk2: 'rmrk',
}

export const chainList = (): Option[] => {
  return chainPrefixes.map((prefix) => ({
    info: chainInfo[prefix],
    text: NAMES[prefix],
    value: prefix === 'ksm' ? 'rmrk' : prefix,
  }))
}

export const oldKsm = (prefix: BackwardPrefix): Prefix =>
  prefix === 'rmrk' ? 'ksm' : prefix
