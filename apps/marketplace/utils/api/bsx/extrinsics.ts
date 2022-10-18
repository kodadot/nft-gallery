import { ExtrinsicCall } from './types'
import type { ApiPromise } from '@polkadot/api'

export function setDefaultFeeToken(api: ApiPromise, id: string): ExtrinsicCall {
  return {
    call: api.tx.multiTransactionPayment.setCurrency,
    args: [id],
  }
}
