import { Config } from './types'

type WS_URL = `wss://${string}` | `ws://${string}`

const KUSAMA_ENDPOINTS: WS_URL[] = [
  'wss://kusama-rpc.polkadot.io',
  // 'wss://kusama.public.curie.radiumblock.co/ws', // https://github.com/polkadot-js/apps/issues/9763
  'wss://rpc.ibp.network/kusama',
  'wss://rpc.dotters.network/kusama',
  'wss://1rpc.io/ksm',
  'wss://kusama.api.onfinality.io/public-ws',
  'wss://kusama-rpc.dwellir.com',
]

const POLKADOT_ENDPOINTS: WS_URL[] = [
  'wss://rpc.polkadot.io',
  'wss://polkadot.public.curie.radiumblock.co/ws',
  'wss://rpc.ibp.network/polkadot',
  'wss://rpc.dotters.network/polkadot',
  'wss://1rpc.io/dot',
  'wss://polkadot.api.onfinality.io/public-ws',
  'wss://polkadot-rpc.dwellir.com',
]

// Someone from BSX team told me that Polkadot API takes Array of endpoints
export const ALTERNATIVE_ENDPOINT_MAP: Config<WS_URL[]> = {
  bsx: ['wss://rpc.basilisk.cloud', 'wss://basilisk-rpc.dwellir.com'],
  glmr: ['wss://public-rpc.pinknode.io/moonbeam'],
  rmrk: KUSAMA_ENDPOINTS,
  movr: ['wss://wss.api.moonriver.moonbeam.network'],
  ksm: KUSAMA_ENDPOINTS,
  snek: ['wss://basilisk-rococo-rpc.play.hydration.cloud'],
  ahk: [
    'wss://kusama-asset-hub-rpc.polkadot.io',
    'wss://statemine-rpc.dwellir.com',
    'wss://sys.ibp.network/statemine',
    'wss://sys.dotters.network/statemine',
    'wss://rpc-asset-hub-kusama.luckyfriday.io',
    'wss://statemine.api.onfinality.io/public-ws',
    'wss://statemine.public.curie.radiumblock.co/ws',
  ],
  dot: POLKADOT_ENDPOINTS,
  ahp: [
    'wss://polkadot-asset-hub-rpc.polkadot.io',
    'wss://statemint-rpc.dwellir.com',
    'wss://statemint-rpc-tn.dwellir.com',
    'wss://sys.ibp.network/statemint',
    'wss://sys.dotters.network/statemint',
    'wss://statemint.api.onfinality.io/public-ws',
  ],
}

export const ENDPOINT_MAP: Config<WS_URL> = {
  bsx: 'wss://rpc.basilisk.cloud',
  glmr: 'wss://public-rpc.pinknode.io/moonbeam',
  rmrk: KUSAMA_ENDPOINTS[0],
  movr: 'wss://wss.api.moonriver.moonbeam.network',
  ksm: KUSAMA_ENDPOINTS[0],
  snek: 'wss://basilisk-rococo-rpc.play.hydration.cloud',
  ahk: 'wss://kusama-asset-hub-rpc.polkadot.io',
  dot: POLKADOT_ENDPOINTS[0],
  ahp: 'wss://polkadot-asset-hub-rpc.polkadot.io',
}
