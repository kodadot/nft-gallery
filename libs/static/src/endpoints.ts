import endpoints from './endpoints.json'
import type { Config } from './types'

type WS_URL = `wss://${string}` | `ws://${string}`
type HTTP_URL = `https://${string}` | `http://${string}`

type ENDPOINT_URL = WS_URL | HTTP_URL

const POLKADOT_ENDPOINTS: WS_URL[] = [
  'wss://rpc.dotters.network/polkadot',
  'wss://polkadot.public.curie.radiumblock.co/ws',
  'wss://rpc.ibp.network/polkadot',
  'wss://1rpc.io/dot',
  'wss://polkadot-rpc.dwellir.com',
]

// Someone from HydraDX team told me that Polkadot API takes Array of endpoints
export const ALTERNATIVE_ENDPOINT_MAP: Config<ENDPOINT_URL[]> = {
  ksm: endpoints.ahk.providers as ENDPOINT_URL[],
  ahk: endpoints.ahk.providers as ENDPOINT_URL[],
  dot: POLKADOT_ENDPOINTS,
  ahp: endpoints.ahp.providers as ENDPOINT_URL[],
  imx: ['https://rpc.immutable.com'],
  base: ['https://mainnet.base.org'],
  mnt: ['https://rpc.mantle.xyz'],
  // ahr: ['wss://rococo-asset-hub-rpc.polkadot.io'],
  // glmr: ['wss://public-rpc.pinknode.io/moonbeam'],
  // movr: ['wss://wss.api.moonriver.moonbeam.network'],
}

export const ENDPOINT_MAP: Config<ENDPOINT_URL> = {
  ksm: endpoints.ahk.endpoint as ENDPOINT_URL,
  ahk: endpoints.ahk.endpoint as ENDPOINT_URL,
  dot: POLKADOT_ENDPOINTS[0],
  ahp: endpoints.ahp.endpoint as ENDPOINT_URL,
  imx: 'https://rpc.immutable.com',
  base: 'https://mainnet.base.org',
  mnt: 'https://rpc.mantle.xyz',
  // ahr: 'wss://rococo-asset-hub-rpc.polkadot.io',
  // glmr: 'wss://public-rpc.pinknode.io/moonbeam',
  // movr: 'wss://wss.api.moonriver.moonbeam.network',
}
