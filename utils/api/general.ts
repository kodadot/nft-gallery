import type { ApiPromise } from '@polkadot/api'
import Connector from '@kodadot1/sub-api'

export type ApiCallbackFunction = (api: ApiPromise) => void

export default function onApiConnect(cb: ApiCallbackFunction): void {
  const { getInstance: Api } = Connector
  if (Api().api) {
    console.log('[API] already connected')
    cb(Api().api)
    return
  }

  Api().on('connect', (api: ApiPromise) => {
    api.isReady.then(cb)
  })
}
