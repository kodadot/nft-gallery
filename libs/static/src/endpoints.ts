import type { Config } from './types'

type WS_URL = `wss://${string}` | `ws://${string}`
type HTTP_URL = `https://${string}` | `http://${string}`

type ENDPOINT_URL = WS_URL | HTTP_URL

const KUSAMA_ENDPOINTS: WS_URL[] = [
  'wss://rpc.ibp.network/kusama',
  'wss://rpc.dotters.network/kusama',
  'wss://1rpc.io/ksm',
  'wss://kusama-rpc.dwellir.com',
]

const POLKADOT_ENDPOINTS: WS_URL[] = [
  'wss://rpc.dotters.network/polkadot',
  'wss://polkadot.public.curie.radiumblock.co/ws',
  'wss://rpc.ibp.network/polkadot',
  'wss://1rpc.io/dot',
  'wss://polkadot-rpc.dwellir.com',
]

const AHP_ENDPOINTS: WS_URL[] = [
  'wss://statemint.api.onfinality.io/public-ws',
  'wss://polkadot-asset-hub-rpc.polkadot.io',
  'wss://sys.ibp.network/statemint',
  'wss://statemint-rpc.dwellir.com',
  'wss://statemint-rpc-tn.dwellir.com',
  'wss://sys.dotters.network/statemint',
]

// Someone from HydraDX team told me that Polkadot API takes Array of endpoints
export const ALTERNATIVE_ENDPOINT_MAP: Config<ENDPOINT_URL[]> = {
  ksm: KUSAMA_ENDPOINTS,
  ahk: [
    'wss://sys.ibp.network/statemine',
    'wss://statemine-rpc.dwellir.com',
    'wss://sys.dotters.network/statemine',
    'wss://rpc-asset-hub-kusama.luckyfriday.io',
    'wss://statemine.public.curie.radiumblock.co/ws',
  ],
  dot: POLKADOT_ENDPOINTS,
  ahp: AHP_ENDPOINTS,
  base: ['https://mainnet.base.org'],
  ahw: ['wss://assethub-westend-rpc.polkadot.io'],
  // ahr: ['wss://rococo-asset-hub-rpc.polkadot.io'],
  // glmr: ['wss://public-rpc.pinknode.io/moonbeam'],
  // movr: ['wss://wss.api.moonriver.moonbeam.network'],
}

export const ENDPOINT_MAP: Config<ENDPOINT_URL> = {
  ksm: KUSAMA_ENDPOINTS[0],
  ahk: 'wss://sys.ibp.network/statemine',
  dot: POLKADOT_ENDPOINTS[0],
  ahp: AHP_ENDPOINTS[2],
  base: 'https://mainnet.base.org',
  ahw: ALTERNATIVE_ENDPOINT_MAP.ahw[0],
  // ahr: 'wss://rococo-asset-hub-rpc.polkadot.io',
  // glmr: 'wss://public-rpc.pinknode.io/moonbeam',
  // movr: 'wss://wss.api.moonriver.moonbeam.network',
}
