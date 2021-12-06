import type { ApiPromise } from '@polkadot/api';
import Connector from '@vue-polkadot/vue-api';

export type ApiCallbackFunction = (api: ApiPromise) => any;

export default function onApiConnect(cb: ApiCallbackFunction): void {
  const { getInstance: Api } = Connector
  if (Api().api) {
    console.log('API is already connected')
    cb(Api().api)
  }

  Api().on('connect', cb)
}
