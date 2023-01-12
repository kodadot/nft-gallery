import { Interaction } from '@kodadot1/minimark'

import { dangerMessage, infoMessage } from '@/utils/notification'
import { ShoppingActions } from '@/utils/shoppingActions'
import { execTsxList } from './transaction/transactionList'
import { execTsxSend } from './transaction/transactionSend'
import { execTsxOffer } from './transaction/transactionOffer'

import type {
  ActionList,
  ActionOffer,
  ActionSend,
  Actions,
} from './transaction/types'
import type { ApiPromise } from '@polkadot/api'

const useExecuteTransaction = () => {
  const { accountId } = useAuth()
  const { howAboutToExecute, isLoading, status, initTransactionLoader } =
    useMetaTransaction()

  const executeTransaction = ({ cb, arg, successMessage, errorMessage }) => {
    initTransactionLoader()
    howAboutToExecute(
      accountId.value,
      cb,
      arg,
      () => infoMessage(successMessage || 'Success!'),
      () => dangerMessage(errorMessage || 'Failed!')
    )
  }

  return {
    isLoading,
    status,
    executeTransaction,
  }
}

export const useTransaction = () => {
  const { apiInstance } = useApi()
  const { isLoading, status, executeTransaction } = useExecuteTransaction()

  const transactionMap = (item: Actions, api: ApiPromise) => {
    const map = {
      [Interaction.LIST]: (item, api) =>
        execTsxList(item as ActionList, api, executeTransaction),
      [Interaction.SEND]: (item, api) =>
        execTsxSend(item as ActionSend, api, executeTransaction),
      [ShoppingActions.MAKE_OFFER]: (item, api) =>
        execTsxOffer(item as ActionOffer, api, executeTransaction),
    }
    return map[item.interaction]?.(item, api) ?? 'UNKNOW'
  }

  const transaction = async (item: Actions) => {
    const api = await apiInstance.value
    return transactionMap(item, api)
  }

  return {
    isLoading,
    status,
    transaction,
  }
}
