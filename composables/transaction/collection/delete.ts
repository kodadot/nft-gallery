import type { ApiPromise } from '@polkadot/api'
import type {
  ActionDeleteCollection,
  ExecuteTransactionParams,
} from '@/composables/transaction/types'

import { warningMessage } from '@/utils/notification'

export function execDeleteCollection(
  params: ActionDeleteCollection,
  api: ApiPromise,
  executeTransaction: ({
    cb,
    arg,
    successMessage,
    errorMessage,
  }: ExecuteTransactionParams) => void,
) {
  try {
    const cb = api.tx.nfts.destroy

    executeTransaction({
      cb,
      arg: [params.collectionId.toString(), {}],
    })
  } catch (error) {
    warningMessage(error)
  }
}
