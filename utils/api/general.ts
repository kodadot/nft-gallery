import type { ApiPromise } from '@polkadot/api'
import Connector from '@vue-polkadot/vue-api'

export type ApiCallbackFunction = (api: ApiPromise) => any

export default function onApiConnect(cb: ApiCallbackFunction): void {
  const { getInstance: Api } = Connector
  if (Api().api) {
    console.log('[API] already connected')
    cb(Api().api)
    return
  }

  Api().on('connect', (api: ApiPromise) => {
    console.log('[API] has been connected')
    api.isReady.then(cb)
  })
}
