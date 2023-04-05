import { Config } from './types'

type WS_URL = `wss://${string}` | `ws://${string}`

export const ENDPOINT_MAP: Config<WS_URL> = {
  bsx: 'wss://basilisk-rpc.dwellir.com',
  glmr: 'wss://public-rpc.pinknode.io/moonbeam',
  ksm: 'wss://kusama-rpc.dwellir.com',
  movr: 'wss://wss.api.moonriver.moonbeam.network',
  rmrk2: 'wss://kusama-rpc.dwellir.com',
  snek: 'wss://rococo-basilisk-rpc.hydration.dev',
}

// Someone from BSX team told me that Polkadot API takes Array of endpoints
export const ALTERNATIVE_ENDPOINT_MAP: Config<WS_URL[]> = {
  bsx: ['wss://basilisk-rpc.dwellir.com', 'wss://rpc.basilisk.cloud'],
  glmr: ['wss://public-rpc.pinknode.io/moonbeam'],
  ksm: [
    'wss://kusama-rpc.dwellir.com',
    'wss://kusama.elara.patract.io',
    'wss://kusama-rpc.polkadot.io',
  ],
  movr: ['wss://wss.api.moonriver.moonbeam.network'],
  rmrk2: [
    'wss://kusama-rpc.dwellir.com',
    'wss://kusama.elara.patract.io',
    'wss://kusama-rpc.polkadot.io',
  ],
  snek: ['wss://rococo-basilisk-rpc.hydration.dev'],
}
