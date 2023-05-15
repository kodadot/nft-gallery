import { Config } from './types'

type WS_URL = `wss://${string}` | `ws://${string}`

const KUSAMA_ENDPOINTS: WS_URL[] = [
  'wss://kusama-rpc.polkadot.io',
  'wss://kusama.public.curie.radiumblock.co/ws',
  'wss://rpc.ibp.network/kusama',
  'wss://rpc.dotters.network/kusama',
  'wss://1rpc.io/ksm',
  'wss://kusama.api.onfinality.io/public-ws',
  'wss://kusama-rpc.dwellir.com',
]

// Someone from BSX team told me that Polkadot API takes Array of endpoints
export const ALTERNATIVE_ENDPOINT_MAP: Config<WS_URL[]> = {
  bsx: ['wss://rpc.basilisk.cloud', 'wss://basilisk-rpc.dwellir.com'],
  glmr: ['wss://public-rpc.pinknode.io/moonbeam'],
  rmrk: KUSAMA_ENDPOINTS,
  movr: ['wss://wss.api.moonriver.moonbeam.network'],
  ksm: KUSAMA_ENDPOINTS,
  snek: ['wss://basilisk-rococo-rpc.play.hydration.cloud'],
  stmn: [
    'wss://statemine-rpc.polkadot.io',
    'wss://statemine-rpc.dwellir.com',
    'wss://sys.ibp.network/statemine',
    'wss://sys.dotters.network/statemine',
    'wss://rpc-statemine.luckyfriday.io',
    'wss://statemine.api.onfinality.io/public-ws',
    'wss://statemine.public.curie.radiumblock.co/ws',
  ],
}

export const ENDPOINT_MAP: Config<WS_URL> = {
  bsx: 'wss://rpc.basilisk.cloud',
  glmr: 'wss://public-rpc.pinknode.io/moonbeam',
  rmrk: KUSAMA_ENDPOINTS[0],
  movr: 'wss://wss.api.moonriver.moonbeam.network',
  ksm: KUSAMA_ENDPOINTS[0],
  snek: 'wss://basilisk-rococo-rpc.play.hydration.cloud',
  stmn: 'wss://statemine-rpc.polkadot.io',
}
